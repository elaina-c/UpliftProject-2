const searchBox = document.getElementById("searchBox");
const animeContainer = document.getElementById("animeContainer");
const searchAnime = document.getElementById("searchAnimeButton");
const nextPageButton = document.getElementById("nextPageButton");
const backPageButton = document.getElementById("backPageButton");

let currentPage = 1;
let currentQuery = "";

function showSpinner() {
  document.getElementById("loadingSpinner").style.display = "block";
}

function hideSpinner() {
  document.getElementById("loadingSpinner").style.display = "none";
}

function searchInput() {
  const animeTitle = searchBox.value.trim();

  currentQuery = animeTitle;
  currentPage = 1;

  getAnime(currentQuery, currentPage).then((animeList) => {
    displayAnime(animeList);
    updatePageButtons();
  });

  searchBox.value = "";
  searchBox.focus();
  nextPageButton.style.display = "inline";
  backPageButton.style.display = "inline";
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
    return data.data;
  } catch (error) {
    console.error("Failed to fetch anime:", error);
    return [];
  } finally {
    hideSpinner();
  }
}

function displayAnime(animeList) {
  animeContainer.innerHTML = "";

  if (!animeList || animeList.length === 0) {
    animeContainer.innerHTML = `<p class="noAnimeFound">No Anime found.</p>`;
    return;
  }

  animeList.forEach((anime) => {
    const animeCard = document.createElement("div");
    animeCard.className = "animeCard";
    animeCard.innerHTML = `
      <img class="animeImg fadesUp" src="${anime.images.jpg.image_url}" />
      <div class="animeDescription">
      <h2>${anime.title} - ${anime.year ?? ""}</h2>
      <p> 
      ⭐ ${anime.score ?? "N/A"}<br>
      ❤  ${anime.favorites ?? "N/A"} <br>
      <b>Genre:</b> ${anime.genres.map((g) => g.name).join(", ") || "N/A"}<br>
      <b>Episodes:</b> ${anime.episodes ?? "N/A"} <br>
      <b>Status:</b> ${anime.status} <br>
      <b>Broadcast:</b> ${anime.broadcast?.day ?? "Finished"}<br>
      <b>Duration:</b> ${anime.duration ?? "N/A"} <br>
      <b>Studio:</b> ${anime.studios.map((s) => s.name).join(", ") || "N/A"}
      </p>
      <div class="ventiMushroom">
        <img src="pictures/ventiMushroom.png" class="mushroomIcon jumpItem" alt="logo" />
      </div>
    `;
    animeContainer.appendChild(animeCard);
  });
}

function updatePageButtons() {
  backPageButton.disabled = currentPage === 1;
}

searchInput();

getAnime(currentQuery, currentPage).then((animeList) => {
  displayAnime(animeList);
  updatePageButtons();
});

searchAnime.addEventListener("click", searchInput);

nextPageButton.addEventListener("click", () => {
  currentPage++;
  getAnime(currentQuery, currentPage).then((animeList) => {
    displayAnime(animeList);
    updatePageButtons();
  });
  searchBox.value = "";
  searchBox.focus();
});

backPageButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    getAnime(currentQuery, currentPage).then((animeList) => {
      displayAnime(animeList);
      updatePageButtons();
    });
    searchBox.value = "";
    searchBox.focus();
  }
});

searchBox.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    searchInput();
  }
});
