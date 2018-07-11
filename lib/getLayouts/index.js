'use strict';

const _ = require('lodash'),
  fs = require('fs'),
  path = require('path');

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

/**
 * Get folder names.
 *
 * Should only occur once per directory.
 *
 * @param  {string} dir enclosing folder
 * @return {[]}     array of folder names
 */
function getFolders(dir) {
  try {
    return fs.readdirSync(dir).filter(file => isDirectory(path.join(dir, file)));
  } catch (ex) {
    return [];
  }
}

/**
 * Get array of layout names from layouts folder.
 *
 * Should only occur once!
 * @return {[]}
 */
function getLayouts() {
  return getFolders(path.join(process.cwd(), 'layouts'));
}

module.exports = _.memoize(getLayouts);
