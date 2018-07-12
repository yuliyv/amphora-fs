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

  it('throws an error if the module exists but cannot be required successfully', function () {
    const name = 'some name',
      path = 'some path';

    tryRequire.throws(new Error('some error'));
    getComponentPath.returns(path);

    expect(() => fn(name)).to.throw();
  });

  it('returns undefined if the module does not exist', function () {
    const name = 'some name',
      path = 'some path';

    tryRequire.returns(undefined);
    getComponentPath.returns(path);

    expect(fn(name)).to.equal(undefined);
  });

  it('handles model.js path', function () {
    const name = 'some name',
      path = 'some path',
      result = 'some result';

    getComponentPath.returns(path);
    tryRequire.returns(result);

    expect(fn(name)).to.equal(result);
  });

  it('handles renderer model.js path', function () {
    const name = 'some name',
      path = 'some path',
      prefix = 'foobar',
      result = 'some result';

    getComponentPath.returns(path);
    tryRequire.returns(result);

    expect(fn(name, prefix)).to.equal(result);
  });

  it('returns false if the prefix is html', function () {
    const name = 'some name',
      prefix = 'html';

    expect(fn(name, prefix)).to.be.false;
    sinon.assert.notCalled(getComponentPath);
  });
});
