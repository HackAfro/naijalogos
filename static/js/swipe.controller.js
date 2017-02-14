(function () {
    'use strict';

    var office = angular.module('naijalogosOffice');

    office.controller('swipeCtrl', ['$scope', '$localForage','$timeout', function ($scope, $localForage, $timeout) {
    	function get() {
            $localForage.getItem('user').then(function (data) {
                $scope.user = data
            })

            $timeout(get, 500)
        }

        $timeout(get, 500);
    	
        $scope.showSideBar = function () {
            $('.ui.left.sidebar').sidebar({
                dimPage: true,
                transition: 'overlay',
                exclusive: false,
                closable: true
            }).sidebar('show');
        }

        $scope.hideSideBar = function () {
            $('.ui.left.sidebar').sidebar('hide')
        }
        
        $('.cookie.nag')
         .nag('show');
    }])
})();