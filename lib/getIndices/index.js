'use strict';

const _ = require('lodash'),
  { getComponentName } = require('clayutils');

/**
 * @param {object} obj
 * @param {Function} [filter=_.identity]  Optional filter
 * @returns {array}
 */
function listDeepObjects(obj, filter) {
  let cursor, items,
    list = [],
    queue = [obj];

  while (queue.length) {
    cursor = queue.pop();
    items = _.filter(cursor, _.isObject);
    list = list.concat(_.filter(items, filter));
    queue = queue.concat(items);
  }

  return list;
}

/**
 * Loop through the provided object and find all
 * references to other components.
 *
 * @param {string} [ref]
 * @param {object} data
 * @returns {{refs: object, components: Array}}
 */
function getIndices(ref, data) {
  let components,
    refs = {};

  refs[ref] = data;
  _.assign(refs, _.keyBy(listDeepObjects(data, '_ref'), '_ref'));
  components = _.uniq(_.filter(_.map(Object.keys(refs), (ref) => getComponentName(ref)), _.identity));

  return { refs, components };
}

module.exports = getIndices;
