'use strict';

var Promise = require('bluebird'),
    https = require('https'),
    _ = require('lodash'),
    resolveServices,
    resolveRuntime;

var getEnvVar = function (envVarName) {
  return (envVarName in process.env) ? process.env[envVarName] : null;
};

var githubConfig = {
  token: getEnvVar('CONFIGURATOR_GITHUB_ACCESS_TOKEN'),
  clientId: getEnvVar('CONFIGURATOR_GITHUB_CLIENT_ID'),
  clientSecret: getEnvVar('CONFIGURATOR_GITHUB_CLIENT_SECRET')
};

var servicesConfigPromise = new Promise(function (res) {
  resolveServices = res;
});

https.get(process.env.TOTEM_SERVICES_CONFIG, function (res) {
  var body = '';

  res.on('data', function (data) {
    body += data;
  });

  res.on('end', function () {
    var links = JSON.parse(body).links,
        services = {};

    _.each(links, function (link) {
      services[link.rel] = link;
    });

    resolveServices(services);
  });
});

var runtimeConfigPromise = new Promise(function (res) {
  resolveRuntime = res;
});

https.get(process.env.CONFIGURATOR_RUNTIME_CONFIG, function (res) {
  var body = '';

  res.on('data', function (data) {
    body += data;
  });

  res.on('end', function () {
    resolveRuntime(JSON.parse(body));
  });
});

module.exports = {
  host: process.env.CONFIGURATOR_HOST,
  services: servicesConfigPromise,
  runtime: runtimeConfigPromise,
  github: githubConfig
};
