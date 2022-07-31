import Api from './Api'

export default {
  getBooks () {
    return Api().get('/books')
  }
}