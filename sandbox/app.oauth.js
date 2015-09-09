'use strict';

var SandboxedModule = require('sandboxed-module'),
    MockConfig = require('../mocks/config'),
    config = new MockConfig('XXXX', 'XXXX');

var app = SandboxedModule.require('../app', {
  requires: {
    github: require('../mocks/github'),
    './modules/config': config
  }
});

module.exports = app;
