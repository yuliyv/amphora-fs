'use strict';

const _ = require('lodash');
var getLayouts = require('../getLayouts');

/**
 * TKTKTKTK
 *
 * @param {string} name
 * @returns {string|false}
 */
function getLayoutName(name) {
  return _.includes(getLayouts(), name) && name;
}

module.exports = getLayoutName;
