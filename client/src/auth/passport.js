const passport = require('passport')
const { User } = require('../../../database/models')
const providers = require('./providers')
const functions = require('./controllers')

passport.serializeUser((user, next) => {
  try {
    next(null, user.id)
  } catch (error) {
    console.log('Unable to serialize user:', error)
    next(error, false)
  }
})

passport.deserializeUser(async (id, next) => {
  try {
    const user = await User.findOne({
      where: {
        id
      },
      attributes: [
        'id',
        'name',
        'email',
        'emailVerified'
      ]
    })
    next(null, user)
  } catch (error) {
    console.log(error)
    next(error, false)
  }
})

providers.forEach(({
  providerName,
  Strategy,
  strategyOptions,
  getProfile
}) => {
  strategyOptions.callbackURL = (strategyOptions.callbackURL || `http://localhost:3000/auth/oauth/${providerName.toLowerCase()}/callback`)
  strategyOptions.passReqToCallback = true

  passport.use(
    new Strategy(
      strategyOptions,
      async (req, accessToken, refreshToken, _profile, next) => {
        try {
          let profile = getProfile(_profile)

          req.session[providerName.toLowerCase()] = {
            accessToken
          }

          if (!profile.email) {
            profile.email = `${providerName.toLowerCase()}-${profile.id}@localhost.localdomain`
          }

          try {
            const user = await User.findOne({
              where: {
                [providerName.toLowerCase()]: {
                  id: profile.id
                }
              }
            })

            console.log('FOUND USER:::::::::::::', user)
  
            if (req.user) {
              // Handles scenarios where the user is already logged in
              if (user) {
                if (req.user.id === user.id) {
                  if (refreshToken) {
                    user[providerName.toLowerCase()] = {
                      id: profile.id,
                      accessToken: accessToken,
                      refreshToken: refreshToken
                    }

                    try {
                      await user.save()
                    } catch (err) {
                      next(err)
                    }
                  } else {
                    return next(null, user)
                  }
                } else {
                  // Handles scenarios where a user is logged in but
                  // the oAuth account they are trying to link to is
                  // already linked to a different local account
                  return next(null, false)
                }
              } else {
                // Handles situation in which a user is already logged in
                // and is trying to link to a new account
                try {
                  const id = req.user.id
                  if (!id) throw new Error('Unable to serialize user')
  
                  let user = await User.findById(id)
                  if (!user) {
                    return next(new Error('Unable to look up account for current user'). false)
                  }
  
                  user.name = user.name || profile.name
                  const pattern = new RegExp(/.*@localhost\.localdomain$/)
  
                  if (user.email && user.email.match(pattern) && profile.email && !profile.match(pattern)) {
                    user.emailVerified = true // Assuming that third party account has a verified email
                    user.email = profile.email
                  }
  
                  user[providerName.toLowerCase()] = {
                    id: profile.id,
                    accessToken: accessToken,
                    refreshToken: refreshToken
                  }
  
                  try {
                    const newUser = await user.save()
                    return next(null, newUser)
                  } catch (err) {
                    return next(err)
                  }
                } catch (err) {
                  return next(err)
                }
              }
            } else {
              // Handle scenarios where a user is not logged in
              if (user) {
                if (accessToken || refreshToken) {
                  if (accessToken) user[providerName.toLowerCase()].accessToken = accessToken
                  if (refreshToken) user[providerName.toLowerCase()].refreshToken = refreshToken

                  try {
                    await user.save()
                    return next(null, user)
                  } catch (err) {
                    return next(err, false) 
                  }
                } else {
                  return next(null, user)
                }
              } else {
                // Handle scenarios where the user is not logged in and
                // they don't have a local account already
                const user = await User.findOne({
                  where: {
                    email: profile.email    
                  }
                })
                console.log('USER::::::::::', user)
                if (user) return next(null, false)

                try {
                  const newUser = await User.create({
                    name: profile.name,
                    email: profile.email,
                    [providerName.toLowerCase()]: {
                      id: profile.id,
                      accessToken: accessToken,
                      refreshToken: refreshToken
                    },
                    emailVerified: true
                  })

                  return next(null, newUser)
                } catch (err) {
                  return next(err, false)
                }
              }
            }
          } catch (err) {
            return next(err, false)
          }
        } catch (err) {
          return next(err, false)
        }
      }
    )
  )
})