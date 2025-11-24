document.addEventListener("DOMContentLoaded", () => {
    const list = document.getElementById("favoritesList");

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    list.innerHTML = ""; 

    if (favorites.length === 0) {
        list.innerHTML = "<p>Du har inga favoriter ännu.</p>";
        return;
    }

    favorites.forEach(book => {
        const card = document.createElement("div");
        card.classList.add("favoritesBookCard");

        card.innerHTML = `
            <img src="${book.thumbnail}" alt="${book.title}" class="book-cover" />

            <div class="book-info">
                <h2>${book.title}</h2>
            </div>

            <button class="removeFavoritesBtn" title="Ta bort favorit">
                <img src="assets/icons/delete.png" alt="Delete" />
            </button>
        `;

        // Remove from favorites
        card.querySelector(".removeFavoritesBtn").addEventListener("click", () => {
            removeFavorite(book.title);
            card.remove();
        });

        list.appendChild(card);
    });
});

// Remove function
async function removeFavorite(title) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites = favorites.filter(book => book.title !== title);
    localStorage.setItem("favorites", JSON.stringify(favorites));

    await fetch(`http://localhost:3000/favorites/${encodeURIComponent(title)}`, {
        method: "DELETE"
    });
}
