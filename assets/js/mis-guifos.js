/*CREATE GIFOS*/
const createGuifosWindow = document.querySelector(".window-container.start");
const createGuifosSection = document.getElementsByClassName("create-guifos")[0];
const checkWindow = document.querySelector('.window-container.check');
const video = document.querySelector('video');
const gifPreview = document.querySelector('.gif-preview');
let seconds = 0;
let recorder;
let myTimer;
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

//RECORD RELATED
function startCheck() {
    const cameraImg = document.querySelector('.capturar img');

    checkWindow.classList.remove('hidden');
    createGuifosWindow.classList.add('hidden');

    if(sessionStorage.getItem('theme') === 'dark') {
        cameraImg.setAttribute('src', './assets/img/camera_light.svg');
    } else {
        cameraImg.setAttribute('src', './assets/img/camera.svg');
    }
    
    getStreamAndRecord();
}

function getStreamAndRecord () {
    navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => {
        recorder = RecordRTC(stream, {
            type: 'gif',
            frameRate: 1,
            quality: 10,
            width: 360,
            hidden: 240,
            onGifRecordingStarted: function() {
                console.log('onGifRecordingStarted')
            }
        });
        video.srcObject = stream;
        video.play();
    }).catch(error => {
        alert('No se puede acceder a tu cámara. Por favor, chequeá los console logs.');
        console.error(error);
    })
}

function startToRecordOnWindow() {
    changeToRecordingStyle();

    myTimer = setInterval(incrementSeconds, 1000);
    recorder.startRecording();
}

function incrementSeconds() {
    const timer = document.querySelector('.counter p');

    if(seconds < 60) {
        seconds++;

        if(seconds <= 9) {
            seconds = '0' + seconds;
            timer.innerHTML = '00:00:' + seconds;
            seconds = parseInt(seconds);
        } else {
            timer.innerHTML = '00:00:' + seconds;
        }
    } else {
        stopToRecordOnWindow();
    }
}

function stopToRecordOnWindow() {
    stopTimer(myTimer);

    recorder.stopRecording(() => {
        let form = new FormData();
        let blob = recorder.getBlob();

        form.append('file', blob, 'myGif.gif');

        gifPreview.setAttribute('src', URL.createObjectURL(blob));
        gifPreview.classList.remove('hidden');
        video.classList.add('hidden');

        // console.log(form, gifSrc);
        // TODO: Post a la API
    });
}

function changeToRecordingStyle() {
    const buttonCapturar = document.querySelector('.capturar');
    const buttonRecording = document.querySelector('.recording');
    const counter = document.querySelector('.counter');

    buttonCapturar.classList.add('hidden');
    counter.classList.remove('hidden');
    buttonRecording.classList.remove('hidden');
}

function stopTimer(myTimer) {
    clearInterval(myTimer);
    seconds = 0;
}

checkOrigin();