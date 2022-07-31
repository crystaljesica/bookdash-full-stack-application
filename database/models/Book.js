module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    title: DataTypes.STRING,
    subtitle: DataTypes.STRING,
    author: DataTypes.STRING,
    genre: DataTypes.STRING,
    description: DataTypes.TEXT,
    coverArt: DataTypes.STRING,
    publisher: DataTypes.STRING,
    publicationDate: DataTypes.DATE,
    isbn10: DataTypes.STRING,
    isbn13: DataTypes.STRING,
    pageCount: DataTypes.INTEGER,
    amazonUrl: DataTypes.STRING,
    goodreadsUrl: DataTypes.STRING
  })

  return Book
}