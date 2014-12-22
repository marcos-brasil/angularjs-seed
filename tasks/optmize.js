'use strict'

var gulp = require('gulp')
var $ = require('gulp-load-plugins')()
var del = require('del')
var runSequence = require('run-sequence')

var thr = require('through2').obj
var CFG = require('./config');

var log = $.util.log
var red = $.util.colors.red
var cyan = $.util.colors.cyan
var mag = $.util.colors.magenta

// Optimize Images
gulp.task('images', function (next) {
  return gulp.src(CFG.images.src)
    .pipe($.cached('images', {optimizeMemory: true}))
    .pipe($.imagemin(CFG.images.opt))
    .on('error', next)
    .pipe(gulp.dest(CFG.build))
    .pipe($.size({title: 'images'}));
});

// Copy Web Fonts To Dist
gulp.task('copy', function (next) {
  return gulp.src(CFG.copy.src)
    .pipe(gulp.dest(CFG.build))
    .pipe($.size({title: 'copy'}));
});

gulp.task('styles', function (next) {
  // var src = [].slice.call(CFG.css.src)
  // src.push(CFG.tmp + '/**/*.css')
  // For best performance, don't add Sass partials to `gulp.src`
  return gulp.src(CFG.css.src)
    .pipe($.autoprefixer({browsers: CFG.cssBrowserPrefix}))
    // Concatenate And Minify Styles
    .on('error', next)
    .pipe($.if('*.css', $.csso()))
    .on('error', next)
    .pipe(gulp.dest(CFG.build))
    .pipe($.size({title: 'styles'}));
});

gulp.task('html', function (next) {
  var assets = $.useref.assets(CFG.useref)
  // var src = [].slice.call(CFG.html.src)
  // src.push(CFG.tmp + '/**/*.html')

  return gulp.src(CFG.html.src)
    .pipe(assets)
    // Concatenate And Minify JavaScript
    .on('error', next)
    .pipe($.if('*.js', $.uglify(CFG.uglify)))
    .on('error', next)
    // Remove Any Unused CSS
    // Note: If not using the Style Guide, you can delete it from
    // the next line to only include styles your project uses.
    .pipe($.if('*.css', $.uncss(CFG.uncss)))
    .on('error', next)
    .pipe(assets.restore())
    .on('error', next)
    .pipe($.useref())
    .on('error', next)
    // Minify Any HTML
    .pipe($.if('*.html', $.minifyHtml()))
    .on('error', next)
    // Output Files
    .pipe(gulp.dest(CFG.build))
    .pipe($.size({title: 'html'}));
});
