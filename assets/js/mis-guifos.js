/*CREATE GIFOS*/

const createGuifosWindow = document.querySelector(".window-container.start");
const createGuifosSection = document.getElementsByClassName("create-guifos")[0];
const checkWindow = document.querySelector('.window-container.check');
const video = document.querySelector('video');

const constraints = {
    audio: false,
    video: {
        height: { max: 480 }
    }
}

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

//VIDEO FUNCTIONS
function getStreamAndRecord () {
    navigator.mediaDevices.getUserMedia(constraints)
    .then(function(stream) {
        video.srcObject = stream;
        video.play();
    }).catch(function(err) {
        //manejo error
    })
}

function startCheck() {
    checkWindow.classList.remove('hidden');
    createGuifosWindow.classList.add('hidden');
    getStreamAndRecord();
}

checkOrigin();