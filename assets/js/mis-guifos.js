/*CREATE GIFOS*/
const createGuifosWindow = document.querySelector(".window-container.start");
const createGuifosSection = document.getElementsByClassName("create-guifos")[0];
const checkWindow = document.querySelector('.window-container.check');
const video = document.querySelector('video');
let seconds = 0;

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

// function goToMyGuifos(params) {
//     window.location.reload();
// }

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

function startRecording() {
    myTimer = setInterval(incrementSeconds, 1000);

    return myTimer;
}

function incrementSeconds() {
    const timer = document.querySelector('.counter p');

    seconds = seconds + 1;
    if(seconds <= 9) {
        seconds = '0' + seconds;
        timer.innerHTML = '00:00:' + seconds;
        seconds = parseInt(seconds);
    } else if(seconds <= 60) {
        timer.innerHTML = '00:00:' + seconds;
    }
    stopRecording();
}

function stopTimer(myTimer) {
    clearInterval(myTimer);
    seconds = 0;
}

function stopRecording(params) {
    stopTimer(myTimer);
}

function changeToRecordingStyle() {
    const buttonCapturar = document.querySelector('.capturar');
    const buttonCapturarText = document.querySelector('.capturar .button-text');
    const buttonCapturarIconImg = document.querySelector('.capturar img');
    const counter = document.querySelector('.counter');

    buttonCapturarText.innerHTML = 'Listo';
    buttonCapturarIconImg.setAttribute('src', './assets/img/recording.svg');
    buttonCapturar.classList.add('recording');
    counter.classList.remove('hidden');

    startRecording();
}

checkOrigin();