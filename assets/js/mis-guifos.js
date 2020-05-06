const createGuifosWindow = document.querySelector(".window-container.start");
const createGuifosSection = document.getElementsByClassName("create-guifos")[0];
const checkWindow = document.querySelector('.window-container.check');
const titleWindowBar = document.querySelector('.window-container.check .bar p');
const video = document.querySelector('video');
const buttonCapturar = document.querySelector('.capturar');
const buttonRecording = document.querySelector('.recording');
const counter = document.querySelector('.counter');
const gifPreview = document.querySelector('.gif-preview');
const remakeButton = document.querySelector('.remake-gif');
const uploadButton = document.querySelector('.upload-gif');
const buttonCancelarUpload = document.querySelector('.window-container.check button.cancelar');
const uploadingBackground = document.querySelector('.uploading');
const myGuifosDivNode = document.querySelector('.mis-guifos .gif-grid');
const uploadedWindow = document.querySelector('.window-container.uploaded');
const uploadedGifImg = document.querySelector('.uploaded img');
const timer = document.querySelector('.counter p');
const controller = new AbortController()
const signal = controller.signal
let myGifURL;
let copied = 0;
let downloaded = 0;
let jsonRes;
let seconds = 0;
let recorder;
let myTimer;
let gifURL;
let form;
let myGifs = [];
let index = 0;
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

async function loadMyGuifosPage() {
    for(let i = 0; i <= localStorage.length - 1; i++) {
        let id = localStorage.getItem(localStorage.key(i));
        let myGifById = await getGifByID(id);
        //console.log(myGifById);
        loadMyGif(myGifById.data.images.downsized.url);
    }
}

async function getGifByID(id) {
    const consultById = await fetch('https://api.giphy.com/v1/gifs/' + id +'?api_key=' + APIKEY)
        .then(response => {
            return response.json();
        })
        .catch(error => {
            return error;
        })
    return consultById;
}

function loadMyGif(gifURL) {
    const gifHashtag = 'myGIF';

    const div = document.createElement('div');
    const img = document.createElement('img');
    const divBar = document.createElement('div');
    const p = document.createElement('p');

    div.classList.add('gif-container');
    divBar.classList.add('bar');
    img.setAttribute('src', gifURL);
    p.innerHTML = hashtagCreatorForTrends(gifHashtag);

    div.append(img);
    divBar.append(p);
    div.append(divBar);

    myGuifosDivNode.append(div);
}

/*CREATE GIFOS*/
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

    if(sessionStorage.getItem('data-theme') === 'dark') {
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
        alert('No se puede acceder a tu cámara. Por favor, chequeá la consola.');
        console.error(error);
    })
}

function startToRecordOnWindow() {
    changeToRecordingStyle();

    myTimer = setInterval(incrementSeconds, 1000);
    recorder.startRecording();
}

function incrementSeconds() {
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
        form = new FormData();
        let blob = recorder.getBlob();

        form.append('file', blob, 'myGif.gif');

        gifURL = URL.createObjectURL(blob);
        gifPreview.setAttribute('src', gifURL);

        console.log(form.get('file'));

        changeToPreviewStyle();
    });
}

function changeToRecordingStyle() {
    buttonCapturar.classList.add('hidden');
    counter.classList.remove('hidden');
    buttonRecording.classList.remove('hidden');
    titleWindowBar.innerHTML = 'Capturando Tu Guifo';
}

function stopTimer(myTimer) {
    clearInterval(myTimer);
    seconds = 0;
}

function changeToPreviewStyle() {
    gifPreview.classList.remove('hidden');
    video.classList.add('hidden');

    remakeButton.classList.remove('hidden');
    uploadButton.classList.remove('hidden');
    buttonRecording.classList.add('hidden');
    titleWindowBar.innerHTML = 'Vista Previa';
}

function uploadGif() {
    fetch('https://upload.giphy.com/v1/gifs?api_key=' + APIKEY + '&source_image_url=' + gifURL, {
        method: "POST",
        body: form,
        signal: signal
    }).then(async res => {
        jsonRes = await res.json(); //Convierto la respuesta a JSON
        saveGifInLocaStorage(); //Guardo ID del GIF en localStorage
        changeToUploadedStyle();

        let myGifById = await getGifByID(jsonRes.data.id);
        loadMyGif(myGifById.data.images.downsized.url);
        
        return jsonRes;
    })
    .catch(error => console.error('Error:', error))
    .then(response => console.log('Success:', response));
    
    changeToUploadingStyle();
}

function abortUpload() {
    console.log('Now aborting');
    controller.abort()
    window.location.reload();
}

function reDoGif() {
    timer.innerHTML = '00:00:00';
    remakeButton.classList.add('hidden');
    uploadButton.classList.add('hidden');
    counter.classList.add('hidden');
    gifPreview.classList.add('hidden');
    video.classList.remove('hidden');
    buttonCapturar.classList.remove('hidden');

    startCheck();
}

function saveGifInLocaStorage() {
    localStorage.setItem(jsonRes.data.id, jsonRes.data.id);
}

function changeToUploadingStyle() {
    uploadingBackground.classList.remove('hidden');
    buttonCancelarUpload.classList.remove('hidden');
    gifPreview.classList.add('hidden');
    remakeButton.classList.add('hidden');
    uploadButton.classList.add('hidden');
    counter.classList.add('hidden');
    titleWindowBar.innerHTML = 'Subiendo Guifo';
}

function changeToUploadedStyle() {
    checkWindow.classList.add('hidden');
    uploadedWindow.classList.remove('hidden');
    uploadedGifImg.setAttribute('src', gifURL);
}

async function copyMyGifLink() {
    copied = 1;

    if(downloaded === 1) {
        await navigator.clipboard.writeText(myGifURL);
    } else {
        let myGifById = await getGifByID(jsonRes.data.id);
        myGifURL = myGifById.data.images.downsized.url;
        await navigator.clipboard.writeText(myGifURL);
    }
}

async function downloadMyGif() {
    downloaded = 1;

    if(copied === 1) {
        await recorder.save(myGifURL);
    } else {
        let myGifById = await getGifByID(jsonRes.data.id);
        myGifURL = myGifById.data.images.downsized.url;
        await recorder.save(myGifURL);
    }
}

function GifDone() {
    downloaded = 0;
    copied = 0;
    timer.innerHTML = '00:00:00';
    window.location.reload();
}

checkOrigin();
loadMyGuifosPage();