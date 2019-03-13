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
    const { Component, pageProps, router } = this.props
    return (
      <Container>
        <PageTransition timeout={500} classNames="page-transition">
          <Component {...pageProps} key={router.route} />
        </PageTransition>
        <style jsx global>{`
          .page-transition-enter {
            transform-origin: center top;
            opacity: 0;
            transform: rotate3d(1, 0, 0, -20deg);
          }
          .page-transition-enter-active {
            opacity: 1;
            transform: rotate3d(1, 0, 0, 0);
            transition: opacity 300ms, transform 500ms;
          }
          .page-transition-exit {
            opacity: 1;
            transform: scale(1);
          }
          .page-transition-exit-active {
            opacity: 0;
            transform: scale(0.7) rotateZ(20deg);
            transition: opacity 500ms, transform 500ms;
          }
        `}</style>
      </Container>
    )
  }
}
