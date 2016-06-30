/**
 * Created by JackieWu on 16/3/23.
 */
import 'angular';
import 'angular-ui-router';
import 'ocLazyLoad';
import './lib/ui-router-require-polyfill';
import './lib/service/service-config';
import routeConfig from './lib/route-config';
import header from './lib/header/header-controller';
import nav from './lib/nav/nav-controller';

import '../less/main.less';

window.angular.module('demo', ['ui.router', 'angular.service','ui.router.requirePolyfill'])

    .controller('headerController', header).directive("headerContainer", () => {
        return {
            restrict: 'E',
            controller: 'headerController',
            template: require('../route-tpl/header/header.html'),
            transclude: true,
            replace: true
        }
    })
    .controller('navController', nav).directive("navContainer", () => {
        return {
            restrict: 'E',
            controller: 'navController',
            template: require('../route-tpl/nav/nav.html'),
            transclude: true,
            replace: true
        }
    })

    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider','$compileProvider', routeConfig]);

window.angular.bootstrap(document, ['demo']);
