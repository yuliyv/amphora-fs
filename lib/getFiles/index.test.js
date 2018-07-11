'use strict';

const _ = require('lodash'),
  filename = __filename.split('/').pop().split('.').shift(),
  expect = require('chai').expect,
  sinon = require('sinon'),
  fs = require('fs'),
  fn = require('./' + filename),
  path = require('path');

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
    sandbox.stub(path);
    fn.cache = new _.memoize.Cache();
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('gets a list of folders', function () {
    fs.readdirSync.returns(['isAFile', 'isADirectory']);
    fs.statSync.withArgs('isAFile').returns(createMockStat({isDirectory: false}));
    fs.statSync.withArgs('isADirectory').returns(createMockStat({isDirectory: true}));
    path.resolve.returnsArg(0);

    expect(fn('.')).to.contain('isAFile');
  });

  it('returns empty array on error', function () {
    fs.readdirSync.throws();

    expect(fn('.')).to.deep.equal([]);
  });
});
