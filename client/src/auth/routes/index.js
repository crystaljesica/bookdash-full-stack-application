const router = require('express').Router()
const providers = require('../providers')
const passport = require('passport')
const { User } = require('../../../../database/models')
const AuthenticationController = require('../controllers')

// GET handlers
router.get('/csrf', AuthenticationController.csrf)

router.get('/session', AuthenticationController.getSession)

router.get('/linked', AuthenticationController.linkedAccounts)

router.get('/providers', AuthenticationController.providers)

router.get('/verify-email/:token', AuthenticationController.verifyEmailToken)

// POST handlers
router.post('/register', AuthenticationController.registerUser)

router.post('/login', AuthenticationController.login)

router.post('/signout', AuthenticationController.signout)

// Provider OAuth handlers
providers.forEach(({
  providerName,
  providerOptions
}) => {
  const provider = providerName.toLowerCase()
  // Route to start sign in
  router.post(`/oauth/${provider}`, passport.authenticate(provider, providerOptions))

  router.get(`/oauth/${provider}/callback`,
    passport.authenticate(provider, {
      successRedirect: `http://localhost:3000/auth/callback?action=signin&service=${provider}`,
      failureRedirect: `http://localhost:3000/auth/error?action=signin&type=oauth&service=${provider}`
    })
  )

  router.post(`/oauth/${provider}/unlink`, async (req, res, next) => {
    if (!req.user) {
      return next(new Error('Not signed in'))
    }

    const id = req.user.id
    if (!id) throw new Error('Unable to serialize user')

    const user = await User.findById(id)
    if (!user) return next(new Error('Unable to look up account for current user'))

    if (user[provider]) {
      user[provider] = null
    }

    try {
      await user.save()
      return res.send({ success: true })
      // return res.redirect(`http://localhost:3000/auth/callback?action=unlink&service=${provider}`)
    } catch (err) {
      return next(err, false)
    }
  })
})

router.get('/oauth/:provider', (req, res) => {
  res.send({ error: 'Provider is not supported' })
  // res.redirect('http://localhost:3000/auth/oauth/error?action=signin&type=unsupported')
})

module.exports = router