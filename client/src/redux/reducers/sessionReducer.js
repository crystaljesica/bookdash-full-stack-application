import { actionTypes } from '../actions/types'

let initialState = {
  error: null
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SESSION_SUCCESS:
      return {
        ...state,
        ...action.payload
      }

    case actionTypes.SESSION_FAILURE:
      return {
        ...state,
        ...{ error: action.payload }
      }

    case actionTypes.CSRF_SUCCESS:
      return {
        ...state,
        ...{ csrfToken: action.payload }
      }

    case actionTypes.CSRF_FAILURE:
      return {
        ...state,
        ...{ error: action.payload }
      }

    case actionTypes.SIGNOUT_SUCCESS:
      return {
        error: null
      }

    case actionTypes.SIGNOUT_FAILURE:
      return {
        ...state,
        error: action.payload
      }

    default:
      return state
  }
}