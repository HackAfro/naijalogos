/**
 * Created by Afro on 12/17/2016.
 */

(function () {
    'use strict'

    var office = angular.module('naijalogosOffice', ['ngRoute', 'LocalForageModule']);

    office.controller('officeCtrl', ['$http', '$scope', '$cookies', function ($http, $scope, $cookies) {
        $scope.data = [];

        $scope.add = function () {

        };

        $http.get('/office/vendors').then(function (response) {
            $scope.data = response.data;
        })



    }])
})();
