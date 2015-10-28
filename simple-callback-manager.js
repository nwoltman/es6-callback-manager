'use strict';

/**
 * Creates a new CallbackManager.
 *
 * @class
 * @param {function} callback - The callback to invoke once all intermediary
 *     callbacks have been invoked. Is invoked immediately if one of the
 *     callbacks is called with an `Error` as the first argument and is passed
 *     the `Error` object as the first argument.
 * @example
 * var CallbackManager = require('simple-callback-manager');
 * var cbManager = new CallbackManager(function(err) {
 *   if (err) throw err;
 *   console.log('Done!');
 * });
 * setTimeout(cbManager.getNewCallback(), 200);
 * setTimeout(cbManager.getNewCallback(), 100);
 * setTimeout(cbManager.getNewCallback(), 300);
 */
function CallbackManager(callback) {
  var _this = this;

  this._count = 0;

  this._callback = function(error) {
    if (_this._count === 0) {
      return;
    }

    if (error && error instanceof Error) {
      _this.abort();
      callback(error);
      return;
    }

    if (--_this._count === 0) {
      callback(null);
    }
  };
}

/**
 * Aborts the callback sequence, preventing the original callback from being
 * invoked once all intermediary callbacks have been invoked.
 *
 * @returns {void}
 * @example
 * var cbManager = new CallbackManager(function() {
 *   console.log('This is never called');
 * });
 * setTimeout(cbManager.getNewCallback(), 100);
 * setTimeout(function() {
 *   cbManager.abort();
 * }, 50);
 */
CallbackManager.prototype.abort = function() {
  this._count = 0;
};

/**
 * Returns an intermediary callback and increases the number of callbacks to
 * wait for until original the callback can be invoked.
 *
 * @returns {function} An intermediary callback that, when invoked, decreases
 *     the number of callbacks to wait for. If it is the last callback being
 *     waited on, it invokes the original callback. If it is called with an
 *     `Error` as the first argument, it invokes the original callback
 *     immediately with the `Error`.
 * @example
 * var cbManager = new CallbackManager(callback);
 * process.nextTick(cbManager.getNewCallback());
 *
 * var cb = cbManager.getNewCallback();
 * cb('error'); // Does nothing since a string is not an Error object
 *
 * var error = new Error();
 * cb = cbManager.getNewCallback();
 * cb(error); // Stops waiting for other callbacks and calls callback(error)
 */
CallbackManager.prototype.getNewCallback = function() {
  this._count++;
  return this._callback;
};

/**
 * Returns the number of intermediary callbacks currently being waited on.
 *
 * @returns {number}
 * @example
 * var cbManager = new CallbackManager(function() {
 *   cbManager.getCount(); // -> 0
 * });
 * process.nextTick(cbManager.getNewCallback());
 * cbManager.getCount(); // -> 1
 * process.nextTick(cbManager.getNewCallback());
 * cbManager.getCount(); // -> 2
 */
CallbackManager.prototype.getCount = function() {
  return this._count;
};

module.exports = CallbackManager;
