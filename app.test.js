'use strict';

var request = require('nodeunit-express'),
    app = require('./app.sandboxed');

module.exports = {
  'Create hooks': function (test) {
    var express = request(app);
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
    var express = request(app);
    express
      .post('/add/user/repo')
      .expect(function (response) {
        test.equal(response.statusCode, 401);
        test.done();
        express.close();
      });
  }
};
