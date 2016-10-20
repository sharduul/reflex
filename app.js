(function(){
    'use strict';

    angular
        .module('notif-app', ['ui.router', 'ngResource', 'notifications-controllers', 'notifications-directives', 'notifications-services'])
        .config(Config)
        .run(Run);

    Config.$inject = ['$stateProvider', '$urlRouterProvider', '$httpProvider'];
    Run.$inject = ['$rootScope'];

    function Run($rootScope){

        // this event is fired whenever there is change of route state
        $rootScope.$on('$stateChangeStart',  function(e, stateData) {

        });
    }

    function Config($stateProvider, $urlRouterProvider){

        $stateProvider
            .state('notificationsCenter', {
                url: "/notificationsCenter",
                templateUrl: "templates/notificationsCenter.html"
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/');
    }

})();