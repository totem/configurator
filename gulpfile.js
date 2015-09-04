'use strict';

var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    nodeunit = require('gulp-nodeunit'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish');

gulp.task('lint', function () {
  gulp.src(['./**/*.js', '!node_modules/**/*.js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter(stylish));
});

gulp.task('unit', function () {
  gulp.src(['**/*.test.js', '!node_modules/**/*.test.js'])
    .pipe(nodeunit({
      reporter: 'default',
      reporterOptions: {
        output: 'test'
      }
    }));
});

gulp.task('test', ['lint', 'unit']);

gulp.task('default', function () {
  nodemon({script: 'bin/www'})
    .on('change', ['lint']);
});
