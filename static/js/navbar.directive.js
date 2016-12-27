/**
 * Created by Afro on 12/19/2016.
 */
(function () {
    var office = angular.module('naijalogosOffice');

    office.directive('navBar',function () {
        return {
            restrict: 'E',
            templateUrl: '/static/html/nav.html',
            controller : ['$scope', '$http', '$location', '$localForage', function ($scope, $http, $location, $localForage) {
                $localForage.getItem('user').then(function (data) {
                    $scope.user = data
                });

                $scope.logout = function () {

                    $localForage.removeItem('user');
                    $http.post('/auth_api/logout/');

                    $location.url('/login')
                };


            
                
                    
                $http.get('/office/imprests/').then(function (response) {
                    var total = 0
                        var data = response.data
                        var prests = 0
                        for (var i=0; i<data.length; i++){
                            if(!data[i].is_approved){
                                prests++
                            }
                        }
                    total = prests
                        $http.get('/office/vendors/').then(function (response) {
                            var data = response.data
                            var vends = 0
                            for (var j=0; j<data.length; j++){
                                if(!data[j].is_approved){
                                    vends++
                                }
                            }
                        total += vends
                    $scope.notifications = total
                    })
                        
                    })

                
                    
                




                $scope.notification = function () {
                    $location.url('/notifications')
                }

                $scope.home = function () {
                    $location.url('/')
                }
                
                $scope.profile = function(){
                    $location.url('/profile')
                }
            }],
            controllerAs: 'navbarCtrl'
        }
    })
})();
