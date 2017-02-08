(function () {
    'use strict';

    var office = angular.module('naijalogosOffice');

    office.controller('profileCtrl', ['$http', '$scope', '$localForage', '$location', function ($http, $scope, $localForage, $location) {
        $localForage.getItem('user').then(function (data) {
            $scope.user = data
        });

        $scope.tab = 1;

        $scope.number = 10
        $scope.amount = 10

        $scope.addMore = function () {
            $scope.amount = $scope.amount + 10
        }

        $scope.viewMore = function () {
            $scope.number = $scope.number + 10
        }

        $scope.selectTab = function (tab) {
            $scope.tab = tab;
        }

        $scope.isSelected = function (checktab) {
            return $scope.tab === checktab
        }

        $scope.page = 0

        $scope.selectPage = function (page) {
            $scope.page = page
        }

        $scope.activePage = function (page) {
            return $scope.page === page
        }

        setTimeout(() => {
            $localForage.getItem('user').then(function (data) {
            $scope.user = data
            var url = '/office/vendors/'

            if ('caches' in window) {

                caches.match(url).then(function (response) {
                    if (response) {
                        response.json().then(function (json) {
                            if (networkPending) {
                                var data = json
                                var vendors = []
                                if (data[0].vendor_name) {
                                    for (var j = 0; j < data.length; j++) {
                                        if (data[j].user.username === $scope.user.username) {
                                            vendors.push(data[j])
                                        }
                                    }
                                    console.log(vendors)
                                    $scope.vendors = vendors
                                }
                            }
                        })
                    }
                })
            }
            var networkPending = true

            $http.get(url).then(function (response) {
                $scope.loading = false
                var data = response.data
                var vendors = []
                for (var j = 0; j < data.length; j++) {
                    if (data[j].user.username === $scope.user.username) {
                        vendors.push(data[j])
                    }
                }
                $scope.vendors = vendors

                networkPending = false

            }, function () {
                $scope.loading = false
            })
        })

    },
        1000
        )
        ;


        activate()
        function activate() {
            $localForage.getItem('user').then(function (data) {
                if (!data) {
                    $location.url('/login')
                }
            })
        }

        $scope.loading = true

        setTimeout(() => {

            $localForage.getItem('user').then(function (data) {
            $scope.user = data
            var url = '/office/imprests/'
            if ('caches' in window) {
                caches.match(url).then(function (response) {
                    if (response) {
                        response.json().then(function (json) {
                            if (networkPending) {
                                var data = json
                                var imprests = []
                                if (data[0].description) {
                                    for (var i = 0; i < data.length; i++) {
                                        if (data[i].user.username === $scope.user.username) {
                                            imprests.push(data[i])
                                        }
                                    }
                                    console.log(imprests.length)
                                    console.log(imprests)
                                    $scope.imprests = imprests
                                    $scope.loading = false
                                }

                            }
                        })
                    }

                })
            }
            var networkPending = true
            $http.get('/office/imprests/').then(function (response) {

                var data = response.data
                var imprests = []
                for (var i = 0; i < data.length; i++) {

                    if (data[i].user.username === $scope.user.username) {
                        imprests.push(data[i])

                    }
                }

                $scope.imprests = imprests
                networkPending = false
                $scope.loading = false
            }, function () {
                $scope.loading = false
            })
        })


    },
        1000
        )
        ;

        $scope.isEditing = false;

        $scope.editing = function () {
            $scope.isEditing = !$scope.isEditing
        }

        $scope.cancelEditing = function () {
            $scope.isEditing = false;
        }

        $scope.new = {}
        $scope.update = function () {
            $scope.loading = true

            if ($scope.new.confPass === $scope.user.password) {
                $http.put('/auth_api/accounts/' + $scope.user.id + '/', $scope.user).then(function () {
                    $scope.loading = false
                    $("#acc-imprest > p").text("You've successfully updated your profile!")
                    $("#acc-imprest").fadeTo(2000, 500).slideUp(500, function () {
                        $("#acc-imprest").slideUp(500);
                    });
                    $scope.cancelEditing()
                }, function () {
                    $scope.loading = false
                    $("#acc-imprest > p").text("Error updating your profile. Please try again")
                    $("#acc-imprest").fadeTo(2000, 500).slideUp(500, function () {
                        $("#acc-imprest").slideUp(500);
                    });
                })
            }
            $scope.new = {}
            $scope.user = {}
        }

        $scope.limit = 5

        $scope.account = function () {
            $location.url('/account')
        }

    }])

})();