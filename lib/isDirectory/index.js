'use strict';
const fs = require('fs'),
  _ = require('lodash');

/**
 * @param {string} file
 * @returns {boolean}
 */
function isDirectory(file) {
  try {
    return fs.statSync(file).isDirectory();
  } catch (ex) {
    return false;
  }
}

module.exports = _.memoize(isDirectory);
