'use strict';

const _ = require('lodash'),
  filename = __filename.split('/').pop().split('.').shift(),
  expect = require('chai').expect,
  sinon = require('sinon'),
  fs = require('fs'),
  path = require('path'),
  lib = require('./' + filename);

describe(_.startCase(filename), function () {
  var sandbox, getLayoutName;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    getLayoutName = sandbox.stub();

    sandbox.stub(fs, 'existsSync');
    sandbox.stub(path, 'resolve');

    lib.setGetLayoutName(getLayoutName);
    lib.cache = new _.memoize.Cache();
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('getLayoutPath', function () {
    beforeEach(function () {
      sandbox.stub(process, 'cwd').returns('');
      fs.existsSync.returns(false);
      fs.existsSync.withArgs('layouts/c1').returns(true);
      fs.existsSync.withArgs('layouts/c2').returns(false);
      getLayoutName.withArgs('c1').returns(true);
      getLayoutName.withArgs('c2').returns(true);
      path.resolve.withArgs(process.cwd(), 'layouts', 'c1').returns('layouts/c1');
      path.resolve.withArgs(process.cwd(), 'layouts', 'c2').returns('layouts/c2');
    });

    it('returns null if name isn\'t a component', function () {
      expect(lib('c0')).to.equal(null);
    });

    it('gets an internal path', function () {
      expect(lib('c1')).to.equal('layouts/c1');
    });

    it('returns null when it does not exist', function () {
      expect(lib('c2')).to.equal(null);
    });
  });
});
