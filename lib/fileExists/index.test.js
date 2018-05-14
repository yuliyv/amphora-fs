'use strict';

const _ = require('lodash'),
  filename = __filename.split('/').pop().split('.').shift(),
  expect = require('chai').expect,
  sinon = require('sinon'),
  fs = require('fs'),
  fn = require('./' + filename);

describe(_.startCase(filename), function () {
  let sandbox;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    sandbox.stub(fs, 'statSync');
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('fileExists', function () {
    it('is true if exists', function () {
      fs.statSync.returns({});

      expect(fn('a')).to.equal(true);
    });

    it('is false if falsy', function () {
      expect(fn('a')).to.equal(false);
    });

    it('is false if throws', function () {
      fs.statSync.throws();

      expect(fn('a')).to.equal(false);
    });
  });
});
