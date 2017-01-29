(function () {
	'use strict';

	var office = angular.module('naijalogosOffice')

	office.controller('boardCtrl', ['$scope', '$http', '$localForage', '$location', function ($scope, $http, $localForage, $location) {

		function get() {
			var url = '/office/billboards/'
			$scope.loading = true

			if ('caches' in window) {
				caches.match(url).then(function (response) {
					if (response) {
						response.json().then(function (json) {
							if (networkPending) {
								$scope.billboards = lease(json)
								$scope.loading = false
							}
						})
					}
				})
			}

			var networkPending = true

			$http.get(url).then(function (data) {
				var billboards = data.data

				$scope.billboards = lease(billboards)
				networkPending = false
				$scope.loading = false

			}, function () {
				$scope.loading = false
			})
		}

		get()

		function lease(billboards) {
			var date = new Date()
			var day = date.getDate()
			var mnth = date.getMonth() + 1
			var year = date.getFullYear()

			var today = new Date(year + '-' + mnth + '-' + day)

			for (var i = 0; i < billboards.length; i++) {
					var leases = billboards[i].lease_info
					var num = 0
					for (var j = 0; j < leases.length; j++) {
						var start = new Date(leases[j].start_date)
						var end = new Date(leases[j].expiry_date)
						

						if (today > start && today > end || start > today && end > today) {
							num++
						}
						if (today > start && end > today) {
							leases[j].active = true
						}

						if (start > today && end > today) {
							leases[j].pending = true
						}
					}
					
					if (num === leases.length) {
						billboards[i].is_leased = false
					}else{
						billboards[i].is_leased = true
					}
				}

			return billboards
		}


		$scope.num = 0

		$scope.switch = function (number) {
			$scope.num = number
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