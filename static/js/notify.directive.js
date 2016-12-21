/**
 * Created by Afro on 12/19/2016.
 */
(function () {
    var office = angular.module('naijalogosOffice');

    office.directive('notifyBar',function () {
        return {
            restrict: 'E',
            templateUrl: '/static/html/notify.html'
        }
    })
})();