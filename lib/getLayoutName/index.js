'use strict';

const _ = require('lodash');
var getLayouts = require('../getLayouts');

/**
 * Get a layout's name, so we can look it up in the file system.
 * This should be used when you want to validate that the layout
 * exists in your instance, rather than just parsing the name of the uri
 *
 * @param {string} name
 * @returns {string|false}
 */
function getLayoutName(name) {
  return _.includes(getLayouts(), name) && name;
}

module.exports = getLayoutName;

// For testing
module.exports.setGetLayouts = (stub) => getLayouts = stub;
