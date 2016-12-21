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
                $scope.notifcations = 0;
                var total = 0
                function gatherNotifications(){
                    $http.get('/office/vendors/').then(function (response) {
                        var data = response.data
                        for(var i; i<data.length; i++){
                            if(!data[i].is_approved){
                                alert('yes')
                                total++
                            }else {
                                alert('no')
                            }
                        }
                    },
                    function (status) {
                        return;
                    })
                }

                $scope.profile= function () {
                    $location.url('/profile')
                }

                $scope.home = function () {
                    $location.url('/')
                }
            }],
            controllerAs: 'navbarCtrl'
        }
    })
})();
