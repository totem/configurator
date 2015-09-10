'use strict';

var SandboxedModule = require('sandboxed-module'),
    express = require('express');

var app = SandboxedModule.require('../app', {
  requires: {
    './routes/add': require('./routes/add.token'),
    './routes/auth': express.Router()
  }
});

module.exports = app;
