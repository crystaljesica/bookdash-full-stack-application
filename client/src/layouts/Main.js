import React from 'react'
import ButtonAppBar from '../components/Header/Header'
import { withStyles } from '@material-ui/core/styles'

const styles = {
  container: {
    paddingTop: 80
  }
}

const Page = ({ children, classes }) => (
  <React.Fragment>
    <ButtonAppBar />
    <div className={classes.container}>
      {children}
    </div>
  </React.Fragment>
)

export default withStyles(styles)(Page)