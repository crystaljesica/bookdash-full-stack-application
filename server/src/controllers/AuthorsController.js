const { Author } = require('../../../database/models')

module.exports = {
  async index (req, res) {
    try {
      let authors
      const search = req.query.search

      if (search) {
        authors = await Author.findAndCountAll({
          where: {
            fullName: {
              $iLike: `%${search}%`
            }
          }
        })
      } else {
        authors = await Author.findAndCountAll({
          order: [
            ['id', 'DESC']
          ],
          limit: 10
        })
        authors.count = authors.rows.length
      }
      res.send({ data: authors })
    } catch (err) {
      res.status(500).send({
        error: 'An error occurred while trying to fetch authors.'
      })
    }
  }
}