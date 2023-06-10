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
    displayOnlyPage("home-page");
  });
  document.getElementById("header-search").addEventListener("keypress", (event) => {
    if(event.key == "Enter" && event.currentTarget.value !== "") {
      searchArticlesByTitle(event.currentTarget.value);
      event.currentTarget.value = "";
    }
  });
  document.getElementById("header-search-button").addEventListener("click", () => {
    let searchBar = document.getElementById("header-search");
    if(searchBar.value !== "") {
      searchArticlesByTitle(searchBar.value);
      searchBar.value = "";
    }
  });
  document.getElementById("home-search").addEventListener("keypress", (event) => {
    if(event.key == "Enter" && event.currentTarget.value !== "") {
      searchArticlesByTitle(event.currentTarget.value);
      event.currentTarget.value = "";
    }
  });
  document.getElementById("home-search-button").addEventListener("click", () => {
    let searchBar = document.getElementById("home-search");
    if(searchBar.value !== "") {
      searchArticlesByTitle(searchBar.value);
      searchBar.value = "";
    }
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
  // submitEditedArticle();
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
async function searchArticlesByTitle(title) {
  const resultData = await fetchAPI(
    "GET", "/?" + new URLSearchParams({ name: title })
  );

  document.getElementById("search-page-title").innerText = "Resultados para \"" + title + "\"";
  let searchResultsContainer = document.getElementById("search-results");

  while(searchResultsContainer.hasChildNodes()) {
    searchResultsContainer.removeChild(searchResultsContainer.firstChild);
  }

  resultData.item.forEach(result => {
    let listElement = document.createElement("li");
    listElement.innerText = result.autor + " | " + result.titulo;
    listElement.addEventListener("click", async () => getArticle(result._id));
    searchResultsContainer.appendChild(listElement);
  });

  displayOnlyPage("search-page");
}

async function getArticle(id) {
  const article = await fetchAPI(
    "GET", "/?" + new URLSearchParams({ id })
  );
  const articleData = article.item;

  document.getElementById("article-title").innerText = articleData.titulo;
  document.getElementById("article-category").innerText = articleData.categoria;
  document.getElementById("article-description").innerText = articleData.descripcion;
  document.getElementById("article-distributors").innerText = articleData.distribuidores;
  document.getElementById("article-references").innerText = articleData.referencias;
  document.getElementById("article-author").innerText = articleData.autor;

  displayOnlyPage("article-page");
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
async function submitEditedArticle(event) {
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