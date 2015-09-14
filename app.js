'use strict';

var express = require('express'),
    passport = require('passport'),
    path = require('path'),
    cors = require('cors'),
    Promise = require('bluebird'),
    configPromises = require('./modules/config'),
    auth = require('./routes/auth'),
    add = require('./routes/add'),
    app = express();

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(cors());
app.use(passport.initialize());

// Routes
app.use('/add', add.router);
app.use('/auth', auth.router);

// Config
Promise.props(configPromises).then(function (config) {
  add.start(config);
  auth.start(config);
});

module.exports = app;
