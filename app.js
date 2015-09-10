'use strict';

var express = require('express'),
    GitHubApi = require('github'),
    GitHubStrategy = require('passport-github').Strategy,
    Promise = require('bluebird'),
    passport = require('passport'),
    cors = require('cors'),
    path = require('path'),
    _ = require('lodash'),
    configPromises = require('./modules/config'),
    app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(passport.initialize());
app.use(cors());

var github = new GitHubApi({
  version: '3.0.0'
});

Promise.props(configPromises).then(function (config) {
  if (config.github.clientId && config.github.clientSecret) {
    // If there are the necessary env vars for OAuth, then set up OAuth

    passport.serializeUser(function(user, done) {
      done(null, user);
    });

    passport.deserializeUser(function(obj, done) {
      done(null, obj);
    });

    passport.use(new GitHubStrategy({
        clientID: config.github.clientId,
        clientSecret: config.github.clientSecret,
        callbackURL: config.host + '/auth/github/callback',
        scope: ['write:repo_hook']
      }, function (accessToken, refreshToken, profile, done) {
        profile.token = accessToken;
        done(null, profile);
      })
    );

    app.get('/auth/github', passport.authenticate('github'));

    app.get('/auth/github/callback', passport.authenticate('github'), function (req, res) {
      res.render('index', {
        token: req.user.token,
        origin: config.services.dashboard.href.value
      });
    });
  }

  var corsOptions = {
    origin: config.services.dashboard.href.value
  };

  app.post('/add/:user/:repo', cors(corsOptions), function (req, res) {
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

module.exports = app;
