var cacheName = 'miListitaCache'

var filesToCache = [
    '/',
    '/index.html',
    '/main.js',
    '/style.css',
    '/image/icon-144x144.png',
    '/image/icon-512x512.png'
  ];

// Instala el Service Worker
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(cacheName).then(function(cache){
            console.log('[serviceWorker] Caching app shell')
            return cache.addAll(filesToCache)
        })
    )
    console.log('Service Worker instalado');
  });
  
  // Activa el Service Worker
  self.addEventListener('activate', (e) => {
    console.log('Service Worker activado');
  });
  
  // Controla las solicitudes de recursos
  self.addEventListener('fetch', (e) => {
    console.log('entre a fetch')
    e.respondWith(
        // comprobamos si el recurso solicitado se encuentra en el cache
        caches.match(e.request).then(function(response){
            console.log('Linea 34: ', response)
            if (response) {
                console.log('[serviceWorker] Found in cache', e.request.url)
                alert('[serviceWorker] Found in cache', e.request.url)
                return response
            }
            // si no esta en cache, lo solicitamos a travez de internet
            var request = e.request.clone()
            return fetch(request).then(function(response){
                console.log('Linea 43: ', response)
                // si la solicitud es exitosa, almacenamos el recurso en el cache para futuras solicitudes
                if (response) {
                    console.log('[serviceWorker] Caching new resource', e.request.url)
                    alert('[serviceWorker] Caching new resource', e.request.url)
                    caches.open(cacheName).then(function (cache) {
                        cache.put(e.request, response)
                    })
                }
                return response
            })
        })
    )
    console.log('Solicitud de recursos recibida');
  });
  