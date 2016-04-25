var CACHE_NAME = 'shri-2016-task3-1';

var urlsToCache = [
  '/',
  '/css/index.css',
  '/js/index.js',
  '/index.html'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                return cache.addAll(urlsToCache);
            })
    );
});

function fetchAndPutToCache(request) {
    var fetchRequest = request.clone();
    return fetch(fetchRequest).then((response) => {
        return caches.open(CACHE_NAME).then((cache) => {
            cache.put(fetchRequest, response.clone());
            return response || caches.match(request).then(function (response) {
                    return response
                });
        })
    }).catch((error) => {
        console.log('Error: ' + error);
    })
}

//self.addEventListener('fetch', function(event) {
//    console.log(typeof caches.match(event.request))
//    return event.respondWith(
//         caches.match(event.request).then(function (response) {
//                 return response || fetchAndPutToCache(event.request);
//        })
//    );
//});

self.addEventListener('fetch', function(event) {
    const requestURL = new URL(event.request.url);

    if (/^\/api\/v1/.test(requestURL.pathname)
        && (event.request.method !== 'GET' && event.request.method !== 'HEAD')) {
        return event.respondWith(fetch(event.request));
    }

    if (/^\/api\/v1/.test(requestURL.pathname)) {
        return event.respondWith(
            fetchAndPutToCache(event.request)
            //caches.match(event.request).then(function (response) {
            //    return response || fetchAndPutToCache(event.request);
            //})
        );
    }

    return event.respondWith(
        caches.match(event.request).then(function (response) {
            return response || fetchAndPutToCache(event.request);
        })
    );
});

//function fetchAndPutToCache(request) {
//    return fetch(request).then((response) => {
//        const responseToCache = response.clone();
//        return caches.open(CACHE_NAME)
//            .then((cache) => {
//                cache.put(request, responseToCache);
//            })
//            .then(() => response);
//    })
//    .catch(() => caches.match(request));
//}
//
//function getFromCache(request) {
//    return caches.match(request)
//        .then((response) => {
//            if (response) {
//                return response;
//            }
//
//            return Promise.reject();
//        });
//}
