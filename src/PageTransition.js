/* eslint-env browser */
// We (supposedly) know what we're doing
/* eslint-disable react/no-did-update-set-state */
/* eslint-disable react/no-did-mount-set-state */
import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Transition from 'react-transition-group/Transition'
import CSSTransition from 'react-transition-group/CSSTransition'
import { timeoutsShape } from 'react-transition-group/utils/PropTypes'

function areChildrenDifferent(oldChildren, newChildren) {
  return oldChildren !== newChildren
}

function differentChildrenNeedAnimation(oldChildren, newChildren) {
  if (!oldChildren || !newChildren) {
    return true
  }

  if (
    !React.isValidElement(oldChildren) ||
    !React.isValidElement(newChildren)
  ) {
    // eslint-disable-next-line no-console
    console.warn(
      '[next-page-transitions] PageTransition child is not a valid React component'
    )
    return true
  }

  if (oldChildren.key == null || newChildren.key == null) {
    // eslint-disable-next-line no-console
    console.warn(
      '[next-page-transitions] PageTransition child does not have a key'
    )
    return true
  }

  return oldChildren.key !== newChildren.key
}

function buildClassName(className, state) {
  switch (state) {
    case 'enter':
      return `${className}-enter`
    case 'entering':
      return `${className}-enter ${className}-enter-active`
    case 'entered':
      return `${className}-enter-done`
    case 'exit':
      return `${className}-exit`
    case 'exiting':
      return `${className}-exit ${className}-exit-active`
    case 'exited':
      return `${className}-exit-done`
    default:
      return ''
  }
}

function shouldDelayEnter(children) {
  return (
    React.isValidElement(children) && children.type.pageTransitionDelayEnter
  )
}

function makeStateUpdater(state, otherProps) {
  return function updateState() {
    this.setState({
      state,
      ...otherProps,
    })
  }
}

class PageTransition extends React.Component {
  constructor(props) {
    super(props)

    const { children } = props
    this.state = {
      state: props.skipInitialTransition ? 'init' : 'enter',
      isIn: !shouldDelayEnter(children),
      currentChildren: children,
      nextChildren: null,
      renderedChildren: children,
      showLoading: false,
    }
  }

