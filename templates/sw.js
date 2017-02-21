var fileCache = 'naijalogos-files-v4'
var dataCache = 'naijalogos-data'

var files = [
				'/',
				'/static/html/home.html',
				'https://fonts.googleapis.com/css?family=Lato:400,700,400italic,700italic&subset=latin',
				'https://fonts.gstatic.com/s/lato/v11/H2DMvhDLycM56KNuAtbJYA.woff2',
				'https://fonts.gstatic.com/s/lato/v11/ObQr5XYcoH0WBoUxiaYK3_Y6323mHUZFJMgTvxaG2iE.woff2',
				'//ajax.googleapis.com/ajax/libs/angularjs/1.6.0/angular-touch.js',
				'/static/html/imprests.html',
				'/static/images/nl.png',
				'/static/images/web.png',
				'/static/images/web1.png',
				'/static/html/login.html',
				'/static/html/nav.html',
				'/static/html/notify.html',
				'https://ajax.googleapis.com/ajax/libs/angularjs/1.6.0/angular.js',
				'/static/js/angular-localForage.js',
				'https://ajax.googleapis.com/ajax/libs/angularjs/1.6.0/angular-route.js',
				'/static/js/localforage.min.js',
				'https://code.jquery.com/jquery-2.2.4.min.js',
				'/static/js/style.js',
				'/static/css/style.css',
				'https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.6/semantic.min.js',
				'https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.6/semantic.min.css',
				'/static/html/notifications.html',
				'/static/html/profile.html',
				'https://cdnjs.cloudflare.com/ajax/libs/angular-pusher/0.0.14/angular-pusher.min.js',
				'//cdnjs.cloudflare.com/ajax/libs/angular-moment/0.9.0/angular-moment.min.js',
				'//cdnjs.cloudflare.com/ajax/libs/moment.js/2.9.0/moment.min.js',
				'/static/js/notify.directive.js',
				'/static/js/forms.controller.js',
				'/static/js/site.js',
				'/static/js/profile.controller.js',
				'/static/js/office.config.js',
				'/static/js/notifications.controller.js',
				'/static/js/navbar.directive.js',
				'/static/js/jobs.controller.js',
				'/static/html/jobs.html',
				'/static/images/file.png',
				'/static/js/account.controller.js',
				'/static/html/accounts.html',
				'/static/html/billboard.html',
				'/static/js/billboard.controller.js',
		        '/static/html/sidebarmenu.html',
                '/static/js/menu.directive.js',
                '/static/js/swipe.controller.js',
                '/static/html/vendor.html',
                '/static/js/vendor.controller.js',
                '/static/js/sidebar.controller.js',
                '/static/js/angular-animate.js',
                '/static/images/calendar.png',
                '/static/images/avatar.png',
                '/static/css/animate.css',
                '/static/images/cancel.png',
                '/static/images/check-mark-button.png',
                '/static/js/vendors.controller.js',
                '/static/html/vendors.html'
			]

self.addEventListener('install',function (e) {
	e.waitUntil(
		caches.open(fileCache).then(function (cache) {
			cache.addAll(files).then(function () {
				self.skipWaiting()
			})
		})
		);
});

self.addEventListener('activate',function (event) {
	event.waitUntil(
		caches.keys().then(function (cacheNames) {
			return Promise.all(
				cacheNames.filter(function (cacheName) {
					return cacheName !== fileCache
				}).map(function (cacheName) {
					return caches.delete(cacheName)
				})
				)
		})
		)
})


self.addEventListener('fetch',function (event) {
	var url = event.request.url

	console.log('[ServiceWorker] fetch', url);

	if (url === 'https://www.naijalogosoffice.com/office/vendors/' || url === 'https://www.naijalogosoffice.com/office/vendor/' || url === 'https://www.naijalogosoffice.com/office/billboards/' || url === 'https://www.naijalogosoffice.com/office/imprests/' || url === 'https://www.naijalogosoffice.com/office/messages/' || url === 'https://www.naijalogosoffice.com/office/jobs/' || url === 'https://www.naijalogosoffice.com/office/balance/' || url === 'https://www.naijalogosoffice.com/api/inbox/' || url === 'https://www.naijalogosoffice.com/office/credits/') {
		console.log('Getting data')
		console.log('Method: ',event.request.method)

		event.respondWith(fetch(event.request).then(function (r) {
			if ( event.request.method === 'GET') {
				req = r.clone()
				caches.open(dataCache).then(function (cache) {
					cache.put(url,req)
					console.log('Cached data')
			})
			}
			return r
			})
		)
	}else{
		event.respondWith(caches.match(event.request).then(function (response) {
			return response || fetch(event.request)
		})
		)
	}

	
	
	
})


// Register event listener for the 'push' event.
self.addEventListener('push', function(event) {
  // Retrieve the textual payload from event.data (a PushMessageData object).
  // Other formats are supported (ArrayBuffer, Blob, JSON), check out the documentation
  // on https://developer.mozilla.org/en-US/docs/Web/API/PushMessageData.
	if (event.data !== null) {
		var notification = event.data.json()
		var title = notification.head
		var body = notification.body
		console.log(notification)
	}
	else{
		var title = "NaijalogosOffice";
		var body = "There's no content"
	}
	
	if (notification.tag === 'created') {
		var actions = [
    	    { action: "accept", title: "Accept", icon: "/static/images/check-mark-button.png" },
    	    { action: "cancel", title: "Cancel", icon: "/static/images/cancel.png" }
    	  ]
	} else {
		var actions = null
	}
	
  // Keep the service worker alive until the notification is created.
  event.waitUntil(
    // Show a notification with title 'ServiceWorker Cookbook' and use the payload
    // as the body.
    self.registration.showNotification(title, {
      body: body,
      icon: '/static/images/icon256.png',
      vibrate: [200,100,200,100,200,100,400],
      //actions : actions
    })
  );
});

self.addEventListener('notificationclick', function(event) {  
	  console.log('On notification click: ', event.notification.tag);  
	  // Android doesn't close the notification when you click on it  
	  // See: http://crbug.com/463146  
	  event.notification.close();

	  // This looks to see if the current is already open and  
	  // focuses if it is  
	  event.waitUntil(
	    clients.matchAll({  
	      type: "window"  
	    })
	    .then(function(clientList) {  
	      for (var i = 0; i < clientList.length; i++) {  
	        var client = clientList[i];  
	        if (client.url == '/' && 'focus' in client)  
	          return client.focus();  
	      }  
	      if (clients.openWindow) {
	        return clients.openWindow('/#!/notifications');  
	      }
	    })
	  );
	});