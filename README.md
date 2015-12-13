# ES6 CallbackManager

A class for managing asynchronous callbacks in JavaScript

[![NPM Version](https://img.shields.io/npm/v/es6-callback-manager.svg)](https://www.npmjs.com/package/es6-callback-manager)
[![Build Status](https://travis-ci.org/woollybogger/es6-callback-manager.svg?branch=master)](https://travis-ci.org/woollybogger/es6-callback-manager)
[![Coverage Status](https://coveralls.io/repos/woollybogger/es6-callback-manager/badge.svg?branch=master)](https://coveralls.io/r/woollybogger/es6-callback-manager?branch=master)
[![devDependency Status](https://david-dm.org/woollybogger/es6-callback-manager/dev-status.svg)](https://david-dm.org/woollybogger/es6-callback-manager#info=devDependencies)


## Installation

```sh
npm install es6-callback-manager --save
```

**Note:** Requires Node v4 or higher


# API Reference

<a name="CallbackManager"></a>
## CallbackManager

* [CallbackManager](#CallbackManager)
    * [new CallbackManager(callback)](#new_CallbackManager_new)
    * [.callback](#CallbackManager+callback) : <code>function</code>
    * [.registerCallback()](#CallbackManager+registerCallback) ⇒ <code>function</code>
    * [.getCount()](#CallbackManager+getCount) ⇒ <code>number</code>
    * [.abort()](#CallbackManager+abort) ⇒ <code>void</code>


---

<a name="new_CallbackManager_new"></a>
### new CallbackManager(callback)
Creates a new CallbackManager.


| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | The callback to invoke once all intermediary     callbacks have been invoked. Is invoked immediately if one of the     callbacks is called with an `Error` as the first argument and is passed     the `Error` object as the first argument. |


**Example**
```js
var CallbackManager = require('es6-callback-manager');
var cbManager = new CallbackManager(function(err) {
  if (err) throw err;
  console.log('Done!');
});
setTimeout(cbManager.registerCallback(), 200);
setTimeout(cbManager.registerCallback(), 100);
setTimeout(cbManager.registerCallback(), 300);
```

---

<a name="CallbackManager+callback"></a>
### callbackManager.callback : <code>function</code>
The callback passed to the constructor. Is read-only.


---

<a name="CallbackManager+registerCallback"></a>
### callbackManager.registerCallback() ⇒ <code>function</code>
Returns an intermediary callback and increases the number of callbacks to
wait for until the original callback will be invoked.

**Returns**: <code>function</code> - An intermediary callback that, when invoked, decreases
    the number of callbacks to wait for. If it is the last callback being
    waited on, it invokes the original callback. If it is called with an
    `Error` as the first argument, it invokes the original callback
    immediately with the `Error`.  

**Example**
```js
var cbManager = new CallbackManager(callback);
process.nextTick(cbManager.registerCallback());

var cb = cbManager.registerCallback();
cb('error'); // Does nothing since a string is not an Error object

var error = new Error();
cb = cbManager.registerCallback();
cb(error); // Stops waiting for other callbacks and calls callback(error)
```

---

<a name="CallbackManager+getCount"></a>
### callbackManager.getCount() ⇒ <code>number</code>
Returns the number of intermediary callbacks currently being waited on.


**Example**
```js
var cbManager = new CallbackManager(function() {
  cbManager.getCount(); // -> 0
});
process.nextTick(cbManager.registerCallback());
cbManager.getCount(); // -> 1
process.nextTick(cbManager.registerCallback());
cbManager.getCount(); // -> 2
```

---

<a name="CallbackManager+abort"></a>
### callbackManager.abort() ⇒ <code>void</code>
Aborts the callback sequence, preventing the original callback from being
invoked once all intermediary callbacks have been invoked.


**Example**
```js
var cbManager = new CallbackManager(function() {
  console.log('This is never called');
});
setTimeout(cbManager.registerCallback(), 100);
setTimeout(function() {
  cbManager.abort();
}, 50);
```

---

