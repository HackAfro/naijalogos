var fileCache = 'naijalogos-files'
var dataCache = 'naijalogos-data'

var files = [
				'./',
				'/static/html/home.html',
				'https://fonts.googleapis.com/css?family=Lato:400,700,400italic,700italic&subset=latin',
				'https://fonts.gstatic.com/s/lato/v11/H2DMvhDLycM56KNuAtbJYA.woff2',
				'https://fonts.gstatic.com/s/lato/v11/ObQr5XYcoH0WBoUxiaYK3_Y6323mHUZFJMgTvxaG2iE.woff2',
				'/static/html/imprests.html',
				'/static/images/nl.png',
				'/static/images/web.png',
				'/static/images/web1.png',
				'/static/html/login.html',
				'/static/html/nav.html',
				'/static/html/notify.html',
				'/static/html/sidebar.html',
				'https://ajax.googleapis.com/ajax/libs/angularjs/1.6.0/angular.js',
				'/static/js/angular-localForage.js',
				'https://ajax.googleapis.com/ajax/libs/angularjs/1.6.0/angular-route.js',
				'/static/js/localforage.min.js',
				'/static/js/jquery-2.1.1.js',
				'https://code.jquery.com/jquery-2.2.4.min.js',
				'/static/js/style.js',
				'/static/css/style.css',
				'/static/Semantic-UI-1.0/dist/semantic.js',
				'https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.6/semantic.min.js',
				'https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.6/semantic.min.css',
				'/static/Semantic-UI-1.0/dist/themes/default/assets/fonts/icons.eot',
				'/static/Semantic-UI-1.0/dist/themes/default/assets/fonts/icons.svg',
				'/static/Semantic-UI-1.0/dist/themes/default/assets/fonts/icons.ttf',
				'/static/Semantic-UI-1.0/dist/themes/default/assets/fonts/icons.woff',
				'/static/html/notifications.html',
				'/static/html/profile.html',
				'https://cdnjs.cloudflare.com/ajax/libs/angular-pusher/0.0.14/angular-pusher.min.js',
				'//cdnjs.cloudflare.com/ajax/libs/angular-moment/0.9.0/angular-moment.min.js',
				'//cdnjs.cloudflare.com/ajax/libs/moment.js/2.9.0/moment.min.js',
				'/static/js/notify.directive.js',
				'/static/js/forms.controller.js',
				'/static/js/sidebar.directive.js',
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
			]
self.addEventListener('install',function (e) {
	e.waitUntil(
		caches.open(fileCache).then(function (cache) {
			cache.addAll(files)
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

	if (url === 'http://127.0.0.1:8000/office/vendors/' || url === 'http://127.0.0.1:8000/office/imprests/' || url === 'http://127.0.0.1:8000/office/messages/' || url === 'http://127.0.0.1:8000/office/jobs/' || url === 'http://127.0.0.1:8000/office/balance/' || url === 'http://127.0.0.1:8000/api/inbox/' || url === 'http://127.0.0.1:8000/office/credits/') {
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
