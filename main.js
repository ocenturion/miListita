let deferredPrompt;
const btnAdd = document.getElementById('btnAdd');

window.addEventListener('beforeinstallprompt', (e) => {
    console.log('entre a beforeinstallprompt')
  // Evita que se muestre la ventana emergente de forma automática
  e.preventDefault();
  // Almacena el evento para poder mostrar la ventana emergente más tarde
  deferredPrompt = e;
  // Muestra el botón de instalación
  btnAdd.style.display = 'block';
});

btnAdd.addEventListener('click', (e) => {
  // Oculta el botón de instalación
  btnAdd.style.display = 'none';
  // Comprueba si el evento "beforeinstallprompt" está definido
  if (deferredPrompt) {
    // Muestra la ventana emergente de instalación
    deferredPrompt.prompt();
    // Escucha la respuesta del usuario
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('El usuario aceptó la instalación');
      } else {
        console.log('El usuario canceló la instalación');
      }
      deferredPrompt = null;
    });
  }else{
    console.log('deferredPrompt == false')
  }
});

window.addEventListener('appinstalled', (evt) => {
  console.log('La aplicación se ha instalado');
});
