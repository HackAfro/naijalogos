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

                $scope.profile= function () {
                    $location.url('/profile')
                }

                $scope.home = function () {
                    $location.url('/home')
                }
            }],
            controllerAs: 'navbarCtrl'
        }
    })
})();