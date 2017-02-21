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

        $timeout(get, 5000);

        $scope.page = 0;


        $scope.activePage = function (page) {
            return $scope.page === page
        }

        $scope.view = function (page,url) {
            $scope.page = page
            $location.url(url)
            $('.ui.left.sidebar').sidebar('hide')
        }

    }])
})()