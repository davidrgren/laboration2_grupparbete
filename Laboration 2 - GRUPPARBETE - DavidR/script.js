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
