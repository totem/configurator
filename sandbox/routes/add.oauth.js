'use strict';

var SandboxedModule = require('sandboxed-module');

var add = SandboxedModule.require('../../routes/add', {
  requires: {
    github: require('../../mocks/github'),
    lodash: require('lodash')
  }
});

module.exports = add;
