import App, { Container } from 'next/app'
import React from 'react'
import { PageTransition, animations } from 'next-page-transitions'

import Loader from '../components/Loader'

const { fadeIn, fadeOut } = animations

function a(t) {
  return `.test {
    opacity: ${t};
  }`
}

export default class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
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
        <PageTransition loadingComponent={Loader} timeout={300}>
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
