import React from 'react'
import App, { Container } from 'next/app'
import { PageTransition } from 'next-page-transitions'

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props

    return (
      <Container>
        <PageTransition timeout={500} classNames={`transition-${pageProps.transitionType}`}>
          <Component {...pageProps} />
        </PageTransition>
        <style jsx global>{`
          .transition-fade-enter {
            opacity: 0;
          }
          .transition-fade-enter-active {
            opacity: 1;
            transition: opacity 500ms
          }
          .transition-fade-exit {
            opacity: 1;
          }
          .transition-fade-exit-active {
            opacity: 0;
            transition: opacity 500ms
          }

          .transition-slide-enter {
            transform: translate3d(-100%, 0, 0);
          }
          .transition-slide-enter-active {
            transform: translate3d(0, 0, 0);
            transition: transform 500ms ease-out;
          }
          .transition-slide-exit {
            transform: translate3d(0, 0, 0);
          }
          .transition-slide-exit-active {
            transform: translate3d(100%, 0, 0);
            transition: transform 500ms ease-in;
          }
        `}</style>
      </Container>
    )
  }
}
