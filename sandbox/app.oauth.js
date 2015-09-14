'use strict';

var SandboxedModule = require('sandboxed-module'),
    MockConfig = require('../mocks/config');

var app = SandboxedModule.require('../app', {
  requires: {
    './routes/add': require('./routes/add.oauth'),
    './modules/config': new MockConfig('XXXX', 'XXXX', null)
  }
});

module.exports = app;
