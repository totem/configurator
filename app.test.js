'use strict';

var request = require('nodeunit-express'),
    app = require('./app.sandboxed');

module.exports = {
  createHooks: function (test) {
    var express = request(app);
    express
      .set('Authorization', 'Bearer XXXXXX')
      .post('/user/repo')
      .expect(function (response) {
        test.equal(response.statusCode, 201);
        test.done();
        express.close();
      });
  }
};
