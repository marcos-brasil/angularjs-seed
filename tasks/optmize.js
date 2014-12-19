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
gulp.task('images', function () {
  return gulp.src(CFG.images.src)
    .pipe($.cached('images', {optimizeMemory: true}))
    .pipe($.imagemin(CFG.images.opt))
    .pipe(gulp.dest(CFG.build))
    .pipe($.size({title: 'images'}));
});

// Copy Web Fonts To Dist
gulp.task('copy', function () {
  return gulp.src(CFG.copy.src)
    .pipe(gulp.dest(CFG.build))
    .pipe($.size({title: 'copy'}));
});

gulp.task('styles', function () {
  var src = [].slice.call(CFG.css.src)
  src.push(CFG.tmp + '/**/*.css')
  // For best performance, don't add Sass partials to `gulp.src`
  return gulp.src(src)
    .pipe($.autoprefixer({browsers: CFG.cssBrowserPrefix}))
    // Concatenate And Minify Styles
    .pipe($.if('*.css', $.csso()))
    .pipe(gulp.dest(CFG.build))
    .pipe($.size({title: 'styles'}));
});

gulp.task('html', function () {
  var assets = $.useref.assets(CFG.useref)
  var src = [].slice.call(CFG.html.src)
  src.push(CFG.tmp + '/**/*.html')

  return gulp.src(src)
    .pipe(assets)
    // Concatenate And Minify JavaScript
    .pipe($.if('*.js', $.uglify(CFG.uglify)))
    // Remove Any Unused CSS
    // Note: If not using the Style Guide, you can delete it from
    // the next line to only include styles your project uses.
    .pipe($.if('*.css', $.uncss(CFG.uncss)))
    .pipe(assets.restore())
    .pipe($.useref())
    // Minify Any HTML
    .pipe($.if('*.html', $.minifyHtml()))
    // Output Files
    .pipe(gulp.dest(CFG.build))
    .pipe($.size({title: 'html'}));
});
