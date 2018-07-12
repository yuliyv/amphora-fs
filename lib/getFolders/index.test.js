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

  it('gets a list of folders', () => {
    fs.readdirSync.returns(['isAFolder', 'isNotAFolder']);
    fs.statSync.withArgs('foo/isAFolder').returns(createMockStat({isDirectory: true}));
    fs.statSync.withArgs('foo/isNotAFolder').returns(createMockStat({isDirectory: false}));

    expect(fn('foo')).to.contain('isAFolder');
  });

  it('returns empty array if something goes wrong', () => {
    fs.readdirSync.throws();

    expect(fn('bar')).to.eql([]);
  });
});
