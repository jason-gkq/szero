'use strict';

const net = require('..');
const assert = require('assert').strict;

assert.strictEqual(net(), 'Hello from net');
console.info('net tests passed');
