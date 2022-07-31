import { actionTypes } from '../actions/types'

// The initial application state
let initialState = {
  error: null,
  loginPending: false,
  loggedIn: false,
  user: null,
  providers: {
    data: null,
    error: null
  },
  linkedAccounts: {
    accounts: null,
    error: null
  }
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_SUCCESS:
      const { user } = action.payload
      return {
        ...state,
        user,
        loggedIn: true
      }

    case actionTypes.LOGIN_REQUEST:
      return {
        ...state,
        loginPending: true
      }
      
    case actionTypes.REGISTER_REQUEST:
      return {
        ...state,
        loginPending: true
      }

    case actionTypes.SIGNOUT_SUCCESS:
      return {
        ...state,
        user: null,
        loggedIn: false
      }

    case actionTypes.SIGNOUT_FAILURE:
      return {
        ...state,
        error: action.payload
      }

    case actionTypes.AUTH_ERROR:
      return {
        ...state,
        loginPending: false,
        error: action.payload
      }

    case actionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null
      }

    case actionTypes.RESET_AUTH_STATE:
      return {
        ...state,
        error: null,
        loginPending: false
      }

    case actionTypes.PROVIDERS_SUCCESS:
      return {
        ...state,
        providers: {
          data: action.payload,
          error: null
        }
      }

    case actionTypes.PROVIDERS_FAILURE:
      return {
        ...state,
        providers: {
          ...state.providers,
          error: action.payload
        }
      }

    case actionTypes.LINKED_ACCOUNTS_SUCCESS:
      return {
        ...state,
        linkedAccounts: {
          accounts: action.payload,
          error: null
        }
      }

    case actionTypes.LINKED_ACCOUNTS_FAILURE:
      return {
        ...state,
        linkedAccounts: {
          ...state.linkedAccounts,
          error: action.payload
        }
      }

    default:
      return state
  }
}