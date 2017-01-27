(function () {

    var office = angular.module('naijalogosOffice');

    office.directive('sideBar', function () {
        return {
            restrict: 'E',
            controller: 'profileCtrl',
            templateUrl: '/static/html/sidebar.html'
        }
    })
})()