'use strict'

var path = require('path')
var fs = require('fs')

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');

var log = $.util.log
var red = $.util.colors.red
var cyan = $.util.colors.cyan

var CFG = require('./config');

function runTasks () {
  var args = [].slice.call(arguments)
  return function (evt) {
    if ('changed' !== evt.type) { return }
    // bug on runSequece.
    // this JSON trick is cleanest way to deep copy a simple, non-circular array.
    runSequence.apply(runSequence, JSON.parse(JSON.stringify(args)))
  }
}

function assets () {
  log("Starting '"+ cyan('watch:assets') +"'...")

  gulp.watch(CFG.files.js.src, runTasks(['commonjs', 'browserify'], 'reload'))
  gulp.watch(CFG.files.less.src, runTasks('less', 'reload'))
  gulp.watch(CFG.files.sass.src, runTasks('sass', 'reload'))
  gulp.watch(CFG.files.jade.src, runTasks('jade', 'reload'))
}

function gulpfile () {
  log("Starting '"+ cyan('watch:gulpfile') +"'...")
  gulp.watch(CFG.files.tasks.src, runTasks('restart'))
}

module.exports = {
  assets: assets,
  gulpfile: gulpfile,
}
