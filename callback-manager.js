'use strict';

function CallbackManager(callback, continueOnError) {
  var _this = this;
  var lastError = null;

  this._count = 0;

  this._callback = function(error) {
    if (_this._count === 0) {
      return;
    }

    _this._count--;

    if (error && error instanceof Error) {
      lastError = error;
      if (!continueOnError) {
        _this._count = 0;
      }
    }

    if (_this._count !== 0) {
      return;
    }

    callback(lastError);
    lastError = null;
  };
}

CallbackManager.prototype.abort = function() {
  this._count = 0;
};

CallbackManager.prototype.getCallback = function() {
  this._count++;
  return this._callback;
};

CallbackManager.prototype.getCount = function() {
  return this._count;
};

module.exports = CallbackManager;
