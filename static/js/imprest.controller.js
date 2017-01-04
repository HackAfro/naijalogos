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
                var imprest = 0
                for (var i=0; i<$scope.data.length; i++){
                    if(!$scope.data[i].is_approved){
                        imprest++
                    }
                }
                $scope.imprests = imprest
            });
        }

        retrieve()


        $scope.accept = function (imprest) {
            imprest.is_approved = true
            $http.put('/office/imprests/' + imprest.id+'/', imprest)
                .then(function(){
                    $("#acc-imprest > p").text("Imprest accepted!! :)")
                    $("#acc-imprest").fadeTo(2000, 500).slideUp(500, function(){
                    $("#acc-imprest").slideUp(500);
                    });
            },function(){
                    $("#acc-imprest > p").text("Error accepting imprest, please try again :(")
                    $("#acc-imprest").fadeTo(2000, 500).slideUp(500, function(){
                    $("#acc-imprest").slideUp(500);
                    });
            })
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
                var vends = 0
                for (var j=0; j<$scope.vendors.length; j++){
                    if(!$scope.vendors[j].is_approved){
                        vends++
                    }
                }
                $scope.vend = vends
            })
        }

        $scope.approve = function (form) {
            form.is_approved = true
            $http.put('/office/vendors/' + form.id+'/', form)
                .then(function(){
                    $("#acc-imprest > p").text("Vendor form approved!!")
                    $("#acc-imprest").fadeTo(2000, 500).slideUp(500, function(){
                    $("#acc-imprest").slideUp(500);
                    });
            },function(){
                    $("#acc-imprest > p").text("Error approving form, please try again :(")
                    $("#acc-imprest").fadeTo(2000, 500).slideUp(500, function(){
                    $("#acc-imprest").slideUp(500);
                    });
            })
        };
    }])
})();