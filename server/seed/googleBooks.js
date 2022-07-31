const axios = require('axios')
const fs = require('fs')
const path = require('path')
const jsonfile = require('jsonfile')

const fields = `items(id,kind,volumeInfo(authors,categories,description,imageLinks/thumbnail,industryIdentifiers,infoLink,pageCount,publishedDate,publisher,subtitle,title))`
let data = []
const targetFile = path.join(__dirname, 'books.json')
 
axios.get('https://www.googleapis.com/books/v1/volumes', {
  params: {
    q: 'subject:politics',
    fields,
    orderBy: 'relevance',
    langRestrict: 'en',
    maxResults: 10
  }
})
  .then(response => {
    const { items } = response.data
    data = items.map(volume => {
      let {
        title,
        authors,
        categories,
        description,
        imageLinks: {
          thumbnail: coverArt
        },
        industryIdentifiers,
        infoLink,
        language,
        pageCount,
        publishedDate,
        publisher
      } = volume.volumeInfo

      let isbn10, isbn13
      industryIdentifiers.filter(item => {
        item.type === 'ISBN_10' ? isbn10 = item.identifier : isbn13 = item.identifier
      })

      return {
        title,
        author: authors.join(', '),
        genre: categories[0],
        description,
        coverArt,
        publisher,
        publicationDate: publishedDate,
        isbn10,
        isbn13,
        pageCount: parseInt(pageCount),
        amazonUrl: infoLink
      }
    })

    jsonfile.readFile(targetFile, (err, obj) => {
      if (obj instanceof Array) {
        data = [...obj, ...data]
        jsonfile.writeFile(targetFile, data)
      }

    })

  })
  .catch(error => {
    console.log(error)
  })