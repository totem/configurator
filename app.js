'use strict';

var express = require('express'),
    GitHubApi = require('github'),
    GitHubStrategy = require('passport-github').Strategy,
    Promise = require('bluebird'),
    passport = require('passport'),
    cors = require('cors'),
    path = require('path'),
    _ = require('lodash'),
    config = require('./config.json'),
    app = express(),
    githubToken = ('GITHUB_ACCESS_TOKEN' in process.env) ? process.env.GITHUB_ACCESS_TOKEN : false,
    githubClientId = ('GITHUB_CLIENT_ID' in process.env) ? process.env.GITHUB_CLIENT_ID : false,
    githubClientSecret = ('GITHUB_CLIENT_SECRET' in process.env) ? process.env.GITHUB_CLIENT_SECRET : false;

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(passport.initialize());
app.use(cors());

var github = new GitHubApi({
  version: '3.0.0'
});

var corsOptions = {
  origin: config.dashboardUrl
};

if (githubClientId && githubClientSecret) {
  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

  passport.use(new GitHubStrategy({
      clientID: githubClientId,
      clientSecret: githubClientSecret,
      callbackURL: config.serviceUrl + '/auth/github/callback',
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
      origin: config.dashboardUrl
    });
  });
}

app.post('/add/:user/:repo', cors(corsOptions), function (req, res) {
  if (githubToken) {
    github.authenticate({
      type: 'token',
      token: githubToken
    });
  } else {
    try {
      github.authenticate({
        type: 'oauth',
        token: req.headers.authorization.split(' ')[1]
      });
    } catch (err) {
      res.sendStatus(401);
      return;
    }
  }

  var errorCode = null,
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
