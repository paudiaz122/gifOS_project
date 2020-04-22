/*CREATE GIFOS*/

const createGuifosWindow = document.querySelector(".window-container.start");
const createGuifosSection = document.getElementsByClassName("create-guifos")[0];
const checkWindow = document.querySelector('.window-container.check');

function checkOrigin() {
    if(sessionStorage.getItem('createGif') === 'true') {
        createGuifos();
        sessionStorage.setItem('createGif', 'false');
    }
}

function createGuifos() {
    //tomo todos los elementos de html que necesito mostrar u ocultar
    const navButton = document.getElementsByClassName("nav-button")[0];
    const goBakcArrow = document.getElementsByClassName("goback")[0];

    //muestro u oculto los elementos
    navButton.classList.add("hidden");
    createGuifosSection.classList.remove("hidden");
    goBakcArrow.classList.remove("hidden");
}

function startCheck() {
    checkWindow.classList.remove('hidden');
    createGuifosWindow.classList.add('hidden');
}

checkOrigin();