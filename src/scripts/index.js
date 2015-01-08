'use strict';

import * as fs from 'fs';
import { angular} from 'globals';
import * as components from './components';
import { routerConfig } from './routes';

console.log(fs.readFileSync('./LICENSE', 'utf8'));

export var APP = angular.module('app', ['ui.router']);

APP.config(routerConfig);

for (let item in components) {
  APP.directive(item, components[item]);
}
