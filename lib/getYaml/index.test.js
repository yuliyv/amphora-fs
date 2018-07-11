'use strict';

const _ = require('lodash'),
  filename = __filename.split('/').pop().split('.').shift(),
  expect = require('chai').expect,
  sinon = require('sinon'),
  fs = require('fs'),
  fn = require('./' + filename),
  temp2env = require('template2env'),
  yaml = require('js-yaml');

describe(_.startCase(filename), function () {
  let sandbox;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    sandbox.stub(temp2env);
    sandbox.stub(fs);
    sandbox.stub(yaml);
    fn.cache = new _.memoize.Cache();
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('returns result', function () {
    const filename = 'bootstrap',
      result = 'a: b';

    fs.readFileSync.onCall(0).returns(result);
    yaml.safeLoad.returnsArg(0);

    expect(fn(filename)).to.equal(result);
  });

  it('returns result from yaml extension', function () {
    const filename = 'bootstrap',
      result = 'a: b';

    fs.readFileSync.onCall(0).returns(result);
    fs.readFileSync.onCall(1).throws();
    yaml.safeLoad.returnsArg(0);

    expect(fn(filename)).to.equal(result);
  });

  it('returns result from yml extension', function () {
    const filename = 'bootstrap',
      result = 'a: b';

    fs.readFileSync.onCall(0).throws();
    fs.readFileSync.onCall(1).returns(result);
    yaml.safeLoad.returnsArg(0);

    expect(fn(filename)).to.equal(result);
  });

  it('runs temp2env for configs', function () {
    const result = 'a: b';

    fs.readFileSync.returns(result);
    temp2env.interpolate.returns(result);

    fn('config');

    sinon.assert.calledOnce(temp2env.interpolate);
  });

  it('does not run temp2env for non-configs', function () {
    const filename = 'bootstrap',
      result = 'a: b';

    fs.readFileSync.returns(result);
    temp2env.interpolate.returns(result);

    fn(filename);

    sinon.assert.notCalled(temp2env.interpolate);
  });
});
