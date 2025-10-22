document.addEventListener("DOMContentLoaded", async () => {
  console.log("✅ DOM cargado");

  const params = new URLSearchParams(window.location.search);
  const blogId = params.get("id");

  console.log("🔍 blogId detectado:", blogId);

  // ================================
  // 📍 Página principal (sin ID)
  // ================================
  if (!blogId && document.getElementById("articles-container")) {
    console.log("📰 Cargando lista de artículos...");

    try {
      const res = await fetch("https://18.222.79.144/blogs/");
      console.log("➡️ Respuesta artículos:", res.status);

      if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
      const articles = await res.json();
      console.log("📦 Artículos obtenidos:", articles);

      const container = document.getElementById("articles-container");
      container.innerHTML = "";

      articles.forEach(article => {
        container.innerHTML += `
          <div class="mb-3 d-flex justify-content-between">
            <div class="pr-3">
              <h2 class="mb-1 h4 font-weight-bold">
                <a href="article.html?id=${article.id}" class="text-dark">${article.title}</a>
              </h2>
              <p>${article.description}</p>
              <div class="card-text text-muted small">
                ${article.author} in ${article.category}
              </div>
              <small class="text-muted">${article.date} &middot; ${article.read_time}</small>
            </div>
            <img height="120" src="${article.image}" alt="${article.title}">
          </div>
        `;
      });

      console.log("✅ Artículos renderizados en el DOM");

      const resPopular = await fetch("https://18.222.79.144/blogs/popular/");
      console.log("➡️ Respuesta populares:", resPopular.status);

      if (!resPopular.ok) throw new Error(`Error HTTP ${resPopular.status}`);
      const featured = await resPopular.json();
      console.log("⭐ Populares obtenidos:", featured);

      const list = document.getElementById("featured-list");
      list.innerHTML = "";
      featured.forEach(article => {
        list.innerHTML += `
          <li>
            <span>
              <h6 class="font-weight-bold">
                <a href="article.html?id=${article.id}" class="text-dark">${article.title}</a>
              </h6>
              <p class="text-muted">${article.author} in ${article.category}</p>
            </span>
          </li>
        `;
      });

      console.log("✅ Populares renderizados");

    } catch (err) {
      console.error("❌ Error cargando artículos:", err);
    }
  }

});
document.addEventListener("DOMContentLoaded", async () => {
  const blogContainer = document.querySelector(".col-md-8");
  const sidebarList = document.querySelector(".list-featured");

  try {
    const res = await fetch("https://18.222.79.144/blogs/");
    if (!res.ok) throw new Error("Error al obtener blogs");
    const blogs = await res.json();

    // Limpia el contenido previo
    // blogContainer.innerHTML = `
    //   <h5 class="font-weight-bold spanborder"><span>Últimos Blogs</span></h5>
    // `;

    // Render principal
    blogs.forEach(blog => {
      const html = `
        <div class="mb-3 d-flex justify-content-between blog-item" data-id="${blog.id}" style="cursor:pointer;">
          <div class="pr-3">
            <h2 class="mb-1 h4 font-weight-bold text-dark">${blog.title}</h2>
            <p>${blog.summary || blog.description || ''}</p>
            <div class="card-text text-muted small">${blog.author}</div>
            <small class="text-muted">${blog.date} · ${blog.read_time}</small>
          </div>
          <img height="120" src="${blog.image || './assets/img/demo/1.jpg'}">
        </div>
      `;
      blogContainer.insertAdjacentHTML("beforeend", html);
    });

    // Añadir evento de click a cada blog
    document.querySelectorAll(".blog-item").forEach(item => {
      item.addEventListener("click", () => {
        const blogId = item.getAttribute("data-id");
        window.location.href = `article.html?id=${blogId}`;
      });
    });

    // Sidebar (populares)
    if (sidebarList) {
      sidebarList.innerHTML = "";
      blogs.slice(0, 4).forEach(blog => {
        const html = `
          <li class="sidebar-item" data-id="${blog.id}" style="cursor:pointer;">
            <span>
              <h6 class="font-weight-bold text-dark">${blog.title}</h6>
              <p class="text-muted">${blog.author}</p>
            </span>
          </li>
        `;
        sidebarList.insertAdjacentHTML("beforeend", html);
      });

      // Click en sidebar
      document.querySelectorAll(".sidebar-item").forEach(item => {
        item.addEventListener("click", () => {
          const blogId = item.getAttribute("data-id");
          window.location.href = `article.html?id=${blogId}`;
        });
      });
    }

  } catch (err) {
    console.error("Error cargando blogs:", err);
    blogContainer.innerHTML = `<p>Error al cargar blogs.</p>`;
  }
});
