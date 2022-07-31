const { User } = require('../../../../database/models')
const { email, session } = require('../../../../env.config')
const providers = require('../providers')
const uuid = require('uuid/v4')
const nodemailer = require('nodemailer')

let transportOptions

if (email.server && email.username && email.password) {
  transportOptions = {
    service: 'gmail',
    auth: {
      user: email.username,
      pass: email.password
    }
  }
}

async function sendVerificationEmail ({ email, url, req }) {
  nodemailer
    .createTransport(transportOptions)
    .sendMail({
      to: email,
      from: email.from,
      subject: 'Verify your email',
      text: `Use the link below to sign in:\n\n${url}\n\n`,
      html: `<p><strong></strong>Use the link below to sign in:</strong></p><p>${url}</p>`
    }, (err) => {
      if (err) {
        console.error('Error sending email to ' + email, err)
      }
    })

    if (process.env.NODE_ENV === 'development')  {
      console.log('Generated sign in link ' + url + ' for ' + email)
    }
}

module.exports = {
  async csrf (req, res) {
    return res.json({
      csrfToken: res.locals._csrf
    })
  },
  async getSession (req, res) {
    let sess = {
      maxAge: session.sessionMaxAge,
      revalidateAge: session.sessionRevalidateAge,
      csrfToken: res.locals._csrf
    }

    // Add user object to session if logged in
    if (req.user) {
      // If logged in, export the API access token details to the client
      // Note: This token is valid for the duration of this session only.
      sess.user = req.user
      if (req.session && req.session.api) {
        sess.api = req.session.api
      }
    }

    return res.json(sess)
  },
  async providers (req, res) {
    let configuredProviders = {}

    providers.forEach(provider => {
      configuredProviders[provider.providerName] = {
        signin: (session.serverUrl || '') + `/auth/oauth/${provider.providerName.toLowerCase()}`,
        callback: (session.serverUrl || '') + `/auth/oauth/${provider.providerName.toLowerCase()}/callback`
      }
    })

    return res.json(configuredProviders)
  },
  async linkedAccounts (req, res) {
    if (!req.user) return res.status(400).send({
      success: false,
      error: 'No user was found in the request'
    })

    try {
      const user = await User.findById(req.user.id)
      if (!user) return res.json({ success: false, error: 'Unable to find user' })
  
      let linkedAccounts = {}
      providers.forEach(provider => {
        linkedAccounts[provider.providerName] = user[provider.providerName.toLowerCase()] != null ? true : false
      })
  
      return res.json(linkedAccounts)
    } catch (error) {
      console.log(error)
      return res.status(500).send({
        success: false,
        error: 'An error occurred while trying to fetch linked accounts'
      })
    }
  },
  async verifyEmailToken (req, res) {
    if (!req.params.token) {
      return res.redirect('/auth/error?action=signin&type=token-missing')
    }

    try {
      let user = await User.findOne({
        where: {
          emailToken: req.params.token
        }
      })

      
      let newUser
      if (user) {
        // Delete current token so it cannot be used again
        // Mark email as verified now we know they have access to it
        user.emailVerified = true
        user.emailToken = null

        newUser = await user.save()
      } else {
        throw new Error('Token not valid')
      }

      // If the user object is valid, sign the user in
      req.logIn(newUser, (err) => {
        if (err) return res.redirect('/auth/error?action=signin&type=token-invalid')
        if (req.xhr) {
          // If AJAX request (from client with JS), return JSON response
          return res.json({ success: true })
        } else {
          // If normal form POST (from client without JS) return redirect
          return res.redirect('/profile?email_verified=1')
        }
      })
    } catch (err) {
      console.log(err)
      return res.redirect('/auth/error?action=signin&type=token-invalid')
    }
  },
  async registerUser (req, res) {
    const { name, email, password }  = req.body || null
    
    if (!email || email.trim() === '' || !password || password.trim() === '' || !name || name.trim() === '') {
      return res.status(403).send({
        error: 'Some registration information is missing'
      })
    }

    const token = uuid()
    const url = (session.serverUrl || `${req.protocol}://${req.headers.host}`) + `/auth/verify-email/${token}`

    // Create verification token save it to database
    try {
      const user = await User.findOne({
        where: {
          email: email
        }
      })

      let newUser
      
      if (user !== null) {
        try {
          user.emailToken = token
          newUser = await user.save()
        } catch (error) {
          throw new Error(error)
        }
      } else {
        try {
          newUser = await User.create({
            name,
            password,
            email,
            emailToken: token
          })
        } catch (error) {
          throw new Error(error)
        }
      }

      // Sending email verification email
      try {
        sendVerificationEmail({
          email: newUser.getDataValue('email'),
          url,
          req
        })
      } catch (error) {
        console.log(error)
      }

      // We log in the user, but limit the features they can access on the front end
      // until their email is verified. Emails are automatically verified when signing
      // in through a third party provider (Google, Facebook, etc.)
      req.logIn(newUser, (err) => {
        if (err) return res.redirect('/auth/error?action=signin&type=credentials')
        if (req.xhr) {
          // If AJAX request (from client with JS), return JSON response
          return res.send({
            success: true,
            user: {
              email,
              name
            }
          })
        } else {
          // If normal form POST (from client without JS) return redirect
          return res.redirect('/auth/callback?action=signin&service=credentials')
        }
      })

    } catch (err) {
      return res.redirect(`/auth/error?action=signin&type=email&email=${email}`)
    }
  },
  async login (req, res) {
    try {
      const { email, password } = req.body
      const user = await User.findOne({
        where: {
          email: email
        }
      })

      if (!user) {
        return res.status(403).send({
          error: 'The login information was incorrect.'
        })
      }

      const isPasswordValid = await user.comparePassword(password)

      if (!isPasswordValid) {
        return res.status(403).send({
          error: 'The login information was incorrect.'
        })
      }

      // If signIn() returns a user, sign in as them
      req.logIn(user, (err) => {
        if (err) return res.redirect('http://localhost:3000/auth/error?action=signin&type=credentials')
        if (req.xhr) {
          // If AJAX request (from client with JS), return JSON response
          return res.json({ success: true })
        } else {
          // If normal form POST (from client without JS) return redirect
          return res.redirect('http://localhost:3000/auth/callback?action=signin&service=credentials')
        }
      })

    } catch (err) {
      res.status(500).send({
        error: 'An error has occurred while trying to login.'
      })
    }
  },
  async signout (req, res) {
    // Log user out with Passport and remove their Express session
    req.logout()
    req.session.destroy(() => {
      return res.redirect('/?logged_out=1')
    })
  }
}