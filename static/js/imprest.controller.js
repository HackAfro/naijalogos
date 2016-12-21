/**
 * Created by Afro on 12/19/2016.
 */
(function () {

    var office = angular.module('naijalogosOffice');

    office.controller('getImprestCtrl', ['$http', '$scope', '$localForage', '$location', function ($http, $scope, $localForage, $location) {
        $localForage.getItem('user').then(function (data) {
            $scope.user = data
        });

        $scope.data = {};


        $http.get('/office/imprests/').then(function (response) {
            $scope.data = response.data

        });

        $scope.accept = function (imprest) {
            imprest.is_approved = true
            $http.put('/office/imprests/' + imprest.id+'/', imprest)
        };

        activate()
        function activate() {
            $localForage.getItem('user').then(function (data) {
                if (!data) {
                    $location.url('/login')
                }
            })
        }
    }])
})();