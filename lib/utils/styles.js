"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeStyles = undefined;
exports.prepareStyles = prepareStyles;

var _simpleAssign = require("simple-assign");

var _simpleAssign2 = _interopRequireDefault(_simpleAssign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mergeStyles = exports.mergeStyles = function mergeStyles() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return _simpleAssign2.default.apply(undefined, [{}].concat(args));
};

/**
 * `prepareStyles` is used to merge multiple styles, make sure they are flipped
 * to rtl if needed, and then autoprefix them.
 *
 * Never call this on the same style object twice. As a rule of thumb, only
 * call it when passing style attribute to html elements.
 *
 * If this method detects you called it twice on the same style object, it
 * will produce a warning in the console.
 */
function prepareStyles(muiTheme) {
  var style = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  for (var _len2 = arguments.length, styles = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
    styles[_key2 - 2] = arguments[_key2];
  }

  if (styles) {
    //warning(false, 'Providing more than one style argument to prepareStyles has been deprecated. ' +
    //  'Please pass a single style, such as the result from mergeStyles(...styles).');
    style = mergeStyles.apply(undefined, [style].concat(styles));
  }

  return muiTheme.prepareStyles(style);
}

exports.default = {
  mergeStyles: mergeStyles,
  prepareStyles: prepareStyles
};