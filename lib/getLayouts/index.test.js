'use strict';

const _ = require('lodash'),
  filename = __filename.split('/').pop().split('.').shift(),
  expect = require('chai').expect,
  sinon = require('sinon'),
  fs = require('fs'),
  path = require('path'),
  lib = require('./' + filename);

describe(_.startCase(filename), function () {
  var sandbox;

  function createMockStat(options) {
    return {
      isDirectory: _.constant(!!options.isDirectory)
    };
  }

  beforeEach(function () {
    sandbox = sinon.sandbox.create();

    sandbox.stub(fs);
    lib.cache = new _.memoize.Cache();
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('getLayouts', function () {
    it('gets a list of internal layouts', function () {
      console.log(process.cwd());
      fs.readdirSync.withArgs(path.join(process.cwd(), 'layouts')).returns(['c1', 'c2']);
      fs.statSync.withArgs(path.join(process.cwd(), 'layouts/c1')).returns(createMockStat({isDirectory: true}));
      fs.statSync.withArgs(path.join(process.cwd(), 'layouts/c2')).returns(createMockStat({isDirectory: false}));


      expect(lib()).to.contain('c1', 'c2');
    });
  });
});
