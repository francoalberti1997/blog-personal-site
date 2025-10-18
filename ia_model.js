document.addEventListener("DOMContentLoaded", async () => {
  const modelId = 1;

  try {
    const res = await fetch(`https://18.222.79.144/modelos/${modelId}/`);
    if (!res.ok) throw new Error("Error al obtener los datos del modelo");
    const model = await res.json();

    document.getElementById("model-title").textContent = model.title;
    document.getElementById("model-description").textContent = model.description || "";
    document.getElementById("model-instructions").textContent = model.instructions || "";

  } catch (err) {
    console.error("⚠️ Error cargando modelo:", err);
    document.getElementById("model-title").textContent = "Error al cargar el modelo.";
  }

  const form = document.getElementById("image-form");
  const input = document.getElementById("image-input");
  const inputPreview = document.getElementById("input-preview");
  const outputImage = document.getElementById("output-image");

  // Previsualización de la imagen seleccionada
  input.addEventListener("change", () => {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      inputPreview.src = e.target.result;
      inputPreview.style.display = "block";
    };
    reader.readAsDataURL(file);
  });

  // Envío del formulario
  form.addEventListener("submit", async e => {
    e.preventDefault();

    const file = input.files[0];
    if (!file) {
      alert("Por favor seleccioná una imagen.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    const submitButton = form.querySelector("button[type='submit']");
    submitButton.disabled = true;
    submitButton.textContent = "Procesando... Esto puede tardar un momento";
    outputImage.style.display = "none";

    // Crear AbortController para manejar timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3600000); // 1 hora = 3600000 ms

    try {
      const res = await fetch(`https://18.222.79.144/models/${modelId}/predict/`, {
        method: "POST",
        body: formData,
        signal: controller.signal
      });

      if (!res.ok) throw new Error("Error procesando la imagen");

      const data = await res.json();

      if (data.output_image_url) {
        outputImage.src = data.output_image_url;
        outputImage.style.display = "block";
      } else {
        alert("No se recibió una imagen de salida desde el modelo.");
      }
    } catch (err) {
      if (err.name === "AbortError") {
        alert("⚠️ La petición tardó demasiado y fue cancelada (timeout 1 hora).");
      } else {
        console.error("⚠️ Error enviando imagen:", err);
        alert("Ocurrió un error procesando la imagen.");
      }
    } finally {
      clearTimeout(timeoutId);
      submitButton.disabled = false;
      submitButton.textContent = "Enviar imagen";
    }
  });
});
