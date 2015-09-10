'use strict';

var SandboxedModule = require('sandboxed-module'),
    MockConfig = require('../../mocks/config');

var app = SandboxedModule.require('../../routes/auth', {
  requires: {
    '../modules/config': new MockConfig('XXXX', 'XXXX', null)
  }
});

module.exports = app;
