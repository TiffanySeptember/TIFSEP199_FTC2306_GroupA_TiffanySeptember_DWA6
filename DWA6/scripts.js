const BOOKS_PER_PAGE = 36;

// Data Initialization
let bookList = books; // You can switch to a different book list if needed
let matches = bookList;
let page = 1;

// CSS Variables
const themes = {
  day: {
    dark: "10, 10, 20",
    light: "255, 255, 255",
  },
  night: {
    dark: "255, 255, 255",
    light: "10, 10, 20",
  },
};

// DOM Elements
const dataListItems = document.querySelector("[data-list-items]");
const dataSearchGenres = document.querySelector("[data-search-genres]");
const dataSearchAuthors = document.querySelector("[data-search-authors]");
const dataSettingsForm = document.querySelector("[data-settings-form]");
const dataListButton = document.querySelector("[data-list-button]");
const dataSearchCancel = document.querySelector("[data-search-cancel]");
const dataSettingsCancel = document.querySelector("[data-settings-cancel]");
const dataHeaderSearch = document.querySelector("[data-header-search]");
const dataHeaderSettings = document.querySelector("[data-header-settings]");
const dataSearchForm = document.querySelector("[data-search-form]");
const dataSettingsOverlay = document.querySelector("[data-settings-overlay]");

// Set the initial theme
const isDarkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
const currentTheme = isDarkTheme ? "night" : "day";
setTheme(currentTheme);

// Event Listeners
dataSearchCancel.addEventListener("click", closeSearchOverlay);
dataSettingsCancel.addEventListener("click", closeSettingsOverlay);
dataSettingsForm.addEventListener("submit", handleSettingsSubmit);
dataHeaderSearch.addEventListener("click", openSearchOverlay);
dataHeaderSettings.addEventListener("click", openSettingsOverlay);
dataSearchForm.addEventListener("submit", handleSearchSubmit);
dataSettingsOverlay.addEventListener("submit", handleSettingsOverlaySubmit);

dataListButton.addEventListener("click", loadMoreBooks);
dataListItems.addEventListener("click", handleBookClick);

// Functions
function setTheme(theme) {
  document.documentElement.style.setProperty(
    "--color-dark",
    themes[theme].dark
  );
  document.documentElement.style.setProperty(
    "--color-light",
    themes[theme].light
  );
}

function createPreviewElement({ author, id, image, title }) {
  const preview = document.createElement("div");
  preview.classList.add("preview");

  const img = document.createElement("img");
  img.classList.add("preview__image");
  img.src = image;
  img.alt = title;

  const info = document.createElement("div");
  info.classList.add("preview__info");

  const titleElement = document.createElement("h3");
  titleElement.classList.add("preview__title");
  titleElement.textContent = title;

  info.appendChild(titleElement);

  if (authors[author]) {
    const authorElement = document.createElement("p");
    authorElement.classList.add("preview__author");
    authorElement.textContent = `Author: ${authors[author]}`;
    info.appendChild(authorElement);
  }

  preview.appendChild(img);
  preview.appendChild(info);
  preview.dataset.listPreview = id;

  return preview;
}

function closeSearchOverlay() {
  const searchOverlay = document.querySelector("[data-search-overlay]");
  searchOverlay.open = false;
}

function closeSettingsOverlay() {
  const settingsOverlay = document.querySelector("[data-settings-overlay]");
  settingsOverlay.open = false;
}

function openSearchOverlay() {
  const searchOverlay = document.querySelector("[data-search-overlay]");
  searchOverlay.open = true;
  const searchTitle = document.querySelector("[data-search-title]");
  searchTitle.focus();
}

function openSettingsOverlay() {
  const settingsOverlay = document.querySelector("[data-settings-overlay]");
  settingsOverlay.open = true;
}

function handleSettingsSubmit(event) {
  event.preventDefault();
  const formData = new FormData(dataSettingsForm);
  const theme = formData.get("theme");
  setTheme(theme);
  closeSettingsOverlay();
}

function handleSearchSubmit(event) {
  event.preventDefault();
  const formData = new FormData(dataSearchForm);
  const filters = Object.fromEntries(formData.entries());

  const filteredBooks = books.filter((book) => {
    const titleMatch =
      filters.title.trim() === "" ||
      book.title.toLowerCase().includes(filters.title.toLowerCase());
    const authorMatch =
      filters.author === "any" || book.author === filters.author;
    const genreMatch =
      filters.genre === "any" || book.genres.includes(filters.genre);

    return titleMatch && authorMatch && genreMatch;
  });

  loadBooks(filteredBooks);
  closeSearchOverlay();
}

function handleSettingsOverlaySubmit(event) {
  event.preventDefault();
  const formData = new FormData(dataSettingsOverlay);
  const theme = formData.get("theme");
  setTheme(theme);
  closeSettingsOverlay();
}

function loadBooks(booksToLoad) {
  matches = booksToLoad;
  page = 1;
  const booksToShow = matches.slice(0, BOOKS_PER_PAGE);
  displayBooks(booksToShow);
  updateShowMoreButton();
}

function displayBooks(booksToShow) {
  dataListItems.innerHTML = "";
  const fragment = document.createDocumentFragment();

  for (const book of booksToShow) {
    const preview = createPreviewElement(book);
    fragment.appendChild(preview);
  }

  dataListItems.appendChild(fragment);
}

function loadMoreBooks() {
  const startIndex = page * BOOKS_PER_PAGE;
  const endIndex = startIndex + BOOKS_PER_PAGE;
  const booksToShow = matches.slice(startIndex, endIndex);
  displayBooks(booksToShow);
  page++;
  updateShowMoreButton();
}

function updateShowMoreButton() {
  dataListButton.textContent = `Show more (${Math.max(
    matches.length - page * BOOKS_PER_PAGE,
    0
  )})`;
  dataListButton.disabled = matches.length - page * BOOKS_PER_PAGE <= 0;
}

function handleBookClick(event) {
  const previewElement = event.target.closest(".preview");
  if (previewElement) {
    const previewId = previewElement.dataset.listPreview;
    const activeBook = books.find((book) => book.id === previewId);

    if (activeBook) {
      displayBookDetails(activeBook);
    }
  }
}

function displayBookDetails(book) {
  const listActiveOverlay = document.querySelector("[data-list-active]");
  const listTitle = listActiveOverlay.querySelector("[data-list-title]");
  const listSubtitle = listActiveOverlay.querySelector("[data-list-subtitle]");
  const listDescription = listActiveOverlay.querySelector(
    "[data-list-description]"
  );
  const listImage = listActiveOverlay.querySelector("[data-list-image]");
  const listBlur = listActiveOverlay.querySelector("[data-list-blur]");

  listTitle.textContent = book.title;
  listSubtitle.textContent = `Author: ${authors[book.author]} (${new Date(
    book.published
  ).getFullYear()})`;
  listDescription.textContent = book.description;
  listImage.src = book.image;
  listImage.alt = book.title;
  listBlur.src = book.image;
  listActiveOverlay.open = true;
}
