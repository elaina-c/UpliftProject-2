document.addEventListener("DOMContentLoaded", async () => {
  const { anime, hasNext } = await getLatestAnime(currentPage);
  displayAnime(anime);
  updatePageButtons(hasNext);
});

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY || document.documentElement.scrollTop;

  if (scrollY > 300) {
    backToTopBtn.style.display = "block";
  } else {
    backToTopBtn.style.display = "none";
  }
});

backToTopBtn.addEventListener("click", function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

searchAnime.addEventListener("click", searchInput);

searchBox.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    searchInput();
  }
});

nextPageButton.addEventListener("click", () => {
  currentPage++;
  loadAnimePage();
  searchBox.focus();
});

backPageButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    loadAnimePage();
    searchBox.focus();
  }
});
