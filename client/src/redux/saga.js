import qs from 'qs'
import { put, call, take, takeLatest, select, fork, all, cancel, cancelled } from 'redux-saga/effects'
import { actionTypes } from './actions/types'

import Router from 'next/router'
import AuthenticationService from '../services/AuthenticationService'
import BookService from '../services/BookService'

function * watchAndLog () {
  // while (true) {
  //   const action = yield take('*')
  //   const state = yield select()

  //   console.log('action', action)
  //   console.log('state after', state)
  // }
}

function * getSession ({ req = null, force = false } = {}) {
  try {
    let session = {}
    if (req) {
      if (req.session) {
        // If running on the server session data should be in the req object
        session.csrfToken = req.connection._httpMessage.locals._csrf
        session.expires = req.session.cookie._expires
        // If the user is logged in, add the user to the session object
        if (req.user) {
          session.user = req.user
        }
      }
    } else {
      // If running in the browser attempt to load session from sessionStore
      if (force === true) {
        // If force update is set, reset data store
        yield call(_removeLocalStore, 'session')
      } else {
        session = yield call(_getLocalStore, 'session')
      }
    }
  
    // If session data exists, has not expired AND force is not set then
    // return the stored session we already have.
    if (session && Object.keys(session).length > 0 && session.expires && session.expires > Date.now()) {
      yield put({ type: actionTypes.SESSION_SUCCESS, payload: session })
  
      return session
    } else {
      // If running on server, but session has expired return empty object
      // (no valid session)
      if (typeof window === 'undefined') {
        yield put({ type: actionTypes.SESSION_SUCCESS, payload: {} })
    
        return {}
      }
    }
    
    // If we don't have session data, or it's expired, or force is set
    // to true then revalidate it by fetching it again from the server.
    try {
      const res = yield call(AuthenticationService.session)
  
      if (res.status !== 200) {
        yield put({ type: actionTypes.SESSION_FAILURE, payload: 'HTTP error when trying to get session' })
      }
      
      session = res.data
      session.expires = Date.now() + session.revalidateAge
      
      yield put({ type: actionTypes.SESSION_SUCCESS, payload: session })
      yield call(_saveLocalStore, 'session', session)
    } catch (err) {
      yield put({ type: actionTypes.SESSION_FAILURE, payload: 'Unable to get session information' })
    }
  } catch (error) {
    console.log('Something went wrong...', error)
  }
}

function * getCsrfToken () {
  try {
    const res = yield call(AuthenticationService.csrf)
    yield put({ type: actionTypes.CSRF_SUCCESS, payload: res.data.csrfToken})
    return res.data.csrfToken
  } catch (err) {
    yield put({ type: actionTypes.CSRF_FAILURE, payload: 'Unable to get CSRF token' })
  }
}

function * getProviders ({ payload } = {}) {
  let res
  const { req } = payload

  try {
    if (req) {
      res = yield call(req.providers)
    } else {
      res = yield call(AuthenticationService.providers)
    }

    if (res && res.status && res.status !== 200) {
      yield put({
        type: actionTypes.PROVIDERS_FAILURE,
        payload: 'Unexpected response when trying to get providers'
      })

      return false
    }
    
    yield put({
      type: actionTypes.PROVIDERS_SUCCESS,
      payload: req ? res : res.data
    })

    return req ? res : res.data
  } catch (error) {
    console.log(error)

    yield put({
      type: actionTypes.PROVIDERS_FAILURE,
      payload: 'Unable to get oAuth providers'
    })
  }
}

function * getLinkedAccounts ({ payload } = {}) {
  let res
  const { req } = payload

  try {
    if (req) {
      res = yield call(req.linked)
    } else {
      res = yield call(AuthenticationService.linked)
    }

    if (res && res.status && res.status !== 200) {
      yield put({
        type: actionTypes.LINKED_ACCOUNTS_FAILURE,
        payload: 'Unexpected response when trying to get linked accounts'
      })

      return false
    }

    yield put({
      type: actionTypes.LINKED_ACCOUNTS_SUCCESS,
      payload: req ? res : res.data
    })

    return req ? res : res.data
  } catch (error) {
    console.log(error)

    yield put({
      type: actionTypes.LINKED_ACCOUNTS_FAILURE,
      payload: 'Unable to get linked accounts'
    })
  }
}

