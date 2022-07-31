import React from 'react'
import App, { Container } from 'next/app'
import { Provider } from 'react-redux'
import withRedux from 'next-redux-wrapper'
import withReduxSaga from 'next-redux-saga'
import { MuiThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import JssProvider from 'react-jss/lib/JssProvider'
import getPageContext from '../src/getPageContext'
import { retrieveSession } from '../src/redux/actions'
import NProgress from 'nprogress'
import Router from 'next/router'

import createStore from '../src/redux/store'

NProgress.configure({
  minimum: 0.15,
  showSpinner: false,
  easing: 'cubic-bezier(0.5, 0.08, 0, 1)',
  speed: 430
})

Router.onRouteChangeStart = (url) => {
  console.log(`Loading: ${url}`)

  NProgress.start()
}
Router.onRouteChangeComplete = () => NProgress.done()
Router.onRouteChangeError = () => NProgress.done()

class Bookdash extends App {
  static async getInitialProps ({ Component, ctx }) {
    // Get session info upon every request
    ctx.store.dispatch(retrieveSession({ req: ctx.req, force: true }))

    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  constructor (props) {
    super(props)
    this.pageContext = getPageContext()
  }

  pageContext = null

  componentDidMount () {
    // Remove server-side injected CSS
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles)
    }
  }

  render () {
    const { Component, pageProps, store } = this.props

    return (
      <Container>
        <JssProvider
          registry={this.pageContext.sheetsRegistry}
          generateClassName={this.pageContext.generateClassName}
        >
          {/* MuiThemeProvider makes the theme available down the React
              tree thanks to React context. */}
          <MuiThemeProvider
            theme={this.pageContext.theme}
            sheetsManager={this.pageContext.sheetsManager}
          >
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <Provider store={store}>
              <Component pageContext={this.pageContext} {...pageProps} />
            </Provider>
          </MuiThemeProvider>
        </JssProvider>
      </Container>
    )
  }
}

export default withRedux(createStore)(
  withReduxSaga({
    async: false
  })(Bookdash)
)