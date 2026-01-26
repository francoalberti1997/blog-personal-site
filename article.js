document.addEventListener("DOMContentLoaded", async () => {
  console.log("✅ DOM cargado");
  

  const params = new URLSearchParams(window.location.search);
  const blogId = params.get("id");

  const articlesContainer = document.getElementById("articles-container");
  const blogContainer = document.querySelector(".col-md-8");
  const sidebarList = document.querySelector(".list-featured");

  // Mostrar loader mientras se cargan los datos
  if (articlesContainer) articlesContainer.innerHTML = "<p>Cargando artículos...</p>";
  if (blogContainer) blogContainer.innerHTML = "<p>Cargando blogs...</p>";

  try {
    // ================================
    // 📍 Página principal - lista de artículos
    // ================================
    if (!blogId && articlesContainer) {
      console.log("📰 Cargando lista de artículos...");

      const res = await fetch(`https://francoalberti97.pythonanywhere.com/blogs/`);
      const text = await res.text(); // Capturamos el texto crudo de la respuesta

      if (!res.ok) throw new Error(`Error HTTP ${res.status}: ${text}`);

      let articles;
      try {
        articles = JSON.parse(text);
      } catch (jsonErr) {
        throw new Error(`Error parseando JSON: ${jsonErr.message}`);
      }

      articlesContainer.innerHTML = "";

      articles.forEach(article => {
        articlesContainer.innerHTML += `
          <div class="mb-3 d-flex justify-content-between">
            <div class="pr-3">
              <h2 class="mb-1 h4 font-weight-bold">
                <a href="article.html?id=${article.id}" class="text-dark">${article.title}</a>
              </h2>
              <p>${article.description || "Sin descripción disponible."}</p>
              <div class="card-text text-muted small">
                ${article.author || "Autor desconocido"} en ${article.category || "Sin categoría"}
              </div>
              <small class="text-muted">${article.date || "Fecha no disponible"} &middot; ${article.read_time || "Tiempo no indicado"}</small>
            </div>
            <img height="120" src="${article.image || './assets/img/demo/1.jpg'}" alt="${article.title}">
          </div>
        `;
      });

      console.log("✅ Artículos renderizados en el DOM");

      // Cargar artículos populares
      const resPopular = await fetch(`https://francoalberti97.pythonanywhere.com/blogs/popular/`);
      const textPopular = await resPopular.text();
      console.log("🧾 Respuesta cruda de /blogs/popular/:", textPopular);

      if (!resPopular.ok) throw new Error(`Error HTTP ${resPopular.status}: ${textPopular}`);

      let featured;
      try {
        featured = JSON.parse(textPopular);
      } catch (jsonErr) {
        throw new Error(`Error parseando JSON de populares: ${jsonErr.message}`);
      }

      const list = document.getElementById("featured-list");
      if (list) {
        list.innerHTML = "";
        featured.forEach(article => {
          list.innerHTML += `
            <li>
              <span>
                <h6 class="font-weight-bold">
                  <a href="article.html?id=${article.id}" class="text-dark">${article.title}</a>
                </h6>
                <p class="text-muted">${article.author || "Autor desconocido"} en ${article.category || "Sin categoría"}</p>
              </span>
            </li>
          `;
        });
      }

      console.log("✅ Populares renderizados");
    }

    // ================================
    // 📍 Sección de blogs con sidebar
    // ================================
    if (blogContainer) {
      const res = await fetch(`https://francoalberti97.pythonanywhere.com/blogs/`);
      const text = await res.text();

      if (!res.ok) throw new Error(`Error HTTP ${res.status}: ${text}`);

      let blogs;
      try {
        blogs = JSON.parse(text);
      } catch (jsonErr) {
        throw new Error(`Error parseando JSON de blogs: ${jsonErr.message}`);
      }

      blogContainer.innerHTML = "";

      blogs.forEach(blog => {
        const html = `
          <div class="mb-3 d-flex justify-content-between blog-item" data-id="${blog.id}" style="cursor:pointer;">
            <div class="pr-3">
              <h2 class="mb-1 h4 font-weight-bold text-dark">${blog.title}</h2>
              <p>${blog.summary || blog.description || ''}</p>
              <div class="card-text text-muted small">${blog.author || "Autor desconocido"}</div>
              <small class="text-muted">${blog.date || "Fecha no disponible"} · ${blog.read_time || "Tiempo no indicado"}</small>
            </div>
            <img height="120" src="${blog.image || './assets/img/demo/1.jpg'}">
          </div>
        `;
        blogContainer.insertAdjacentHTML("beforeend", html);
      });

      // Click en cada blog → ir al detalle
      document.querySelectorAll(".blog-item").forEach(item => {
        item.addEventListener("click", () => {
          const blogId = item.getAttribute("data-id");
          window.location.href = `article.html?id=${blogId}`;
        });
      });

      // Sidebar
      if (sidebarList) {
        sidebarList.innerHTML = "";
        blogs.slice(0, 4).forEach(blog => {
          sidebarList.innerHTML += `
            <li class="sidebar-item" data-id="${blog.id}" style="cursor:pointer;">
              <span>
                <h6 class="font-weight-bold text-dark">${blog.title}</h6>
                <p class="text-muted">${blog.author || "Autor desconocido"}</p>
              </span>
            </li>
          `;
        });

        document.querySelectorAll(".sidebar-item").forEach(item => {
          item.addEventListener("click", () => {
            const blogId = item.getAttribute("data-id");
            window.location.href = `article.html?id=${blogId}`;
          });
        });
      }
    }

  } catch (err) {
    console.error("❌ Error cargando datos:", err);

    // Mensaje visual de error
    const errorHTML = `
      <div class="col-12 text-center my-5">
        <div class="alert alert-danger" role="alert">
          ⚠️ Ocurrió un error al cargar los datos.  
          <br>Verificá la consola para más detalles.
        </div>
      </div>
    `;

    if (articlesContainer) articlesContainer.innerHTML = errorHTML;
    if (blogContainer) blogContainer.innerHTML = errorHTML;
  }
});
