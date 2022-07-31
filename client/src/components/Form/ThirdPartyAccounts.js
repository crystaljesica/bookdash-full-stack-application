import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import * as actions from '../../redux/actions'

import Button from '@material-ui/core/Button'
import SvgIcon from '@material-ui/core/SvgIcon'
import Grid from '@material-ui/core/Grid'
import CardContent from '@material-ui/core/CardContent'

const styles = {
  google: {
    backgroundColor: '#DB4437',
    "&:hover": {
      backgroundColor: "#C24237"
    }
  },
  facebook: {
    backgroundColor: '#3B5998',
    "&:hover": {
      backgroundColor: "#395080"
    }
  }
}

const theme = createMuiTheme({
  palette: {
    type: 'light'
  }
})

class ThirdPartyAccounts extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    csrfToken: PropTypes.string.isRequired,
    providers: PropTypes.object.isRequired,
    handleClick: PropTypes.func.isRequired
  }

  handleClick = (provider) => {
    // The following code specifies params for pop-up window authentication.
    // This turned out to be a little too complex for now, may revisit later
    {/*
      const url = `/auth/oauth/${provider}`
      const name = `ProviderSignin`
      const width = provider === 'google' ? 500 : 575,
            height = provider === 'google' ? 600 : 400
      const specs = [
        `width=${width}`,
        `height=${height}`,
        `left=${window.innerWidth / 2 - width / 2}`,
        `top=${window.innerHeight / 2 - height / 2}`,
        'toolbar=no',
        'location=no',
        'directories=no',
        'status=no',
        'menubar=no',
        'scrollbars=no',
        'resizable=no',
        'copyhistory=no'
      ].join()
      window.open(url, name, specs)
    */}
    this.props.handleClick()
    this.props.registerUser({ isProvider: true })
  }

  render () {
    const { classes, providers, errorMessage, csrfToken } = this.props
    
    return (
      <CardContent>
        { errorMessage && <span>{errorMessage}</span> }
        <MuiThemeProvider theme={theme}>
          <Grid container spacing={16}>
            <ProviderButtons
              providers={providers}
              classes={classes}
              handleClick={this.handleClick}
              csrfToken={csrfToken}
            />
          </Grid>
        </MuiThemeProvider>
      </CardContent>
    )
  }
}

const ProviderButtons = (props) => {
  const { classes, providers, handleClick, csrfToken } = props

  return (
    <React.Fragment>
      { providers &&
        Object.keys(providers).map((provider, i) => {
          const providerName = provider.toLowerCase()

          return (
            <Grid item key={i}>
              <form action={`/auth/oauth/${providerName}`} method="POST">
                <input type="hidden" name="_csrf" value={csrfToken} />
                <Button
                  type="submit"
                  title={`Sign in with ${provider}`}
                  onClick={() => handleClick(providerName)}
                  mini
                  variant="fab"
                  color="primary"
                  classes={{
                    root: classes[providerName]
                  }}
                >
                  {
                    providerName === 'google' ?
                      <SvgIcon viewBox="0 0 512 512">
                        <path d="M179.7 237.6L179.7 284.2 256.7 284.2C253.6 304.2 233.4 342.9 179.7 342.9 133.4 342.9 95.6 304.4 95.6 257 95.6 209.6 133.4 171.1 179.7 171.1 206.1 171.1 223.7 182.4 233.8 192.1L270.6 156.6C247 134.4 216.4 121 179.7 121 104.7 121 44 181.8 44 257 44 332.2 104.7 393 179.7 393 258 393 310 337.8 310 260.1 310 251.2 309 244.4 307.9 237.6L179.7 237.6 179.7 237.6ZM468 236.7L429.3 236.7 429.3 198 390.7 198 390.7 236.7 352 236.7 352 275.3 390.7 275.3 390.7 314 429.3 314 429.3 275.3 468 275.3"/>
                      </SvgIcon> :
                      <SvgIcon viewBox="0 0 512 512">
                        <path d="M211.9 197.4h-36.7v59.9h36.7V433.1h70.5V256.5h49.2l5.2-59.1h-54.4c0 0 0-22.1 0-33.7 0-13.9 2.8-19.5 16.3-19.5 10.9 0 38.2 0 38.2 0V82.9c0 0-40.2 0-48.8 0 -52.5 0-76.1 23.1-76.1 67.3C211.9 188.8 211.9 197.4 211.9 197.4z"/>
                      </SvgIcon>
                  }
                </Button>
              </form>
            </Grid>
            )           
        })
      }
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  csrfToken: state.session.csrfToken,
  providers: state.auth.providers.data,
  errorMessage: state.auth.providers.error
})

export default withStyles(styles)(
  connect(
    mapStateToProps,
    actions
  )(ThirdPartyAccounts)
)