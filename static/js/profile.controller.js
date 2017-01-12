(function(){
    'use strict';
    
    var office = angular.module('naijalogosOffice');
    
    office.controller('profileCtrl', ['$http', '$scope', '$localForage','$location', function($http, $scope, $localForage, $location){
        $localForage.getItem('user').then(function (data) {
            $scope.user = data
        });
        
        $scope.tab = 1;
        
        $scope.selectTab = function(tab){
            $scope.tab = tab;
        }
        
        $scope.isSelected = function(checktab){
            return $scope.tab === checktab
        }

        $http.get('/office/vendors/').then(function(response){
                $scope.vendors = response.data
                var venNum = 0
                for (var j=0; j<$scope.vendors.length; j++){
                    if($scope.vendors[j].prepared_by.username === $scope.user.username){
                        venNum++
                    }
                }
                $scope.numVen = venNum
        })

        activate()
        function activate() {
            $localForage.getItem('user').then(function (data) {
                if (!data) {
                    $location.url('/login')
                }
            })
        }

        $http.get('/office/imprests/').then(function(response){
                $scope.imprests = response.data
                var impNum = 0
                for (var i=0; i<$scope.imprests.length; i++){
                    if($scope.imprests[i].raised_by.username === $scope.user.username){
                        impNum++
                    }
                }
                $scope.numImp = impNum
        })

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

        $scope.imprestPage = function(){
            $location.url('/imprests')
            $('.ui.left.sidebar').sidebar('close')
        }

        $scope.vendors = function(){
            $location.url('/vendors')
        }

        $scope.billboards = function(){
            $location.url('/billboards')
        }

        $scope.limit = 5

    }])
    
})();