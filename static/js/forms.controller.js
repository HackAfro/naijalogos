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
                .then(function(){
                    $("#acc-imprest > p").text("Form sent!!. You'll be notified once it's accepted!!")
                    $("#acc-imprest").fadeTo(2000, 500).slideUp(500, function(){
                    $("#acc-imprest").slideUp(500);
                    });
            },function(){
                    $("#acc-imprest > p").text("Error submitting form, please try again!!")
                    $("#acc-imprest").fadeTo(2000, 500).slideUp(500, function(){
                    $("#acc-imprest").slideUp(500);
                    });
            })

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
                  .then(function(){
                    $("#acc-imprest > p").text("Form sent!!. You'll be notified once it's accepted!!")
                    $("#acc-imprest").fadeTo(2000, 500).slideUp(500, function(){
                    $("#acc-imprest").slideUp(500);
                    });
            },function(){
                    $("#acc-imprest > p").text("Error submitting form, please try again!!")
                    $("#acc-imprest").fadeTo(2000, 500).slideUp(500, function(){
                    $("#acc-imprest").slideUp(500);
                    });
            })


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

    office.controller('billboardCtrl', ['$scope', '$http', function($scope, $http){
        $scope.billboard = {}

        $scope.create = function(){
             var form = {
            client_name: $scope.billboard.clientName,
            entry_date: $scope.billboard.entryDate,
            duration: $scope.billboard.duration,
            location: $scope.billboard.location,
            amount_due: $scope.billboard.amountDue,
            amount_paid: $scope.billboard.amountPaid,
            balance: $scope.billboard.balance,
            expiry_date: $scope.billboard.expiryDate,
            client_mobile: $scope.billboard.mobile,
            is_expired: false,
        }
            $http.post('/office/billboards/', form)
                  .then(function(){
                    $("#acc-imprest > p").text("Form sent!!. You'll be notified once it's accepted!!")
                    $("#acc-imprest").fadeTo(2000, 500).slideUp(500, function(){
                    $("#acc-imprest").slideUp(500);
                    });
            },function(){
                    $("#acc-imprest > p").text("Error submitting form, please try again!!")
                    $("#acc-imprest").fadeTo(2000, 500).slideUp(500, function(){
                    $("#acc-imprest").slideUp(500);
                    });
            })


            $scope.billboard = {}
        }

    }])

    office.controller('homeCtrl',['$scope',function ($scope) {
        $scope.editingVendor = false;
        $scope.editingImprest = false;
        $scope.editingBillboard = false;


        $scope.isEditingVendor = function () {
            $scope.editingVendor = !$scope.editingVendor
            $scope.editingImprest = false;
            $scope.editingBillboard = false;

        }
        $scope.isEditingImprest = function () {
            $scope.editingImprest = !$scope.editingImprest
            $scope.editingVendor = false;
            $scope.editingBillboard = false;
        }

        $scope.isEditingBillboard = function(){
            $scope.editingBillboard = !$scope.editingBillboard;
            $scope.editingVendor = false;
            $scope.editingImprest = false;
        }

        $scope.cancelEditing = function () {
            $scope.editingVendor = false;
            $scope.editingImprest = false;
            $scope.editingBillboard = false;

        }
    }])
})();
