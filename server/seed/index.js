const {
  sequelize,
  Book,
  User,
  Author
} = require('../../database/models')

const Promise = require('bluebird')
const books = require('./books.json')
const users = require('./users.json')
const authors = require('./authors.json')

sequelize.sync({ force: true })
  .then(async function () {
    await Promise.all(
      users.map(user => {
        User.create(user)
      })
    )

    await Promise.all(
      books.map(book => {
        Book.create(book)
      })
    )

    await Promise.all(
      authors.map(author => {
        Author.create(author)
      })
    )
  })