'use strict'

var path = require('path')
var fs = require('fs')

var gulp = require('gulp')
var $ = require('gulp-load-plugins')()
var runSequence = require('run-sequence')
var thr = require('through2').obj

var transpiler = require('./utils').transpiler
var collapser = require('./utils').collapser

var CFG = require('./config');

// TODO: add comments
gulp.task('assets', function(next){
  // runSequence(['jade', 'less', 'sass', 'commonjs', 'browserify'], 'collapse', next)
  runSequence(['jade', 'less', 'sass', 'browserify'], next)
})

// TODO: add comments
gulp.task('jade', function(next){
  return gulp.src(CFG.jade.src)
    .pipe($.cached('jade', {optimizeMemory: true}))
    .pipe($.jade(CFG.jade.opt))
    .on('error', next)
    .pipe(gulp.dest(CFG.tmp))
    .pipe($.size({title: 'jade'}))
    // .pipe($.gzip())
    // .pipe($.size({title: 'gz: jade'}))
    // .pipe(gulp.dest(CFG.tmp +'/gzip'))
});

// TODO: add comments
gulp.task('less', function(next){
  return gulp.src(CFG.less.src)
    .pipe($.sourcemaps.init())
    .pipe($.less(CFG.less.opt))
    .on('error', next)
    .pipe($.sourcemaps.write('./maps'))
    .pipe(gulp.dest(CFG.tmp))
    .pipe($.size({title: 'css: less'}))
    // .pipe($.gzip())
    // .pipe($.size({title: 'gz: less'}))
    // .pipe(gulp.dest(CFG.tmp +'/gzip'))
});

gulp.task('sass', function (next) {
  return gulp.src(CFG.sass.src)
      .pipe($.sourcemaps.init({loadMaps: true}))
      .pipe($.sass(CFG.sass.opt))
      .on('error', next)
      .pipe($.sourcemaps.write('./maps'))
      .pipe(gulp.dest(CFG.tmp))
      .pipe($.size({title: 'css: sass'}))
      // .pipe($.gzip())
      // .pipe($.size({title: 'gz: sass'}))
      // .pipe(gulp.dest(CFG.tmp +'/gzip'))
});

// Compile ES6 -> ES5
gulp.task('commonjs', function (next) {
  return gulp.src(CFG.es6.src)
    .pipe($.cached('compile', {optimizeMemory: true}))
    .pipe($.sourcemaps.init({loadMaps: true}))
    .pipe($['6to5'](CFG.es6.commonjs)).on('error', next)
    .on('error', next)
    .pipe($.sourcemaps.write('./maps'))
    .pipe(gulp.dest(CFG.tmp))
    .pipe($.size({title: 'commonjs'}))
    // .pipe($.gzip())
    // .pipe($.size({title: 'gz: commonjs'}))
    // .pipe(gulp.dest(CFG.tmp +'/gzip'))
})

// TODO: explain this
// this is hack, it would be better if it was a browserify transform
// gulp.task('collapse', collapser(CFG))

// TODO: add comments
gulp.task('browserify', function (next) {
  return gulp.src(CFG.es6.browserify.entries)
    .pipe(transpiler(CFG.es6.browserify))
    .on('error', next)
})
