'use strict';

/* eslint-disable prefer-arrow-callback */

const CallbackManager = require('../');
const assert = require('assert');

describe('CallbackManager', function() {

  it('should wait for all generated callbacks to be invoked before invoking the provided callback', function() {
    var called = false;
    var callbackManager = new CallbackManager(function() {
      called = true;
    });
    var cb1 = callbackManager.registerCallback();
    var cb2 = callbackManager.registerCallback();
    var cb3 = callbackManager.registerCallback();

    cb1();
    called.should.equal(false);
    cb2();
    called.should.equal(false);
    cb3();
    called.should.equal(true);

    called = false;
    cb1 = callbackManager.registerCallback();
    cb2 = callbackManager.registerCallback();

    // Order doesn't matter
    cb2();
    called.should.equal(false);
    cb1();
    called.should.equal(true);
  });

  it('should only invoke the provided callback once', function() {
    var numCalls = 0;
    var callbackManager = new CallbackManager(function() {
      numCalls++;
    });
    var cb1 = callbackManager.registerCallback();
    var cb2 = callbackManager.registerCallback();

    cb1();
    numCalls.should.equal(0);
    cb2();
    numCalls.should.equal(1);

    cb1();
    cb2();
    numCalls.should.equal(1);
  });

  it('should invoke the callback when the first error occurs', function(done) {
    var firstError = new Error('First');
    var otherError = new Error('Other');

    var callbackManager = new CallbackManager(function(err) {
      if (err !== firstError) {
        throw new Error('Did not call the callback immediately after the first error');
      }
      done();
    });

    process.nextTick(callbackManager.registerCallback());
    process.nextTick(callbackManager.registerCallback().bind(null, firstError));
    process.nextTick(callbackManager.registerCallback().bind(null, otherError));
    process.nextTick(callbackManager.registerCallback());
    process.nextTick(callbackManager.registerCallback().bind(null, otherError));
  });

  it('should not invoke the callback with a value if a non-error value was encountered', function(done) {
    var callbackManager = new CallbackManager(function(err) {
      if (err) {
        throw new Error('Should not have been invoked with an error value');
      }
      done();
    });

    process.nextTick(callbackManager.registerCallback());
    process.nextTick(callbackManager.registerCallback().bind(null, true));
    process.nextTick(callbackManager.registerCallback().bind(null, 10));
    process.nextTick(callbackManager.registerCallback());
    process.nextTick(callbackManager.registerCallback().bind(null, 'error'));
  });

  it('should be reusable, even after an error', function(done) {
    var expectedErrValue = new Error();
    var callbackManager = new CallbackManager(function(err) {
      if (err !== expectedErrValue) {
        throw new Error('Unexpected err value: ' + err);
      }
      if (err) {
        expectedErrValue = null;
        process.nextTick(callbackManager.registerCallback());
        process.nextTick(callbackManager.registerCallback());
      } else {
        done();
      }
    });

    process.nextTick(callbackManager.registerCallback());
    process.nextTick(callbackManager.registerCallback().bind(null, expectedErrValue));
    process.nextTick(callbackManager.registerCallback());
  });


  describe('#callback', function() {

    it('should be the original callback passed to the constructor', function() {
      function callback() {}
      var callbackManager = new CallbackManager(callback);
      callbackManager.callback.should.equal(callback);
    });

    it('should not be modifiable', function() {
      function callback() {}
      var callbackManager = new CallbackManager(callback);
      callbackManager.callback.should.equal(callback);
      assert.throws(function() {
        callbackManager.callback = 1;
      }, TypeError);
    });

  });


  describe('#registerCallback()', function() {

    it('should return a function', function() {
      var callbackManager = new CallbackManager(function() {});
      callbackManager.registerCallback().should.be.a.type('function');
    });

  });


  describe('#getCount()', function() {

    it('should return the number of callbacks currently waiting to be called', function(done) {
      var callbackManager = new CallbackManager(done);

      callbackManager.getCount().should.equal(0);

      process.nextTick(callbackManager.registerCallback());
      callbackManager.getCount().should.equal(1);

      process.nextTick(callbackManager.registerCallback());
      process.nextTick(function() {
        callbackManager.getCount().should.equal(1); // Runs after the first 2 callbacks are called
      });
      process.nextTick(callbackManager.registerCallback());
      callbackManager.getCount().should.equal(3);
    });

  });


  describe('#abort()', function() {

    it('should prevent the provided callback from being called', function(done) {
      var callbackManager = new CallbackManager(function() {
        throw new Error('Callback not aborted');
      });

      process.nextTick(callbackManager.registerCallback());
      process.nextTick(function() {
        callbackManager.abort();
      });
      process.nextTick(callbackManager.registerCallback());
      process.nextTick(callbackManager.registerCallback());
      process.nextTick(done);
    });

  });

});
