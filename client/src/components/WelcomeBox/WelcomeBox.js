import React from 'react'
import PropTypes from 'prop-types'
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles'
import classNames from 'classnames'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Avatar from '@material-ui/core/Avatar'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import CollectionsBookmark from '@material-ui/icons/CollectionsBookmark'
import QuestionAnswer from '@material-ui/icons/QuestionAnswer'
import PersonPin from '@material-ui/icons/PersonPin'

const styles = theme => ({
  root: {
    height: '100%'
  },
  displayText: {
    color: theme.palette.accent,
    fontSize: 'calc(58px + 31 * ((100vw - 375px) / 1065))',
    fontWeight: 700,
    marginLeft: '-0.03em'
  },
  subtitle: {
    color: 'white'
  },
  featuresDivider: {
    marginTop: 18,
    marginBottom: 18
  },
  featureAvatar: {
    backgroundColor: 'rgba(0, 0, 0, 0.24)',
    color: '#FFF'
  },
  [theme.breakpoints.up('lg')]: {
    root: {
      padding: 40
    }
  }
})

const WelcomeBox = props => {
  const { classes } = props

  return (
    <Grid container className={classes.root} justify="center" wrap="wrap" direction="column">
      <Grid item>
        <Typography className={classes.displayText} variant="display2">
          Lorem ipsum
        </Typography>
        <Typography className={classes.subtitle} variant="headline">
          Lorem ipsum dolor amet
        </Typography>
      </Grid>
      <Divider className={classes.featuresDivider}/>
      <Grid item zeroMinWidth className={classes.features}>
        <List>
          <ListItem>
            <ListItemIcon>
              <Avatar className={classes.featureAvatar}>
                <CollectionsBookmark />
              </Avatar>
            </ListItemIcon>
            <ListItemText
              className={classes.featuresText}
              primary="Lorem ipsum dolor sit amet, consectetur adipiscing"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Avatar className={classes.featureAvatar}>
                <QuestionAnswer />
              </Avatar>
            </ListItemIcon>
            <ListItemText
              className={classes.featuresText}
              primary="Duis aute irure dolor in reprehenderit in voluptate velit"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Avatar className={classes.featureAvatar}>
                <PersonPin />
              </Avatar>
            </ListItemIcon>
            <ListItemText
              primary="Excepteur sint occaecat cupidatat non proident"
            />
          </ListItem>
        </List>
      </Grid>
    </Grid>
  )
}

WelcomeBox.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(WelcomeBox)