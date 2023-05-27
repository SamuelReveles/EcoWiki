// document.addEventListener("DOMContentLoaded", test);

let homePage;
let categoryPage;
let editableArticlePage;
let articlePage;
let searchPage;
let adminPage;

let articleEditionForm;

let categories = [
  "Categoría 1",
  "Categoría 2",
  "Categoría 3"
];

let descriptions = [
  "Descripcion 1",
  "Descripcion 2",
  "Descripcion 3"
];

document.addEventListener("DOMContentLoaded", init);

function init() {

  displayOnlyPage("home-page");
  articleEditionForm = document.getElementById("article-edition-form");
  document.getElementById("create-button").addEventListener("click", (event) => {
    event.preventDefault();
    displayOnlyPage("editable-article-page");
    articleEditionForm.addEventListener("submit", submitArticle);
  })
  document.getElementById("home-link").addEventListener("click", (event) => {
    event.preventDefault();
    location.href = "/index.html";
  });
  
}

function displayOnlyPage(name) {
  homePage = document.getElementById("home-page");
  categoryPage = document.getElementById("category-page");
  editableArticlePage = document.getElementById("editable-article-page")
  articlePage = document.getElementById("article-page");
  searchPage = document.getElementById("search-page");
  adminPage = document.getElementById("admin-page");

  homePage.style.display = "none";
  categoryPage.style.display = "none";
  editableArticlePage.style.display = "none"
  articlePage.style.display = "none";
  searchPage.style.display = "none";
  adminPage.style.display = "none"

  document.getElementById(name).style.display = "block"
}

/**
 * Función temporal para probar las interacciones con el backend.
 */
function test() {
  console.log("Testing API functions...");

  // Descomentar la función a probar:

  // submitArticle();
  // getCategories();
  // loginAdmin();
  // approveArticle();
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
      headers: {"Encryption-Type": "multipart/form-data"},
      body,
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
async function submitArticle(event) {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);

  const resultData = await fetchAPI("POST", "/", formData);

  // TODO: Indicar al usuario la creación de su artículo.
  console.log("Resultado:");
  console.log(resultData);
}

/**
 * Edita un artículo y lo deja pendiente de aprobación por el admin.
 */
async function editArticle(event) {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);

  const resultData = await fetchAPI("PUT", "/", formData);

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
async function approveArticle(event) {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const resultData = await fetchAPI("PUT", "/admin", formData);

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