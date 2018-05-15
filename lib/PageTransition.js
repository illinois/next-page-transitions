"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _Transition = _interopRequireDefault(require("react-transition-group/Transition"));

var _CSSTransition = _interopRequireDefault(require("react-transition-group/CSSTransition"));

var _PropTypes = require("react-transition-group/utils/PropTypes");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function areChildrenDifferent(oldChildren, newChildren) {
  if (oldChildren === newChildren) return false;

  if (_react.default.isValidElement(oldChildren) && _react.default.isValidElement(newChildren) && oldChildren.key != null && oldChildren.key === newChildren.key) {
    return false;
  }

  return true;
}

function buildClassName(className, state) {
  switch (state) {
    case 'enter':
      return "".concat(className, "-enter");

    case 'entering':
      return "".concat(className, "-enter ").concat(className, "-enter-active");

    case 'entered':
      return "".concat(className, "-enter-done");

    case 'exit':
      return "".concat(className, "-exit");

    case 'exiting':
      return "".concat(className, "-exit ").concat(className, "-exit-active");

    case 'exited':
      return "".concat(className, "-exit-done");

    default:
      return '';
  }
}

function shouldDelayEnter(children) {
  return _react.default.isValidElement(children) && children.type.shouldDelayEnter;
}

var PageTransition =
/*#__PURE__*/
function (_React$Component) {
  _inherits(PageTransition, _React$Component);

  function PageTransition(props) {
    var _this;

    _classCallCheck(this, PageTransition);

    _this = _possibleConstructorReturn(this, (PageTransition.__proto__ || Object.getPrototypeOf(PageTransition)).call(this, props));
    var children = props.children;
    var delayedEnter = shouldDelayEnter(children);
    _this.state = {
      state: 'enter',
      isIn: !delayedEnter,
      currentChildren: children,
      nextChildren: null,
      renderedChildren: children,
      showLoading: false
    };
    return _this;
  }

  _createClass(PageTransition, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (shouldDelayEnter(this.props.children)) {
        this.setState({
          timeoutId: this.startEnterTimer()
        });
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      var _state = this.state,
          currentChildren = _state.currentChildren,
          renderedChildren = _state.renderedChildren,
          nextChildren = _state.nextChildren,
          isIn = _state.isIn,
          state = _state.state;
      var children = this.props.children;
      var hasNewChildren = areChildrenDifferent(currentChildren, children);
      var needsTransition = areChildrenDifferent(renderedChildren, children);

      if (hasNewChildren) {
        // We got a new set of children while we were transitioning some in
        // Immediately start transitioning out this component and update the next
        // component
        this.setState({
          isIn: false,
          nextChildren: children,
          currentChildren: children
        });

        if (this.state.timeoutId) {
          clearTimeout(this.state.timeoutId);
        }
      } else if (needsTransition && !isIn && state === 'exited') {
        if (_react.default.isValidElement(nextChildren) && nextChildren.type.shouldDelayEnter) {
          // Wait for the ready callback to actually transition in, but still
          // mount the component to allow it to start loading things
          this.setState({
            renderedChildren: nextChildren,
            nextChildren: null,
            timeoutId: this.startEnterTimer()
          });
        } else {
          // No need to wait, mount immediately
          this.setState({
            isIn: true,
            renderedChildren: nextChildren,
            nextChildren: null
          });
        }
      } else if (prevState.showLoading && !this.state.showLoading) {
        // We hid the loading indicator that that change has been flushed to
        // the DOM; we can now bring in the next component!
        this.setState({
          isIn: true
        });
      }
    }
  }, {
    key: "onEnter",
    value: function onEnter() {
      this.setState({
        state: 'enter',
        showLoading: false
      });
    }
  }, {
    key: "onEntering",
    value: function onEntering() {
      this.setState({
        state: 'entering'
      });
    }
  }, {
    key: "onEntered",
    value: function onEntered() {
      this.setState({
        state: 'entered'
      });
    }
  }, {
    key: "onExit",
    value: function onExit() {
      this.setState({
        state: 'exit'
      });
    }
  }, {
    key: "onExiting",
    value: function onExiting() {
      this.setState({
        state: 'exiting'
      });
    }
  }, {
    key: "onExited",
    value: function onExited() {
      this.setState({
        renderedChildren: null,
        state: 'exited'
      });
    }
  }, {
    key: "onChildLoaded",
    value: function onChildLoaded() {
      if (this.state.timeoutId) {
        clearTimeout(this.state.timeoutId);
      }

      this.setState({
        showLoading: false
      });
    }
  }, {
    key: "startEnterTimer",
    value: function startEnterTimer() {
      var _this2 = this;

      return setTimeout(function () {
        _this2.setState({
          showLoading: true
        });
      }, this.props.loadingDelay);
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _state2 = this.state,
          children = _state2.renderedChildren,
          state = _state2.state;
      var _props = this.props,
          timeout = _props.timeout,
          loadingComponent = _props.loadingComponent;

      if (this.state.state === 'entering' || this.state.state === 'exiting') {
        // Need to reflow!
        // eslint-disable-next-line no-unused-expressions
        if (document.body) document.body.scrollTop;
      }

      var hasLoadingComponent = !!loadingComponent;
      return _react.default.createElement(_react.Fragment, null, _react.default.createElement(_Transition.default, {
        timeout: timeout,
        "in": this.state.isIn,
        appear: true,
        onEnter: function onEnter() {
          return _this3.onEnter();
        },
        onEntering: function onEntering() {
          return _this3.onEntering();
        },
        onEntered: function onEntered() {
          return _this3.onEntered();
        },
        onExit: function onExit() {
          return _this3.onExit();
        },
        onExiting: function onExiting() {
          return _this3.onExiting();
        },
        onExited: function onExited() {
          return _this3.onExited();
        }
      }, _react.default.createElement("div", {
        className: buildClassName(this.props.classNames, state)
      }, children && _react.default.cloneElement(children, {
        onReadyToEnter: function onReadyToEnter() {
          return _this3.onChildLoaded();
        }
      }))), hasLoadingComponent && _react.default.createElement(_CSSTransition.default, {
        "in": this.state.showLoading,
        mountOnEnter: true,
        unmountOnExit: true,
        appear: true,
        classNames: this.props.loadingClassNames,
        timeout: this.props.loadingTimeout
      }, loadingComponent));
    }
  }]);

  return PageTransition;
}(_react.default.Component);

PageTransition.propTypes = {
  children: _propTypes.default.node.isRequired,
  timeout: _PropTypes.timeoutsShape,
  classNames: _propTypes.default.string.isRequired,
  loadingComponent: _propTypes.default.element,
  loadingDelay: _propTypes.default.number,

  /* eslint-disable react/require-default-props */
  loadingTimeout: function loadingTimeout(props) {
    var pt = _PropTypes.timeoutsShape;
    if (props.loadingComponent) pt = pt.isRequired;

    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return pt.apply(void 0, [props].concat(args));
  },
  loadingClassNames: function loadingClassNames(props) {
    var pt = _propTypes.default.string;
    if (props.loadingTimeout) pt = pt.isRequired;

    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    return pt.apply(void 0, [props].concat(args));
  }
  /* eslint-enable react/require-default-props */

};
PageTransition.defaultProps = {
  timeout: 300,
  loadingComponent: null,
  loadingDelay: 500
};
var _default = PageTransition;
exports.default = _default;