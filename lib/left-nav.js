'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _simpleAssign = require('simple-assign');

var _simpleAssign2 = _interopRequireDefault(_simpleAssign);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _keyCode = require('./utils/key-code');

var _keyCode2 = _interopRequireDefault(_keyCode);

var _autoPrefix = require('./styles/auto-prefix');

var _autoPrefix2 = _interopRequireDefault(_autoPrefix);

var _transitions = require('./styles/transitions');

var _transitions2 = _interopRequireDefault(_transitions);

var _windowListenable = require('./mixins/window-listenable');

var _windowListenable2 = _interopRequireDefault(_windowListenable);

var _overlay = require('./overlay');

var _overlay2 = _interopRequireDefault(_overlay);

var _paper = require('./paper');

var _paper2 = _interopRequireDefault(_paper);

var _getMuiTheme = require('./styles/getMuiTheme');

var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var openNavEventHandler = null;

var LeftNav = _react2.default.createClass({
  displayName: 'LeftNav',


  propTypes: {
    /**
     * The contents of the `LeftNav`
     */
    children: _react2.default.PropTypes.node,

    /**
     * The css class name of the root element.
     */
    className: _react2.default.PropTypes.string,

    /**
     * Indicates whether swiping sideways when the `LeftNav` is closed should open it.
     */
    disableSwipeToOpen: _react2.default.PropTypes.bool,

    /**
     * Indicates that the `LeftNav` should be docked. In this state, the overlay won't
     * show and clicking on a menu item will not close the `LeftNav`.
     */
    docked: _react2.default.PropTypes.bool,

    /**
     * Callback function that is fired when the open state of the `LeftNav` is
     * requested to be changed. The provided open argument determines whether
     * the `LeftNav` is requested to be opened or closed. Also, the reason
     * argument states why the `LeftNav` got closed or opend. It can be either
     * `'clickaway'` for overlay clicks, `'escape'` for pressing the
     * escape key and `'swipe'` for swiping. For opening the reason is always `'swipe'`.
     */
    onRequestChange: _react2.default.PropTypes.func,

    /**
     * Indicates that the `LeftNav` should be opened, closed or uncontrolled.
     * Providing a boolean will turn the `LeftNav` into a controlled component.
     */
    open: _react2.default.PropTypes.bool,

    /**
     * Positions the `LeftNav` to open from the right side.
     */
    openRight: _react2.default.PropTypes.bool,

    /**
     * The `className` to add to the `Overlay` component that is rendered behind the `LeftNav`.
     */
    overlayClassName: _react2.default.PropTypes.string,

    /**
     * Overrides the inline-styles of the `Overlay` component that is rendered behind the `LeftNav`.
     */
    overlayStyle: _react2.default.PropTypes.object,

    /**
     * Override the inline-styles of the root element.
     */
    style: _react2.default.PropTypes.object,

    /**
     * The width of the left most (or right most) area in pixels where the `LeftNav` can be
     * swiped open from. Setting this to `null` spans that area to the entire page
     * (**CAUTION!** Setting this property to `null` might cause issues with sliders and
     * swipeable `Tabs`, use at your own risk).
     */
    swipeAreaWidth: _react2.default.PropTypes.number,

    /**
     * The width of the `LeftNav` in pixels. Defaults to using the values from theme.
     */
    width: _react2.default.PropTypes.number
  },

  contextTypes: {
    muiTheme: _react2.default.PropTypes.object
  },

  childContextTypes: {
    muiTheme: _react2.default.PropTypes.object
  },

  mixins: [_windowListenable2.default],

  getDefaultProps: function getDefaultProps() {
    return {
      disableSwipeToOpen: false,
      docked: true,
      open: null,
      openRight: false,
      swipeAreaWidth: 30,
      width: null
    };
  },
  getInitialState: function getInitialState() {
    this._maybeSwiping = false;
    this._touchStartX = null;
    this._touchStartY = null;
    this._swipeStartX = null;

    return {
      open: this.props.open !== null ? this.props.open : this.props.docked,
      swiping: null,
      muiTheme: this.context.muiTheme || (0, _getMuiTheme2.default)()
    };
  },
  getChildContext: function getChildContext() {
    return {
      muiTheme: this.state.muiTheme
    };
  },
  componentDidMount: function componentDidMount() {
    this._enableSwipeHandling();
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps, nextContext) {
    var newState = { muiTheme: nextContext.muiTheme || this.state.muiTheme };

    // If docked is changed, change the open state for when uncontrolled.
    if (this.props.docked !== nextProps.docked) newState.open = nextProps.docked;

    // If controlled then the open prop takes precedence.
    if (nextProps.open !== null) newState.open = nextProps.open;

    this.setState(newState);
  },
  componentDidUpdate: function componentDidUpdate() {
    this._enableSwipeHandling();
  },
  componentWillUnmount: function componentWillUnmount() {
    this._disableSwipeHandling();
  },


  windowListeners: {
    keyup: '_onWindowKeyUp'
  },

  getStyles: function getStyles() {
    var muiTheme = this.state.muiTheme;
    var theme = muiTheme.leftNav;

    var x = this._getTranslateMultiplier() * (this.state.open ? 0 : this._getMaxTranslateX());

    var styles = {
      root: {
        height: '100%',
        width: this.props.width || theme.width,
        position: 'fixed',
        zIndex: muiTheme.zIndex.leftNav,
        left: 0,
        top: 0,
        transform: 'translate3d(' + x + 'px, 0, 0)',
        transition: !this.state.swiping && _transitions2.default.easeOut(null, 'transform', null),
        backgroundColor: theme.color,
        overflow: 'auto'
      },
      overlay: {
        zIndex: muiTheme.zIndex.leftNavOverlay,
        pointerEvents: this.state.open ? 'auto' : 'none' },
      // Bypass mouse events when left nav is closing.
      rootWhenOpenRight: {
        left: 'auto',
        right: 0
      }
    };

    return styles;
  },
  _shouldShow: function _shouldShow() {
    return this.state.open || !!this.state.swiping; // component is swiping
  },
  _close: function _close(reason) {
    if (this.props.open === null) this.setState({ open: false });
    if (this.props.onRequestChange) this.props.onRequestChange(false, reason);
    return this;
  },
  _open: function _open(reason) {
    if (this.props.open === null) this.setState({ open: true });
    if (this.props.onRequestChange) this.props.onRequestChange(true, reason);
    return this;
  },
  _onOverlayTouchTap: function _onOverlayTouchTap(event) {
    event.preventDefault();
    this._close('clickaway');
  },
  _onWindowKeyUp: function _onWindowKeyUp(e) {
    if (e.keyCode === _keyCode2.default.ESC && !this.props.docked && this.state.open) {
      this._close('escape');
    }
  },
  _getMaxTranslateX: function _getMaxTranslateX() {
    var width = this.props.width || this.state.muiTheme.leftNav.width;
    return width + 10;
  },
  _getTranslateMultiplier: function _getTranslateMultiplier() {
    return this.props.openRight ? 1 : -1;
  },
  _enableSwipeHandling: function _enableSwipeHandling() {
    if (!this.props.docked) {
      document.body.addEventListener('touchstart', this._onBodyTouchStart);
      if (!openNavEventHandler) {
        openNavEventHandler = this._onBodyTouchStart;
      }
    } else {
      this._disableSwipeHandling();
    }
  },
  _disableSwipeHandling: function _disableSwipeHandling() {
    document.body.removeEventListener('touchstart', this._onBodyTouchStart);
    if (openNavEventHandler === this._onBodyTouchStart) {
      openNavEventHandler = null;
    }
  },
  _onBodyTouchStart: function _onBodyTouchStart(e) {

    var swipeAreaWidth = this.props.swipeAreaWidth;

    var touchStartX = e.touches[0].pageX;
    var touchStartY = e.touches[0].pageY;

    // Open only if swiping from far left (or right) while closed
    if (swipeAreaWidth !== null && !this.state.open) {
      if (this.props.openRight) {
        // If openRight is true calculate from the far right
        if (touchStartX < document.body.offsetWidth - swipeAreaWidth) return;
      } else {
        // If openRight is false calculate from the far left
        if (touchStartX > swipeAreaWidth) return;
      }
    }

    if (!this.state.open && (openNavEventHandler !== this._onBodyTouchStart || this.props.disableSwipeToOpen)) {
      return;
    }

    this._maybeSwiping = true;
    this._touchStartX = touchStartX;
    this._touchStartY = touchStartY;

    document.body.addEventListener('touchmove', this._onBodyTouchMove);
    document.body.addEventListener('touchend', this._onBodyTouchEnd);
    document.body.addEventListener('touchcancel', this._onBodyTouchEnd);
  },
  _setPosition: function _setPosition(translateX) {
    var leftNav = _reactDom2.default.findDOMNode(this.refs.clickAwayableElement);
    var transformCSS = 'translate3d(' + this._getTranslateMultiplier() * translateX + 'px, 0, 0)';
    this.refs.overlay.setOpacity(1 - translateX / this._getMaxTranslateX());
    _autoPrefix2.default.set(leftNav.style, 'transform', transformCSS, this.state.muiTheme);
  },
  _getTranslateX: function _getTranslateX(currentX) {
    return Math.min(Math.max(this.state.swiping === 'closing' ? this._getTranslateMultiplier() * (currentX - this._swipeStartX) : this._getMaxTranslateX() - this._getTranslateMultiplier() * (this._swipeStartX - currentX), 0), this._getMaxTranslateX());
  },
  _onBodyTouchMove: function _onBodyTouchMove(e) {
    var currentX = e.touches[0].pageX;
    var currentY = e.touches[0].pageY;

    if (this.state.swiping) {
      e.preventDefault();
      this._setPosition(this._getTranslateX(currentX));
    } else if (this._maybeSwiping) {
      var dXAbs = Math.abs(currentX - this._touchStartX);
      var dYAbs = Math.abs(currentY - this._touchStartY);
      // If the user has moved his thumb ten pixels in either direction,
      // we can safely make an assumption about whether he was intending
      // to swipe or scroll.
      var threshold = 10;

      if (dXAbs > threshold && dYAbs <= threshold) {
        this._swipeStartX = currentX;
        this.setState({
          swiping: this.state.open ? 'closing' : 'opening'
        });
        this._setPosition(this._getTranslateX(currentX));
      } else if (dXAbs <= threshold && dYAbs > threshold) {
        this._onBodyTouchEnd();
      }
    }
  },
  _onBodyTouchEnd: function _onBodyTouchEnd(e) {
    if (this.state.swiping) {
      var currentX = e.changedTouches[0].pageX;
      var translateRatio = this._getTranslateX(currentX) / this._getMaxTranslateX();

      this._maybeSwiping = false;
      var swiping = this.state.swiping;
      this.setState({
        swiping: null
      });

      // We have to open or close after setting swiping to null,
      // because only then CSS transition is enabled.
      if (translateRatio > 0.5) {
        if (swiping === 'opening') {
          this._setPosition(this._getMaxTranslateX());
        } else {
          this._close('swipe');
        }
      } else {
        if (swiping === 'opening') {
          this._open('swipe');
        } else {
          this._setPosition(0);
        }
      }
    } else {
      this._maybeSwiping = false;
    }

    document.body.removeEventListener('touchmove', this._onBodyTouchMove);
    document.body.removeEventListener('touchend', this._onBodyTouchEnd);
    document.body.removeEventListener('touchcancel', this._onBodyTouchEnd);
  },
  render: function render() {
    var _props = this.props;
    var children = _props.children;
    var className = _props.className;
    var docked = _props.docked;
    var openRight = _props.openRight;
    var overlayClassName = _props.overlayClassName;
    var overlayStyle = _props.overlayStyle;
    var style = _props.style;


    var styles = this.getStyles();

    var overlay = undefined;
    if (!docked) {
      overlay = _react2.default.createElement(_overlay2.default, {
        ref: 'overlay',
        show: this._shouldShow(),
        className: overlayClassName,
        style: (0, _simpleAssign2.default)(styles.overlay, overlayStyle),
        transitionEnabled: !this.state.swiping,
        onTouchTap: this._onOverlayTouchTap
      });
    }

    return _react2.default.createElement(
      'div',
      null,
      overlay,
      _react2.default.createElement(
        _paper2.default,
        {
          ref: 'clickAwayableElement',
          zDepth: 2,
          rounded: false,
          transitionEnabled: !this.state.swiping,
          className: className,
          style: (0, _simpleAssign2.default)(styles.root, openRight && styles.rootWhenOpenRight, style)
        },
        children
      )
    );
  }
});

exports.default = LeftNav;
module.exports = exports['default'];