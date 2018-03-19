'use strict';

const fs = require('fs'),
  path = require('path');

function getSchemaPath(dir) {
  var ymlPath, yamlPath;

  if (!dir || typeof dir !== 'string') {
    throw new Error('Directory path is invalid for dir: ', dir);
  }

  ymlPath = path.join(dir, 'schema.yml');
  yamlPath = path.join(dir, 'schema.yaml');

  if (fs.existsSync(ymlPath)) {
    return ymlPath;
  } else if (fs.existsSync(yamlPath)) {
    return yamlPath;
  } else {
    throw new Error('Schema path not found in ' + dir);
  }
}

module.exports = getSchemaPath;
