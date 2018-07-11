'use strict';

const _ = require('lodash'),
  filename = __filename.split('/').pop().split('.').shift(),
  expect = require('chai').expect,
  sinon = require('sinon'),
  fs = require('fs'),
  fn = require('./' + filename);

function createMockStat(options) {
  return {
    isDirectory: _.constant(!!options.isDirectory)
  };
}

describe(_.startCase(filename), function () {
  let sandbox;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    sandbox.stub(fs);
    fn.cache = new _.memoize.Cache();
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('returns true if path is a directory', function () {
    fs.statSync.returns(createMockStat({isDirectory: true}));

    expect(fn('some-path')).to.equal(true);
  });

  it('returns false if path is a file', function () {
    fs.statSync.returns(createMockStat({isDirectory: false}));

    expect(fn('some-path')).to.equal(false);
  });
});
