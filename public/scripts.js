let homePage;
let categoryPage;
let editableArticlePage;
let articlePage;
let searchPage;
let adminLoginPage;
let adminPage;

let currentArticleData;
let editingNewArticle = false;
let adminIsReadingArticle = false;
let lastSearch = "";

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
  
  document.getElementById("article-edition-form").addEventListener("submit", (event) => {
    if(editingNewArticle)
      submitArticle(event);
    else
      submitEditedArticle(event);
  });
  document.getElementById("create-button").addEventListener("click", (event) => {
    event.preventDefault();
    editingNewArticle = true;
    document.getElementById("article-edition-form").reset();
    displayOnlyPage("editable-article-page");
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
  document.getElementById("return-button").addEventListener("click", () => {
    if(adminIsReadingArticle)
      goToAdminPage();
    else {
      searchArticlesByTitle(lastSearch);
    }
  });
  document.getElementById("edit-article-button").addEventListener("click", () => editArticle());
  document.getElementById("admin-access-button").addEventListener("click", () => {
    displayOnlyPage("admin-login-page");
  });
  document.getElementById("admin-login-button").addEventListener("click", loginAdmin);
}

function displayOnlyPage(name) {
  homePage = document.getElementById("home-page");
  categoryPage = document.getElementById("category-page");
  editableArticlePage = document.getElementById("editable-article-page")
  articlePage = document.getElementById("article-page");
  searchPage = document.getElementById("search-page");
  adminLoginPage = document.getElementById("admin-login-page");
  adminPage = document.getElementById("admin-page");

  homePage.style.display = "none";
  categoryPage.style.display = "none";
  editableArticlePage.style.display = "none"
  articlePage.style.display = "none";
  searchPage.style.display = "none";
  adminLoginPage.style.display = "none";
  adminPage.style.display = "none"

  document.getElementById(name).style.display = "block"
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
  lastSearch = title;
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
    listElement.addEventListener("click", async () => loadArticle(result._id, false));
    searchResultsContainer.appendChild(listElement);
  });

  displayOnlyPage("search-page");
}

async function loadArticle(id, isForAdmin) {
  let article;

  if(isForAdmin) {
    article = await fetchAPI("GET", "/admin/?" + new URLSearchParams({ id }));
    document.getElementById("edit-article-button").style.display = "none";
  }
  else {
    article = await fetchAPI("GET", "/?" + new URLSearchParams({ id }));
    document.getElementById("edit-article-button").style.display = "block";
  }
  const articleData = article.item;
  currentArticleData = articleData;

  document.getElementById("article-title").innerText = articleData.titulo;
  document.getElementById("article-category").innerText = articleData.categoria;
  document.getElementById("article-description").innerText = articleData.descripcion;
  document.getElementById("article-distributors").innerText = articleData.distribuidores;
  document.getElementById("article-references").innerText = articleData.referencias;
  document.getElementById("article-author").innerText = articleData.autor;

  displayOnlyPage("article-page");
}

function editArticle() {
  const articleData = currentArticleData;
  currentArticleData = null;
  editingNewArticle = false;

  document.getElementById("editable-article-title").value = articleData.titulo;
  document.getElementById("editable-article-category").value = articleData.categoria;
  document.getElementById("editable-article-description").value = articleData.descripcion;
  document.getElementById("editable-article-distributors").value = articleData.distribuidores;
  document.getElementById("editable-article-references").value = articleData.referencias;
  document.getElementById("editable-article-author").value = articleData.autor;
  document.getElementById("editable-article-origin").value = articleData._id;

  displayOnlyPage("editable-article-page");
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

  displayOnlyPage("home-page");
}

/**
 * Edita un artículo y lo deja pendiente de aprobación por el admin.
 */
async function submitEditedArticle(event) {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);

  const resultData = await fetchAPI("PUT", "/", formData);

  displayOnlyPage("home-page");
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
  const email = document.getElementById("admin-email").value;
  const password = document.getElementById("admin-password").value;

  const resultData = await fetchAPI(
    "GET", "/admin/access?"
    + new URLSearchParams({ email, password })
  );

  document.getElementById("admin-login-form").reset();

  if(resultData === "Access allowed")
    goToAdminPage();
  else
    alert("Información de acceso incorrecta.");
}

async function goToAdminPage() {
  await loadArticlesToReview();
  await loadApprovedArticles();
  displayOnlyPage("admin-page");
}

/**
 * Obtiene todos los artículos pendientes de revisión
 * por el admin.
 */
async function loadArticlesToReview() {
  const resultData = await fetchAPI("GET", "/admin");

  let newArticlesContainer = document.getElementById("new-articles-container");
  while(newArticlesContainer.hasChildNodes())
    newArticlesContainer.removeChild(newArticlesContainer.firstChild);
  let editedArticlesContainer = document.getElementById("edited-articles-container");
  while(editedArticlesContainer.hasChildNodes())
    editedArticlesContainer.removeChild(editedArticlesContainer.firstChild);
  
  resultData.item.forEach(result => {
    let approveButton = createAdminActionButton("approve");
    approveButton.addEventListener("click", () => approveArticle(result._id));
    let rejectButton = createAdminActionButton("reject");
    rejectButton.addEventListener("click", () => deleteArticle(result._id));
    let adminActions = document.createElement("span");
    adminActions.appendChild(approveButton);
    adminActions.appendChild(rejectButton);
    let itemText = document.createElement("p");

    let listItem = document.createElement("li");
    itemText.innerText = result.autor + " | " + result.titulo;
    itemText.addEventListener("click", () => loadArticle(result._id, true));

    listItem.appendChild(itemText);
    listItem.appendChild(adminActions);

    if(result.editado)
      editedArticlesContainer.appendChild(listItem);
    else
      newArticlesContainer.appendChild(listItem);
  });
}

function createAdminActionButton(action, articleId) {
  let id = articleId;
  let button = document.createElement("button");
  let img = document.createElement("img");
  img.src = "../assets/" + action + "_icon.png";
  button.appendChild(img);
  return button;
}

async function loadApprovedArticles() {
  const resultData = await fetchAPI("GET", "/");

  let approvedArticlesContainer = document.getElementById("approved-articles-container");
  while(approvedArticlesContainer.hasChildNodes())
    approvedArticlesContainer.removeChild(approvedArticlesContainer.firstChild);

  resultData.item.forEach(result => {
    let deleteButton = createAdminActionButton("reject");
    deleteButton.addEventListener("click", () => deleteArticle(result._id));
    let itemText = document.createElement("p");
    itemText.innerText = result.autor + " | " + result.titulo;
    itemText.addEventListener("click", () => loadArticle(result._id, true));
    let listItem = document.createElement("li");
    listItem.appendChild(itemText);
    listItem.appendChild(deleteButton);
    approvedArticlesContainer.appendChild(listItem);
  });
}

/**
 * Permite que el administrador apruebe un artículo.
 */
async function approveArticle(id) {
  const formData = new FormData();
  formData.append("id", id);
  formData.append("accepted", true);

  await fetchAPI("PUT", "/admin", formData);

  await goToAdminPage();
}

/**
 * Borra un artículo con cierto ID.
 */
async function deleteArticle(id) {
  const formData = new FormData();
  formData.append("id", id);

  await fetchAPI("DELETE", "/admin", formData);

  await goToAdminPage();
}