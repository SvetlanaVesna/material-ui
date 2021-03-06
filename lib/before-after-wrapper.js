'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _simpleAssign = require('simple-assign');

var _simpleAssign2 = _interopRequireDefault(_simpleAssign);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _getMuiTheme = require('./styles/getMuiTheme');

var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/**
 *  BeforeAfterWrapper
 *    An alternative for the ::before and ::after css pseudo-elements for
 *    components whose styles are defined in javascript instead of css.
 *
 *  Usage: For the element that we want to apply before and after elements to,
 *    wrap its children with BeforeAfterWrapper. For example:
 *
 *                                            <Paper>
 *  <Paper>                                     <div> // See notice
 *    <BeforeAfterWrapper>        renders         <div/> // before element
 *      [children of paper]       ------>         [children of paper]
 *    </BeforeAfterWrapper>                       <div/> // after element
 *  </Paper>                                    </div>
 *                                            </Paper>
 *
 *  Notice: Notice that this div bundles together our elements. If the element
 *    that we want to apply before and after elements is a HTML tag (i.e. a
 *    div, p, or button tag), we can avoid this extra nesting by passing using
 *    the BeforeAfterWrapper in place of said tag like so:
 *
 *  <p>
 *    <BeforeAfterWrapper>   do this instead   <BeforeAfterWrapper elementType='p'>
 *      [children of p]          ------>         [children of p]
 *    </BeforeAfterWrapper>                    </BeforeAfterWrapper>
 *  </p>
 *
 *  BeforeAfterWrapper features spread functionality. This means that we can
 *  pass HTML tag properties directly into the BeforeAfterWrapper tag.
 *
 *  When using BeforeAfterWrapper, ensure that the parent of the beforeElement
 *  and afterElement have a defined style position.
 */

var BeforeAfterWrapper = _react2.default.createClass({
  displayName: 'BeforeAfterWrapper',


  propTypes: {
    afterElementType: _react2.default.PropTypes.string,
    afterStyle: _react2.default.PropTypes.object,
    beforeElementType: _react2.default.PropTypes.string,
    beforeStyle: _react2.default.PropTypes.object,
    children: _react2.default.PropTypes.node,
    elementType: _react2.default.PropTypes.string,

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

  getDefaultProps: function getDefaultProps() {
    return {
      beforeElementType: 'div',
      afterElementType: 'div',
      elementType: 'div'
    };
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
    var _props = this.props;
    var beforeStyle = _props.beforeStyle;
    var afterStyle = _props.afterStyle;
    var beforeElementType = _props.beforeElementType;
    var afterElementType = _props.afterElementType;
    var elementType = _props.elementType;

    var other = _objectWithoutProperties(_props, ['beforeStyle', 'afterStyle', 'beforeElementType', 'afterElementType', 'elementType']);

    var prepareStyles = this.state.muiTheme.prepareStyles;


    var beforeElement = void 0;
    var afterElement = void 0;

    beforeStyle = {
      boxSizing: 'border-box'
    };

    afterStyle = {
      boxSizing: 'border-box'
    };

    if (this.props.beforeStyle) beforeElement = _react2.default.createElement(this.props.beforeElementType, {
      style: prepareStyles((0, _simpleAssign2.default)(beforeStyle, this.props.beforeStyle)),
      key: '::before'
    });
    if (this.props.afterStyle) afterElement = _react2.default.createElement(this.props.afterElementType, {
      style: prepareStyles((0, _simpleAssign2.default)(afterStyle, this.props.afterStyle)),
      key: '::after'
    });

    var children = [beforeElement, this.props.children, afterElement];

    var props = other;
    props.style = prepareStyles((0, _simpleAssign2.default)({}, this.props.style));

    return _react2.default.createElement(this.props.elementType, props, children);
  }
});

exports.default = BeforeAfterWrapper;
module.exports = exports['default'];