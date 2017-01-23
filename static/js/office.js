/**
 * Created by Afro on 12/17/2016.
 */

(function () {
    'use strict'

    var office = angular.module('naijalogosOffice', ['ngRoute', 'LocalForageModule', 'angularMoment','doowb.angular-pusher']);

    office.config(['PusherServiceProvider', function(PusherServiceProvider) {
        PusherServiceProvider.setToken("1e6cf382786b2218bb7b")
        }
    ]);
    

    office.filter('time', function(){
        return function(items,month){
            var arrayToReturn = []

            angular.forEach(items, function (imprests) {
                var date = new Date(imprests.created_at);
                var mnth = date.toDateString().slice(4,7);
                if (mnth === month){
                    arrayToReturn.push(imprests)
                }
            })
            return arrayToReturn;
        }
    })

    office.controller('allImprestCtrl', ['$http', '$scope', '$location', '$localForage', 'timeFilter', function($http, $scope, $location, $localForage, timeFilter){

        function getImprest(argument) {
            var url = '/office/imprests/'

            if ('caches' in window) {
                caches.match(url).then(function (response) {
                    if (response) {
                        response.json().then(function (json) {
                            if (networkLoading) {
                                $scope.imprests = json
                            }
                        })
                    }
                })
            }
            var networkLoading = true
            $http.get(url).then(function(response){
                $scope.imprests = response.data
                networkLoading = false
            })

            $scope.total = function (month){
                var filtered = timeFilter($scope.imprests,month)
                var total = 0;
                for(var i=0; i<filtered.length; i++){
                    total+=filtered[i].amount
                }
                return total
            }

            $scope.totalUser = function (user) {
                var total = 0
                for (var i=0; i<$scope.imprests.length; i++){
                    if ($scope.imprests[i].user.username === user){
                        total+=$scope.imprests[i].amount
                    }
                }
                return total
            }
        }

        getImprest()
        
        activate()
        function activate() {
            $localForage.getItem('user').then(function (data) {
                if(!data){
                    $location.url('/login')
                }else{
                    if (!data.is_staff){
                        $location.url('/')
                    }
                }
            })
        }

        $scope.tab = 1;

        $scope.selectTab = function(tab){
            $scope.tab = tab;
        }

        $scope.isSelected = function(checktab){
            return $scope.tab === checktab
        }



    }])
})();
