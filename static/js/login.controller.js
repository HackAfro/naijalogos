/**
 * Created by Afro on 12/17/2016.
 */
(function () {
    'use strict';

    var office = angular.module('naijalogosOffice');

    office.controller('LoginController', ['$http', '$scope', '$location', '$localForage', function ($http, $scope, $location, $localForage) {

        $scope.login = function () {
            $http.post('/auth_api/login/', $scope.user)
                .then(function (data) {
                    $localForage.setItem('user', data.data)

                    $location.url('/')
            },
             function () {
               $scope.login_error = 'Invalid Username/password'
                })
        };
        activate()

        function activate() {
            $localForage.getItem('user').then(function (data) {
                if (data){
                    var active = !!data.id
                    if (active){
                        $location.url('/')
                    }
                }
            })
        }




    }])


})();

