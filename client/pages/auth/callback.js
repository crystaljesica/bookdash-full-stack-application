import React from 'react'
import Router from 'next/router'
import { retrieveSession } from '../../src/redux/actions'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'

import CircularProgress from '@material-ui/core/CircularProgress'

const styles = theme => ({
  circleLoader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '50%',
    zIndex: 100,
    textAlign: 'center',
    transform: 'translate(-50%, -50%)',
  }
})

class Callback extends React.Component {
  static async getInitialProps({ req, res, store }) {
    if (store.getState().session.user) {
      if (res) {
        res.redirect('/')
      } else {
        Router.replace('/')
      }

      return {}
    }

    store.dispatch(retrieveSession({ req, force: true }))
  }

  componentDidMount () {
    // Get latest session data after rendering on client then redirect.
    // The ensures client state is always updated after signing in or out.
    this.props.dispatch(retrieveSession({ force: true }))
    if (window.opener && window.opener !== window) {
      window.close()
    } else {
      Router.replace('/books')
    }
  }

  render() {
    const { classes } = this.props
    // Provide a link for clients without JavaScript as a fallback.
    return (
      <React.Fragment>
        <a href="/" className={classes.circleLoader}>
          <CircularProgress size={70} color="primary" />
        </a>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(connect()(Callback))