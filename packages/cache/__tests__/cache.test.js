'use strict';

const cache = require('..');
const assert = require('assert').strict;

assert.strictEqual(cache(), 'Hello from cache');
console.info('cache tests passed');
