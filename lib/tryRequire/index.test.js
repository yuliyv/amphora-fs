'use strict';

const _ = require('lodash'),
  filename = __filename.split('/').pop().split('.').shift(),
  expect = require('chai').expect,
  sinon = require('sinon'),
  fn = require('./' + filename);

describe(_.startCase(filename), function () {
  let sandbox, req;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    req = sandbox.stub();
    req.resolve = sandbox.stub();
    fn.setRequire(req);
    fn.cache = new _.memoize.Cache();
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('returns undefined if file does not exist', function () {
    req.resolve.throws();

    expect(fn('some-path')).to.equal(undefined);
  });

  it('requires file if it exists', function () {
    req.resolve.returns('some-path');
    req.returns('hi');

    expect(fn('some-path')).to.equal('hi');
  });
});
