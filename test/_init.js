/**
 * mocha initilize file
 */

process.env.NODE_ENV = 'test';

var chai = require('chai');

global.should = chai.should();
