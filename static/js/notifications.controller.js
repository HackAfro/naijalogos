
/**
 * Created by Afro on 12/19/2016.
 */
(function () {
	'use strict';

	var office = angular.module('naijalogosOffice');

	office.controller('notificationCtrl', ['$scope', '$http','$localForage','Pusher',function($scope,$http,$localForage,Pusher){
		$localForage.getItem('user').then(function (data) {
            $scope.user = data

            $http.get('/api/inbox/').then(function(data){
			var latest = data.data
			for(var i=0; i<latest.length; i++){
				latest[i].tags = JSON.parse(latest[i].tags) 
			}
			$scope.latest = latest.reverse()
			$scope.loading = false
			if (!$scope.user.is_staff) {
				$http.post('/api/mark_all_read/')
			}
		})

            Pusher.subscribe($scope.user.username + '_inbox','update',function(item){
            $scope.loading = true
            $http.get('/api/inbox/').then(function(data){
            	var latest = data.data
				for(var i=0; i<latest.length; i++){
					latest[i].tags = JSON.parse(latest[i].tags) 
				}	
				$scope.latest = latest.reverse()
				$scope.loading = false
            })
            $("#acc-imprest > p").text(item.message)
				$("#acc-imprest").fadeTo(2000, 2000).slideUp(1000, function(){
				$("#acc-imprest").slideUp(1000);
			})
        })
        });

        
       

		

        $scope.tab = 1;
        
        $scope.selectTab = function(tab){
            $scope.tab = tab;
        }
        
        $scope.isSelected = function(checktab){
            return $scope.tab === checktab
        }

        

		$scope.loading = true
		
		

		$http.get('/office/messages/').then(function(data){
			var messages = data.data
			for (var i = 0; i<messages.length; i++) {
				messages[i].message.tags = JSON.parse(messages[i].message.tags)
			}
			$scope.messages = messages
		})

		$scope.view = function(feed){
            if (feed.url.indexOf('v') === -1){
                feed.conLoading = true
                $localForage.getItem('details' + feed.id).then(function(data){
                    var details = data.data
                    if (details.description){
                    	
                    	var id = feed.id
                    	$scope.details = {}

                    	$scope.details.id = id
                    	$scope.details.data = details
                    	feed.conLoading =false
                   }else{
                   	$http.get(feed.url).then(function(data){
                        var details = data.data
                        
                        var id = feed.id
                        $scope.details = {}
                        $scope.details.id = id
                        $scope.details.data = details
                        $localForage.setItem('details' + id,$scope.details)
                        feed.conLoading =false
                    })
                   		
                   }
                }).catch(function(err){
                    $http.get(feed.url).then(function(data){
                        var details = data.data
                    
                        var id = feed.id
                        $scope.details = {}
                        $scope.details.id = id
                        $scope.details.data = details
                        $localForage.setItem('details' + id,$scope.details)
                        feed.conLoading =false
                    },function(){
                    	feed.conLoading = false
                		$("#acc-imprest > p").text("Error getting details, please try again :(")
						$("#acc-imprest").fadeTo(2000, 500).slideUp(500, function(){
						$("#acc-imprest").slideUp(500);
					})
                    })
                })
            }else {
            	

            	$localForage.getItem('details' + feed.id).then(function(data){
            		feed.conLoading = true
            		var details = data.data
            		if (details.vendor_name){
            			var id = feed.id
                    
                    	$scope.vendor = {}
                    	$scope.vendor.id = id
                    	$scope.vendor.data = details
                    	feed.conLoading = false
                }else{
                	$http.get(feed.url).then(function (data) {
                    feed.conLoading = true
                    var details = data.data
                    var id = feed.id
                    
                    $scope.vendor = {}
                    $scope.vendor.id = id
                    $scope.vendor.data = details
                    $localForage.setItem('details' + id,$scope.vendor)
                    feed.conLoading = false
                
                	})
                }
                    
            	}).catch(function(err){
            		$http.get(feed.url).then(function (data) {
                    feed.conLoading = true
                    var details = data.data
                    var id = feed.id
                    
                    $scope.vendor = {}
                    $scope.vendor.id = id
                    $scope.vendor.data = details
                    $localForage.setItem('details' + id,$scope.vendor)
                    feed.conLoading = false
                
                	},function(){
                		feed.conLoading = false
                		$("#acc-imprest > p").text("Error getting details, please try again :(")
						$("#acc-imprest").fadeTo(2000, 500).slideUp(500, function(){
						$("#acc-imprest").slideUp(500);
					});

                	})
            	})  
            }
		}
		

		$scope.update = function(imprest){
			if (imprest.data.description){
				$scope.loadingForm = true
				$http.put('/office/imprests/' + imprest.data.id + '/', imprest.data).then(function(data){
					$scope.loadingForm = false
					$localForage.removeItem('details' + imprest.id)
					$("#acc-imprest > p").text("Form edited!")
						$("#acc-imprest").fadeTo(2000, 500).slideUp(500, function(){
						$("#acc-imprest").slideUp(500);
					});
				},function(){
					$scope.loadingForm = false
					$("#acc-imprest > p").text("Error editing form, please try again :(")
						$("#acc-imprest").fadeTo(2000, 500).slideUp(500, function(){
						$("#acc-imprest").slideUp(500);
					});
				})
			}else{
				$scope.loadingForm = true
				$http.put('/office/vendors/' + imprest.data.id + '/', imprest.data).then(function(){
					$scope.loadingForm = false
					$localForage.removeItem('details' + imprest.id)
					$("#acc-imprest > p").text("Form edited!")
						$("#acc-imprest").fadeTo(2000, 500).slideUp(500, function(){
						$("#acc-imprest").slideUp(500);
					});
				},function(){
					$scope.loadingForm = false
					$("#acc-imprest > p").text("Error editing form, please try again :(")
						$("#acc-imprest").fadeTo(2000, 500).slideUp(500, function(){
						$("#acc-imprest").slideUp(500);
					});
				})

			}
			
		}

		$scope.modelOptions = {
			debounce: 1000
		};

		$scope.acceptImprest = function (imprest, feed, index) {
			var imprests;
			if (imprest){
				var newImprest = imprest.data
				
				feed.loading = true
				newImprest.is_approved = true
				$http.put(feed.url, newImprest)
					.then(function(){
						$("#acc-imprest > p").text("Imprest accepted!! :)")
						$("#acc-imprest").fadeTo(2000, 500).slideUp(500, function(){
						$("#acc-imprest").slideUp(500);
						});
						var id = feed.id
						$http.post('/api/inbox/' + id + '/read/')
						feed.loading = false
						$scope.latest.splice(index,1)

					},function(){
						$("#acc-imprest > p").text("Error accepting imprest, please try again :(")
						$("#acc-imprest").fadeTo(2000, 500).slideUp(500, function(){
						$("#acc-imprest").slideUp(500);
						});
						feed.loading = false
			})
			}else{
				$http.get(feed.url).then(function(data){
					feed.loading = true
					imprests = data.data
						
					imprests.is_approved = true
					$http.put(feed.url,imprests).then(function(){
						$("#acc-imprest > p").text("Imprest accepted!! :)")
						$("#acc-imprest").fadeTo(2000, 500).slideUp(500, function(){
						$("#acc-imprest").slideUp(500);
						});
						var id = feed.id
						$http.post('/api/inbox/' + id + '/read/')
						feed.loading = false
						$scope.latest.splice(index,1)

					},
					function(){
						$("#acc-imprest > p").text("Error accepting imprest, please try again :(")
						$("#acc-imprest").fadeTo(2000, 500).slideUp(500, function(){
						$("#acc-imprest").slideUp(500);
						});
						feed.loading = false
					})				
				})
			}
			
		};

		$scope.acceptVendor = function(vendor, feed, index){
			var data
			if (vendor){
				var newVendor = vendor.data
				feed.loading = true
				
				newVendor.is_approved = true
				$http.put(feed.url, newVendor)
					.then(function(){
						$("#acc-imprest > p").text("Vendor remittance form approved!!")
						$("#acc-imprest").fadeTo(2000, 500).slideUp(500, function(){
						$("#acc-imprest").slideUp(500);
						});
						var id = feed.id
						$http.post('/api/inbox/' + id + '/read/')
						feed.loading = false
						$scope.latest.splice(index,1)

					},function(){
						$("#acc-imprest > p").text("Error approving form, please try again :(")
						$("#acc-imprest").fadeTo(2000, 500).slideUp(500, function(){
						$("#acc-imprest").slideUp(500);
						});
						feed.loading = false
				})
			}else{
				$http.get(feed.url).then(function(data){
					feed.loading = true
					
					data = data.data	
					data.is_approved = true
					$http.put(feed.url,data).then(function(){
						$("#acc-imprest > p").text("Vendor remittance form approved!!")
						$("#acc-imprest").fadeTo(2000, 500).slideUp(500, function(){
						$("#acc-imprest").slideUp(500);
						});
						var id = feed.id
						$http.post('/api/inbox/' + id + '/read/')
						feed.loading = false
						$scope.latest.splice(index,1)

					},
					function(){
						$("#acc-imprest > p").text("Error approving form, please try again :(")
						$("#acc-imprest").fadeTo(2000, 500).slideUp(500, function(){
						$("#acc-imprest").slideUp(500);
						});
						feed.loading = false
					})				
				})
			}

		}
	}])
})();/**
 * Created by Afro on 1/7/2017.
 */