  componentDidMount() {
    const { children, monkeyPatchScrolling } = this.props
    if (shouldDelayEnter(children)) {
      this.setState({
        timeoutId: this.startEnterTimer(),
      })
    }

    if (monkeyPatchScrolling && typeof window !== 'undefined') {
      // Forgive me for what I'm about to do
      this.originalScrollTo = window.scrollTo
      this.disableScrolling = false
      window.scrollTo = (...args) => {
        if (this.disableScrolling) return
        this.originalScrollTo.apply(window, args)
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      currentChildren,
      renderedChildren,
      nextChildren,
      isIn,
      state,
    } = this.state
    const { children } = this.props
    const { timeoutId, showLoading } = this.state
    const hasNewChildren = areChildrenDifferent(currentChildren, children)
    const needsTransition = areChildrenDifferent(renderedChildren, children)
    const shouldAnimateTransition =
      needsTransition &&
      differentChildrenNeedAnimation(renderedChildren, children)
    if (isIn && needsTransition && !shouldAnimateTransition) {
      // We need to update our rendered children, but we shouldn't animate them.
      // This will occur when the key prop on our children stays the same but
      // the children themselves change. This can happen in a lot of cases: HMR,
      // a rerender due to a Redux state change, a Router.push to the current page,
      // etc. In this case, we'll just immediately flush the children to be
      // rendered.
      this.setState({
        currentChildren: children,
        renderedChildren: children,
      })
    } else if (hasNewChildren) {
      // We got a new set of children while we were transitioning some in
      // Immediately start transitioning out this component and update the next
      // component
      this.setState({
        isIn: false,
        nextChildren: children,
        currentChildren: children,
      })
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    } else if (
      needsTransition &&
      !isIn &&
      (state === 'enter' || state === 'exited')
    ) {
      if (shouldDelayEnter(nextChildren)) {
        // Wait for the ready callback to actually transition in, but still
        // mount the component to allow it to start loading things
        this.setState({
          renderedChildren: nextChildren,
          nextChildren: null,
          timeoutId: this.startEnterTimer(),
        })
      } else {
        // No need to wait, mount immediately
        this.setState({
          isIn: true,
          renderedChildren: nextChildren,
          nextChildren: null,
        })
      }
    } else if (prevState.showLoading && !showLoading) {
      // We hid the loading indicator; now that that change has been flushed to
      // the DOM, we can now bring in the next component!
      this.setState({
        isIn: true,
      })
    }
  }

  componentWillUnmount() {
    if (this.originalScrollTo && typeof window !== 'undefined') {
      window.scrollTo = this.originalScrollTo
    }
    const { timeoutId } = this.state
    if (timeoutId) clearTimeout(timeoutId)
  }

  onEnter() {
    // It's safe to reenable scrolling now
    this.disableScrolling = false
    this.setState({
      state: 'enter',
      showLoading: false,
    })
  }

  onEntering = makeStateUpdater('entering').bind(this)

  onEntered = makeStateUpdater('entered').bind(this)

  onExit() {
    // Disable scrolling until this component has unmounted
    this.disableScrolling = true
    this.setState({
      state: 'exit',
    })
  }

  onExiting = makeStateUpdater('exiting').bind(this)

  onExited = makeStateUpdater('exited', { renderedChildren: null }).bind(this)

  onChildLoaded() {
    const { timeoutId, showLoading } = this.state
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    if (showLoading) {
      // We'll hide the loader first and animate in the page on the next tick
      this.setState({
        showLoading: false,
      })
    } else {
      // We can immediately bring in the next page!
      this.setState({
        isIn: true,
      })
    }
  }

  startEnterTimer() {
    const { loadingDelay } = this.props
    return setTimeout(() => {
      this.setState({
        showLoading: true,
      })
    }, loadingDelay)
  }

  render() {
    const {
      tag: Tag,
      timeout,
      loadingComponent,
      loadingCallbackName,
      classNames,
      loadingClassNames,
      loadingTimeout,
      skipInitialTransition,
    } = this.props
    const { renderedChildren: children, state, isIn, showLoading } = this.state

    if (['entering', 'exiting', 'exited'].indexOf(state) !== -1) {
      // Need to reflow!
      // eslint-disable-next-line no-unused-expressions
      if (document.body) document.body.scrollTop
    }

    const hasLoadingComponent = !!loadingComponent
    const containerClassName = buildClassName(classNames, state)

    return (
      <Fragment>
        <Transition
          timeout={timeout}
          in={isIn}
          appear={!skipInitialTransition}
          onEnter={() => this.onEnter()}
          onEntering={() => this.onEntering()}
          onEntered={() => this.onEntered()}
          onExit={() => this.onExit()}
          onExiting={() => this.onExiting()}
          onExited={() => this.onExited()}
        >
          <Tag className={containerClassName}>
            {children &&
              React.cloneElement(children, {
                [loadingCallbackName]: () => this.onChildLoaded(),
              })}
          </Tag>
        </Transition>
        {hasLoadingComponent && (
          <CSSTransition
            in={showLoading}
            mountOnEnter
            unmountOnExit
            appear
            classNames={loadingClassNames}
            timeout={loadingTimeout}
          >
            {loadingComponent}
          </CSSTransition>
        )}
      </Fragment>
    )
  }
}

// We do weird things with timeoutsShape because these are omitted in some
// environments
// See https://github.com/reactjs/react-transition-group/pull/448
PageTransition.propTypes = {
  tag: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
    PropTypes.shape({ $$typeof: PropTypes.symbol, render: PropTypes.func }),
  ]),
  children: PropTypes.node.isRequired,
  classNames: PropTypes.string.isRequired,
  /* eslint-disable react/require-default-props */
  timeout: (props, ...args) => {
    if (timeoutsShape) {
      return timeoutsShape.isRequired(props, ...args)
    }
    return undefined
  },
  loadingComponent: PropTypes.element,
  loadingDelay: PropTypes.number,
  loadingCallbackName: PropTypes.string,
  /* eslint-disable react/require-default-props */
  loadingTimeout: (props, ...args) => {
    if (timeoutsShape && props.loadingComponent) {
      return timeoutsShape.isRequired(props, ...args)
    }
    return undefined
  },
  loadingClassNames: (props, ...args) => {
    let pt = PropTypes.string
    if (props.loadingTimeout) pt = pt.isRequired
    return pt(props, ...args)
  },
  /* eslint-enable react/require-default-props */
  monkeyPatchScrolling: PropTypes.bool,
  skipInitialTransition: PropTypes.bool,
}

PageTransition.defaultProps = {
  tag: 'div',
  loadingComponent: null,
  loadingCallbackName: 'pageTransitionReadyToEnter',
  loadingDelay: 500,
  monkeyPatchScrolling: false,
  skipInitialTransition: false,
}

export default PageTransition
