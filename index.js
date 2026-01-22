(async () => {
  const url = "http://127.0.0.1:8000/ping/";
  console.log("🌐 Haciendo ping a:", url);

  try {
    const res = await fetch(url, { method: "GET" });
    const text = await res.text(); // no asumas JSON de una
    console.log("📦 Respuesta cruda:", text);

    let data;
    try {
      data = JSON.parse(text);
      console.log("✅ JSON parseado:", data);
    } catch {
      console.warn("⚠️ No es JSON, texto devuelto:", text);
    }
  } catch (err) {
    console.error("❌ Error en la conexión:", err);
  }
})();
