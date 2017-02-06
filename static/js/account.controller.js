(function () {
    'use strict';

    var office = angular.module('naijalogosOffice');

    office.controller('balanceCtrl', ['$scope', '$http', '$localForage', '$location', function ($scope, $http, $localForage, $location) {
    	
    	$localForage.getItem('user').then(function (data) {
            $scope.user = data
        });
    	
    	$scope.balLoading = true
    	
    	setTimeout(() => {
    	  
            var url = '/office/balance/'

            if ('caches' in window) {
                caches.match(url).then(function (response) {
                    if (response) {
                        response.json().then(function (json) {
                            if (networkPending) {
                                console.log(JSON.stringify(json[0]))
                                $scope.balance = json[0]
                                $scope.balLoading = false
                            }
                        })
                    }
                })
            }

            var networkPending = true
            $http.get(url).then(function (data) {
                $scope.balance = data.data[0]
                networkPending = false
                $scope.balLoading = false
            })

		}, 1000);
    	

        activate()
        function activate() {
            $localForage.getItem('user').then(function (data) {
                if (!data) {
                    $location.url('/login')
                } else {
                    if (!data.is_staff) {
                        $location.url('/')
                    }
                }

            })
        }
        
        setTimeout(() => {
        	$scope.feedLoading = true
            var url = '/office/credits/'

            if ('caches' in window) {
                caches.match(url).then(function (response) {
                    if (response) {
                        response.json().then(function (json) {
                            if (networkPending) {
                                console.log(JSON.stringify(json))
                                $scope.credits = json.reverse()
                                $scope.feedLoading = false

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
                $scope.feedLoading = false
            })

		}, 1000);
        

        $scope.detail = {}

        $scope.create = function () {
            $scope.loading = true

            $http.post('/office/credits/', $scope.detail).then(function (data) {
                    $scope.balance.balance = $scope.balance.balance + data.data.amount
                    $http.put('/office/balance/1/', $scope.balance).then(function (data) {
                        $scope.balance = data.data
                    })
                    $scope.credits.unshift(data.data)
                    $scope.loading = false
                    $scope.detail = {}
                    $("#acc-imprest > p").text("Balance Updated Successfully")
                    $("#acc-imprest").fadeTo(2000, 5000).slideUp(500, function () {
                        $("#acc-imprest").slideUp(500);
                    });
                },
                function () {
                    $scope.loading = false
                    $("#acc-imprest > p").text("Error Submitting Form. Try again")
                    $("#acc-imprest").fadeTo(2000, 500).slideUp(500, function () {
                        $("#acc-imprest").slideUp(500);
                    });
                })
        }

    }])

})();