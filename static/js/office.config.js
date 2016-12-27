/**
 * Created by Afro on 12/17/2016.
 */
(function () {
    'use strict';

    var office = angular.module('naijalogosOffice').run(['$http', function ($http) {
        $http.defaults.xsrfHeaderName = 'X-CSRFToken';
        $http.defaults.xsrfCookieName = 'csrftoken'
    }]);

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
            .otherwise('/')
    }])
})();
