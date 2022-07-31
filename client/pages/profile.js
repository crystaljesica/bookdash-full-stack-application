import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'

import Page from '../src/layouts/Main'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'
import green from '@material-ui/core/colors/green'
import IconButton from '@material-ui/core/IconButton'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'

const styles = (theme) => ({
  snackbar: {
    background: green[600]
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  }
})

class Profile extends React.Component {
  static async getInitialProps ({ query }) {
    return {
      verified: query.email_verified === '1'
    }
  }

  state = {
    open: this.props.verified,
  }

  handleClick = () => {
    this.setState({ open: true })
  }

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    this.setState({ open: false })
  }

  render () {
    const { classes, verified } = this.props
    return (
      <Page>
        {verified && 
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            open={this.state.open}
            autoHideDuration={6000}
            onClose={this.handleClose}
          >
            <SnackbarContent
              className={classes.snackbar}
              aria-describedby="client-snackbar"
              message={
                <span id="client-snackbar" className={classes.message}>
                  <CheckCircleIcon className={classNames(classes.icon, classes.iconVariant)} />
                  Your email has been verified
                </span>
              }
              action={[
                <IconButton
                  key="close"
                  aria-label="Close"
                  color="inherit"
                  className={classes.close}
                  onClick={this.handleClose}
                >
                  <CloseIcon className={classes.icon} />
                </IconButton>
              ]}
            />
          </Snackbar>
        }
        <Typography variant="display2">Hello, {this.props.user.name}</Typography>
      </Page>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.session.user
})

export default withStyles(styles)(connect(mapStateToProps)(Profile))