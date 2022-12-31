/*
var cacheName = "miListitaCache";

var filesToCache = [
  "/index.html",
  "/main.js",
  "/style.css",
  "/manifest.json",
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
        console.log("[Service Worker] 49: ", e.request);
        
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
              cache.put(request.url, response);
            });
          }
          return response2;
        });
      })
    );
  });
*/

// Al incrementar el  OFFLINE_VERSION obligará a lanzar el evento de instalación y
// los caché anteriores serán actualizados desde la red.
// Esta variable está declarada intencionalmente y no se usa.
// Agrega un comentario para tu linter si lo deseas:
// eslint-disable-next-line no-unused-vars
const OFFLINE_VERSION = 1;
const CACHE_NAME = "offline";
// Modifica esto con una diferente URL si es necesario.
// const OFFLINE_URL = "offline.html";
const OFFLINE_URL = [
    "/index.html",
    "/main.js",
    "/style.css",
    "/manifest.json",
    "/image/icon-144x144.png",
    "/image/icon-512x512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      caches.open(CACHE_NAME).then(function (cache){
        cache.addAll(new Request(OFFLINE_URL, { cache: "reload" }))
      });
      // Al definir {cache: 'reload'} en la nueva consulta asegurara que la
      // respuesta no sea desde el caché de HTTP; i.e., esta será
      // de la red.
    //   await cache.addAll(new Request(OFFLINE_URL, { cache: "reload" }));
    })()
  );
  // Obliga al service worker que espera a que se convierta en uno activo.
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Permite la navegación precargada si tiene compatibilidad
      // Mira https://developers.google.com/web/updates/2017/02/navigation-preload
      if ("navigationPreload" in self.registration) {
        await self.registration.navigationPreload.enable();
      }
    })()
  );

  // Le dice al service worker activo que tome el control inmediato de la página.
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Solo queremos llamar al event.respondWith() si es una solicitud de navegación
  // para una página HTML.
  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          // Primero, utiliza una respuesta de precarga de navegación.
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) {
            return preloadResponse;
          }

          // Siempre usa la red primero.
          const networkResponse = await fetch(event.request);
          return networkResponse;
        } catch (error) {
          // El catch solo se dispara cuando se obtiene una excepción
          // gracias a un error en la red.
          // Si fetch() regresa una respuesta HTTP valida con un codigo de respuesta en el
          // rango de 4xx o 5xx, el catch() no se llamará
          console.log("Fetch failed; returning offline page instead.", error);

          const cache = await caches.open(CACHE_NAME);
          const cachedResponse = await cache.match(OFFLINE_URL);
          return cachedResponse;
        }
      })()
    );
  }

  // si nuestra condición de if() es falso, el controlador de fetch no atrapará la
  // solicitud. Si hay más controladores de fetch registrados, ellos tendrán la
  // oportunidad de llamar a event.respondWith(). De lo contrario, si no hay, no se llamará a
  // event.respondWith(), la solicitud será controlada por el buscador como si no
  // los service worker no se hubieran involucrado.
});