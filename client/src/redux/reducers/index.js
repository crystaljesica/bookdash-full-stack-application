import { combineReducers } from 'redux'
import { reducer as form } from 'redux-form'
import authReducer from './authReducer'
import dashboardReducer from './dashboardReducer'
import sessionReducer from './sessionReducer'
import authModalsReducer from './authModalsReducer'
import sidenavReducer from './sidenavReducer'

const rootReducer = combineReducers({
  form,
  auth: authReducer,
  authModals: authModalsReducer,
  session: sessionReducer,
  sidenav: sidenavReducer,
  dashboard: dashboardReducer,
})

export default rootReducer