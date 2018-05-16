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
  if (oldChildren === newChildren) return false
  if (
    React.isValidElement(oldChildren) &&
    React.isValidElement(newChildren) &&
    oldChildren.key != null &&
    oldChildren.key === newChildren.key
  ) {
    return false
  }
  return true
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

    const { children, appear } = props
    this.state = {
      state: appear ? 'entered' : 'enter',
      isIn: !shouldDelayEnter(children),
      currentChildren: children,
      nextChildren: null,
      renderedChildren: children,
      showLoading: false,
    }
  }

  componentDidMount() {
    if (shouldDelayEnter(this.props.children)) {
      this.setState({
        timeoutId: this.startEnterTimer(),
      })
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
    const hasNewChildren = areChildrenDifferent(currentChildren, children)
    const needsTransition = areChildrenDifferent(renderedChildren, children)
    if (hasNewChildren) {
      // We got a new set of children while we were transitioning some in
      // Immediately start transitioning out this component and update the next
      // component
      this.setState({
        isIn: false,
        nextChildren: children,
        currentChildren: children,
      })
      if (this.state.timeoutId) {
        clearTimeout(this.state.timeoutId)
      }
    } else if (needsTransition && !isIn && state === 'exited') {
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
    } else if (prevState.showLoading && !this.state.showLoading) {
      // We hid the loading indicator; now that that change has been flushed to
      // the DOM, we can now bring in the next component!
      this.setState({
        isIn: true,
      })
    }
  }

  onEnter = makeStateUpdater('enter', { showLoading: false }).bind(this)

  onEntering = makeStateUpdater('entering').bind(this)

  onEntered = makeStateUpdater('entered').bind(this)

  onExit = makeStateUpdater('exit').bind(this)

  onExiting = makeStateUpdater('exiting').bind(this)

  onExited = makeStateUpdater('exited', { renderedChildren: null }).bind(this)

  onChildLoaded() {
    if (this.state.timeoutId) {
      clearTimeout(this.state.timeoutId)
    }
    this.setState({
      showLoading: false,
    })
  }

  startEnterTimer() {
    return setTimeout(() => {
      this.setState({
        showLoading: true,
      })
    }, this.props.loadingDelay)
  }

  render() {
    const {
      timeout,
      appear,
      loadingComponent,
      loadingCallbackName,
    } = this.props
    const { renderedChildren: children, state } = this.state

    if (['entering', 'exiting', 'exited'].includes(state)) {
      // Need to reflow!
      // eslint-disable-next-line no-unused-expressions
      if (document.body) document.body.scrollTop
    }

    const hasLoadingComponent = !!loadingComponent
    const containerClassName = buildClassName(this.props.classNames, state)

    return (
      <Fragment>
        <Transition
          timeout={timeout}
          in={this.state.isIn}
          appear={appear}
          onEnter={this.onEnter}
          onEntering={this.onEntering}
          onEntered={() => this.onEntered()}
          onExit={() => this.onExit()}
          onExiting={() => this.onExiting()}
          onExited={() => this.onExited()}
        >
          <div className={containerClassName}>
            {children &&
              React.cloneElement(children, {
                [loadingCallbackName]: () => this.onChildLoaded(),
              })}
          </div>
        </Transition>
        {hasLoadingComponent && (
          <CSSTransition
            in={this.state.showLoading}
            mountOnEnter
            unmountOnExit
            appear
            classNames={this.props.loadingClassNames}
            timeout={this.props.loadingTimeout}
          >
            {loadingComponent}
          </CSSTransition>
        )}
      </Fragment>
    )
  }
}

PageTransition.propTypes = {
  children: PropTypes.node.isRequired,
  classNames: PropTypes.string.isRequired,
  timeout: timeoutsShape,
  appear: PropTypes.bool,
  loadingComponent: PropTypes.element,
  loadingDelay: PropTypes.number,
  loadingCallbackName: PropTypes.string,
  /* eslint-disable react/require-default-props */
  loadingTimeout: (props, ...args) => {
    let pt = timeoutsShape
    if (props.loadingComponent) pt = pt.isRequired
    return pt(props, ...args)
  },
  loadingClassNames: (props, ...args) => {
    let pt = PropTypes.string
    if (props.loadingTimeout) pt = pt.isRequired
    return pt(props, ...args)
  },
  /* eslint-enable react/require-default-props */
}

PageTransition.defaultProps = {
  timeout: 300,
  loadingComponent: null,
  loadingCallbackName: 'pageTransitionReadyToEnter',
  loadingDelay: 500,
  appear: true,
}

export default PageTransition
