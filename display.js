function displayAnime(animeList) {
  animeContainer.innerHTML = "";

  if (!animeList || animeList.length === 0) {
    animeContainer.innerHTML = "<p>No anime found.</p>";
    return;
  }

  backToTopBtn.style.display = "block";

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
      </div>
    `;
    animeContainer.appendChild(animeCard);
  });
}
