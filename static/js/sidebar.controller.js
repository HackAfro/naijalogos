(function () {
    'use strict';

    var office = angular.module('naijalogosOffice');

    office.controller('sideBarCtrl', ['$scope', '$localForage', '$timeout', '$location', function ($scope, $localForage, $timeout, $location) {

        function get() {
            $localForage.getItem('user').then(function (data) {
                $scope.user = data
            })

            $timeout(get, 5000)
        }

        $timeout(get, 5000)

        $scope.page = 0


        $scope.activePage = function (page) {
            return $scope.page === page
        }

        $scope.imprests = function (page) {
            $scope.page = page
            $location.url('/imprests')
            $('.ui.left.sidebar').sidebar('hide')
        }

        $scope.vendors = function (page) {
            $scope.page = page
            $location.url('/vendorforms')
            $('.ui.left.sidebar').sidebar('hide')
        }

        $scope.billboards = function (page) {
            $scope.page = page
            $location.url('/vendorforms')
            $('.ui.left.sidebar').sidebar('hide')
        }

        $scope.accounts = function (page) {
            $scope.page = page
            $location.url('/account')
            $('.ui.left.sidebar').sidebar('hide')
        }

        $scope.jobs = function (page) {
            $scope.page = page
            $location.url('/jobs')
            $('.ui.left.sidebar').sidebar('hide')
        }

    }])
})()