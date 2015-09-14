'use strict';

var express = require('express'),
    GitHubStrategy = require('passport-github').Strategy,
    passport = require('passport'),
    router = express.Router();

function start (config) {
  if (config.github.clientId && config.github.clientSecret) {
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

    router.get('/github', passport.authenticate('github'));

    router.get('/github/callback', passport.authenticate('github'), function (req, res) {
      res.render('index', {
        token: req.user.token,
        origin: config.services.dashboard.href.value
      });
    });
  }
}

module.exports = {
  router: router,
  start: start
};
