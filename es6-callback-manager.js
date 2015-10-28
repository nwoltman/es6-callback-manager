'use strict';

class CallbackManager {
  /**
   * Creates a new CallbackManager.
   *
   * @class CallbackManager
   * @param {function} callback - The callback to invoke once all intermediary
   *     callbacks have been invoked. Is invoked immediately if one of the
   *     callbacks is called with an `Error` as the first argument and is passed
   *     the `Error` object as the first argument.
   * @example
   * var CallbackManager = require('es6-callback-manager');
   * var cbManager = new CallbackManager(function(err) {
   *   if (err) throw err;
   *   console.log('Done!');
   * });
   * setTimeout(cbManager.registerCallback(), 200);
   * setTimeout(cbManager.registerCallback(), 100);
   * setTimeout(cbManager.registerCallback(), 300);
   */
  constructor(callback) {
    this._callback = callback;
    this._count = 0;

    this._intermediaryCallback = error => {
      if (this._count === 0) {
        return;
      }

      if (error && error instanceof Error) {
        this.abort();
        callback(error);
        return;
      }

      if (--this._count === 0) {
        callback(null);
      }
    };
  }

  /**
   * The callback passed to the constructor. Is read-only.
   *
   * @member {function} CallbackManager#callback
   */
  get callback() {
    return this._callback;
  }

  /**
   * Returns an intermediary callback and increases the number of callbacks to
   * wait for until the original callback will be invoked.
   *
   * @returns {function} An intermediary callback that, when invoked, decreases
   *     the number of callbacks to wait for. If it is the last callback being
   *     waited on, it invokes the original callback. If it is called with an
   *     `Error` as the first argument, it invokes the original callback
   *     immediately with the `Error`.
   * @example
   * var cbManager = new CallbackManager(callback);
   * process.nextTick(cbManager.registerCallback());
   *
   * var cb = cbManager.registerCallback();
   * cb('error'); // Does nothing since a string is not an Error object
   *
   * var error = new Error();
   * cb = cbManager.registerCallback();
   * cb(error); // Stops waiting for other callbacks and calls callback(error)
   */
  registerCallback() {
    this._count++;
    return this._intermediaryCallback;
  }

  /**
   * Returns the number of intermediary callbacks currently being waited on.
   *
   * @returns {number}
   * @example
   * var cbManager = new CallbackManager(function() {
   *   cbManager.getCount(); // -> 0
   * });
   * process.nextTick(cbManager.registerCallback());
   * cbManager.getCount(); // -> 1
   * process.nextTick(cbManager.registerCallback());
   * cbManager.getCount(); // -> 2
   */
  getCount() {
    return this._count;
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
   * setTimeout(cbManager.registerCallback(), 100);
   * setTimeout(function() {
   *   cbManager.abort();
   * }, 50);
   */
  abort() {
    this._count = 0;
  }
}

module.exports = CallbackManager;
