'use strict';

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
