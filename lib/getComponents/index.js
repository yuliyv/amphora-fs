'use strict';

const _ = require('lodash'),
  path = require('path'),
  IGNORED_CLAY_MODULES = [
    'clay-log',
    'clay-sitemaps'
  ];

var getFolders = require('../getFolders'),
  pkg = require(path.resolve(process.cwd(), 'package.json'));

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
module.exports.setDeps = (gF) => {
  getFolders = gF;
};
