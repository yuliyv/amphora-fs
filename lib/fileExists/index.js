'use strict';

const fs = require('fs'),
  utils = require('../util');

/**
 * @param {string} filename
 * @returns {string}
 */
function fileExists(filename) {
  try {
    return !!fs.statSync(filename);
  } catch (ex) {
    return false;
  }
}

module.exports = utils.memoize(fileExists);
