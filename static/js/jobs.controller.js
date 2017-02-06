(function () {
    'use strict';

    var office = angular.module('naijalogosOffice');

    office.controller('jobsController', ['$scope', '$http', '$localForage', '$location', function ($scope, $http, $localForage, $location) {
    	
    	$localForage.getItem('user').then(function (data) {
            $scope.user = data
        });
    	$scope.getting = true
    	
    	setTimeout(() => {
    		var url = '/office/jobs/'
                
                var complete = 0;
                var incomplete = 0;

                if ('caches' in window) {
                    caches.match(url).then(function (data) {
                        if (data) {
                            data.json().then(function (json) {
                                if (networkPending) {
                                    var jobs = json

                                    for (var i = 0; i < jobs.length; i++) {
                                        if (jobs[i].is_complete === true) {
                                            complete++
                                        } else {
                                            incomplete++
                                        }
                                    }

                                    $scope.complete = complete;
                                    $scope.incomplete = incomplete;

                                    $scope.jobs = jobs.reverse()
                                    $scope.getting = false
                                }
                            })
                        }
                    })
                }

                var networkPending = true
                $http.get(url).then(function (data) {
                    var jobs = data.data
                    complete = 0;
                    incomplete = 0;

                    for (var i = 0; i < jobs.length; i++) {
                        if (jobs[i].is_complete === true) {
                            complete++
                        } else {
                            incomplete++
                        }
                    }

                    $scope.complete = complete;
                    $scope.incomplete = incomplete;

                    $scope.jobs = jobs.reverse()
                    networkPending = false
                    $scope.getting = false
                })

		}, 2000);

        activate()
        function activate() {
            $localForage.getItem('user').then(function (data) {
                if (!data) {
                    $location.url('/login')
                }
            })
        }

        $scope.tab = 1

        $scope.selectTab = function (tab) {
            $scope.tab = tab
        }

        $scope.isSelected = function (tab) {
            return $scope.tab === tab
        }

        $scope.update = function (job) {
            $scope.loading = true

            job.balance = job.amount_due - job.amount_paid
            
            $http.put('/office/jobs/' + job.id + '/', job).then(function (data) {
                var newJob = data.data

                if (newJob.is_complete === true) {
                    $scope.loading = false
                    $("#acc-imprest > p").text("Congrats!! You completed your job :)")
                    $("#acc-imprest").fadeTo(2000, 500).slideUp(500, function () {
                        $("#acc-imprest").slideUp(500);
                    });
                } else {
                    $scope.loading = false
                    $("#acc-imprest > p").text("Success!!")
                    $("#acc-imprest").fadeTo(2000, 500).slideUp(500, function () {
                        $("#acc-imprest").slideUp(500);
                    });
                }


            }, function () {
                $scope.loading = false
                $("#acc-imprest > p").text("Error submitting, please try again!!")
                $("#acc-imprest").fadeTo(2000, 500).slideUp(500, function () {
                    $("#acc-imprest").slideUp(500);
                });
            })
        }

        $scope.modelOptions = {
            debounce: 1000
        };

        $scope.message = {}
        $scope.remarkLoading = false

        $scope.addRemark = function (job) {
            $scope.remarkLoading = true
            $scope.message.job = job.id

            $http.post('/office/remarks/', $scope.message).then(function (data) {
                    $scope.remarkLoading = false
                    job.remarks.unshift(data.data)
                    $scope.message = {}
                    $("#acc-imprest > p").text("New remark added!!")
                    $("#acc-imprest").fadeTo(2000, 500).slideUp(500, function () {
                        $("#acc-imprest").slideUp(500);
                    });
                },
                function () {
                    $scope.remarkLoading = false
                    $scope.loading = false
                    $("#acc-imprest > p").text("Error submitting, please try again!!")
                    $("#acc-imprest").fadeTo(2000, 500).slideUp(500, function () {
                        $("#acc-imprest").slideUp(500);
                    });
                }
            )
        }
    }])
})();