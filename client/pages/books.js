import React, { Component } from 'react'
import { connect } from 'react-redux'
import { loadBooks } from '../src/redux/actions'

import Page from '../src/layouts/Main'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import BookList from '../src/components/BookList/BookList'

class Books extends Component {
  static async getInitialProps ({ store, isServer }) {

    if (!store.getState().dashboard.data) {
      store.dispatch(loadBooks())
    }

    return { isServer }
  }

  render () {
    return (
      <Page>
        <Typography variant="display2">Hello, {this.props.user.name}</Typography>
        <BookList books={this.props.books} />
      </Page>
    )
  }
}

const mapStateToProps = (state) => ({
  books: state.dashboard.data,
  user: state.session.user
})

export default connect(mapStateToProps)(Books)