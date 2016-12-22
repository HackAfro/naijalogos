/**
 * Created by Afro on 12/19/2016.
 */
(function () {

    var office = angular.module('naijalogosOffice');

    office.controller('getImprestCtrl', ['$http', '$scope', '$localForage', '$location', function ($http, $scope, $localForage, $location) {
        $localForage.getItem('user').then(function (data) {
            $scope.user = data
        });

        $scope.editingImprest = false

        $scope.isEditingImprest = function () {
            $scope.editingImprest = !$scope.editingImprest
        }
        $scope.cancelEditing = function () {
            $scope.editingImprest = false
        }

        $scope.update = function (imprest) {
            $http.put(
                '/office/imprests/' + imprest.id + '/',
                imprest
            )
        };
        $scope.modelOptions = {
            debounce: 1000
        };

        $scope.data = [];

        function retrieve() {
            $http.get('/office/imprests/').then(function (response) {
                $scope.data = response.data
            });
        }

        retrieve()


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

    office.controller('getVendorCtrl', ['$scope', '$http',function ($scope, $http) {

        $scope.vendors = []

        retrieve()
        function retrieve() {
            $http.get('/office/vendors/').then(function (response) {
                $scope.vendors = response.data
            })
        }

        $scope.approve = function (form) {
            form.is_approved = true
            $http.put('/office/vendors/' + form.id+'/', form)
        };
    }])
})();