// Instala el Service Worker
self.addEventListener('install', (event) => {
    console.log('Service Worker instalado');
  });
  
  // Activa el Service Worker
  self.addEventListener('activate', (event) => {
    console.log('Service Worker activado');
  });
  
  // Controla las solicitudes de recursos
  self.addEventListener('fetch', (event) => {
    console.log('Solicitud de recursos recibida');
  });
  