'use strict';

const _ = require('lodash'),
  filename = __filename.split('/').pop().split('.').shift(),
  expect = require('chai').expect,
  sinon = require('sinon'),
  fn = require('./' + filename);

describe(_.startCase(filename), function () {
  let sandbox, getComponentPath, tryRequire;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    getComponentPath = sandbox.stub();
    tryRequire = sandbox.stub();
    fn.setDeps(getComponentPath, tryRequire);
    fn.cache = new _.memoize.Cache();
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('handles missing name', function () {
    expect(fn()).to.equal();
  });

  it('handles bad name', function () {
    const name = 'some name';

    expect(fn(name)).to.equal();
  });

  it('handles bad path', function () {
    const name = 'some name';

    getComponentPath.returns(null);

    expect(fn(name)).to.equal(null);
  });

  it('handles index.js path', function () {
    const name = 'some name',
      path = 'some path',
      result = [];

    getComponentPath.returns(path);
    tryRequire.returns(result);

    expect(fn(name)).to.equal(result);
  });
});
