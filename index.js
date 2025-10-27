console.log("https://crucially-treacherous-madie.ngrok-free.dev/");

// Petición GET a /ping/
fetch("https://crucially-treacherous-madie.ngrok-free.dev/ping/")
  .then(response => {
    if (!response.ok) throw new Error("Error en la respuesta del servidor");
    return response.json();
  })
  .then(data => console.log("✅ Respuesta del backend:", data))
  .catch(error => console.error("❌ Error al hacer ping:", error));
