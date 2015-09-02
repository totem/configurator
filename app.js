var express = require('express'),
    GitHubApi = require('github'),
    Promise = require('bluebird'),
    _ = require('lodash'),
    config = require('./config.json'),
    app = express();

var github = new GitHubApi({
  version: '3.0.0'
});

app.post('/:user/:repo', function (req, res) {
  github.authenticate({
    type: 'oauth',
    token: req.headers.authorization.split(' ')[1]
  });

  var errorCode = null;
      hooks = [],
      promises = [];

  _.each(config.hooks, function (hook) {
    var resolve,
        reject;

    var hookPromise = new Promise(function (res, rej) {
      resolve = res;
      reject = rej;
    });

    hookPromise.then(function (data) {
      hooks.push(data);
    }).catch(function (err) {
      errorCode = err.code;
      hooks.push(JSON.parse(err.message));
    });

    promises.push(hookPromise);

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

  Promise.settle(promises).then(function () {
    var statusCode = errorCode || 201;
    res.status(statusCode).json(hooks);
  });
});

module.exports = app;
