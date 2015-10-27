# CallbackManager

A class for managing asynchronous callbacks in JavaScript

[![NPM Version](https://img.shields.io/npm/v/callback-manager.svg)](https://www.npmjs.com/package/callback-manager)
[![Build Status](https://travis-ci.org/woollybogger/callback-manager.svg?branch=master)](https://travis-ci.org/woollybogger/callback-manager)
[![Coverage Status](https://coveralls.io/repos/woollybogger/callback-manager/badge.svg?branch=master)](https://coveralls.io/r/woollybogger/callback-manager?branch=master)
[![devDependency Status](https://david-dm.org/woollybogger/callback-manager/dev-status.svg)](https://david-dm.org/woollybogger/callback-manager#info=devDependencies)


## Installation

```sh
npm install callback-manager --save
```


## API Reference

<a name="CallbackManager"></a>
## CallbackManager

* [CallbackManager](#CallbackManager)
  * [new CallbackManager(callback)](#new_CallbackManager_new)
  * [.abort()](#CallbackManager+abort) ⇒ <code>void</code>
  * [.getCallback()](#CallbackManager+getCallback) ⇒ <code>function</code>
  * [.getCount()](#CallbackManager+getCount) ⇒ <code>number</code>


---

<a name="new_CallbackManager_new"></a>
### new CallbackManager(callback)
Creates a new CallbackManager.


| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | The callback to invoke once all intermediary     callbacks have been invoked. Is invoked immediately if one of the     callbacks is called with an `Error` as the first argument and is passed     the `Error` object as the first argument. |


**Example**
```js
var CallbackManager = require('callback-manager');
var cbManager = new CallbackManager(function(err) {
  if (err) throw err;
  console.log('Done!');
});
setTimeout(cbManager.getCallback(), 200);
setTimeout(cbManager.getCallback(), 100);
setTimeout(cbManager.getCallback(), 300);
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
setTimeout(cbManager.getCallback(), 100);
setTimeout(function() {
  cbManager.abort();
}, 50);
```

---

<a name="CallbackManager+getCallback"></a>
### callbackManager.getCallback() ⇒ <code>function</code>
Returns an intermediary callback and increases the number of callbacks to
wait for until original the callback can be invoked.

**Returns**: <code>function</code> - An intermediary callback that, when invoked, decreases
    the number of callbacks to wait for. If it is the last callback being
    waited on, it invokes the original callback. If it is called with an
    `Error` as the first argument, it invokes the original callback
    immediately with the `Error`.  

**Example**
```js
var cbManager = new CallbackManager(callback);
process.nextTick(cbManager.getCallback());

var cb = cbManager.getCallback();
cb('error'); // Does nothing since a string is not an Error object

var error = new Error();
cb = cbManager.getCallback();
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
process.nextTick(cbManager.getCallback());
cbManager.getCount(); // -> 1
process.nextTick(cbManager.getCallback());
cbManager.getCount(); // -> 2
```

---

