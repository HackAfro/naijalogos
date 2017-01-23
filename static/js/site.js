
const applicationServerPublicKey = "BP4O6JMOaXNERv4-9jmlShJC0dmMHFoQPRdJysIARNwzVHtvluqZ5zjY2RUkY8K5psG6i2uMOQXyxWJRiZ9o-XE"

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}


if ('serviceWorker' in navigator && 'PushManager' in window) {

	navigator.serviceWorker.register('/sw.js')
	.then(function (registration) {
		console.log('Service worker registered: ' ,registration)
		if (registration.installing) {
			console.log('Installing')
		}
		registration.pushManager.subscribe({
			userVisibleOnly: true,
			})
			.then(
			function (pushSubscription) {

				isSubscribed = !(pushSubscription === null)

				if (isSubscribed) {
					console.log('User is subscribed')
				}else{
					console.log('User is not subscribed')
				}


			},
			function (err) {
				console.log(err)
			}
			)
	})
	.catch(function (err) {
		console.log('Service worker failed to register:', err)
	})
}