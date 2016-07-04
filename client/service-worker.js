var cache_version="main_###BUILD_TAG###";

self.addEventListener('install', function(event) {
  console.log('[DEBUG] On Install');
  event.waitUntil(
    caches.open(cache_version).then(function(cache) {
      return cache.addAll(cache_files);
    })
  );
});

var expectedCaches=[cache_version];

self.addEventListener('activate', function(event) {
    console.log('[DEBUG] On Activate');
 
    if(self.clients && clients.claim) {
        clients.claim();
    }
 
    // Suppression des anciens caches
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    console.log('[DEBUG] Processing cacheName ' + cacheName);
                    if(expectedCaches.indexOf(cacheName) === -1) {
                        console.log('[DEBUG] Deleting out of date cache : ' + cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', function(event) {
  console.log('[DEBUG] On fetch event for ', event.request.url);
  
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request);
    })
  );
});
