const searchBox = document.getElementById("searchBox");
const animeContainer = document.getElementById("animeContainer");
const searchAnime = document.getElementById("searchAnimeButton");
const nextPageButton = document.getElementById("nextPageButton");
const backPageButton = document.getElementById("backPageButton");
const backToTopBtn = document.getElementById("backToTopBtn");
const cardContainer = document.getElementById("cardContainer");

let currentPage = 1;
let currentQuery = "";

function showSpinner() {
  document.getElementById("loadingSpinner").style.display = "block";
}

function hideSpinner() {
  document.getElementById("loadingSpinner").style.display = "none";
}

function loadAnimePage() {
  if (currentQuery === "") {
    getLatestAnime(currentPage).then(({ anime, hasNext }) => {
      displayAnime(anime);
      updatePageButtons(hasNext);
    });
  } else {
    getAnime(currentQuery, currentPage).then(({ anime, hasNext }) => {
      displayAnime(anime);
      updatePageButtons(hasNext);
    });
  }
}

function searchInput() {
  const animeTitle = searchBox.value.trim();
  currentQuery = animeTitle;
  currentPage = 1;

  loadAnimePage();

  searchBox.value = "";
  searchBox.focus();
}

if (animeTitle === "") {
  getLatestAnime(currentPage).then(({ anime, hasNext }) => {
    displayAnime(anime);
    updatePageButtons(hasNext);
  });
} else {
  getAnime(currentQuery, currentPage).then(({ anime, hasNext }) => {
    displayAnime(anime);
    updatePageButtons(hasNext);
  });
}

searchBox.value = "";
searchBox.focus();
nextPageButton.style.display = "inline";
backPageButton.style.display = "inline";

window.onscroll = function () {
  if (
    document.body.scrollTop > 300 ||
    document.documentElement.scrollTop > 300
  ) {
    backToTopBtn.style.display = "block";
  } else {
    backToTopBtn.style.display = "none";
  }
};

async function getLatestAnime(page = 1) {
  showSpinner();
  try {
    const res = await fetch(
      `https://api.jikan.moe/v4/anime?order_by=popularity&sort=asc&page=${page}&limit=20`
    );
    const data = await res.json();
    return { anime: data.data, hasNext: data.pagination.has_next_page };
  } catch (error) {
    console.error("Error fetching latest anime:", error);
    return { anime: [], hasNext: false };
  } finally {
    hideSpinner();
  }
}

async function getAnime(animeTitle, page = 1) {
  showSpinner();
  try {
    const res = await fetch(
      `https://api.jikan.moe/v4/anime?q=${animeTitle}&limit=20&page=${page}`
    );

    if (res.status === 429) {
      throw new Error("Too many requests. Please wait a moment and try again.");
    }

    if (!res.ok) {
      throw new Error(`Failed to fetch anime: ${res.status}`);
    }

    const data = await res.json();
    return { anime: data.data, hasNext: data.pagination.has_next_page };
  } catch (error) {
    console.error("Failed to fetch anime:", error);
    return { anime: [], hasNext: false };
  } finally {
    hideSpinner();
  }
}

function updatePageButtons(hasNextPage) {
  backPageButton.disabled = currentPage === 1;
  backPageButton.style.display = currentPage === 1 ? "none" : "inline-block";

  nextPageButton.disabled = !hasNextPage;
  nextPageButton.style.display = hasNextPage ? "inline-block" : "none";
}
