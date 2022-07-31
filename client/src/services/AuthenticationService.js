import Api from './Api'

const authApi = Api()
authApi.defaults.baseURL = 'http://localhost:3000/auth'
authApi.defaults.withCredentials = true

export default {
  register (credentials) {
    return authApi.post('/register', credentials, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Requested-With': 'XMLHttpRequest' // So Express can detect AJAX post
      }
    })
  },
  login (credentials) {
    return authApi.post('/login', credentials, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Requested-With': 'XMLHttpRequest' // So Express can detect AJAX post
      }
    })
  },
  signout (credentials) {
    return authApi.post('/signout', credentials, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  },
  providers () {
    return authApi.get('/providers')
  },
  linked () {
    return authApi.get('/linked')
  },
  session () {
    return authApi.get('/session')
  },
  csrf () {
    return authApi.get('/csrf')
  }
}