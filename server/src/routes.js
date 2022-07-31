const BooksController = require('./controllers/BooksController')

module.exports = (app) => {
  app.get('/books',
    BooksController.index)
}
