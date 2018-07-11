'use strict';

const fs = require('fs'),
  path = require('path');
var getLayoutName = require('../getLayoutName');

/**
 * Get path to component folder.
 *
 * @param  {string} name
 * @return {string}
 */
function getLayoutPath(name) {
  let result = null,
    modulePath;

  // make sure it's a component we have (either in /components or package.json)
  if (getLayoutName(name)) {
    modulePath = path.resolve(process.cwd(), 'layouts', name);

    if (fs.existsSync(modulePath)) {
      result = modulePath;
    }
  }

  return result;
}

module.exports = getLayoutPath;

// For testing
module.exports.setGetLayoutName = stub => getLayoutName = stub;
