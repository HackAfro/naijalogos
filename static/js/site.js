if ('serviceWorker' in navigator && 'PushManager' in window) {

    navigator.serviceWorker.register('/sw.js')
        .then(function (registration) {
            console.log('Service worker registered: ', registration)
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
                            console.log('User is subscribed',pushSubscription)
                        } else {
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