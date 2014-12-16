'use strict'

var path = require('path')
var fs = require('fs')

var PATH_OFFSET = ''
var CFG = {}

if (process.env.ORI_PATH) {
  PATH_OFFSET = path.relative(process.cwd(), fs.realpathSync(process.env.ORI_PATH))
  CFG = require('../'+ PATH_OFFSET +'/config.js')
}

CFG.throw = console.error.bind(console)
CFG.dest = './tmp'
CFG.build = './build'

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

CFG.files = {
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
      entry: './src/scripts/main.js',
      basename: 'app-closure',
      sourcemaps: true,
      dest: CFG.dest,
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
  images: {
    src: [
      './src/**/*.{svg,ttf,eot,woff,woff2,png,jpg,jpeg}',
      '!./src/**/hamburger.svg', // buggy image
     ],
    opt: {
      progressive: true,
      interlaced: true,
    },
  },
}

CFG.browserSync = {
  server: {
    baseDir: [
      path.join(PATH_OFFSET, CFG.build),
      path.join(PATH_OFFSET, CFG.dest),
      path.join(PATH_OFFSET, './public'),
      path.join(PATH_OFFSET, './src'),
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

module.exports = CFG
