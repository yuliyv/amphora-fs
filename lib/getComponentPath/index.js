'use strict';

const _ = require('lodash'),
  fs = require('fs'),
  path = require('path');
var getComponentName = require('../getComponentName'),
  pkg = require(path.resolve(process.cwd(), 'package.json'));


/**
 * Get the full name of a possibly-scoped npm component
 *
 * @param {string} name, e.g. 'clay-header'
 * @returns {string|undefined} e.g. '@nymdev/clay-header'
 */
function getScopedModuleName(name) {
  return _.findKey(pkg.dependencies, function (version, dep) {
    return _.includes(dep, name);
  });
}

/**
 * Get path to component folder.
 *
 * @param  {string} name
 * @return {string}
 */
function getComponentPath(name) {
  let result = null,
    modulePath, npmName;

  // make sure it's a component we have (either in /components or package.json)
  if (getComponentName(name)) {
    modulePath = path.resolve(process.cwd(), 'components', name);

    if (fs.existsSync(modulePath)) {
      result = modulePath;
    } else {
      npmName = getScopedModuleName(name);
      modulePath = npmName && path.resolve(process.cwd(), 'node_modules', npmName);
      result = modulePath;
    }
  }

  return result;
}

module.exports = getComponentPath;

// For testing
module.exports.setGetComponentName = (mod) => { getComponentName = mod; };
module.exports.setPackageConfiguration = (val) => { pkg = val; };
