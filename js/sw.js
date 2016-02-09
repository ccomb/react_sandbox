// put the assets in cache
this.addEventListener('install', function(e) {
    console.log('SW installed');
});

// return the cached assets on request
this.addEventListener('fetch', function(e) {
    console.log('SW got fetch event for ' + e.request.url);
    e.respondWith(
        caches.match(e.request).then(function(cachedresponse){
            console.log('SW cache match got ' + cachedresponse);
            return cachedresponse ||
                fetch(e.request.url).then(function(response){
                    console.log('SW need to fetch ' + e.request.url);
                    if (response) {
                    caches.open('v1').then(function(cache) {
                        console.log('SW storing ' + e.request.url)
                        cache.put(e.request, response.clone()).then(function(response){
                            return response;
                        })
                    }).catch(function(error) {
                        console.log(error)
                    })
                    }
                }).catch(function(error){
                    console.log('SW fetch error');
                })
        })
    )
})
