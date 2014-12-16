'use strict'

var path = require('path')

var gulp = require('gulp')
var $ = require('gulp-load-plugins')()
var del = require('del')
var runSequence = require('run-sequence')
var thr = require('through2').obj

var compileJs = require('./utils').compileJs
var CFG = require('./config');

var log = $.util.log
var red = $.util.colors.red
var cyan = $.util.colors.cyan
var mag = $.util.colors.magenta

// Optimize Images
gulp.task('images', function () {
  return gulp.src(CFG.files.images.src)
    .pipe($.cached('images', {optimizeMemory: true}))
    .pipe($.imagemin(CFG.files.images.opt))
    .pipe(gulp.dest(CFG.dest))
    .pipe($.size({title: 'images'}));
});
