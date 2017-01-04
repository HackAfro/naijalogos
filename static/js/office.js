/**
 * Created by Afro on 12/17/2016.
 */

(function () {
    'use strict'

    var office = angular.module('naijalogosOffice', ['ngRoute', 'LocalForageModule', 'angularMoment','doowb.angular-pusher']);
    
    office.controller('officeCtrl', ['$http', '$scope', 'timeFilter', function ($http, $scope, timeFilter) {
        $scope.data = [];


        $http.get('/office/vendors').then(function (response) {
            $scope.data = response.data;
        })
        $scope.all = 55555


    }])

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

    office.controller('allImprestCtrl', ['$http', '$scope', 'timeFilter', function($http, $scope, timeFilter){
        
        $http.get('/office/imprests/').then(function(response){
                $scope.imprests = response.data
                function main(month){
                    var filtered = timeFilter($scope.imprests,month)
                    var total = 0;
                    for(var i=0; i<filtered.length; i++){
                        total+=filtered[i].amount
                    }
                    return total
                }

        })



    }])
})();
