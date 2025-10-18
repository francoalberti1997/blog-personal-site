document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector(".row");

  try {
    const res = await fetch("https://18.222.79.144/modelos/");
    if (!res.ok) throw new Error("Error al obtener los modelos");

    const modelos = await res.json();

    // Limpia el contenedor
    container.innerHTML = "";

    // Genera una card por cada modelo
    modelos.forEach(modelo => {
      const html = `
        <div class="col-lg-6 mb-4">
          <div class="card border-0 box-shadow h-xl-400">
            <div style="
              background-image: url(${modelo.image || './assets/img/demo/placeholder.jpg'});
              height: 350px;
              background-size: cover;
              background-repeat: no-repeat;
              border-radius: 10px 10px 0 0;
            "></div>
            <div class="card-body px-0 pb-0 d-flex flex-column align-items-start">
              <h2 class="h4 font-weight-bold">
                <a class="text-dark" href="./ia_model.html?id=${modelo.id}">
                  ${modelo.title}
                </a>
              </h2>
              <p class="card-text">${modelo.description || "Sin descripción disponible."}</p>
              <div>
                <small class="d-block">
                  <a class="text-muted" href="./author.html">${modelo.author || "Autor desconocido"}</a>
                </small>
                <small class="text-muted">${modelo.date} · ${modelo.category || "Sin categoría"}</small>
              </div>
            </div>
          </div>
        </div>
      `;
      container.insertAdjacentHTML("beforeend", html);
    });

  } catch (err) {
    console.error("⚠️ Error cargando modelos:", err);
    container.innerHTML = `
      <div class="col-12">
        <p class="text-danger">Error al cargar los modelos. Intenta recargar la página.</p>
      </div>
    `;
  }
});


