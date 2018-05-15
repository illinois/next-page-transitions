import App, { Container } from 'next/app'
import React from 'react'
import { PageTransition } from 'next-page-transitions'

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
        <PageTransition timeout={500} classNames="fade">
          <Component {...pageProps} />
        </PageTransition>
        <style jsx global>{`
          .fade-enter {
            transform-origin: center top;
            opacity: 0;
            transform: rotate3d(1, 0, 0, -20deg) rotateZ(0) scale(1);
          }
          .fade-enter-active {
            opacity: 1;
            transform: rotate3d(1, 0, 0, 0);
            transition: opacity 300ms, transform 500ms;
          }
          .fade-exit {
            opacity: 1;
            transform: scale(1) ;
          }
          .fade-exit-active {
            opacity: 0;
            transform: scale(0.7) ;
            transition: opacity 500ms, transform 500ms;
          }
        `}</style>
      </Container>
    )
  }
}
