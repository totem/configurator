'use strict';

var SandboxedModule = require('sandboxed-module'),
    MockConfig = require('../../mocks/config');

var add = SandboxedModule.require('../../routes/add', {
  requires: {
    github: require('../../mocks/github'),
    '../modules/config': new MockConfig(null, null, 'XXXX')
  }
});

module.exports = add;
