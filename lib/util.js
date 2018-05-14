'use strict';

let memoryLeakThreshold = 32768,
  log = console.log; // replace with clay-log;
const _ = require('lodash'),
  minute = 60000;

function defineWritable(definition) {
  if (!definition.set && !definition.get) {
    definition.writable = true;
  }
  definition.enumerable = false;
  definition.configurable = false;
  return definition;
}

function getMemoryLeakThreshold() {
  return memoryLeakThreshold;
}

function setMemoryLeakThreshold(value) {
  memoryLeakThreshold = value;
}

/**
 * Report that a memory leak occurred
 * @param {function} fn
 * @param {object} cache
 */
function reportMemoryLeak(fn, cache) {
  log('warn', 'memory leak', fn.name, cache);
}

/**
 * Memoize, but warn if the target is not suitable for memoization
 * @param {function} fn
 * @returns {function}
 */
function memoize(fn) {
  const dataProp = '__data__.string.__data__',
    memFn = _.memoize.apply(_, _.slice(arguments)),
    report = _.throttle(reportMemoryLeak, minute),
    controlFn = function () {
      const result = memFn.apply(null, _.slice(arguments));

      if (_.size(_.get(memFn, `cache.${dataProp}`)) >= memoryLeakThreshold) {
        report(fn, _.get(memFn, `cache.${dataProp}`));
      }

      return result;
    };

  Object.defineProperty(controlFn, 'cache', defineWritable({
    get() { return memFn.cache; },
    set(value) { memFn.cache = value; }
  }));

  return controlFn;
}

module.exports.memoize = memoize;
module.exports.setLog = (fake) => log = fake;
module.exports.getMemoryLeakThreshold = getMemoryLeakThreshold;
module.exports.setMemoryLeakThreshold = setMemoryLeakThreshold;
