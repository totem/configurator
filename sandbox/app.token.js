'use strict';

var SandboxedModule = require('sandboxed-module'),
    MockConfig = require('../mocks/config');

var app = SandboxedModule.require('../app', {
  requires: {
    './routes/add': require('./routes/add.token'),
    './modules/config': new MockConfig(null, null, 'XXXX')
  }
});

module.exports = app;
