import { actionTypes } from './types'

export function signoutUser ({ csrf }) {
  return { type: actionTypes.SIGNOUT_REQUEST, payload: { csrf } }
}

export function loadBooks () {
  return { type: actionTypes.LOAD_BOOKS }
}

export function openModal () {
  return { type: actionTypes.MODAL_OPENED }
}

export function closeModal () {
  return { type: actionTypes.MODAL_CLOSED }
}

export function openSidenav () {
  return { type: actionTypes.SIDENAV_OPENED }
}

export function closeSidenav () {
  return { type: actionTypes.SIDENAV_CLOSED }
}

/**
 * Requests an updated (or new) session object from the server
 * @param  {object} req The request object provided with server-side renders
 * @param  {boolean} force Boolean indicating whether or not to force refresh the session object
 */
export function retrieveSession ({ req, force }) {
  return {
    type: actionTypes.SESSION_REQUEST,
    payload: { req, force }
  }
}

export function getCsrfToken () {
  return { type: actionTypes.CSRF_REQUEST }
}

export function retrieveProviders ({ req }) {
  return {
    type: actionTypes.PROVIDERS_REQUEST,
    payload: { req }
  }
}

export function retrieveLinkedAccounts ({ req }) {
  return {
    type: actionTypes.LINKED_ACCOUNTS_REQUEST,
    payload: { req }
  }
}

export function loadDataSuccess (data) {
  return {
    type: actionTypes.LOAD_DATA_SUCCESS,
    data
  }
}

/**
 * Tells the app we want to register a user
 * @param  {object} data The data we're sending for registration
 * @param  {string} data.name The name of the user to register
 * @param  {string} data.email The email of the user to register
 * @param  {string} data.password The password of the user to register
 * @param  {boolean} data.isRegistering Whether or not we're registering a new user
 * @param  {boolean} data.isProvider Indicates if signin is through provider
 */
export function registerUser ({ name, email, password, isRegistering, isProvider }) {
  return {
    type: actionTypes.REGISTER_REQUEST,
    payload: { name, email, password, isRegistering, isProvider }
  }
}

export function resetAuthState () {
  return { type: actionTypes.RESET_AUTH_STATE }
}

/**
 * Tells the app we want to log in a user
 * @param  {object} data          The data we're sending for log in
 * @param  {string} data.email The username of the user to log in
 * @param  {string} data.password The password of the user to log in
 */
export function loginUser ({ email, password }) {
  return {
    type: actionTypes.LOGIN_REQUEST,
    payload: { name, password }
  }
}

/**
 * Sets the `error` state to the error received
 * @param  {object} error The error we got when trying to make the request
 */
export function requestError (error) {
  return {
    type: actionTypes.AUTH_ERROR,
    error
  }
}

/**
 * Sets the `error` state as empty
 */
export function clearError () {
  return { type: actionTypes.CLEAR_ERROR }
}