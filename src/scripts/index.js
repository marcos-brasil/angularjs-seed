'use strict';

import * as fs from 'fs';
import { angular } from 'globals';
import * as directives from './directives';
import * as services from './services';
import { routerConfig } from './routes';

console.log(fs.readFileSync('./LICENSE', 'utf8'));

export var APP = angular.module('app', ['ui.router']);

for (let item in directives) {
  APP.directive(item, directives[item]);
}

for (let item in services) {
  APP.factory(item, services[item]);
}

APP.config(routerConfig).run(['$state', ($state) => {
  $state.elements = {}
}]);