function * loadDataSaga () {
  try {
    const res = yield call(BookService.getBooks)
    yield put({ type: actionTypes.LOAD_DATA_SUCCESS, payload: res.data.data })
  } catch (err) {
    console.log(err)
    yield put({ type: actionTypes.LOAD_DATA_FAILURE, payload: 'Unable to fetch data' })
  }
}

function * authorize ({ name, email, password, isRegistering, isProvider } = {}) {
  try {
    // If signin is through a provider, we return early and allow 
    // the server and provider's oAuth to handle the flow
    if (isProvider) return

    let response
    const formData = isRegistering ? 
      { name, email, password } :
      { email, password }
    
    formData._csrf = yield select(state => state.session.csrfToken)
    const encodedForm = qs.stringify(formData)

    if (isRegistering) {
      response = yield call(AuthenticationService.register, encodedForm)
    } else {
      response = yield call(AuthenticationService.login, encodedForm)
    }

    if (response && response.status && response.status === 200) {
      yield put({ type: actionTypes.AUTH_SUCCESS, payload: response.data })
      Router.push('/books')

      return response.data
    }
  } catch (error) {
    console.error(error)
    yield put({
      type: actionTypes.AUTH_ERROR,
      payload: 'Something went wrong while attempting to log in'
    })
  } finally {
    if (yield cancelled()) {
      console.log('Login cancelled')
      // ... put special cancellation handling code here
    }
  }
}

// function * signout ({ csrf } = null) {
//   try {
//     // Signout from the server
//     // const csrfToken = yield call(getCsrfToken)
//     // const formData = { _csrf: csrfToken }
  
//     // Encoded form parser for sending data in the body
//     const encodedForm = qs.stringify(csrf)
    
//     // Remove cached session data
//     yield call(_removeLocalStore, 'session')
//     yield call(AuthenticationService.signout, encodedForm)

//     // Dispatch signout action to store. This clears user/session information
//     yield put({ type: actionTypes.SIGNOUT_SUCCESS })
//   } catch (error) {
//     console.log(error)
//     yield put({ type: actionTypes.SIGNOUT_FAILURE, payload: 'Unable to signout user' })
//   }
// }

function * loginFlow () {
  while (true) {
    const { type, payload } = yield take([
      actionTypes.LOGIN_REQUEST,
      actionTypes.REGISTER_REQUEST,
      actionTypes.SIGNOUT_REQUEST
    ])

    // fork return a Task object
    const task = type === actionTypes.SIGNOUT_REQUEST ?
      yield fork(signout) :
      yield fork(authorize, payload)

    const action = yield take([actionTypes.SIGNOUT_REQUEST, actionTypes.AUTH_ERROR])

    if (action.type === actionTypes.SIGNOUT_REQUEST)
      yield cancel(task)
      yield call(signout)
  }
}

function * session () {
  while (true) {
    // We include payload to control for server-side or client-side actions
    const { type, payload } = yield take([
      actionTypes.SESSION_REQUEST,
      actionTypes.CSRF_REQUEST
    ])
    const generator = type === actionTypes.SESSION_REQUEST ? getSession : getCsrfToken
    yield fork(generator, payload)
  }
}

const _getLocalStore = name => {
  try {
    return JSON.parse(localStorage.getItem(name))
  } catch (err) {
    return null
  }
}

const _saveLocalStore = (name, data) => {
  try {
    localStorage.setItem(name, JSON.stringify(data))
    return true
  } catch (err) {
    return false
  }
}

const _removeLocalStore = name => {
  try {
    localStorage.removeItem(name)
    return true
  } catch (err) {
    return false
  }
}

function * rootSaga () {
  yield all([
    call(watchAndLog),
    fork(loginFlow),
    fork(session),
    takeLatest(actionTypes.LOAD_BOOKS, loadDataSaga),
    takeLatest(actionTypes.PROVIDERS_REQUEST, getProviders)
  ])
}

export default rootSaga