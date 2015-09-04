'use strict';

var SandboxedModule = require('sandboxed-module');

var app = SandboxedModule.require('./app', {
  requires: {
    github: require('./mocks/github')
  }
});

module.exports = app;
