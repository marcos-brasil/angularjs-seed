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

  gulp.watch(CFG.es6.src, runTasks('browserify', 'reload'))
  gulp.watch(CFG.less.src, runTasks('less', 'reload'))
  gulp.watch(CFG.sass.src, runTasks('sass', 'reload'))
  gulp.watch(CFG.jade.src, runTasks('jade', 'reload'))
}

function optmize () {
  log("Starting '"+ cyan('watch:optmize') +"'...")

  gulp.watch(CFG.es6.src, runTasks(['browserify', 'jshint'], 'html', 'reload'))
  gulp.watch(CFG.less.src, runTasks('less', 'styles', 'html','reload'))
  gulp.watch(CFG.sass.src, runTasks('sass', 'styles', 'html', 'reload'))
  gulp.watch(CFG.jade.src, runTasks('jade', 'html', 'reload'))
  gulp.watch(CFG.copy.src, runTasks('copy', 'html', 'reload'))
  gulp.watch(CFG.images.src, runTasks('images', 'html', 'reload'))

}

function gulpfile () {
  log("Starting '"+ cyan('watch:gulpfile') +"'...")
  gulp.watch(CFG.tasks.src, runTasks('restart'))
}

module.exports = {
  assets: assets,
  optmize: optmize,
  gulpfile: gulpfile,
}
