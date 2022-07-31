import React from 'react'
import PropTypes from 'prop-types'
import { reduxForm, startSubmit } from 'redux-form'
import { connect } from 'react-redux'
import { withStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import * as actions from '../../../redux/actions'

import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Refresh from '@material-ui/icons/Refresh'
import Tooltip from '@material-ui/core/Tooltip'
import Divider from '@material-ui/core/Divider'
import ThirdPartyAccounts from '../ThirdPartyAccounts'
import Grow from '@material-ui/core/Grow'
import Fade from '@material-ui/core/Fade'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'
import blue from '@material-ui/core/colors/blue'

import SignupInputs from './SignupInputs'

const styles = {
  header: {
    paddingBottom: 0
  },
  card: {
    position: 'relative'
  },
  content: {
    paddingTop: 8,
    paddingBottom: 32,
    paddingLeft: 48,
    paddingRight: 48
  },
  overlay: {
    zIndex: 1,
    position: 'absolute',
    borderRadius: 2,
    overflow: 'hidden',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.78)'
  }
}

const theme = outerTheme => createMuiTheme({
  ...outerTheme,
  palette: {
    ...outerTheme.palette,
    primary: blue
  }
})

class SignupCard extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    reset: PropTypes.func.isRequired,
    error: PropTypes.bool,
    errorMessage: PropTypes.string,
    registerUser: PropTypes.func.isRequired
  }

  state = {
    submitPending: false
  }

  handleRegisterEvent = () => {
    this.setState({
      submitPending: true
    })
  }

  handleFormSubmit = ({ name, email, password }) => {
    this.handleRegisterEvent()
    this.props.registerUser({
      name,
      email,
      password,
      isRegistering: true
    })
  }

  render () {
    const {
      handleSubmit,
      pristine,
      reset,
      loginPending,
      valid,
      errorMessage,
      classes,
      csrfToken
    } = this.props

    return (
      <MuiThemeProvider theme={theme}>
        <Card className={classes.card} raised>
          <Fade in={this.state.submitPending} mountOnEnter unmountOnExit>
            <div className={classes.overlay}>
              <LinearProgress color="primary" />
            </div>
          </Fade>
          <CardHeader className={classes.header} title="Sign up" subheader="Enter your email and password"/>
          <ThirdPartyAccounts handleClick={this.handleRegisterEvent} />
          <Divider />
          {errorMessage &&
            <Typography color="error" align="center" variant="caption">{errorMessage}</Typography>
          }
          <form
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}
          >
            <CardContent className={classes.content}>
              <SignupInputs />
            </CardContent>
            <Divider />
            <CardActions>
              <Button
                type="submit"
                disabled={!valid || pristine || loginPending}
                variant="contained"
                color="primary"
                size="small"
                className={classes.signupButton}
              >
                Sign up
              </Button>
              <Tooltip
                title="Reset form"
                placement="right"
              >
                <div>
                  <Grow in={!pristine}>
                    <IconButton
                      disabled={pristine || loginPending}
                      aria-label="Reset form"
                      onClick={reset}
                      className={classes.resetButton}
                      >
                      <Refresh />
                    </IconButton>
                  </Grow>
                </div>
              </Tooltip>
            </CardActions>
          </form>
        </Card>
      </MuiThemeProvider>
    )
  }
}

const mapStateToProps = (state) => ({
  csrfToken: state.session.csrfToken,
  loginPending: state.auth.loginPending,
  errorMessage: state.auth.error
})

SignupCard = connect(
  mapStateToProps,
  actions
)(withStyles(styles)(SignupCard))

export default reduxForm({
  form: 'signup'
})(SignupCard)