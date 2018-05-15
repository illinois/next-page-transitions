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
    const { Component, pageProps } = this.props
    return (
      <Container>
        <PageTransition
          timeout={300}
          classNames="fade"
          loadingComponent={Loader}
          loadingTimeout={200}
          loadingClassNames="indicator-fade"
        >
          <Component {...pageProps} />
        </PageTransition>
        <style jsx global>{`
          .fade-enter {
            opacity: 0;
            transform: translate3d(0, 20px, 0);
          }
          .fade-enter-active {
            opacity: 1;
            transform: translate3d(0, 0, 0);
            transition: opacity 300ms, transform 300ms;
          }
          .fade-exit {
            opacity: 1;
          }
          .fade-exit-active {
            opacity: 0;
            transition: opacity 300ms;
          }
          .indicator-fade-enter {
            opacity: 0;
          }
          .indicator-fade-appear-active,
          .indicator-fade-enter-active {
            opacity: 1;
            transition: opacity 200ms;
          }
        `}</style>
      </Container>
    )
  }
}
