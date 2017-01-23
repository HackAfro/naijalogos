(function(){
    'use strict';
    
    var office = angular.module('naijalogosOffice');
    
    office.controller('profileCtrl', ['$http', '$scope', '$localForage','$location', function($http, $scope, $localForage, $location){
        $localForage.getItem('user').then(function (data) {
            $scope.user = data

            Pusher.subscribe($scope.user.username + '_inbox','update',function(item){
    
                $("#acc-imprest > p").text(item.message)
                    $("#acc-imprest").fadeTo(2000, 2000).slideUp(1000, function(){
                    $("#acc-imprest").slideUp(1000);
                })
            })
        });
        
        $scope.tab = 1;
        
        $scope.selectTab = function(tab){
            $scope.tab = tab;
        }
        
        $scope.isSelected = function(checktab){
            return $scope.tab === checktab
        }
        function getVendors() {
            $localForage.getItem('user').then(function (data) {
                $scope.user = data

                if ('caches' in window) {

                var url = '/office/vendors/'

                caches.match(url).then(function (response) {
                    if (response){
                        response.json().then(function (json) {
                            if (networkPending) {
                                $scope.vendors = json
                                var venNum = 0
                                if ($scope.vendors[0].vendor_name) {
                                    for (var j=0; j<$scope.vendors.length; j++){
                                        if($scope.vendors[j].user.username === $scope.user.username){
                                            venNum++
                                        }
                                    }
                                        $scope.numVen = venNum
                                    }
                                }
                            })
                        }
                    })
                }
                var networkPending = true

                $http.get(url).then(function(response){
                    $scope.loading = false
                    $scope.vendors = response.data
                    var venNum = 0
                    for (var j=0; j<$scope.vendors.length; j++){
                        if($scope.vendors[j].user.username === $scope.user.username){
                            venNum++
                        }
                    }
                    $scope.numVen = venNum

                    networkPending = false
                
                },function () {
                    $scope.loading = false
                })
            })
        }

        getVendors()
        


        activate()
        function activate() {
            $localForage.getItem('user').then(function (data) {
                if (!data) {
                    $location.url('/login')
                }
            })
        }
        $scope.loading = true

        function getImprests() {

            $localForage.getItem('user').then(function (data) {
                $scope.user = data
            var url = '/office/imprests/'
            if ('caches' in window){
                caches.match(url).then(function (response) {
                    if (response) {
                      response.json().then(function (json) {
                        if (networkPending) {
                            $scope.imprests = json
                            var impNum = 0
                            if ($scope.imprests[0].description) {
                                for (var i=0; i<$scope.imprests.length; i++){
                                    if($scope.imprests[i].user.username === $scope.user.username){
                                        impNum++
                                    }
                            }
                            $scope.numImp = impNum
                            $scope.loading = false
                            }
                        
                        }
                      })  
                    }
                    
                })
            }
            var networkPending = true
            $http.get('/office/imprests/').then(function(response){
                
                $scope.imprests = response.data
                var impNum = 0
                for (var i=0; i<$scope.imprests.length; i++){
                    if($scope.imprests[i].user.username === $scope.user.username){
                        impNum++
                    }
                }
                $scope.numImp = impNum
                networkPending = false
                $scope.loading = false 
            },function () {
                $scope.loading = false
            })
        })

        }
        getImprests()

        $scope.isEditing = false;
        
        $scope.editing = function(){
            $scope.isEditing = !$scope.isEditing 
        }
        
        $scope.cancelEditing = function(){
            $scope.isEditing = false;
        }
        
        $scope.new = {}
        $scope.update = function(){
            if ($scope.new.confPass === $scope.user.password){
                $http.put('/auth_api/accounts/' + $scope.user.id + '/', $scope.user)
            }
            $scope.new = {}   
        }

        $scope.limit = 5

        $scope.account = function () {
            $location.url('/account')
        }

    }])
    
})();