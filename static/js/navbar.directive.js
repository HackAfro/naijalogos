/**
 * Created by Afro on 12/19/2016.
 */
(function () {
    var office = angular.module('naijalogosOffice');

    office.directive('navBar',function () {
        return {
            restrict: 'E',
            templateUrl: '/static/html/nav.html',
            controller : ['$scope', '$http', '$location', '$localForage','Pusher', function ($scope, $http, $location, $localForage, Pusher) {
                $localForage.getItem('user').then(function (data) {
                    $scope.user = data

                    Pusher.subscribe($scope.user.username + '_inbox','update',function(item){
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
                    var url = '/api/inbox/'

                    $http.get(url).then(function (response) {
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
