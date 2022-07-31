const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

const { sequelize } = require('../../database/models')
const { server } = require('../../env.config')

// Initialize app
const app = express()

// Initialize middlewares
app.use(cors())
app.use(morgan('combined'))
app.use(bodyParser.json())

require('./routes')(app)

// Sync database to server
sequelize.sync({ force: false })
  .then(() => {
    app.listen(server.port)
    console.log(`Server started on port ${server.port}`)
  })
  .catch((err) => {
    console.log('An unexpected error occurred. Unable to spin up server.')
    console.log(err)
  })