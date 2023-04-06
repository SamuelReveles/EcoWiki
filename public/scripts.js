document.addEventListener("DOMContentLoaded", test);

/**
 * Función temporal para probar las interacciones con el backend.
 */
function test() {
  console.log("Testing API functions...");

  // Descomentar la función a probar:

  // submitArticle();
  // getCategories();
  // loginAdmin();
  // acceptArticle();
  // searchArticlesByTitle();
  // searchArticlesByCategory();
  // editArticle();
  // getArticlesToReview();
}

/**
 * Función auxiliar para uso estandar de la API.
 * @param method Método HTTP de la ruta (GET, POST, PUT, DELETE).
 * @param route Ruta en la API. 
 * @param body Body opcional a agregar a la solicitud.
 * @returns Promesa resolvible para el JSON devuelto por la API.
 */
async function fetchAPI(method, route, body) {
  const response = await fetch(
    "http://localhost:8080/api" + route, 
    {
      method,
      headers: {"Content-Type": "application/json"},
      body: body ? JSON.stringify(body) : undefined,
    }
  );

  return await response.json();
}

/**
 * Obtiene todos los artículos aceptados que coinciden
 * en título con un parámetro.
 */
async function searchArticlesByTitle() {
  // TODO: Obtener el título de la barra de búsqueda.
  const title = "Test title";

  const resultData = await fetchAPI(
    "GET", "/?" + new URLSearchParams({ name: title })
  );

  // TODO: Mostrar los artículos encontrados.
  console.log("Resultado:");
  console.log(resultData);
}

/**
 * Obtiene todos los artículos que tienen cierta categoría.
 */
async function searchArticlesByCategory() {
  const category = "Test category";

  const resultData = await fetchAPI(
    "GET", "/?" + new URLSearchParams({ category: category })
  );

  // TODO: Mostrar los artículos encontrados.
  console.log("Resultado:");
  console.log(resultData);
}

/**
 * Crea un nuevo articulo en la BD a ser revisado por el admin.
 */
async function submitArticle() {
  // TODO: Tomar los datos de un artículo que se esté creando.
  const article = {
    titulo: "Algun titulo",
    categoria: "Test category",
    descripcion: "Alguna descripcion...",
    distribuidores: [ "Algunos", "distribuidores..." ],
    referencias: "Algunas referencias...",
    autor: "Algun autor...",
  };

  const resultData = await fetchAPI("POST", "/", article);

  // TODO: Indicar al usuario la creación de su artículo.
  console.log("Resultado:");
  console.log(resultData);
}

/**
 * Edita un artículo y lo deja pendiente de aprobación por el admin.
 */
async function editArticle() {
  // TODO: Obtener información del artículo en edición.
  const article = {
    titulo: "Algun titulo...",
    categoria: "Alguna categoria",
    descripcion: "Alguna descripción",
    distribuidores: [ "Algunos", "distribuidores..." ],
    referencias: "Algunas referencias...",
    autor: "Algun autor...",
    origin: undefined,
  }

  const resultData = await fetchAPI("PUT", "/", article);

  // TODO: Indicar y bloquear la edición del artículo.
  console.log("Resultado:");
  console.log(resultData);
}

/**
 * Obtiene todas las categorías de artículos de la BD.
 */
async function getCategories() {
  const resultData = await fetchAPI("GET", "/category");

  // TODO: Mostrar las categorías en la barra lateral.
  console.log("Resultado:");
  console.log(resultData);
}

/**
 * Permite la autenticación del admin.
 */
async function loginAdmin() {
  // TODO: Obtener password desde un input.
  const password = "EcoWikiAdmin";

  const resultData = await fetchAPI(
    "GET", "/admin/access?"
    + new URLSearchParams({ password })
  );

  // TODO: Reaccionar a la validación de password.
  console.log("Resultado:");
  console.log(resultData);
}

/**
 * Obtiene todos los artículos pendientes de revisión
 * por el admin.
 */
async function getArticlesToReview() {
  const resultData = await fetchAPI("GET", "/admin");

  // TODO: Mostrar los artículos a revisar.
  console.log("Resultado:");
  console.log(resultData);
}

/**
 * Permite que el administrador apruebe un artículo.
 */
async function approveArticle() {
  // TODO: Obtener el id del artículo a aprobar.
  const data = { id: undefined }
  
  const resultData = await fetchAPI("PUT", "/admin", data);

  // TODO: Reaccionar a la aceptación del artículo.
  console.log("Resultado:");
  console.log(resultData);
}

/**
 * Borra un artículo con cierto ID.
 */
async function deleteArticle() {
  // TODO: Obtener el id del artículo a borrar.
  const data = { id: undefined }

  const resultData = await fetchAPI("DELETE", "/admin", data);

  // TODO: Reaccionar al artículo borrado.
  console.log("Resultado:");
  console.log(resultData);
}