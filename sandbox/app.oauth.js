'use strict';

var SandboxedModule = require('sandboxed-module');

var app = SandboxedModule.require('../app', {
  requires: {
    './routes/add': require('./routes/add.oauth'),
    './routes/auth': require('./routes/auth')
  }
});

module.exports = app;
