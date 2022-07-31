import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Link from 'next/link'
import classNames from 'classnames'

import { closeSidenav } from '../src/redux/actions'

import Page from '../src/layouts/Splash'
import Hero from '../src/components/Hero/Hero'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import InboxIcon from '@material-ui/icons/Inbox'
import DraftsIcon from '@material-ui/icons/Drafts'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import AuthModal from '../src/components/AuthModal/AuthModal'

const styles = theme => ({
  root: {
    padding: 0,
    margin: 0
  },
  heroDisplay: {
    color: '#ffffff',
    textShadow: '1px 0 10px rgb(90, 86, 80)',
  },
  title: {
    fontSize: 'calc(80px + 31 * ((100vw - 375px) / 1065))'
  },
  heroMain: {
    position: 'relative',
    marginBottom: 28
  },
  getStartedButton: {
    background: 'linear-gradient(135deg, rgba(255,89,100,1) 0%, rgba(250,40,86,1) 100%)',
    height: 48,
    padding: '0 30px'
  },
  list: {
    width: 250,
  }
})

class Index extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  }

  render () {
    const { classes, closeSidenav, open } = this.props

    const sideList = (
      <div className={classes.list}>
        <List>
          <Link prefetch href="/books">
            <ListItem button>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary="Books" />
            </ListItem>
          </Link>
          <Link prefetch href="/profile">
            <ListItem button>
              <ListItemIcon>
                <DraftsIcon />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItem>
          </Link>
        </List>
        <Divider />
      </div>
    )

    return (
      <div className={classes.root}>
        <Page>
          <Drawer open={open} onClose={closeSidenav}>
            <div
              tabIndex={0}
              role="button"
              onClick={closeSidenav}
              onKeyDown={closeSidenav}
            >
              {sideList}
            </div>
          </Drawer>
          <AuthModal />
          <Grid container>
            <Hero size="fullscreen" src="static/images/mainpage-splash--16-9-blurred.jpg">
              <Grid className={classes.heroMain}>
                <Grid item>
                  <Typography variant="display4" className={classNames(classes.heroDisplay, classes.title)}>
                    Bookdash
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="headline" className={classes.heroDisplay}>
                    Put some snappy subtitle here... later
                  </Typography>
                </Grid>
              </Grid>
              <Grid item>
                <Link prefetch href="/get-started">
                  <Button 
                    classes={{
                      root: classes.getStartedButton
                    }}
                    variant="contained"
                    size="large"
                    color="secondary">
                    Get Started
                  </Button>
                </Link>
              </Grid>
            </Hero>
          </Grid>
        </Page>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  open: state.sidenav.open
})

export default withStyles(styles)(
  connect(
    mapStateToProps,
    { closeSidenav }
  )(Index))