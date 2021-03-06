'use strict';

var request = require('nodeunit-express'),
    appOAuth = require('../sandbox/app.oauth'),
    appToken = require('../sandbox/app.token');

module.exports = {
  OAuth: {
    'Create hooks': function (test) {
      var express = request(appOAuth);
      express
        .set('Authorization', 'Bearer XXXXXX')
        .post('/add/user/repo')
        .expect(function (response) {
          test.equal(response.statusCode, 201);
          test.ok(JSON.parse(response.body));
          test.done();
          express.close();
        });
    },
    'Attempt to create hooks without Authorization header': function (test) {
      var express = request(appOAuth);
      express
        .post('/add/user/repo')
        .expect(function (response) {
          test.equal(response.statusCode, 401);
          test.done();
          express.close();
        });
    }
  },
  'Personal Access Token': {
    'Create hooks': function (test) {
      var express = request(appToken);
      express
        .post('/add/user/repo')
        .expect(function (response) {
          test.equal(response.statusCode, 201);
          test.ok(JSON.parse(response.body));
          test.done();
          express.close();
        });
    }
  }
};
