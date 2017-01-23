(function () {
	'use strict';

	var office = angular.module('naijalogosOffice');

	office.controller('balanceCtrl', ['$scope','$http','$localForage','$location', function($scope,$http,$localForage,$location){
		
		function get() {
			var url = '/office/balance/'

			if ('caches' in window) {
				caches.match(url).then(function (response) {
					if (response) {
						response.json().then(function (json) {
							if (networkPending) {
								$scope.balance = json
								console.log(json)
							}
						})
					}
				})
			}

			var networkPending = true
			$http.get(url).then(function (data) {
				$scope.balance = data.data[0]
				networkPending = false
			})
		}

		get()

		function getCredit() {
			var url = '/office/credits/'

			if ('caches' in window) {
				caches.match(url).then(function (response) {
					if (response) {
						response.json().then(function (json) {
							if (networkPending) {
								$scope.credits = json
							}
						})
					}
				})
			}

			var networkPending = true
			$http.get(url).then(function (data) {
				var credits = data.data

				$scope.credits = credits.reverse()
				networkPending = false
			})
		}

		getCredit()

		$scope.detail = {}

		$scope.create = function () {
			$scope.loading = true

			$http.post('/office/credits/', $scope.detail).then(function (data) {
				$scope.balance.balance = $scope.balance.balance + data.data.amount
				$http.put('/office/balance/1/',$scope.balance).then(function (data) {
					$scope.balance = data.data
				})
				$scope.credits.unshift(data.data)
				$scope.loading = false
				$scope.detail = {}
			})
		}

		activate()
        function activate() {
            $localForage.getItem('user').then(function (data) {
                if (!data) {
                    $location.url('/login')
                }
            })
        }
	}])
	
})();