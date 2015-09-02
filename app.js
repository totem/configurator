var express = require('express'),
    GitHubApi = require('github'),
    app = express();

var github = new GitHubApi({
  version: '3.0.0'
});

app.post('/:user/:repo', function (req, res) {
  github.authenticate({
    type: 'oauth',
    token: req.headers.authorization.split(' ')[1]
  });

  github.repos.createHook({
    user: req.params.user,
    repo: req.params.repo,
    name: 'web',
    config: {
      url: 'http://testing.hooks/hook',
      content_type: 'json'
    },
    events: ['push', 'pull_request']
  }, function (err, data) {
    if (err) {
      res.status(err.code).json(JSON.parse(err.message));
    }

    res.status(201).json(data);
  })
});

module.exports = app;
