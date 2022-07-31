import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Link from 'next/link'
import classNames from 'classnames'
import { retrieveProviders, resetAuthState } from '../src/redux/actions'

import Grid from '@material-ui/core/Grid'
import SignupCard from '../src/components/Form/Signup/SignupCard'
import WelcomeBox from '../src/components/WelcomeBox/WelcomeBox'
import IconButton from '@material-ui/core/IconButton'
import NavigateBefore from '@material-ui/icons/NavigateBefore'

const styles = theme => ({
  root: {
    flex: '1 1 100%',
    maxWidth: '100%',
    padding: 0,
    margin: 0,
  },
  section: {
    padding: '1rem',
    height: '100vh',
    minHeight: 500
  },
  [theme.breakpoints.up('lg')]: {
    formContainer: {
      padding: 24
    }
  },
  backButton: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.08)'
  },
  welcomeBox: {
    backgroundColor: theme.palette.secondary.main,
    background: 'linear-gradient(to right, #ff5e62, #ff9966)'
  },
  signupBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'url("static/images/get-started-bookstack.jpg")',
    backgroundSize: 'cover'
  },
})

class GetStarted extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    providers: PropTypes.object
  }

  static async getInitialProps ({ req, store }) {
    if (!store.getState().auth.providers.data) {
      store.dispatch(retrieveProviders({ req }))
    }
  }

  componentWillUnmount () {
    this.props.resetAuthState()
  }

  render () {
    const { classes } = this.props
  
    return (
      <Grid className={classes.root} container direction="row">
        <Grid
          xs={12}
          md={7}
          item
          className={classNames(classes.section, classes.welcomeBox)}
          component="section"
        >
          <Link prefetch href="/">
            <IconButton className={classes.backButton}>
              <NavigateBefore />
            </IconButton>
          </Link>
          <WelcomeBox />
        </Grid>
        <Grid
          xs={12}
          md={5}
          item
          className={classNames(classes.section, classes.signupBox)}
          component="section"
        >
          <Grid container spacing={16} className={classes.formContainer} justify="center">
            <Grid item xs={12} md={9}>
              <SignupCard />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }
}

export default withStyles(styles)(
  connect(
    null,
    { resetAuthState }
  )(GetStarted)
)