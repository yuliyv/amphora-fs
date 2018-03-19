'use strict';

const _ = require('lodash'),
  filename = __filename.split('/').pop().split('.').shift(),
  lib = require('./' + filename),
  sinon = require('sinon'),
  expect = require('chai').expect;

describe(_.startCase(filename), function () {
  var sandbox;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    sandbox.restore();
  });


  describe('getIndices', function () {
    const fn = lib;

    it('allows bad ref, empty data', function () {
      const ref = 'some ref',
        data = {},
        result = {
          refs: { 'some ref': {} },
          components: []
        };

      expect(fn(ref, data)).to.deep.equal(result);
    });

    it('allows good ref, empty data', function () {
      const ref = '/_components/thing/instances/abc',
        data = {},
        result = {
          refs: { '/_components/thing/instances/abc': {} },
          components: ['thing']
        };

      expect(fn(ref, data)).to.deep.equal(result);
    });

    it('allows good ref, data with references', function () {
      const ref = '/_components/thing/instances/abc',
        data = {
          a: 'b',
          c: {_ref: '/_components/d/instances/e'},
          f: {_ref: '/_components/g'},
          h: {
            _ref: '/_components/i',
            j: {_ref:'/_components/k'}
          },
          l: {_ref: '/_components/g'},
          m: {_ref: '/_components/g/instances/n'}
        },
        result = {
          refs: {
            '/_components/d/instances/e': { _ref: '/_components/d/instances/e' },
            '/_components/g': { _ref: '/_components/g' },
            '/_components/g/instances/n': { _ref: '/_components/g/instances/n' },
            '/_components/i': { _ref: '/_components/i', j: {_ref:'/_components/k'} },
            '/_components/k': { _ref: '/_components/k' },
            '/_components/thing/instances/abc': {
              a: 'b',
              c: {_ref: '/_components/d/instances/e'},
              f: {_ref: '/_components/g'},
              h: {
                _ref: '/_components/i',
                j: {_ref:'/_components/k'}
              },
              l: {_ref: '/_components/g'},
              m: {_ref: '/_components/g/instances/n'}
            }
          },
          components: ['thing', 'd', 'g', 'i', 'k']
        };

      expect(fn(ref, data)).to.deep.equal(result);
    });
  });

});
