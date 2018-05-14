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
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('readFilePromise', function () {
    it('returns file contents', function () {
      const result = 'result',
        name = 'article.css';

      sandbox.stub(fs, 'readFile').callsFake(function (path, options, callback) {
        return callback(null, result);
      });

      return fn(name).then(function (fileResult) {
        expect(fileResult).to.equal(result);
      });
    });

    it('throws error', function () {
      const err = new Error('nope');

      sandbox.stub(fs, 'readFile').callsFake(function (path, x, callback) {
        return callback(err, '');
      });

      return fn('.').catch(function (result) {
        expect(result).to.equal(err);
      });
    });
  });
});
