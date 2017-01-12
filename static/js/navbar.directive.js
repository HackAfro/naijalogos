/**
 * Created by Afro on 12/19/2016.
 */
(function () {
    var office = angular.module('naijalogosOffice');

    office.directive('navBar',function () {
        return {
            restrict: 'E',
            templateUrl: '/static/html/nav.html',
            controller : ['$scope', '$http', '$location', '$localForage','$timeout', function ($scope, $http, $location, $localForage, $timeout) {
                $localForage.getItem('user').then(function (data) {
                    $scope.user = data

                    Pusher.subscribe($scope.user.username + '_inbox','update',function(item){
                        alert('new')
                        $http.get('/api/inbox/').then(function(data){
                            $scope.notifications = data.data.length
                        })
            
                      })
                });

                $scope.logout = function () {

                    $localForage.removeItem('user');
                    $http.post('/auth_api/logout/');

                    $location.url('/login')
                };


                
                
                function notify(){
                  $http.get('/api/inbox/').then(function (response) {
                    $scope.notifications = response.data.length
                    })  
                }
                
                notify()
                
                    
                




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
