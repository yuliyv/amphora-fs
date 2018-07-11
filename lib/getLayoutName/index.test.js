'use strict';

const _ = require('lodash'),
  filename = __filename.split('/').pop().split('.').shift(),
  expect = require('chai').expect,
  sinon = require('sinon'),
  lib = require('./' + filename);

describe(_.startCase(filename), function () {
  var sandbox, getLayouts;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    getLayouts = sandbox.stub();

    lib.setGetLayouts(getLayouts);
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('getLayoutName', function () {
    it('calls the `getLayouts` function to get a full list of layouts', function () {
      lib();
      sinon.assert.calledOnce(getLayouts);
    });

    it('returns the name of the layout if it exists', function () {
      var returnVal;

      getLayouts.returns(['foo', 'bar']);
      returnVal = lib('foo');
      expect(returnVal).to.eql('foo');
    });

    it('returns false if thec layout does not exist', function () {
      var returnVal;

      getLayouts.returns(['bar']);
      returnVal = lib('foo');
      expect(returnVal).to.be.false;
    });
  });
});
