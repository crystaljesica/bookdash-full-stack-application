import { actionTypes } from '../actions/types'

let initialState = {
  open: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SIDENAV_OPENED:
      return {
        ...state,
        open: true
      }

    case actionTypes.SIDENAV_CLOSED:
      return {
        ...state,
        open: false
      }

    default:
      return state
  }
}