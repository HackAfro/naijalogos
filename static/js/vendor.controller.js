(function () {
	'use strict';

	var office = angular.module('naijalogosOffice');

	office.controller('vendorFormCtrl', ['$scope','$localForage','$http','$location','Pusher', function($scope,$localForage,$http,$location,Pusher){
		activate()
        function activate() {
            $localForage.getItem('user').then(function (data) {
                if (!data) {
                    $location.url('/login')
                }else{
                	$scope.user = data
                }
            })
        }

        function get() {
        	var url = '/office/vendors/'
            $scope.loading = true
            var vendorForms;
    		var outstanding;
            
            if ('caches' in window) {
				caches.match(url).then(function(response) {
					if (response) {
						response.json().then(function(json) {
							if (networkPending) {
								vendorForms = json
								outstanding = []
								
								for (var i = 0; i < vendorForms.length; i++) {
									if(vendorForms[i].amount_due !== vendorForms[i].current_payment){
										outstanding.push(vendorForms[i])
									}
								}

								$scope.outstanding = outstanding
								$scope.vendorForms = vendorForms
								$scope.loading = false
							}
						})
					}
				})
			}
            var networkPending = true
        	$http.get(url).then(function (data) {
        		vendorForms = data.data
        		outstanding = []
        		for (var i = 0; i < vendorForms.length; i++) {
        			if(vendorForms[i].amount_due !== vendorForms[i].current_payment){
        				outstanding.push(vendorForms[i])
        			}
        		}

        		$scope.outstanding = outstanding
        		$scope.vendorForms = vendorForms
        		networkPending = false
                $scope.loading = false
        	})
        }
        get()

        $scope.limit = 10
        
        $scope.addMore = function() {
			$scope.limit += 10
		}
        $scope.update = function (vendorForm)  {
                $scope.loadingForm = true
                vendorForm.outstanding_balance = vendorForm.amount_due - vendorForm.current_payment
                $http.put('/office/vendors/' + vendorForm.id + '/', vendorForm).then(function () {
                    $scope.loadingForm = false
                    $("#acc-imprest > p").text("Form edited!")
                    $("#acc-imprest").fadeTo(2000, 500).slideUp(500, function () {
                        $("#acc-imprest").slideUp(500);
                    });
                }, function () {
                    $scope.loadingForm = false
                    $("#acc-imprest > p").text("Error editing form, please check the network and try again :(")
                    $("#acc-imprest").fadeTo(2000, 500).slideUp(500, function () {
                        $("#acc-imprest").slideUp(500);
                    });
                })

            }
        $scope.modelOptions = {
            debounce: 1000
        };

        $scope.check = function (word) {
            var found = 0
            $scope.searching = true
            for (var i = 0; i < $scope.vendorForms.length; i++) {
                if($scope.vendorForms[i].job_description.includes(word)){
                    found++
                } 
                if ($scope.vendorForms[i].vendor_name.includes(word)) {
                    found++
                }
                if ($scope.vendorForms[i].bank_name.includes(word)) {
                    found++
                }
            }
            $scope.found = found
            $scope.searching = true
            $scope.done = true
        }


	}])

})();