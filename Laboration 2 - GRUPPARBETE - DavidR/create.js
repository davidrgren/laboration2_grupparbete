
const titleInput = document.querySelector(".createBookTitle input");
const authorInput = document.querySelector(".createBookAuthor input");
const addBookBtn = document.querySelector(".addBook button");
const myBooksSection = document.querySelector(".myBooks");


// laddar skapade böcker från localStorage
function loadLocalBooks() {
    return JSON.parse(localStorage.getItem("myBooks")) || [];
}

function saveLocalBooks(books) {
    localStorage.setItem("myBooks", JSON.stringify(books));
}

function addBookToLocal(book) {
    const books = loadLocalBooks();
    books.push(book);
    saveLocalBooks(books);
}

function removeBookFromLocal(id) {
    let books = loadLocalBooks();
    books = books.filter(b => b.id !== id);
    saveLocalBooks(books);
}
// lade till denna för dummyjson inte har unikt id
function generateId() {
    return Date.now() + Math.floor(Math.random() * 1000);
}


//skapar bok med post metod
async function createBook(title, author) {
    try {
        const res = await fetch("https://dummyjson.com/products/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: title,
                author: author,
                thumbnail: "assets/images/imagePlaceholder.png"
            })
        });

        const data = await res.json();

        data.id = generateId();
        data.author = author;

        return data;

    } catch (error) {
        console.error("Kunde inte skapa bok:", error);
    }
}



//radera bok med delete metod
async function deleteBook(id) {
    try {
        const res = await fetch(`https://dummyjson.com/products/${id}`, {
            method: "DELETE"
        });

        return res.json();

    } catch (error) {
        console.error("Kunde inte radera bok:", error);
    }
}


// Rendera bokkort
function renderBookCard(book) {
    const card = document.createElement("div");
    card.classList.add("myBookCard");
    card.dataset.id = book.id;

    card.innerHTML = `
        <img src="${book.thumbnail}" alt="Book Cover" class="book-cover"/>
        <div class="book-info">
            <h2>${book.title}</h2>
            <h3>${book.author}</h3>
        </div>

        <button class="removeFavoritesBtn" title="Radera bok">
            <img src="assets/icons/delete.png" alt="Delete"/>
        </button>
    `;

    // DELETE-knapp
    card.querySelector(".removeFavoritesBtn").addEventListener("click", async () => {
        await deleteBook(book.id);
        removeBookFromLocal(book.id);
        card.remove();
    });

    myBooksSection.appendChild(card);
}


// hämta böcker vid start
function loadBooksOnStart() {
    const storedBooks = loadLocalBooks();
    storedBooks.forEach(book => renderBookCard(book));
}

loadBooksOnStart();


//skapar bok vid knapptryck
addBookBtn.addEventListener("click", async () => {
    const title = titleInput.value.trim();
    
    const author = authorInput.value.trim();

    if (!title || !author) {
        alert("Fyll i både titel och författare!");
        return;
    }

    // Skapa via API
    const newBook = await createBook(title, author);

    if (newBook) {

        addBookToLocal(newBook);


        renderBookCard(newBook);

        titleInput.value = "";
        authorInput.value = "";
    }
});
