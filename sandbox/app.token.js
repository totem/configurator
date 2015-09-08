'use strict';

process.env.GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_SECRET = 'undefined';
process.env.GITHUB_ACCESS_TOKEN = 'XXXX';

var SandboxedModule = require('sandboxed-module');

var app = SandboxedModule.require('../app', {
  requires: {
    github: require('../mocks/github')
  }
});

module.exports = app;
