'use strict';

const pluginRemote = require('..');
const assert = require('assert').strict;

assert.strictEqual(pluginRemote(), 'Hello from pluginRemote');
console.info('pluginRemote tests passed');
