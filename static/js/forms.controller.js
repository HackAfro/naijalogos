/**
 * Created by Afro on 12/19/2016.
 */
(function () {
    'use strict';

    var office = angular.module('naijalogosOffice');

    office.controller('imprestCtrl', ['$http', '$scope', '$localForage', '$location', function ($http, $scope, $localForage, $location) {
        $scope.addImprest = function () {

            $scope.imprest.isApproved = false
            $http.post('/office/imprests/', $scope.imprest)

            $scope.imprest = {}
        }
            activate();

            function activate() {
                $localForage.getItem('user').then(function (data) {
                    if (data) {
                        if (!!data.id) {
                            $location.url('/')
                        }
                    } else {
                        $location.url('/login')
                    }
                })
            }


    }])

    office.controller('vendorCtrl', ['$http', '$scope', '$localForage', '$location', function ($http, $scope, $localForage, $location) {

        $scope.vendor = {};
        $scope.addVendor = function () {
            var form = {
                vendor_name: $scope.vendor.vendorName,
                bank_name: $scope.vendor.bankName,
                account_details: $scope.vendor.accountDetails,
                job_description: $scope.vendor.jobDescription,
                quantity: $scope.vendor.quantity,
                currency: $scope.vendor.currency,
                amount_due: $scope.vendor.amountDue,
                delivery_date: $scope.vendor.deliveryDate,
                current_payment: $scope.vendor.currentPayment,
                outstanding_balance: $scope.vendor.outstandingBalance,
                is_approved: false
            }
            $http.post('/office/vendors/', form)

            $scope.vendor = {}
        }

        activate();
        function activate() {
            $localForage.getItem('user').then(function (data) {
                if (data) {
                    if (!!data.id) {
                        $location.url('/')
                    }
                } else {
                    $location.url('/login')
                }
            })
        }
    }])

    office.controller('homeCtrl',['$scope',function ($scope) {
        $scope.editingVendor = false;
        $scope.editingImprest = false

        $scope.isEditingVendor = function () {
            $scope.editingVendor = !$scope.editingVendor
            $scope.editingImprest = false;
        }
        $scope.isEditingImprest = function () {
            $scope.editingImprest = !$scope.editingImprest
            $scope.editingVendor = false;
        }

        $scope.cancelEditing = function () {
            $scope.editingVendor = false;
            $scope.editingImprest = false
        }

    }])
})();
