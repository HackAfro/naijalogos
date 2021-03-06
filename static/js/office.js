(function () {
    'use strict';

    var office = angular.module('naijalogosOffice', ['ngRoute', 'LocalForageModule', 'angularMoment', 'doowb.angular-pusher', 'ngTouch', 'ngAnimate']);

    office.config(['PusherServiceProvider', function (PusherServiceProvider) {
        PusherServiceProvider.setToken("6cfd92c53d2b858e9196");
    }
    ]);

    office.controller('officeCtrl', ['$scope', '$localForage', 'Pusher', function ($scope, $localForage, Pusher) {

        $localForage.getItem('user').then(function (data) {
            $scope.user = data

            Pusher.subscribe($scope.user.username + '_inbox', 'update', function (item) {

                $("#acc-imprest > p").text(item.message);
                $("#acc-imprest").fadeTo(10000, 2000).slideUp(500, function () {
                    $("#acc-imprest").slideUp(500);
                });
            });
        });
    }]);


    office.filter('time', function () {
        return function (items, month) {
            var arrayToReturn = []

            angular.forEach(items, function (imprests) {
                var date = new Date(imprests.created_at);
                var mnth = date.toDateString().slice(4, 7);
                if (mnth === month) {
                    arrayToReturn.push(imprests)
                }
            })
            return arrayToReturn;
        }
    })

    office.controller('allImprestCtrl', ['Pusher', '$http', '$scope', '$location', '$localForage', 'timeFilter', function (Pusher, $http, $scope, $location, $localForage, timeFilter) {

        $scope.loading = true

        setTimeout(() => {
            var url = '/office/imprests/'


            if ('caches' in window
        )
        {
            caches.match(url).then(function (response) {
                if (response) {
                    response.json().then(function (json) {
                        if (networkLoading) {
                            var imprests = json
                            $scope.imprests = imprests.reverse()
                            $scope.loading = false
                        }
                    })
                }
            })
        }
        var networkLoading = true
        $http.get(url).then(function (response) {
            $scope.imprests = response.data.reverse()
            $scope.loading = false
            networkLoading = false
        })

        $scope.total = function (month) {
            var filtered = timeFilter($scope.imprests, month)
            var total = 0;
            for (var i = 0; i < filtered.length; i++) {
                total += filtered[i].amount
            }
            return total
        }

        $scope.totalUser = function (user) {
            var total = 0
            for (var i = 0; i < $scope.imprests.length; i++) {
                if ($scope.imprests[i].user.username === user) {
                    total += $scope.imprests[i].amount
                }
            }
            return total
        }
    },
        1000
        )
        ;

        $('#filter').dropdown()
        $('#search').dropdown()

        $scope.limit = 10

        $scope.addMore = function () {
            $scope.limit += 10
        }


        $scope.change = function (user) {
            $scope.search = user
        }


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

        $scope.tab = 1;

        $scope.selectTab = function (tab) {
            $scope.tab = tab;
        }

        $scope.isSelected = function (checktab) {
            return $scope.tab === checktab
        }


    }])
})();
