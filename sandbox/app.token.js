'use strict';

var SandboxedModule = require('sandboxed-module'),
    MockConfig = require('../mocks/config');

var app = SandboxedModule.require('../app', {
  requires: {
    github: require('../mocks/github'),
    './modules/config': new MockConfig(null, null, 'XXXX')
  }
});

module.exports = app;
