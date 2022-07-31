import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import * as actions from '../../redux/actions'
import { withStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import LoginInputs from '../Form/Login/LoginInputs'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import SvgIcon from '@material-ui/core/SvgIcon'
import Typography from '@material-ui/core/Typography'
import Close from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import withMobileDialog from '@material-ui/core/withMobileDialog'
import lightBlue from '@material-ui/core/colors/lightBlue'

const styles = theme => ({
  dialogActions: {
    justifyContent: 'center'
  },
  inputsContainer: {
    marginBottom: 28
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 24
  },
  providerBtnsContainer: {
    marginTop: 16
  },
  providerButton: {
    textTransform: 'none',
    borderWidth: 2,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 14
  },
  providerIcon: {
    marginRight: 12
  },
  authButton: {
    textTransform: 'none',
    fontSize: '20px',
    marginBottom: 8
  },
  signinMethodContainer: {
    position: 'relative',
    padding: 16,
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '50%',
      right: '100%',
      width: 5000,
      borderBottom: '1px solid rgb(228, 228, 228)',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: '100%',
      width: 5000,
      borderBottom: '1px solid rgb(228, 228, 228)',
    }
  },
  signinMethodDivider: {
    fontWeight: 500,
    wordWrap: 'break-word',
    lineHeight: '18px',
    letterSpacing: 'normal',
    color: 'rgb(118, 118, 118)',
    display: 'inline',
    margin: 0,
    fontSize: 14,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
  }
})

const theme = outerTheme => createMuiTheme({
  ...outerTheme,
  palette: {
    ...outerTheme.palette,
    type: 'light',
    primary: lightBlue
  }
})

class AuthModal extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    fullScreen: PropTypes.bool.isRequired
  }

  componentDidMount () {
    console.log('AUTH MODAL MOUNTED')
    if (!this.props.providers) {
      this.props.retrieveProviders({ req: false })
    }
  }

  componentWillUnmount () {
    console.log('AUTH MODAL UNMOUNTING')
  }

  render () {
    const { fullScreen, classes, providers, open, csrfToken } = this.props

    return (
      <MuiThemeProvider theme={theme}>
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onClose={this.props.closeModal}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Sign in to continue
            <IconButton className={classes.closeButton} onClick={this.props.closeModal}>
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              To use all of Bookdash's features, you'll need to log in below.
            </DialogContentText>
            <div className={classes.inputsContainer}>
              <LoginInputs />
            </div>
            <Button
              fullWidth
              className={classes.authButton}
              color="secondary"
              variant="contained"
              style={{ padding: 12 }}
            >
              Sign in
            </Button>
            <div style={{ marginTop: 16, marginBottom: 16 }}>
              <div style={{ overflow: 'hidden', textAlign: 'center' }}>
                <span className={classes.signinMethodContainer}>
                  <span className={classes.signinMethodDivider}>
                    <span>or continue with</span>
                  </span>
                </span>
              </div>
            </div>
            <ProviderButtons
              classes={classes}
              providers={providers}
              csrfToken={csrfToken}
            />
          </DialogContent>
          <Divider />
          <DialogActions classes={{
            root: classes.dialogActions
          }}>
            <Typography variant="body1" align="center" style={{ padding: 8 }}>
              Don't have an account? <a href="/get-started" style={{ textDecoration: 'none', color: '#2196f3' }}>Sign up</a>
            </Typography>
          </DialogActions>
        </Dialog>
      </MuiThemeProvider>
    )
  }
}

const ProviderButtons = ({ providers, classes, csrfToken }) => (
  <Grid container spacing={16} className={classes.providerBtnsContainer}>
    { providers && 
      Object.keys(providers).map((provider, i) => {
        const providerName = provider.toLowerCase()

        return (
          <Grid item xs={12} sm={6}>
            <form action={`/auth/oauth/${providerName}`} method="POST">
              <input type="hidden" name="_csrf" value={csrfToken} />
              <Button
                fullWidth
                className={classes.providerButton}
                size="large"
                type="submit"
                variant="outlined"
              >
              {
                providerName === 'google' ? 
                <SvgIcon
                  className={classes.providerIcon}
                  viewBox="0 0 18 18"
                  style={{ height: 18, width: 18 }}
                >
                  <g fill="none" fillRule="evenodd">
                    <path d="M9 3.48c1.69 0 2.83.73 3.48 1.34l2.54-2.48C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l2.91 2.26C4.6 5.05 6.62 3.48 9 3.48z" fill="#EA4335"></path>
                    <path d="M17.64 9.2c0-.74-.06-1.28-.19-1.84H9v3.34h4.96c-.1.83-.64 2.08-1.84 2.92l2.84 2.2c1.7-1.57 2.68-3.88 2.68-6.62z" fill="#4285F4"></path>
                    <path d="M3.88 10.78A5.54 5.54 0 0 1 3.58 9c0-.62.11-1.22.29-1.78L.96 4.96A9.008 9.008 0 0 0 0 9c0 1.45.35 2.82.96 4.04l2.92-2.26z" fill="#FBBC05"></path>
                    <path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.84-2.2c-.76.53-1.78.9-3.12.9-2.38 0-4.4-1.57-5.12-3.74L.97 13.04C2.45 15.98 5.48 18 9 18z" fill="#34A853"></path>
                    <path d="M0 0h18v18H0V0z"></path>
                  </g>
                </SvgIcon> :
                <SvgIcon
                  className={classes.providerIcon}
                  viewBox="0 0 32 32"
                  fill="currentColor"
                  style={{ height: 18, width: 18 }}
                >
                  <path d="m8 14.41v-4.17c0-.42.35-.81.77-.81h2.52v-2.08c0-4.84 2.48-7.31 7.42-7.35 1.65 0 3.22.21 4.69.64.46.14.63.42.6.88l-.56 4.06c-.04.18-.14.35-.32.53-.21.11-.42.18-.63.14-.88-.25-1.78-.35-2.8-.35-1.4 0-1.61.28-1.61 1.73v1.8h4.52c.42 0 .81.42.81.88l-.35 4.17c0 .42-.35.71-.77.71h-4.21v16c0 .42-.35.81-.77.81h-5.21c-.42 0-.8-.39-.8-.81v-16h-2.52a.78.78 0 0 1 -.78-.78" fillRule="evenodd"></path>
                </SvgIcon>
              }
                {provider}
              </Button>
            </form>
          </Grid>
        )
      })
    }
  </Grid>
)

const mapStateToProps = (state) => ({
  csrfToken: state.session.csrfToken,
  open: state.authModals.open,
  providers: state.auth.providers.data
})

export default withStyles(styles)(
  withMobileDialog()(connect(
    mapStateToProps,
    actions
  )(AuthModal)
))