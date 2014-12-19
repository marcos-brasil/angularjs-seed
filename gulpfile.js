'use strict'

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var assign = require('object-assign')

var CFG = require('./tasks/config');

var BS
var SERVE = false


module.exports = function gulpfile (userGulp) {
  assign(userGulp, gulp)
}

// Load custom tasks from the `tasks` directory
try { require('require-dir')('tasks'); } catch (err) { console.error(err) }
