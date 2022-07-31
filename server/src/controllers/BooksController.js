const { Book } = require('../../../database/models')

module.exports = {
  async index (req, res) {
    try {
      let books
      const search = req.query.search

      if (search) {
        books = await Book.findAndCountAll({
          where: {
            $or: [
              'title', 'author', 'genre'
            ].map(key => ({
              [key]: {
                $iLike: `%${search}%`
              }
            }))
          }
        })
      } else {
        books = await Book.findAndCountAll({
          order: [
            ['id', 'DESC']
          ]
        })
        books.count = books.rows.length
      }
      res.send({ data: books })
    } catch (err) {
      res.status(500).send({
        error: 'An error occurred while trying to fetch books.'
      })
    }
  }
}