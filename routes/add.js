'use strict';

var express = require('express'),
    Promise = require('bluebird'),
    cors = require('cors'),
    GitHubApi = require('github'),
    _ = require('lodash'),
    configPromises = require('../modules/config'),
    router = express.Router();

var github = new GitHubApi({
  version: '3.0.0'
});

Promise.props(configPromises).then(function (config) {
  var corsOptions = {
    origin: '*'
  };

  router.post('/:user/:repo', cors(corsOptions), function (req, res) {
    if (config.github.token) {
      // If a personal access token has been provided, use that instead of OAuth
      github.authenticate({
        type: 'token',
        token: config.github.token
      });
    } else {
      try {
        // Attempt to get OAuth token from Authorization header
        github.authenticate({
          type: 'oauth',
          token: req.headers.authorization.split(' ')[1]
        });
      } catch (err) {
        // Return Unauthorized if no Authrorization header exists
        res.sendStatus(401);
        return;
      }
    }

    var errorCode = null,
        hooks = [],
        hookPromises = [];

    _.each(config.runtime.hooks, function (hook) {
      var resolve,
          reject;

      var hookPromise = new Promise(function (res, rej) {
        resolve = res;
        reject = rej;
      });

      hookPromise.then(function (data) {
        hooks.push(data);
      }).catch(function (err) {
        var message = JSON.parse(err.message);
        errorCode = message.code = err.code;
        hooks.push(message);
      });

      hookPromises.push(hookPromise);

      github.repos.createHook(_.assign(hook, {
        user: req.params.user,
        repo: req.params.repo
      }), function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });

    Promise.settle(hookPromises).then(function () {
      res.status(errorCode ? errorCode : 201).json(hooks);
    });
  });
});

module.exports = router;
