/*CREATE GIFOS*/
function createGuifos() {
    //tomo todos los elementos de html que necesito mostrar u ocultar
    const navButton = document.getElementsByClassName("nav-button")[0];
    const createGuifosWindow = document.getElementsByClassName("create-guifos")[0];

    //muestro u oculto los elementos
    navButton.classList.add("hidden");
    createGuifosWindow.classList.remove("hidden");
}