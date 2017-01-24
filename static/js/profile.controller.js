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

                    caches.match('/office/vendors/').then(function (response) {
                    if (response){
                        console.log('using cahced data')
                        response.json().then(function (json) {
                            if (networkPending) {
                                var data = json
                                console.log('Cached data is available')
                                var vendors = []
                                    console.log('Data is valid')
                                if (data[0].vendor_name) {
                                    for (var j=0; j<data.length; j++){
                                        if(data[j].user.username === $scope.user.username){
                                            vendors.push(data[j])
                                        }
                                        console.log('Valid Data')
                                    }   
                                    $scope.vendors = vendors
                                }  
                                    
                                }
                            })
                        }
                    })
                }
                var networkPending = true

                $http.get('/office/vendors/').then(function(response){
                    $scope.loading = false
                    var data = response.data
                    var vendors = []
                    for (var j=0; j<data.length; j++){
                        if(data[j].user.username === $scope.user.username){
                            vendors.push(data[j])
                        }
                    }
                    $scope.vendors = vendors

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
                      response.json().then(function (object) {
                        if (networkPending) {
                            var imp = object
                            var imprests = []
                            if (imp[0].description) {
                                for (var i=0; i<imp.length; i++){
                                    if(imp[i].user.username === $scope.user.username){
                                        imprests.push(imp[i])
                                    }
                            }
                            $scope.imprests = imprests
                            $scope.loading = false
                            }
                        
                        }
                      })  
                    }
                    
                })
            }
            var networkPending = true
            $http.get('/office/imprests/').then(function(response){
                
                var imp = response.data
                var imprests = []
                for (var i=0; i<imp.length; i++){
                    
                    if(imp[i].user.username === $scope.user.username){
                        imprests.push(imp[i])

                    }
                }

                $scope.imprests = imprests
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