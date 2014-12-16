'use strict'

var path = require('path')

var gulp = require('gulp')
var $ = require('gulp-load-plugins')()
var runSequence = require('run-sequence')
var thr = require('through2').obj

var compileJs = require('./utils').compileJs
var CFG = require('./config');



// TODO: add comments
gulp.task('assets', function(next){
  runSequence(['jade', 'less', 'sass', 'commonjs', 'browserify'], next)
})

// TODO: add comments
gulp.task('jade', function(){
  return gulp.src(CFG.files.jade.src)
    .pipe($.cached('jade', {optimizeMemory: true}))
    .pipe($.jade(CFG.files.jade.opt))
    .on('error', CFG.throw)
    .pipe(gulp.dest(CFG.dest))
    .pipe($.size({title: 'jade'}))
    .pipe($.gzip())
    .pipe($.size({title: 'gz: jade'}))
    .pipe(gulp.dest(CFG.dest +'/gzip'))
});

// TODO: add comments
gulp.task('less', function(){
  return gulp.src(CFG.files.less.src)
    .pipe($.sourcemaps.init())
    .pipe($.less(CFG.files.less.opt))
    .on('error', CFG.throw)
    // .pipe($.autoprefixer(CFG.cssBrowserPrefix))
    .pipe($.sourcemaps.write('./maps'))
    .pipe(gulp.dest(CFG.dest))
    .pipe($.size({title: 'css: less'}))
    .pipe($.gzip())
    .pipe($.size({title: 'gz: less'}))
    .pipe(gulp.dest(CFG.dest +'/gzip'))
});

gulp.task('sass', function () {
  return gulp.src(CFG.files.sass.src)
      .pipe($.sourcemaps.init({loadMaps: true}))
      .pipe($.sass(CFG.files.sass.opt))
      .on('error', CFG.throw)
      // .pipe($.autoprefixer(CFG.cssBrowserPrefix))
      .pipe($.sourcemaps.write('./maps'))
      .pipe(gulp.dest(CFG.dest))
      .pipe($.size({title: 'css: sass'}))
      .pipe($.gzip())
      .pipe($.size({title: 'gz: sass'}))
      .pipe(gulp.dest(CFG.dest +'/gzip'))
});

// Compile ES6 -> ES5
gulp.task('commonjs', function (next) {
  return gulp.src(CFG.files.js.src)
    .pipe($.cached('compile', {optimizeMemory: true}))
    .pipe($.sourcemaps.init({loadMaps: true}))
    .pipe($['6to5'](CFG.files.js.commonjs)).on('error', next)
    .on('error', CFG.throw)
    .pipe($.sourcemaps.write('./maps'))
    .pipe(gulp.dest(CFG.dest))
    .pipe($.size({title: 'commonjs'}))
    .pipe($.gzip())
    .pipe($.size({title: 'gz: commonjs'}))
    .pipe(gulp.dest(CFG.dest +'/gzip'))
})

// TODO: add comments
gulp.task('browserify', function (next) {
  return gulp.src(CFG.files.js.browserify.entry)
    .pipe(compileJs(CFG))
})
