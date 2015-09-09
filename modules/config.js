'use strict';

var Promise = require('bluebird'),
    https = require('https'),
    _ = require('lodash'),
    resolveServices,
    resolveRuntime;

var githubConfig = {
  token: ('CONFIGURATOR_GITHUB_ACCESS_TOKEN' in process.env) ? process.env.CONFIGURATOR_GITHUB_ACCESS_TOKEN : false,
  clientId: ('CONFIGURATOR_GITHUB_CLIENT_ID' in process.env) ? process.env.CONFIGURATOR_GITHUB_CLIENT_ID : false,
  clientSecret: ('CONFIGURATOR_GITHUB_CLIENT_SECRET' in process.env) ? process.env.CONFIGURATOR_GITHUB_CLIENT_SECRET : false
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
