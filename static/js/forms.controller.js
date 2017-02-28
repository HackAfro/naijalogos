(function () {
    'use strict';

    var office = angular.module('naijalogosOffice');

    office.controller('imprestCtrl', ['$http', '$scope', '$localForage', '$location', 'Pusher', function ($http, $scope, $localForage, $location, Pusher) {
        $localForage.getItem('user').then(function (data) {
            $scope.user = data
        });


        $scope.addImprest = function () {
            $scope.loading = true
            $scope.imprest.isApproved = false
            $http.post('/office/imprests/', $scope.imprest)
                .then(function () {
                    $scope.loading = false
                    $("#acc-imprest > p").text("Form sent!!. You'll be notified once it's accepted!!")
                    
                    $("#acc-imprest").fadeTo(5000, 500).slideUp(500, function () {
                    	 $("#acc-imprest").slideUp(500);
                    });
                    
                    
                }, function () {
                    $scope.loading = false
                    $("#acc-imprest > p").text("Error submitting form, please try again!!")
                    $("#acc-imprest").fadeTo(5000, 500).slideUp(500, function () {
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

            $scope.loading = true

            if ($scope.newVendor) {
                var vendor = {
                    name: $scope.vendor.vendorName,
                    bank_name: $scope.vendor.bankName,
                    account_details: $scope.vendor.accountDetails,
                    mobile: $scope.vendor.mobile,
                    email: $scope.vendor.email
                }

                $http.post('/office/vendor/',vendor).then(function () {
                    $("#acc-imprest > p").text("New vendor has been added successfully")
                    $("#acc-imprest").fadeTo(5000, 500).slideUp(500, function () {
                        $("#acc-imprest").slideUp(500);
                    });
                })   
            }

            var form = {
                    vendor_name: $scope.vendor.vendorName,
                    bank_name: $scope.vendor.bankName,
                    account_details: $scope.vendor.accountDetails,
                    mobile: $scope.vendor.mobile,
                    email: $scope.vendor.email,
                    job_description: $scope.vendor.jobDescription,
                    quantity: $scope.vendor.quantity,
                    currency: $scope.vendor.currency,
                    amount_due: $scope.vendor.amountDue,
                    delivery_date: $scope.vendor.deliveryDate,
                    current_payment: $scope.vendor.currentPayment,
                    outstanding_balance: $scope.vendor.outstandingBalance,
                }
    

            $http.post('/office/vendors/', form)
            .then(function () {
                $scope.loading = false
                $("#acc-imprest > p").text("Form sent!!. You'll be notified once it's accepted!!")
                $("#acc-imprest").fadeTo(5000, 500).slideUp(500, function () {
                    $("#acc-imprest").slideUp(500);
                });
            }, function () {
                $scope.loading = false
                $("#acc-imprest > p").text("Error submitting form, please try again!!")
                $("#acc-imprest").fadeTo(5000, 500).slideUp(500, function () {
                    $("#acc-imprest").slideUp(500);
                });
            })
            
            $scope.vendor = {}    
        }

        $scope.vendorDetails = function (index) {
            $scope.vendor.vendorName = $scope.vendors[index].name
            $scope.vendor.bankName = $scope.vendors[index].bank_name
            $scope.vendor.accountDetails = $scope.vendors[index].account_details
            $scope.vendor.mobile = $scope.vendors[index].mobile
            $scope.vendor.email = $scope.vendors[index].email
        }

        function getVendors() {
            $http.get('/office/vendor/').then(function (vendors) {
                $scope.vendors = vendors.data
                $('.ui.selection.dropdown').dropdown()
            })
        }

        getVendors()

        $('.ui.fluid.dropdown').dropdown()


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

    office.controller('billboardCtrl', ['$scope', '$http', function ($scope, $http) {

        $scope.billboard = {}

        $scope.create = function () {
            $scope.loading = true
            var form = {
                client_name: $scope.billboard.clientName,
                start_date: $scope.billboard.entryDate,
                duration: $scope.billboard.duration,
                location: $scope.billboard.location,
                amount_due: $scope.billboard.amountDue,
                amount_paid: $scope.billboard.amountPaid,
                balance: $scope.billboard.balance,
                expiry_date: $scope.billboard.expiryDate,
                client_mobile: $scope.billboard.mobile,
                agent: $scope.billboard.agent,
            }
            $http.post('/office/leases/', form).then(function () {
                $scope.loading = false
                $("#acc-imprest > p").text("Billboarb entry success!")
                $("#acc-imprest").fadeTo(5000, 500).slideUp(500, function () {
                    $("#acc-imprest").slideUp(500);
                });
            }, function () {
                $scope.loading = false
                $("#acc-imprest > p").text("Error submitting form, please try again!!")
                $("#acc-imprest").fadeTo(5000, 500).slideUp(500, function () {
                    $("#acc-imprest").slideUp(500);
                });
            })


            $scope.billboard = {}
        }

        $scope.addDays = function (days) {
            if (days > 0) {
                if ($scope.billboard.entryDate) {
                    var date = new Date($scope.billboard.entryDate)
                    console.log($scope.billboard.entryDate)
                    console.log(date)
                    date.setDate(date.getDate() + parseInt(days))
                    var strDate = date.toDateString()
                    var day = strDate.slice(8, 10)
                    var month = monthToInt(strDate.slice(4, 7))
                    var year = strDate.slice(11, 15)
                    var full = year + '-' + month + '-' + day;
                    return full
                }

            }
            else {
                var date = new Date()
                var strDate = date.toDateString()
                var day = strDate.slice(8, 10)
                var month = monthToInt(strDate.slice(4, 7))
                var year = strDate.slice(11, 15)
                var full = year + '-' + month + '-' + day;
                return full
            }

        }
        function monthToInt(month) {
            switch (month) {
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

    office.controller('jobCtrl', ['$scope', '$http', function ($scope, $http) {
        $scope.job = {}
        $scope.loading = false
        $scope.jobList = []

        $scope.loading = true

        setTimeout(() => {
            var url = '/office/jobs/'

            if ('caches' in window
        )
        {

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


    },
        2000
        )
        ;


        $scope.create = function (editing) {

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

            $http.post('/office/jobs/', form).then(function (data) {
                    $scope.loading = false
                    editing = false
                    recentJob()
                    $("#acc-imprest > p").text("Form submitted!")
                    $("#acc-imprest").fadeTo(5000, 500).slideUp(500, function () {
                        $("#acc-imprest").slideUp(500);
                    });
                },
                function (err) {
                    console.log(err)
                    $scope.loading = false
                    $("#acc-imprest > p").text("Error Submitting form, check network and try again")
                    $("#acc-imprest").fadeTo(5000, 500).slideUp(500, function () {
                        $("#acc-imprest").slideUp(500);
                    });
                })

            $scope.job = {}
        }


    }])


    office.controller('homeCtrl', ['$scope', function ($scope) {
        $scope.editingVendor = false;
        $scope.editingImprest = false;
        $scope.editingBillboard = false;
        $scope.editingJob = false;


        $scope.isEditingVendor = function () {
            $scope.editingVendor = !$scope.editingVendor
            $scope.editingImprest = false;
            $scope.editingBillboard = false;
            $scope.editingJob = false

            $('html,body').animate({
                scrollTop: 1005.4166870117188

            }, 'slow')

        }
        $scope.isEditingImprest = function () {
            $scope.editingImprest = !$scope.editingImprest
            $scope.editingVendor = false;
            $scope.editingBillboard = false;
            $scope.editingJob = false


            $('html,body').animate({
                scrollTop: 1005.4166870117188

            }, 'slow')
        }

        $scope.isEditingBillboard = function () {
            $scope.editingBillboard = !$scope.editingBillboard;
            $scope.editingVendor = false;
            $scope.editingImprest = false;
            $scope.editingJob = false

            $('html,body').animate({
                scrollTop: 1005.4166870117188

            }, 'slow')
        }

        $scope.isEditingJob = function () {
            $scope.editingJob = !$scope.editingJob;
            $scope.editingVendor = false;
            $scope.editingImprest = false;
            $scope.editingBillboard = false;

            $('html,body').animate({
                scrollTop: 1005.4166870117188

            }, 'slow')
        }

        $scope.cancelEditing = function () {
            $scope.editingVendor = false;
            $scope.editingImprest = false;
            $scope.editingBillboard = false;
            $scope.editingJob = false

            $('html,body').animate({
                scrollTop: 1005.4166870117188

            }, 'slow')

        }
    }])
})();
