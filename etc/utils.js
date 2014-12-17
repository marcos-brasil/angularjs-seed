'use strict'

var path = require('path')
var exec = require('child_process').exec
var fs = require('fs')

var gulp = require('gulp')
var $ = require('gulp-load-plugins')()
var del = require('del')
var runSequence = require('run-sequence')
var thr = require('through2').obj

var browserify =  require('browserify')
var to5Browserify = require('6to5-browserify')
var aliasify = require('aliasify')
var brfs = require('brfs')
var vinylify = require('vinyl-source-stream2')

var log = $.util.log
var red = $.util.colors.red
var cyan = $.util.colors.cyan
var mag = $.util.colors.magenta

// TODO: make bundles*  DRY.

module.exports.bundleClosure = bundleClosure
function bundleClosure (opt, next) {

  opt.sourcemaps = opt.sourcemaps || true
  opt.aliases = opt.aliases || {}
  opt.entry = opt.entry || './index.js'
  opt.basename = opt.basename || 'index.js'
  opt.dest = opt.dest || '.'
  opt.title = opt.title || opt.basename
  opt.extensions = opt.extensions || ['.js', '.jsx', 'es6']

  return browserify({
      debug: opt.sourcemaps,
      extensions: opt.extensions
    })
    .transform(to5Browserify.configure())
    .on('error', next)
    .transform(aliasify.configure({
      aliases: opt.aliases,
      appliesTo: {includeExtensions: opt.extensions},
    }))
    .on('error', next)
    .transform(brfs)
    .on('error', next)
    .require(opt.entry, {entry: true})
    .bundle()
    .on('error', next)
    .pipe(vinylify(opt.basename))
    .pipe($.rename(function (p){ p.extname = '.js'}))
    .pipe($.sourcemaps.init({loadMaps: opt.sourcemaps}))
    // .pipe($.uglify())
    .pipe($.sourcemaps.write('./maps'))
    .pipe(gulp.dest(opt.dest))
    .pipe($.size({title: 'js: '+ opt.title}))
    .pipe($.gzip())
    .pipe($.size({title: 'gz: '+ opt.title}))
    .pipe(gulp.dest(opt.dest +'/gzip'))
    .pipe(thr(function (vfs){ next(null, vfs) }))
}

module.exports.bundleNamespace = bundleNamespace
function bundleNamespace (opt, next) {

  opt.sourcemaps = opt.sourcemaps || true
  opt.aliases = opt.aliases || {}
  opt.entry = opt.entry || './index.js'
  opt.basename = opt.basename || 'index.js'
  opt.dest = opt.dest || '.'
  opt.title = opt.title || opt.basename
  opt.standalone = opt.standalone || opt.basename.split('.')[0]
  opt.extensions = opt.extensions || ['.js', '.jsx', 'es6']

  return browserify({
      debug: opt.sourcemaps,
      standalone: opt.standalone,
      extensions: opt.extensions,
    })
    .transform(to5Browserify.configure())
    .on('error', next)
    .transform(aliasify.configure({
      aliases: opt.aliases,
      appliesTo: {includeExtensions: opt.extensions},
    }))
    .on('error', next)
    .transform(brfs)
    .require(opt.entry, {entry: true})
    .bundle()
    .on('error', next)
    .pipe(vinylify(opt.basename))
    .pipe($.rename(function (p){ p.extname = '.js'}))
    .pipe($.sourcemaps.init({loadMaps: opt.sourcemaps}))
    // .pipe($.uglify())
    .pipe($.sourcemaps.write('./maps'))
    .pipe(gulp.dest(opt.dest))
    .pipe($.size({title: 'js: '+ opt.title}))
    .pipe($.gzip())
    .pipe($.size({title: 'gz: '+ opt.title}))
    .pipe(gulp.dest(opt.dest +'/gzip'))
    .pipe(thr(function (){ next() }))
}

module.exports.compileJs = compileJs
function compileJs (cfg) {
  return thr(function _compileJs (vfs, enc, next){
      if (cfg.standalone) {
        return bundleNamespace(cfg, function (err, _vfs) {
          if (err) console.error(err)
          next(null, _vfs)
        })
      }

      bundleClosure(cfg, function (err, _vfs) {
        if (err) console.error(err)
        next(null, _vfs)
      })
    })
}

