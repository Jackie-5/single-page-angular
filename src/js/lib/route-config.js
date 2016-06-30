// 配置路由机制
export default ($stateProvider,$urlRouterProvider,$locationProvider,$compileProvider)=> {
    // 重新配置javascript:void(0)
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/);
    const stateConfig = (url, template)=> {
        return {
            url: url,
            templateUrl: template
        }
    };
    $urlRouterProvider.otherwise("/index");

    $stateProvider
        .state('/index', stateConfig('/index', './route-tpl/controllers/index/container.html'))

        .state('/kpi', stateConfig('/kpi', './route-tpl/controllers/kpi/cash.html'));
//    http://s1.51ping.com/mod/kepler-pc-cortex/0.2.0-beta/build

}
