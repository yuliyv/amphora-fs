'use strict';

const _ = require('lodash'),
  filename = __filename.split('/').pop().split('.').shift(),
  expect = require('chai').expect,
  sinon = require('sinon'),
  lib = require('./' + filename);

describe(_.startCase(filename), function () {
  var sandbox, getComponents;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    getComponents = sandbox.stub();

    lib.setGetComponents(getComponents);
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('getComponentName', function () {
    it('calls the `getComponents` function to get a full list of components', function () {
      lib();
      sinon.assert.calledOnce(getComponents);
    });

    it('returns the name of the component if it exists', function () {
      var returnVal;

      getComponents.returns(['foo', 'bar']);
      returnVal = lib('foo');
      expect(returnVal).to.eql('foo');
    });

    it('returns false if thec component does not exist', function () {
      var returnVal;

      getComponents.returns(['bar']);
      returnVal = lib('foo');
      expect(returnVal).to.be.false;
    });
  });
});
