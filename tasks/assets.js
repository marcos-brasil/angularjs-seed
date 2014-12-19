'use strict'

var path = require('path')
var fs = require('fs')

var gulp = require('gulp')
var $ = require('gulp-load-plugins')()
var runSequence = require('run-sequence')
var thr = require('through2').obj
var readdir = require('recursive-readdir')
var collapse = require('bundle-collapser')

var compileJs = require('./utils').compileJs
var CFG = require('./config');

// TODO: add comments
gulp.task('assets', function(next){
  runSequence(['jade', 'less', 'sass', 'commonjs', 'browserify'], 'collapse', next)
})

// TODO: add comments
gulp.task('jade', function(){
  return gulp.src(CFG.jade.src)
    .pipe($.cached('jade', {optimizeMemory: true}))
    .pipe($.jade(CFG.jade.opt))
    .on('error', CFG.throw)
    .pipe(gulp.dest(CFG.tmp))
    .pipe($.size({title: 'jade'}))
    .pipe($.gzip())
    .pipe($.size({title: 'gz: jade'}))
    .pipe(gulp.dest(CFG.tmp +'/gzip'))
});

// TODO: add comments
gulp.task('less', function(){
  return gulp.src(CFG.less.src)
    .pipe($.sourcemaps.init())
    .pipe($.less(CFG.less.opt))
    .on('error', CFG.throw)
    // .pipe($.autoprefixer(CFG.cssBrowserPrefix))
    .pipe($.sourcemaps.write('./maps'))
    .pipe(gulp.dest(CFG.tmp))
    .pipe($.size({title: 'css: less'}))
    .pipe($.gzip())
    .pipe($.size({title: 'gz: less'}))
    .pipe(gulp.dest(CFG.tmp +'/gzip'))
});

gulp.task('sass', function () {
  return gulp.src(CFG.sass.src)
      .pipe($.sourcemaps.init({loadMaps: true}))
      .pipe($.sass(CFG.sass.opt))
      .on('error', CFG.throw)
      // .pipe($.autoprefixer(CFG.cssBrowserPrefix))
      .pipe($.sourcemaps.write('./maps'))
      .pipe(gulp.dest(CFG.tmp))
      .pipe($.size({title: 'css: sass'}))
      .pipe($.gzip())
      .pipe($.size({title: 'gz: sass'}))
      .pipe(gulp.dest(CFG.tmp +'/gzip'))
});

// Compile ES6 -> ES5
gulp.task('commonjs', function (next) {
  return gulp.src(CFG.js.src)
    .pipe($.cached('compile', {optimizeMemory: true}))
    .pipe($.sourcemaps.init({loadMaps: true}))
    .pipe($['6to5'](CFG.js.commonjs)).on('error', next)
    .on('error', CFG.throw)
    .pipe($.sourcemaps.write('./maps'))
    .pipe(gulp.dest(CFG.tmp))
    .pipe($.size({title: 'commonjs'}))
    .pipe($.gzip())
    .pipe($.size({title: 'gz: commonjs'}))
    .pipe(gulp.dest(CFG.tmp +'/gzip'))
})

// TODO: explain this
gulp.task('collapse', function(next){
  var re = /\.js$/
  var re2 = /-collapsed\.js$/

  readdir(CFG.tmp, function (err, files) {
    if (!files) {return next()}

    files.filter(function(f){
      if (f.match(re2)) {
        return false
      }
      return f.match(re)
    }).map(function (f) {
      var stream = fs.createWriteStream(f.replace(re,'-collapsed.js'));

      try {
        collapse(fs.readFileSync(f)).pipe(stream)
      }
      catch(e){}
    })
    next()
  })
})


// TODO: add comments
gulp.task('browserify', function (next) {
  return gulp.src(CFG.js.browserify.entry)
    .pipe(compileJs(CFG.js.browserify))
})
