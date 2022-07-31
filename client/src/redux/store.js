import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import createSagaMiddleware from 'redux-saga'
// import { persistStore, persistCombineReducers } from 'redux-persist'
// import { CookieStorage } from 'redux-persist-cookie-storage'
// import Cookies from 'cookies-js'

import reducers from './reducers'
import rootSaga from './saga'

const sagaMiddleware = createSagaMiddleware()

const bindMiddleware = (middleware) => {
  const composeEnhancers = composeWithDevTools({
    name: 'Bookdash'
  })

  return composeEnhancers(applyMiddleware(...middleware))
}

const configureStore = (state) => {
  const store = createStore(
    reducers,
    state,
    bindMiddleware([sagaMiddleware])
  )

  store.runSagaTask = () => {
    store.sagaTask = sagaMiddleware.run(rootSaga)
  }

  store.runSagaTask()
  return store
}

export default configureStore