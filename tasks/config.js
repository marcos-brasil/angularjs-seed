'use strict'

var path = require('path')
var fs = require('fs')
var assign = require('object-assign')

var PATH_OFFSET = '.'
var TMP = './tmp'
var BUILD = './build'
var PUBLIC = './public'
var SRC = './src'

var CFG = {}
CFG.throw = console.error.bind(console)

CFG.tmp = TMP
CFG.src = SRC
CFG.build = BUILD
CFG.public = PUBLIC

CFG.PATH_OFFSET = PATH_OFFSET
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
      CFG.tmp,
      CFG.public,
      CFG.src,
    ]
  },
  ghostMode: false,
  notify: false,
  port: 3000,
  browser: 'skip',
  // browser: 'chrome',

  // forces full page reload on css changes.
  // injectChanges: false,

  // Run as an https by uncommenting 'https: true'
  // Note: this uses an unsigned certificate which on first access
  //       will present a certificate warning in the browser.
  // https: true,
}

// if (process.env.ORI_PATH) {
//   PATH_OFFSET = path.relative(process.cwd(), fs.realpathSync(process.env.ORI_PATH))
//   CFG = require('../'+ PATH_OFFSET +'/config.js')
// }

module.exports = assign(CFG, {
  tasks: {
    src: [
      'gulpfile.js',
      'etc/**/*.js',
    ],
  },
  js: {
    src: ['./src/**/*.{js,jsx,es6,ajs}'],
    commonjs: {},
    browserify: {
      // standalone: 'APP_NAMESPACE',
      entry: './' + './src/scripts/main.js',
      basename: 'app-closure',
      sourcemaps: true,
      dest: CFG.tmp,
      aliases: {},
    },
  },
  sass: {
    src: ['./src/**/*.{sass,scss}'],
    opt: { precision: 10,},
  },
  less: {
    src: ['./src/**/*.less'],
    opt: {
      compress: false,
      // paths: [path.join(CFG.PATH_OFFSET, './node_modules/bootstrap/less')],
    },
  },
  jade: {
    src: ['./src/**/*.jade'],
    opt: {pretty: true,},
  },
  html: {
    src: ['./src/**/*.html', './public/**/*.html'],
  },
  css: {
    src: ['./src/**/*.css', './public/**/*.css'],
  },
  copy: {
    src: [
      './src/**/*.{ttf,eot,woff,woff2}',
    ],
  },
  images: {
    src: [
      './src/**/*.{svg,ttf,eot,woff,woff2,png,jpg,jpeg}',
     ],
    opt: {
      progressive: true,
      interlaced: true,
    },
  },
  useref:{searchPath: '{'+ CFG.tmp +','+ CFG.src +'}'},
  uglify: {
    preserveComments: 'some',
  },
  uncss: {
    html: [
      CFG.src +'/**/*.html',
      CFG.tmp +'/**/*.html',
    ],
    // CSS Selectors for UnCSS to ignore
    ignore: [
      /.navdrawer-container.open/,
      /.app-bar.open/
    ]
  },
})


