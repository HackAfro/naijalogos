var isPushEnabled = false,
subBtn,
isSubscribed,
registration;

subBtn = document.getElementById('webpush');

if ('serviceWorker' in navigator && 'PushManager' in window) {
	console.log("Push and Service Worker supported")
	
	navigator.serviceWorker.register('/sw.js')
		.then(function(reg) {
			console.log('Service Worker registered', reg)
			registration = reg
			
			$(document).ready(initialise)
		})
		.catch(function(err) {
			console.log('Service Worker error',err)
		});
}else{
	console.warn('Push messaging not supported')
}

function initialise() {
	$(document).on('click','#webpush',function(){
		subBtn.disabled = true;
		
		if (isSubscribed) {
			unsubscribeUser()
		}else{
			subscribeUser()
		}
	})
	
	registration.pushManager.getSubscription()
		.then(function(sub) {
			isSubscribed = !(sub === null)
			
			if (isSubscribed) {
				console.log('User is subscribed')
				postSubscribeObj('subscribe',sub)
			}else{
				console.log('User is Not subscribed')
				$('#show').addClass('notify')
			}
		})
		
	updateBtn()	
}

function updateBtn() {
	subBtn = document.getElementById('webpush');
	
	if (Notification.permission === 'denied') {
		subBtn.textContent = 'Push messaging blocked';
		subBtn.disabled = true;
		postSubscribeObj('unsubscribe',null)
		return;
			
	}
	  
	if (isSubscribed) {
		console.log("Is subscribed")
			
	}else{
		console.log('Not subscribed')
	}
	
	subBtn.disabled = false
}

function subscribeUser() {
	registration.pushManager.subscribe({
		userVisibleOnly: true
	})
	 .then(function(subscription) {
		console.log('User is subscribed')
		
		postSubscribeObj('subscribe',subscription)
		
		isSubscribed = true
		$('#slider > label').text('Push Enabled')
		setTimeout(() => {
			$('#show').removeClass('notify')
			$('#show').addClass("push")
		}, 2000);
		
		
		updateBtn()
	})
	.catch(function(err) {
		console.log('Failed to subscribe user: ',err)
		updateBtn()
	})
}

function unsubscribeUser() {
	  registration.pushManager.getSubscription()
	  .then(function(subscription) {
	    if (subscription) {
	      postSubscribeObj('unsubscribe',subscription);
	      return subscription.unsubscribe();
	    }
	  })
	  .catch(function(error) {
	    console.log('Error unsubscribing', error);
	  })
	  .then(function() {

	    console.log('User is unsubscribed.');
	    isSubscribed = false;

	    updateBtn();
	  });
	}


function postSubscribeObj(statusType, subscription) {
	// Send the information to the server with fetch API.
	// the type of the request, the name of the user subscribing, 
	// and the push subscription endpoint + key the server needs
	// to send push messages

	var browser = navigator.userAgent.match(/(firefox|msie|chrome|safari|trident)/ig)[0].toLowerCase(),
	  data = {  status_type: statusType,
	            subscription: subscription.toJSON(),
	            browser: browser,
	            group: subBtn.dataset.group
	         };

	fetch('/webpush/save_information', {
	  method: 'post',
	  headers: {'Content-Type': 'application/json'},
	  body: JSON.stringify(data),
	  credentials: 'include'
	})
	  .then(
	    function(response) {
	      // Check the information is saved successfully into server
	      if ((response.status == 201) && (statusType == 'subscribe')) {
	        // Show unsubscribe button instead
	    	
	        subBtn.disabled = false;
	      }
	      
	      else{
		    	  isSubscribed = false
		    	  console.log('Error: ',response)
		      }  
	      }
	  )
}