# Multiple transitions example

Shows how to implement different transitions per page.

## Usage

Clone the `next-page-transitions` repository, cd into this examples' folder and run `npm install && npm run dev`.

## Explanation

We need to make the `PageTransition` component aware of what transition to use on the different pages. In the pages we declare which transition we want to use for that page.

```javascript
// pages/index.js

const Index = () => (
    <h1>Index page</h1>
)

Index.getInitialProps = async function () {
    return { transitionType: 'slide' }
}

export default Index
```

```javascript
// pages/about.js

const About = () => (
    <h1>About page</h1>
)

About.getInitialProps = async function () {
    return { transitionType: 'fade' }
}

export default About
```

Then in `_app.js` we can fetch the `transitionType` prop and pass it to the `PageTransition`'s component classNames prop.

```javascript
// pages/_app.js

import React from 'react'
import App, { Container } from 'next/app'
import { PageTransition } from 'next-page-transitions'

class MyApp extends App {
    render() {
        const { Component, pageProps } = this.props;

        return (
            <Container>
                <PageTransition timeout={1000} classNames={`transition-${pageProps.transitionType}`}>
                   <Component {...pageProps} />
                </PageTransition>
            </Container>
        )
    }
}
export default MyApp
```

Now we can use the classes `transition-slide-enter` `transition-slide-enter-active` `transition-slide-enter-done` `transition-slide-exit` `transition-slide-exit-active` `transition-slide-exit-done` `transition-fade-enter` `transition-fade-enter-active` `transition-fade-enter-done` etc. etc. to style the different transitions.