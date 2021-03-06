'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _simpleAssign = require('simple-assign');

var _simpleAssign2 = _interopRequireDefault(_simpleAssign);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _arrowDropUp = require('../svg-icons/navigation/arrow-drop-up');

var _arrowDropUp2 = _interopRequireDefault(_arrowDropUp);

var _arrowDropDown = require('../svg-icons/navigation/arrow-drop-down');

var _arrowDropDown2 = _interopRequireDefault(_arrowDropDown);

var _iconButton = require('../icon-button');

var _iconButton2 = _interopRequireDefault(_iconButton);

var _getMuiTheme = require('../styles/getMuiTheme');

var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

var _contextPure = require('../mixins/context-pure');

var _contextPure2 = _interopRequireDefault(_contextPure);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getStyles() {
  return {
    root: {
      top: 0,
      bottom: 0,
      right: 4,
      margin: 'auto',
      position: 'absolute'
    }
  };
}

var CardExpandable = _react2.default.createClass({
  displayName: 'CardExpandable',


  propTypes: {
    expanded: _react2.default.PropTypes.bool,
    onExpanding: _react2.default.PropTypes.func.isRequired,

    /**
     * Override the inline-styles of the root element.
     */
    style: _react2.default.PropTypes.object
  },

  contextTypes: {
    muiTheme: _react2.default.PropTypes.object
  },

  childContextTypes: {
    muiTheme: _react2.default.PropTypes.object
  },

  mixins: [_contextPure2.default],

  statics: {
    getChildrenClasses: function getChildrenClasses() {
      return [_iconButton2.default];
    }
  },

  getInitialState: function getInitialState() {
    return {
      muiTheme: this.context.muiTheme || (0, _getMuiTheme2.default)()
    };
  },
  getChildContext: function getChildContext() {
    return {
      muiTheme: this.state.muiTheme
    };
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps, nextContext) {
    this.setState({
      muiTheme: nextContext.muiTheme || this.state.muiTheme
    });
  },
  render: function render() {
    var styles = getStyles(this.props, this.state);

    return _react2.default.createElement(
      _iconButton2.default,
      {
        style: (0, _simpleAssign2.default)(styles.root, this.props.style),
        onClick: this.props.onExpanding
      },
      this.props.expanded ? _react2.default.createElement(_arrowDropUp2.default, null) : _react2.default.createElement(_arrowDropDown2.default, null)
    );
  }
});

exports.default = CardExpandable;
module.exports = exports['default'];