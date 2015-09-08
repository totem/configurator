/* jshint camelcase: false */

'use strict';

var MockGitHubApi = function (opts) {
  this.opts = opts;
};

MockGitHubApi.prototype.repos = {};

MockGitHubApi.prototype.repos.createHook = function (opts, callback) {
  var hookId = 'XXXXXXX',
      hookUrl = 'https://api.github.com/repos/' + opts.user + '/' + opts.repo + '/hooks/' + hookId,
      date = new Date().toISOString();

  var response = {
    url: hookUrl,
    test_url: hookUrl + '/test',
    ping_url: hookUrl + '/pings',
    id: hookId,
    name: opts.name,
    active: true,
    events: opts.events,
    config: opts.config,
    last_response: {
      code: null,
      status: 'unused',
      message: null
    },
    update_at: date,
    created_at: date,
    meta: {
      'x-ratelimit-limit': '5000',
      'x-ratelimit-remaining': '4988',
      'x-ratelimit-reset': '1441382325',
      'x-oauth-scopes': 'write:repo_hook',
      location: hookUrl,
      etag: '\"XXXXXXX\"',
      status: '201 Created'
    }
  };

  var error = {
    code: 401,
    message: JSON.stringify({})
  };

  if (this.authenticated) {
    callback(null, response);
  } else {
    callback(error);
  }
};

MockGitHubApi.prototype.authenticate = function (opts) {
  if (opts.token) {
    this.authenticated = true;
  }
};

module.exports = MockGitHubApi;
