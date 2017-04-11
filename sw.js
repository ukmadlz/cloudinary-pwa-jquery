(function () {
  "use strict";

  var cacheNameStatic = 'cloudinary-pwa-jquery-v1';

  var currentCacheNames = [ cacheNameStatic ];

  var cachedUrls = [
    // 3rd party CDN
    'https://cdnjs.cloudflare.com/ajax/libs/materialize/0.98.1/css/materialize.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/materialize/0.98.1/js/materialize.min.js',
    'https://code.jquery.com/jquery-3.2.1.js',
    // Local assets
    '/style.css',
    '/app.js',
    '/bower_components/webcomponentsjs/webcomponents.js',
    '/bower_components/cloudinary-jquery/cloudinary-jquery.js',
    // Components
    '/components/photo-thumb.html',
    '/components/photo-view.html',
    // Fake API
    '/images.json'
  ];

  // A new ServiceWorker has been registered
  self.addEventListener("install", function (event) {
    event.waitUntil(
      caches.delete(cacheNameStatic).then(function() {
        return caches.open(cacheNameStatic);
      }).then(function (cache) {
        return cache.addAll(cachedUrls);
      }).catch(function(e) {
      })
    );
  });

  // A new ServiceWorker is now active
  self.addEventListener("activate", function (event) {
    event.waitUntil(
      caches.keys()
        .then(function (cacheNames) {
          return Promise.all(
            cacheNames.map(function (cacheName) {
              if (currentCacheNames.indexOf(cacheName) === -1) {
                return caches.delete(cacheName);
              }
            })
          );
        })
    );
  });

  // Save thing to cache in process of use
  self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open(cacheNameStatic).then(function(cache) {
      return cache.match(event.request).then(function(response) {
        var fetchPromise = fetch(event.request).then(function(networkResponse) {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        })
        return response || fetchPromise;
      })
    })
  );
});

})();
