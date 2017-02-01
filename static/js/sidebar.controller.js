(function () {
	'use strict';

	var office = angular.module('naijalogosOffice');

	office.controller('sideBarCtrl', ['$scope','$localForage','$timeout', function($scope,$localForage,$timeout){

		
        function get() {
            $localForage.getItem('user').then(function (data) {
                $scope.user = data
            })

            $timeout(get,5000)
        }
        
	    $timeout(get,5000)
        
		$scope.page = 0

        $scope.selectPage = function (page) {
            $scope.page = page
        }

        $scope.activePage = function (page) {
            return $scope.page === page
        }

	}])
})()