'use strict'

var path = require('path')
var exec = require('child_process').exec
var fs = require('fs')

var gulp = require('gulp')
var gutil = require('gulp-util')
var $ = require('gulp-load-plugins')()

var del = require('del')
var runSequence = require('run-sequence')
var thr = require('through2').obj
var thrBuf = require('through2')
var assign = require('object-assign')


var browserify =  require('browserify')
var to5Browserify = require('6to5ify')
var aliasify = require('aliasify')
var brfs = require('brfs')
var vinylify = require('vinyl-source-stream2')

var collapser = require('bundle-collapser/plugin')

function _browserify (opt, next) {

  opt.standalone = opt.standalone || void 0
  opt.sourcemaps = opt.sourcemaps || true
  opt.aliases = opt.aliases || {}
  opt.entry = opt.entry || './index.js'
  opt.dest = opt.dest || '.'
  opt.title = path.relative(process.cwd(), opt.entry)
  opt.extensions = opt.extensions || ['.js', '.jsx', 'es6']

  // TODO: explain this
  var _dest = path.dirname(path.join(opt.dest, opt.title.replace(/^[^/]*\//,'') ))

  return browserify({
      debug: opt.sourcemaps,
      extensions: opt.extensions,
      standalone: opt.standalone,
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
    .plugin(collapser)
    .bundle()
    .on('error', next)
    .pipe(vinylify(opt.entry))
    .pipe($.derequire())
    .pipe($.rename(function (p){ p.extname = '.js'}))
    .pipe($.sourcemaps.init({loadMaps: opt.sourcemaps}))
    .pipe($.sourcemaps.write('./maps'))
    .pipe(gulp.dest(_dest))
    .pipe($.size({title: 'js: '+ opt.title}))
    // .pipe($.gzip())
    // .pipe($.size({title: 'gz: '+ opt.title}))
    // .pipe(gulp.dest(opt.dest +'/gzip'))
    .pipe(thr(function (vfs){ next(null, vfs) }))
}


module.exports.transpiler = transpiler
function transpiler (cfg) {
  var cfg = assign({}, cfg)

  return thr(function _transpiler (vfs, enc, next){
      cfg.entry = vfs.path

      _browserify(cfg, function (err, _vfs) {
        if (err) console.error(err)
        next(null, _vfs)
      })
    })
}
