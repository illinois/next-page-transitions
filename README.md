# next-page-transitions

Simple and customizable page transitions for Next.js apps

![npm version](https://img.shields.io/npm/v/next-page-transitions.svg?style=flat-square)

**Demo:** https://next-page-transitions.now.sh/

### What does this library do for me?

Simply put, it makes it easy to add page transitions to apps build with Next.js.
It may work with other frameworks, but it was designed around the new `App`
component and the way that Next.js handles pages. Specifically, it solves the
problem of making sure only one page component is mounted at a time and that the
next page isn't mounted until the previous one has completed its exit animation.
It also has built-in support for showing a loading indicator if your page
component has to load data before it can be shown.

### Examples

If you prefer to learn by example, check out the `examples` directory for
some Next.js apps that demonstrate how this library can be used.

### Getting started

First, install the package:

```
npm install --save next-page-transitions
```

Next, ensure that your app has a custom `App` component; if not,
[follow the example](https://github.com/zeit/next.js#custom-app) on the Next.js
readme to create one. Then, in your `App`'s render method, wrap the page
`Component` in a `PageTransition` component. You'll also have to define your
own CSS classes that achieve the transition animations that you want. To keep
this library simple and to account for the wide variety of ways that people
produce and consume CSS, it doesn't offer any built-in styles and has no
particular opinion about how the styles end up on your page. The example below
has a simple transition that fades pages in and out.

```jsx
import App, { Container } from 'next/app'
import React from 'react'
import { PageTransition } from 'next-page-transitions'

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
        <PageTransition timeout={300} classNames="page-transition">
          <Component {...pageProps} key={router.route} />
        </PageTransition>
        <style jsx global>{`
          .page-transition-enter {
            opacity: 0;
          }
          .page-transition-enter-active {
            opacity: 1;
            transition: opacity 300ms;
          }
          .page-transition-exit {
            opacity: 1;
          }
          .page-transition-exit-active {
            opacity: 0;
            transition: opacity 300ms;
          }
        `}</style>
      </Container>
    )
  }
}
```

When you move to a new page, the `key` prop will change, and the
`PageTransition` component will detect that. Instead of immediately unmounting
the page, it will apply the `page-transition-exit` class to a wrapper around
the page to initialize the "exit" transition, and will then apply the
`page-transition-exit-active` class as well to begin the transition. This is
very similar to how the
[react-transition-group](https://github.com/reactjs/react-transition-group)
library does things things. After the previous page has been animated out,
the new page is mounted and a similar pair of `.page-transition-enter` and
`page-transition-enter-active` classes will be applied. This process repeats
every time a new page is navigated to.

**Note**: in previous versions of `next-page-transitions`, it wasn't necessary
to specify the `key` prop on children of `PageTransition`. However, to make hot
module reloading work correctly, it was necessary to make this prop required.
Moving foward, children that don't specify a `key` prop will trigger a warning
in the console. In the future, this may become a runtime error.

### Support for delayed enters

Suppose you have a page that needs to make a network request before it can
display its content. You could have the page itself render a loading spinner
until it's ready to go, but then you lose the beautiful page transition
animation you spent all that time perfecting. Luckily, this library makes it
easy to handle that case.

If you add a static property `pageTransitionDelayEnter = true` to your page
component, your page will be passed a special callback prop that you can use
to indicate that everything has finished loading. In the meantime, your page
will be mounted, but the enter transition won't be started yet, and a loading
indicator of your choice will be shown in its place. When you call the callback
prop, the loading spinner will be hidden, and your page will be animated into
place! By default, the callback is passed via the `pageTransitionReadyToEnter`
prop, but this can be specified by setting the `loadingCallbackName` prop on
your `PageTransition` component.

_Note: make sure that your component returns `null` from its `render()` function
until it has finished loading its content and is ready to be animated in. Your
page will still be in the React component tree while it's loading!_

"But my network requests are usually fast!", you'll say. "They usually take only
a few hundred milliseconds, and I don't want to flash a loading indicator on the
screen for such a short period of time!" This library can handle that case as
well. If you specify a `loadingDelay` prop, the loading indicator won't be
shown until that much time has elapsed. If your component is ready to enter
before then, the loading indicator will never be shown, keeping the UX clean
and snappy. However, if your component is taking a long time, the loading
indicator will be shown until your component is ready.

"That sounds kind of like the Placeholder concept from that React suspense
talk. The one in [this YouTube video](https://youtu.be/nLF0n9SACd4?t=17m38s)."
Yes, yes it does! That was the inspiration for this feature.

Here's an example component that simulates a network request with a timeout:

```js
class About extends React.Component {
  static pageTransitionDelayEnter = true

  constructor(props) {
    super(props)
    this.state = { loaded: false }
  }

  componentDidMount() {
    this.timeoutId = setTimeout(() => {
      this.props.pageTransitionReadyToEnter()
      this.setState({ loaded: true })
    }, 2000)
  }

  componentWillUnmount() {
    if (this.timeoutId) clearTimeout(this.timeoutId)
  }

  render() {
    if (!this.state.loaded) return null
    return <div>Hello, world!</div>
  }
}
```

Assume for a moment that you have a `Loader` component that rendering a nice
spinning loading indicator. You'll have to tell the `PageTransition`
component that you want to use this component, and how long you want to wait
until showing the network indicator:

```
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
```

You'll also have to add styles if you want the loading indicator to be animated
on/off the screen. If you want it to appear/disappear without any animation, you
can add `loadingTimeout={0}` and omit the `loadingClassNames` property.

Check out the `delayed-enter` app under the `examples` directory for a complete
example of what this looks like. The "About" page (`pages/about.js`) will wait
2 seconds before displaying its content, and in the meantime, the component at
`components/Loader.js` will be displayed. Play around with the various delays
to gain a deeper sense of how this component works.

### `PageTransition` props

* **`classNames`**: Specifies the class names that will be applied to the page
  wrapper to drive the page transition animations. Analogous to the `classNames`
  prop of
  `react-transition-group`'s [`CSSTranstition`](http://reactcommunity.org/react-transition-group/css-transition)
  component.
  However, note that only the string form of that prop is supported at present.
  Also, note that this library doesn't have a separate "appear" state; only
  "enter" and "exit" classes are needed.
* **`tag`**: Specifies the tag or component that will be used to render the
  page wrapper. This element will receive the `classNames` prop. This is useful
  if you want to use semantic markup, e.g. if you want to render the page
  wrapper as `main`, or if you need to further customize the styling or
  behavior of the page wrapper.
* **`timeout`**: Specifies timeouts for the page transition animations.
  Analogous to the `timeout` prop of
  `react-transition-group`'s [`CSSTranstition`](http://reactcommunity.org/react-transition-group/css-transition)
  component.
* **`loadingComponent`**: A React element to be shown while
* **`loadingDelay`**: The duration to wait before showing the loading
  indicator, in milliseconds. If a page finishes loading before this duration
  has elapsed, the loading component will never be shown. Defaults to 500ms.
* **`loadingCallbackName`**: Specifies the name of the prop that your page will
  receive to call when it's done loading. Defaults to `pageTransitionReadyToEnter`
* **`loadingTimeout`**: Analogous to the `timeout` prop of
  `react-transition-group`'s [`CSSTranstition`](http://reactcommunity.org/react-transition-group/css-transition)
  component. If this prop is set to `0`, the loading indicator won't be animated on/off
  the screen.
* **`loadingClassNames`**: Specifies the class names that will be applied to the
  loading component if one is specified. Analogous to the `classNames` prop of
  `react-transition-group`'s [`CSSTranstition`](http://reactcommunity.org/react-transition-group/css-transition)
  component.
* **`monkeyPatchScrolling`**: By default, Next's `Link` component will scroll to
  the top of the page whenever it is clicked; this can have an undesirable
  jumpy effect when a page is transitioning out. If this prop is set to `true`
  when the component is mounted, then `window.scrollTo` will be monkey-patched
  so that programmatic scrolling can be disabled while a page is transitioning
  out. Defaults to false, since this potentially sketchy behavior should be
  opt-in.
* **`skipInitialTransition`**: Specifies if page transition will be omitted on
  first mount. If you want to have transitions only between pages, not on 
  first page load, set `skipInitialTransition` to `true`. By default, 
  `skipInitialTransition` is set to `false`.

### Contributing

PRs are welcome! Before working on and submitting a PR, please make an issue
describing the feature you want to build. It may be outside the scope of this
project, or a maintainer might already be working on it.
