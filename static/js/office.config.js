/**
 * Created by Afro on 12/17/2016.
 */
(function () {
    'use strict';

    var office = angular.module('naijalogosOffice').run(['$http', function ($http) {
        $http.defaults.xsrfHeaderName = 'X-CSRFToken';
        $http.defaults.xsrfCookieName = 'csrftoken'
    }]);
    
    office.config(['PusherServiceProvider',
        function(PusherServiceProvider){
            PusherServiceProvider
            .setToken("6cfd92c53d2b858e9196")
            .setOptions({});
        }              
    ]);

    office.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/login',{
                templateUrl: '/static/html/login.html'
            })
            .when('/',{
                templateUrl: '/static/html/home.html'
            })
            .when('/notifications',{
                templateUrl: '/static/html/notifications.html'
            })
            .when('/profile',{
                templateUrl: '/static/html/profile.html'
            })
            .when('/imprests',{
                templateUrl: '/static/html/imprests.html',
            })
            .otherwise('/')
    }])
})();
