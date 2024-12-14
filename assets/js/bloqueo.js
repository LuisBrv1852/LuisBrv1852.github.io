document.addEventListener("DOMContentLoaded", () => {
  const adContainer = document.getElementById('ad-container');
  const adblockMessage = document.getElementById('adblock-message');

  // Mostrar el contenedor del anuncio
  adContainer.style.display = 'block';

  let adLoaded = false;

  // Intentar cargar el anuncio
  try {
    (adsbygoogle = window.adsbygoogle || []).push({});
  } catch (e) {
    console.log("Error al cargar Google AdSense.");
  }

  // Función para verificar si el anuncio se ha cargado
  function checkAdLoaded() {
    if (adContainer.offsetHeight > 0) {
      adLoaded = true;
      adblockMessage.style.display = 'none'; // Ocultar mensaje
      console.log("Anuncio cargado correctamente.");
    } else {
      console.log("Anuncio no detectado todavía...");
    }
  }

  // Ampliar el tiempo de verificación (hasta 15 segundos)
  let attempts = 0;
  const maxAttempts = 15; // Hasta 15 intentos
  const checkInterval = setInterval(() => {
    checkAdLoaded();
    attempts++;

    if (adLoaded || attempts >= maxAttempts) {
      clearInterval(checkInterval); // Detener verificación
      if (!adLoaded) {
        adblockMessage.style.display = 'flex'; // Mostrar advertencia
        console.log("No se detectó el anuncio. Mostrando mensaje de AdBlock.");
      }
    }
  }, 1000); // Verificar cada 1 segundo durante 15 segundos
});
