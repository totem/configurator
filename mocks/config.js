'use strict';

var Promise = require('bluebird');

var MockConfig = function (clientId, clientSecret, token) {
  var resolveServices,
      resolveRuntime;

  this.github = {
    clientId: clientId,
    clientSecret: clientSecret,
    token: token
  };

  this.host = 'https://totem-configurator.dev';

  this.services = new Promise(function (res) {
    resolveServices = res;
  });

  this.runtime = new Promise(function (res) {
    resolveRuntime = res;
  });

  resolveServices({dashboard: {href: {value: 'XXXX'}}});

  resolveRuntime({hooks: [{
    config: {
      'content_type': 'json',
      url: 'http://testing.hooks/hook'
    },
    events: ['delete'],
    name: 'web'
  }]});
};

module.exports = MockConfig;
