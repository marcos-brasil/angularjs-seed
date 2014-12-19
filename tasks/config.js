'use strict'

var path = require('path')
var fs = require('fs')
var assign = require('object-assign')

var PATH_OFFSET = path.relative(__dirname, process.cwd())
PATH_OFFSET = PATH_OFFSET.replace(/^\.\./, '.')

var TMP = './tmp'
var BUILD = './build'
var PUBLIC = './public'
var SRC = './src'

var CFG = {}
CFG.throw = console.error.bind(console)

CFG.tmp = path.join(PATH_OFFSET, TMP)
CFG.src = path.join(PATH_OFFSET, SRC)
CFG.build = path.join(PATH_OFFSET, BUILD)
CFG.public = path.join(PATH_OFFSET, PUBLIC)

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
      path.join(PATH_OFFSET, CFG.build),
      path.join(PATH_OFFSET, CFG.tmp),
      path.join(PATH_OFFSET, CFG.public),
      path.join(PATH_OFFSET, CFG.src),
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
    src: [path.join(PATH_OFFSET, './src/**/*.{js,jsx,es6,ajs}')],
    commonjs: {},
    browserify: {
      // standalone: 'APP_NAMESPACE',
      entry: './' + path.join(PATH_OFFSET, './src/scripts/main.js'),
      basename: 'app-closure',
      sourcemaps: true,
      dest: CFG.tmp,
      aliases: {},
    },
  },
  sass: {
    src: [path.join(PATH_OFFSET, './src/**/*.{sass,scss}')],
    opt: { precision: 10,},
  },
  less: {
    src: [path.join(PATH_OFFSET, './src/**/*.less')],
    opt: {
      compress: false,
      // paths: [path.join(CFG.PATH_OFFSET, './node_modules/bootstrap/less')],
    },
  },
  jade: {
    src: [path.join(PATH_OFFSET, './src/**/*.jade')],
    opt: {pretty: true,},
  },
  html: {
    src: [path.join(PATH_OFFSET, './src/**/*.html', './public/**/*.html')],
  },
  css: {
    src: [path.join(PATH_OFFSET, './src/**/*.css', './public/**/*.css')],
  },
  copy: {
    src: [
      path.join(PATH_OFFSET, './src/**/*.{ttf,eot,woff,woff2}'),
    ],
  },
  images: {
    src: [
      path.join(PATH_OFFSET, './src/**/*.{svg,ttf,eot,woff,woff2,png,jpg,jpeg}'),
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

// console.log(CFG)

