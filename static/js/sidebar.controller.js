(function () {
	'use strict';

	var office = angular.module('naijalogosOffice');

	office.controller('sideBarCtrl', ['$scope','$localForage', function($scope,$localForage){

		$localForage.getItem('user').then(function (data) {
            $scope.user = data
        })
		
		$scope.page = 0

        $scope.selectPage = function (page) {
            $scope.page = page
        }

        $scope.activePage = function (page) {
            return $scope.page === page
        }

	}])
})()