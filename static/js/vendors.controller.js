(function () {
	'use strict';

	var office = angular.module('naijalogosOffice');

	office.controller('vendorsCtrl', ['$scope','$http','$localForage','$location', function($scope,$http,$localForage,$location){
		
        function activate() {
            $localForage.getItem('user').then(function (data) {
          		$scope.user = data

                if (!data) {
                    $location.url('/login')
                } else {
                    if (!data.is_staff) {
                        $location.url('/')
                    }
                }

            })
        }
        activate()

        function get() {
        	$scope.loading = true
        	var url = "/office/vendor/"

        	if ('caches' in window) {
        		caches.match(url).then(function (response) {
        			if (response) {
        				response.json().then(function (json) {
        					if (netwrokPending) {
        						$scope.vendors = json
        						$scope.loading = false
        					}
        				})
        			}
        		})
        	}
        	
        	$scope.loading = true
        	$http.get(url).then(function (data) {
        		$scope.vendors = data.data
        		$scope.loading = false
        	})
        }
        get()

        $scope.limit = 10

        $scope.addMore = function () {
        	$scope.limit += 10
        }

        $scope.orderAlpha = function () {
        	if ($scope.name === 'name') {
        		$scope.name = '-name'
        	} else {
        		$scope.name = 'name'
        	}
        }

        

        $('#order').dropdown()

        $scope.create = function () {
        	var url = "/office/vendor/"
        	$scope.formLoading = true

        	var vendor = {
        		name: $scope.vendor.name,
        		mobile: $scope.vendor.mobile,
        		account_details: $scope.vendor.number,
        		bank_name: $scope.vendor.bankName,
				email: $scope.vendor.email
        	}
        	$http.post(url,vendor).then(function (data) {
        			$scope.vendors.push(data.data)
                	$scope.formLoading = false
                	$scope.vendor = {}
                
                	$("#acc-imprest > p").text("Vendor Added Successfully")
                	$("#acc-imprest").fadeTo(5000, 5000).slideUp(500, function () {
                   		$("#acc-imprest").slideUp(500);
                	});

                },
                function () {
                    $scope.formLoading = false
                    $("#acc-imprest > p").text("Error Submitting Form. Try again")
                    $("#acc-imprest").fadeTo(5000, 500).slideUp(500, function () {
                        $("#acc-imprest").slideUp(500);
                    })
        	})
        }
	}])
})()