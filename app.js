'use strict';

var express = require('express'),
    passport = require('passport'),
    path = require('path'),
    cors = require('cors'),
    auth = require('./routes/auth'),
    add = require('./routes/add'),
    app = express();

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(cors());
app.use(passport.initialize());

// Routes
app.use('/add', add);
app.use('/auth', auth);

module.exports = app;
