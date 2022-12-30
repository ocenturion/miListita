var cacheName = "miListitaCache";

var filesToCache = [
  "index.html",
  "/main.js",
  "/style.css",
  "/image/icon-144x144.png",
  "/image/icon-512x512.png"
];

// Instala el Service Worker
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log("[serviceWorker] Caching app shell");
      return cache.addAll(filesToCache);
    })
  );
  console.log("Service Worker instalado");
});

// Activa el Service Worker
// self.addEventListener("activate", (e) => {
//   console.log("Service Worker activado");
// });

// Activa el Service Worker y elimina cualquier cache antiguo
self.addEventListener("activate", (e) => {
    console.log("[Service Worker] Activated");
    e.waitUntil(
      caches.keys().then((keyList) => {
        return Promise.all(
          keyList.map((key) => {
            if (key !== cacheName) {
              console.log("[Service Worker] Removing old cache", key);
              return caches.delete(key);
            }
          })
        );
      })
    );
  });

// Maneja las solicitudes de recursos utilizando el cache o solicitándolos a través de Internet
self.addEventListener("fetch", (e) => {
    e.respondWith(
      // Intentamos encontrar el recurso en el cache
      caches.match(e.request).then((response) => {
        // Si encontramos el recurso en el cache, lo devolvemos
        if (response) {
          console.log("[Service Worker] Found in cache", e.request.url);
          return response;
        }
  
        // Si no encontramos el recurso en el cache, lo solicitamos a través de Internet
        var request = e.request.clone();
        return fetch(request).then((response2) => {
            let response = response2
          // Si la solicitud es exitosa, almacenamos el recurso en el cache para futuras solicitudes
          if (response2 && response2.status === 200 && response2.url.startsWith('https')) {
            console.log("[Service Worker] Caching new resource", e.request.url);
            caches.open(cacheName).then((cache) => {
                console.log('almaceno: ', request,response)
              cache.put(request.url, response);
            });
          }
          return response2;
        });
      })
    );
  });
  
