import App, {Container} from 'next/app'
import React from 'react'

import * as Testing from 'next-page-transitions'
console.log(Testing)
import { PageTransition, animations } from 'next-page-transitions'

const { fadeIn, fadeOut } = animations

export default class MyApp extends App {
  static async getInitialProps ({ Component, router, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return {pageProps}
  }

  render () {
    const {Component, pageProps} = this.props
    return (
      <Container>
        <PageTransition>
          <Component {...pageProps} />
        </PageTransition>
        <style jsx global>{fadeIn}</style>
        <style jsx global>{fadeOut}</style>
      </Container>
    )
  }
}
