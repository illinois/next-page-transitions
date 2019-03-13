import React from 'react'
import App, { Container } from 'next/app'
import { PageTransition } from 'next-page-transitions'

import Loader from '../components/Loader'

export default class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  render() {
    const { Component, pageProps, router } = this.props
    return (
      <Container>
        <PageTransition
          timeout={300}
          classNames="page-transition"
          loadingComponent={<Loader />}
          loadingDelay={500}
          loadingTimeout={{
            enter: 400,
            exit: 0,
          }}
          loadingClassNames="loading-indicator"
        >
          <Component {...pageProps} key={router.route} />
        </PageTransition>
        <style jsx global>{`
          .page-transition-enter {
            opacity: 0;
            transform: translate3d(0, 20px, 0);
          }
          .page-transition-enter-active {
            opacity: 1;
            transform: translate3d(0, 0, 0);
            transition: opacity 300ms, transform 300ms;
          }
          .page-transition-exit {
            opacity: 1;
          }
          .page-transition-exit-active {
            opacity: 0;
            transition: opacity 300ms;
          }
          .loading-indicator-appear,
          .loading-indicator-enter {
            opacity: 0;
          }
          .loading-indicator-appear-active,
          .loading-indicator-enter-active {
            opacity: 1;
            transition: opacity 400ms;
          }
        `}</style>
      </Container>
    )
  }
}
