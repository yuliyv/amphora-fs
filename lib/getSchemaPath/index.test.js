'use strict';

const _ = require('lodash'),
  filename = __filename.split('/').pop().split('.').shift(),
  lib = require('./' + filename),
  expect = require('chai').expect,
  sinon = require('sinon');

describe(_.startCase(filename), function () {
  let sandbox;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('getSchemaPath', function () {
    const fn = lib;

    it('gets schema with .yaml ext', function () {
      const textSchema = fn('test/fixtures');

      expect(textSchema).to.equal('test/fixtures/schema.yaml');
    });

    it('gets schema with .yml ext', function () {
      const textSchema = fn('test/fixtures/text');

      expect(textSchema).to.equal('test/fixtures/text/schema.yml');
    });

    it('throws error when no schema found', function () {
      function getSchema() {
        return fn('test/fixtures/not-found');
      }

      expect(getSchema).to.throw(/not found/);
    });

    it('throws error when nothing is passed in', function () {
      function getSchema() {
        return fn();
      }

      expect(getSchema).to.throw(/is invalid/);
    });

    it('throws error if a string is not passed in', function () {
      function getSchema() {
        return fn(123123);
      }

      expect(getSchema).to.throw(/is invalid/);
    });
  });
});
