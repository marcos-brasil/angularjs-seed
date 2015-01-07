'use strict';

import * as fs from 'fs';

import { angular } from 'globals';
import { headerBar, navBar, mainContent, menu, rootApp} from './components';

console.log(fs.readFileSync('./LICENSE', 'utf8'));

export var APP = angular.module('app.init', ['ngRoute'])
  .directive('headerBar', headerBar)
  .directive('navBar', navBar)
  .directive('mainContent', mainContent)
  .directive('menu', menu)
  .directive('rootApp', rootApp);
