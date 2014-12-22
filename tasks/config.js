'use strict'

var path = require('path')
var fs = require('fs')
var assign = require('object-assign')

var DEV = './dev'
var BUILD = './build'
var PUBLIC = './public'
var SRC = './src'

var CFG = {}
CFG.throw = console.error.bind(console)

CFG.dev = DEV
CFG.src = SRC
CFG.build = BUILD
CFG.public = PUBLIC

CFG.cssBrowserPrefix = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
]

CFG.browserSync = {
  server: {
    baseDir: [
      CFG.build,
      CFG.dev,
      CFG.public,
      CFG.src,
    ],
    middleware: [
      function (req, res, next) {
        // TODO: explain the reason for this middleware

        if ('GET' !== req.method && 'HEAD' !== req.method ) {
          return next()
        }

        var base = path.basename(req.url)
        var dir = path.dirname(req.url)

        if ('/tests/tests' === dir) {
          req.url = path.join('/tests', base)
        }

        if ('mocha.css' === base) {
          res.setHeader('Content-Type', 'text/css; charset=utf-8')
          res.end(fs.readFileSync('./node_modules/mocha/mocha.css', 'utf8'))
        }

        if ('mocha.js' === base) {
          res.setHeader('Content-Type', 'application/javascript; charset=utf-8')
          res.end(fs.readFileSync('./node_modules/mocha/mocha.js', 'utf8'))
        }

        if ('chai.js' === base) {
          res.setHeader('Content-Type', 'application/javascript; charset=utf-8')
          res.end(fs.readFileSync('./node_modules/chai/chai.js', 'utf8'))
        }

        if ('sinon-chai.js' === base) {
          res.setHeader('Content-Type', 'application/javascript; charset=utf-8')
          res.end(fs.readFileSync('./node_modules/sinon-chai/lib/sinon-chai.js', 'utf8'))
        }

        if ('sinon.js' === base) {
          res.setHeader('Content-Type', 'application/javascript; charset=utf-8')
          res.end(fs.readFileSync('./node_modules/sinon/pkg/sinon.js', 'utf8'))
        }

        next()
      },
    ],
  },
  logFileChanges: true,
  // reloadDelay: 5000,
  ghostMode: false,
  notify: false,
  port: 3000,
  browser: 'skip',
  // browser: 'chrome',

  // forces full page reload on css changes.
  injectChanges: false,

  // Run as an https by uncommenting 'https: true'
  // Note: this uses an unsigned certificate which on first access
  //       will present a certificate warning in the browser.
  // https: true,

}

module.exports = assign(CFG, {
  tasks: {
    src: [
      'gulpfile.js',
      'tasks/**/*.js',
    ],
  },
  es6: {
    src: [CFG.src +'/**/*.{js,jsx,es6,ajs}'],
    commonjs: {
      dest: './commonjs'
    },
    browserify: {
      // standalone: 'APP',
      entries: [
        CFG.src +'/index.js',
        CFG.src +'/scripts/init.js',
        CFG.src +'/tests/index.js',
      ],
      sourcemaps: true,
      dest: CFG.dev,
      aliases: {},
    },
  },
  sass: {
    src: [CFG.src +'/**/*.{sass,scss}'],
    opt: { precision: 10,},
  },
  less: {
    src: [CFG.src +'/**/*.less'],
    opt: {
      compress: false,
    },
  },
  jade: {
    src: [
      CFG.src +'/**/*.jade',
      '!'+ CFG.src +'/partials/**/*',
    ],
    opt: {pretty: true,},
  },
  html: {
    src: [
      CFG.src +'/**/*.html',
      CFG.public +'/**/*.html',
      CFG.dev +'/**/*.html',
    ],
  },
  css: {
    src: [
      CFG.src +'/**/*.css',
      CFG.public +'/**/*.css',
      CFG.dev +'/**/*.css',
    ],
  },
  js: {
    src: [
      CFG.src +'/**/*.js',
      CFG.public +'/**/*.js',
      CFG.dev +'/**/*.js',
    ],
  },
  copy: {
    src: [
      CFG.src +'/**/*.{ttf,eot,woff,woff2}',
      CFG.public +'/**/*',
    ],
  },
  images: {
    src: [
      CFG.src +'/**/*.{svg,ttf,eot,woff,woff2,png,jpg,jpeg}',
     ],
    opt: {
      progressive: true,
      interlaced: true,
    },
  },
  useref:{searchPath: '{'+ CFG.dev +','+ CFG.src +'}'},
  uglify: {
  },
  uncss: {
    html: [
      CFG.src +'/**/*.html',
      CFG.dev +'/**/*.html',
      CFG.public +'/**/*.html',
    ],
    // CSS Selectors for UnCSS to ignore
    ignore: [
      /.navdrawer-container.open/,
      /.app-bar.open/
    ]
  },
})
