const next = require('next')
const express = require('express')
const authConfig = require('./src/auth/auth-cfg')

// Initialize Next.js
const nextApp = next({
  dir: '.',
  dev: true
})

// Add next-auth to next app
nextApp.prepare()
  .then(() => {
    const server = express()
    authConfig(server, nextApp)
  })
  .catch(err => {
    console.log('An error occurred, unable to start the server')
    console.log(err)
  })