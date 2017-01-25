/**
 * Created by Afro on 12/19/2016.
 */
(function () {
    'use strict';

    var office = angular.module('naijalogosOffice');

    office.controller('imprestCtrl', ['$http', '$scope', '$localForage', '$location','Pusher', function ($http, $scope, $localForage, $location,Pusher) {
        $localForage.getItem('user').then(function (data) {
            $scope.user = data

            Pusher.subscribe($scope.user.username + '_inbox','update',function(item){
    
                $("#acc-imprest > p").text(item.message)
                    $("#acc-imprest").fadeTo(2000, 2000).slideUp(1000, function(){
                    $("#acc-imprest").slideUp(1000);
                })
            })
        });
        

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
            agent: $scope.billboard.agent,
        }
            $http.post('/office/billboards/', form).then(function(){
                   
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

        $scope.addDays = function(days) {
            if (days > 0){
                var date = new Date()
                date.setDate(date.getDate() + parseInt(days))
                var strDate = date.toDateString()
                var day = strDate.slice(8,10)
                var month = monthToInt(strDate.slice(4,7))
                var year = strDate.slice(11,15)
                var full = year+ '-' + month + '-' + day;
                return full
            }
            else {
                var date = new Date()
                var strDate = date.toDateString()
                var day = strDate.slice(8,10)
                var month = monthToInt(strDate.slice(4,7))
                var year = strDate.slice(11,15)
                var full = year + '-' + month + '-' + day;
                return full
            }

        }
        function monthToInt(month) {
            switch (month){
                case 'Jan':
                    return 1
                    break
                case 'Feb':
                    return 2
                    break
                case 'Mar':
                    return 3
                    break
                case 'Apr':
                    return 4
                    break
                case 'May':
                    return 5
                    break
                case 'Jun':
                    return 6
                    break
                case 'Jul':
                    return 7
                    break
                case 'Aug':
                    return 8
                    break
                case 'Sep':
                    return 9
                    break
                case 'Oct':
                    return 10
                    break
                case 'Nov':
                    return 11
                    break
                case 'Dec':
                    return 12
                    break
            }
        }

    }])

office.controller('jobCtrl', ['$scope', '$http', function($scope,$http){
    $scope.job = {}
    $scope.loading = false
    $scope.jobList = []

    function recentJob() {
        $scope.loading = true
        var url = '/office/jobs/'

        if ('caches' in window) {

            var networkPending = true
            caches.match(url).then(function (response) {
                if (response) {
                    response.json().then(function (json) {
                        if (networkPending) {
                            var jobs = json
                            $scope.jobList = []
                            if (jobs[jobs.length - 1] !== undefined) {
                                $scope.jobList.push(jobs[jobs.length - 1])
                            }
                            $scope.loading = false
                        }
                    })
                }
            })
        }

        $http.get(url).then(function (data) {
            var jobs = data.data
            $scope.jobList = []
            if (jobs[jobs.length - 1] !== undefined) {
                $scope.jobList.push(jobs[jobs.length - 1])
            }
            
            networkPending = false
            $scope.loading = false
        })

    }

    recentJob()

    $scope.create = function(editing){

        $scope.loading = true
        var form = {
            client_name: $scope.job.clientName,
            handler: $scope.job.handler,
            client_contact_person: $scope.job.clientContactPerson,
            job_description: $scope.job.jobDescription,
            amount_due: $scope.job.amountDue,
            amount_paid: $scope.job.amountPaid,
            balance: $scope.job.balance,
            percentage: $scope.job.percentage,
            client_no: $scope.job.clientNo,
            created_at: $scope.job.createdAt,
            remarks: $scope.job.remarks,
        }

        $http.post('/office/jobs/',form).then(function (data) {
            $scope.loading = false
            editing = false
            recentJob()
             $("#acc-imprest > p").text("Form submitted!")
             $("#acc-imprest").fadeTo(2000, 500).slideUp(500, function(){
             $("#acc-imprest").slideUp(500);
             });
        },
        function (err) {
            console.log(err)
            $scope.loading = false
             $("#acc-imprest > p").text("Error Submitting form, check network and try again")
             $("#acc-imprest").fadeTo(2000, 500).slideUp(500, function(){
             $("#acc-imprest").slideUp(500);
             });            
        })

        $scope.job = {}
    }
    

}])


office.controller('homeCtrl',['$scope',function ($scope) {
        $scope.editingVendor = false;
        $scope.editingImprest = false;
        $scope.editingBillboard = false;
        $scope.editingJob = false;


        $scope.isEditingVendor = function () {
            $scope.editingVendor = !$scope.editingVendor
            $scope.editingImprest = false;
            $scope.editingBillboard = false;
            $scope.editingJob = false

        }
        $scope.isEditingImprest = function () {
            $scope.editingImprest = !$scope.editingImprest
            $scope.editingVendor = false;
            $scope.editingBillboard = false;
            $scope.editingJob = false
        }

        $scope.isEditingBillboard = function(){
            $scope.editingBillboard = !$scope.editingBillboard;
            $scope.editingVendor = false;
            $scope.editingImprest = false;
            $scope.editingJob = false
        }

        $scope.isEditingJob = function(){
            $scope.editingJob = !$scope.editingJob;
            $scope.editingVendor = false;
            $scope.editingImprest = false;
            $scope.editingBillboard = false;
        }

        $scope.cancelEditing = function () {
            $scope.editingVendor = false;
            $scope.editingImprest = false;
            $scope.editingBillboard = false;
            $scope.editingJob = false

        }
    }])
})();
