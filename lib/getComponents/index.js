'use strict';

const _ = require('lodash'),
  fs = require('fs'),
  path = require('path'),
  IGNORED_CLAY_MODULES = [
    'clay-log',
    'clay-sitemaps'
  ];
var pkg = require(path.resolve(process.cwd(), 'package.json'));

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
    return fs.readdirSync(dir)
      .filter(function (file) {
        return isDirectory(path.join(dir, file));
      });
  } catch (ex) {
    return [];
  }
}

/**
 * Get array of component names, from node_modules and components folder.
 *
 * Should only occur once!
 * @return {[]}
 */
function getComponents() {
  const npmComponents = _(pkg.dependencies).map(function (version, name) {
    if (_.includes(name, 'clay-') && !_.includes(IGNORED_CLAY_MODULES, name) ) {
      // this is a clay component
      if (_.includes(name, path.sep)) {
        // this is a scoped npm component!
        // return the name without the scope/user
        return name.split(path.sep)[1];
      }
      // this is an unscoped npm component
      return name;
    } // otherwise returns undefined, and is compacted below
  }).compact().value();

  return getFolders(path.join(process.cwd(), 'components')).concat(npmComponents);
}

module.exports = _.memoize(getComponents);

// For testing
module.exports.setPackageConfiguration = (val) => { pkg = val; };
