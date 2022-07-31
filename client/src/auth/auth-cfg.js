const bodyParser = require('body-parser')
const expressSession = require('express-session')
const lusca = require('lusca')
const passport = require('passport')
const passportSetup = require('./passport')
const { sequelize, User } = require('../../../database/models')
const { session } = require('../../../env.config')
const providers = require('./providers')

const authRoutes = require('./routes')
const SessionStore = require('connect-session-sequelize')(expressSession.Store)

module.exports = (server, nextApp) => {
  server.all('/_next/*', (req, res) => {
    let nextRequestHandler = nextApp.getRequestHandler()
    return nextRequestHandler(req, res)
  })
  
  server.use(bodyParser.json())
  server.use(bodyParser.urlencoded({
    extended: true
  }))
  
  server.set('trust proxy', 1)
  server.use(expressSession({
    secret: session.sessionSecret,
    store: new SessionStore({
      db: sequelize,
      checkExpirationInterval: 10 * 60 * 1000
    }),
    name: 'sessionId',
    resave: false,
    rolling: true,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: 'auto',
      maxAge: session.sessionMaxAge
    }
  }))
  
  server.use(lusca.csrf({
    cookie: '_csrf'
  }))

  // Add router and passport
  server.use(passport.initialize())
  server.use(passport.session())

  server.use('/auth', authRoutes)
  
  server.use((req, res, next) => {
    req.linked = () => {
      return new Promise((resolve, reject) => {
        if (!req.user) return resolve({})

        const id = req.user.id
        if (!id) throw new Error('Unable to serialize user')

        User.findById(id)
          .then(user => {
            if (!user) return resolve({})
            
            let linkedAccounts = {}
            providers.forEach(provider => {
              linkedAccounts[provider.providerName] = user[provider.providerName.toLowerCase()] != null ? true : false
            })

            return resolve(linkedAccounts) 
          })
          .catch(err => {
            return reject(err)
          })
      })
    }
    next()
  })

  server.use((req, res, next) => {
    req.providers = () => {
      return new Promise((resolve, reject) => {
        let configuredProviders = {}
        providers.forEach(provider => {
          configuredProviders[provider.providerName] = {
            signin: (session.serverUrl || '') + `/auth/oauth/${provider.providerName.toLowerCase()}`,
            callback: (session.serverUrl || '') + `/auth/oauth/${provider.providerName.toLowerCase()}/callback`
          }
        })
        return resolve(configuredProviders)
      })    
    }
    next()
  })

  server.all('*', (req, res) => {
    let nextRequestHandler = nextApp.getRequestHandler()
    return nextRequestHandler(req, res)
  })

  return server.listen(3000, err => {
    if (err) throw err
    console.log(`Ready on ${session.serverUrl}`)
  })
}