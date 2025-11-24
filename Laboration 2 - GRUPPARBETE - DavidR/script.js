// ========== Hamburgarmeny-animation ==========
const menuToggle = document.querySelector('.menu-toggle')
const navMenu = document.querySelector('.nav-menu')

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active')
    navMenu.classList.toggle('active')
})

// ========== Byt mellan ljust/mörkt läge ==========
const themeButton = document.getElementById('theme-button')
const themeMode = document.body

themeButton.addEventListener('click', () => {
    themeMode.classList.toggle('dark-mode')
    themeMode.classList.toggle('light-mode')
})

// bok sök funktionalitet
const searchInput = document.getElementById('book-search')
const searchBtn = document.getElementById('search-btn')
const carouselCells = document.querySelectorAll('.carousel-cell')

// Default bok innehåll
async function loadDefaultCarousel() {
    const response = await fetch(
        'https://www.googleapis.com/books/v1/volumes?q=best+selling+books'
    )
    const data = await response.json()

    data.items.slice(0, carouselCells.length).forEach((book, i) => {
        const info = book.volumeInfo
        const thumbnail = info.imageLinks?.thumbnail

        carouselCells[i].innerHTML = `<img src="${thumbnail}" />
            <h4>${info.title}</h4>`
    })
}

const s2 = document.getElementById('s2')
const s3 = document.getElementById('s3')

function createSearchResultsSection() {
    // Kolla om sektionen redan finns
    if (document.getElementById('search-results')) return

    const section = document.createElement('section')
    section.id = 'search-results'
    section.style.padding = '2rem'
    section.style.backgroundColor = '#deb887'
    section.style.color = '#4c2b17'
    section.style.display = 'grid'
    section.style.gridTemplateColumns = 'repeat(auto-fit, minmax(150px, 1fr))'
    section.style.gap = '1.5rem'
    section.style.marginTop = '2rem'
    section.style.borderTop = '3px solid #deb887'
    section.style.borderBottom = '3px solid #deb887'

    s2.insertAdjacentElement('afterend', section)
}

// visar bok sökresultat
function fillSearchResults(books) {
    createSearchResultsSection()
    const resultsSection = document.getElementById('search-results')
    resultsSection.innerHTML = ''

    if (!books || books.length === 0) {
        resultsSection.innerHTML = '<p>Inga böcker hittades.</p>'
        return
    }

    books.forEach((book) => {
        const info = book.volumeInfo
        const thumbnail =
            info.imageLinks?.thumbnail ||
            'https://via.placeholder.com/128x195?text=No+Cover'
        const title = info.title || 'Ingen titel'

        const card = document.createElement('div')
        card.classList.add('search-card')

        card.innerHTML = `
        <div class="card-img-wrapper" style="position:relative; width:100%;">
            <img src="${thumbnail}" style="width:100%;   height:200px; object-fit:cover; " />
            <button class="favorite-btn" title="Favorit">

                <i class="fa-regular fa-star"></i>
            </button>
        </div>
        <h4 style="margin-top:0.5rem; font-size:1rem;">${title}</h4>
    `; //stjärnan från fontawesome


   // Favorit knappen på bok kortet
const favBtn = card.querySelector(".favorite-btn");
favBtn.addEventListener("click", () => {
    const icon = favBtn.querySelector("i");
    icon.classList.toggle("fa-regular");
    icon.classList.toggle("fa-solid");

    const bookData = {
        title,
        thumbnail
    };

    // Spara eller ta bort i localStorage
    toggleFavorite(bookData);

    // Färga ikonen
    icon.style.color = icon.classList.contains("fa-solid") ? "#FFD700" : "#deb887";
});


    resultsSection.appendChild(card)
})

}
async function toggleFavorite(book) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    const exists = favorites.some(fav => fav.title === book.title);

    if (exists) {
        favorites = favorites.filter(fav => fav.title !== book.title);
        localStorage.setItem("favorites", JSON.stringify(favorites));

        await fetch(`http://localhost:3000/favorites/${encodeURIComponent(book.title)}`, {
            method: "DELETE"
        });
    } else {

        favorites.push(book);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        await fetch("http://localhost:3000/favorites", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(book)
        });
    }
}



// Sök efter bok
async function searchBooks(query) {
    const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
            query
        )}`
    )
    const data = await response.json()

    // Fyller karusellen
    if (!data.items) {
        carouselCells.forEach((cell) => {
            cell.innerHTML = `<p>Inga resultat</p>`
        })
        fillSearchResults([])
        return
    }

    data.items.slice(0, carouselCells.length).forEach((book, i) => {
        const info = book.volumeInfo
        const thumbnail =
            info.imageLinks?.thumbnail ||
            'https://via.placeholder.com/128x195?text=No+Cover'

        carouselCells[i].innerHTML = `
            <img src="${thumbnail}" />
            <h4>${info.title}</h4>
        `
    })

    // Fyll nya sökresultat med böcker
    fillSearchResults(data.items.slice(0, 12))
}



// tryck på sök
searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim()
    if (query === '') {
        loadDefaultCarousel()
    } else {
        searchBooks(query)
    }
})

// Tryck på Enter
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click()
    }
})

// Kör default vid start
loadDefaultCarousel()

/* ketegorier */

const categories = [
    'Fiction',
    'History',
    'Romance',
    'Science',
    'Fantasy',
    'Horror',
    'Poetry',
    'Biography',
    'Art',
    'Cooking',
    'Travel',
    'Children'
]

async function fetchCategoryBooks() {
    const boxes = document.querySelectorAll('.carousel-box')

    for (let i = 0; i < boxes.length; i++) {
        const category = categories[i]

        try {
            const response = await fetch(
                `https://www.googleapis.com/books/v1/volumes?q=subject:${category}`
            )
            const data = await response.json()
            // Ta första boken i kategorin
            const book = data.items?.[0]?.volumeInfo
            const thumbnail =
                book?.imageLinks?.thumbnail ||
                'https://via.placeholder.com/128x195?text=No+Cover'

            // Lägg in bok o kategori namn under
            boxes[i].innerHTML = `
                <img src="${thumbnail}" alt="${category}" />
                <p>${category}</p>
            `
        } catch (error) {
            console.error('API-fel:', category, error)
        }
    }
}
fetchCategoryBooks()

// click på kategori
const categoryBoxes = document.querySelectorAll('.carousel-box')

categoryBoxes.forEach((box, index) => {
    box.addEventListener('click', () => {
        const category = categories[index]
        if (category) {

            searchBooks(category)

            searchInput.value = category

            window.scrollTo({
                top: 230,
                behavior: 'smooth'
            })
        }
    })
})
