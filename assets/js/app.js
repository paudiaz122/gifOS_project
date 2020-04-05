const SAILORDAY = 'light';
const SAILORNIGHT = 'dark';
const APIKEY = 'Zn4f1vgWPpB8sJJWHu6xhkVn5L7yMo9k';
const LIMITGIFS = 25;

/*LOAD THEME*/
function loadTheme() {
    const theme = sessionStorage.getItem('theme') || SAILORDAY;
    const body = document.getElementsByTagName('body')[0];
    body.setAttribute('theme', theme);
}


/*OPEN THEME BUTTON*/

var buttonOpen = false;
var themeButton = document.getElementById('theme');

function toggleButton() {
    buttonOpen = !buttonOpen;
    themeButton.classList.toggle('button-open');
}

/*CHANGE THEME BUTTONS*/

function changeCSS(theme, event) {

    event.preventDefault();
    const body = document.body;
    //NO DEBERIA RECARGAR LA PAGINA!!
    if (theme === 'sailorNight') {
        body.setAttribute('theme', SAILORNIGHT);
        sessionStorage.setItem('theme', SAILORNIGHT);
    }
    else {
        body.setAttribute('theme', SAILORDAY);
        sessionStorage.setItem('theme', SAILORDAY);
    }
}

/*USING GIPHY API*/
//SEARCH BUTTON

document.getElementById('search').addEventListener('click', () => {
    const search = document.querySelector('.search-box input').nodeValue;
    getSearchResults(search);
});

async function getSearchResults(search) {
    const found = await fetch('http://api.giphy.com/v1/gifs/search?q=' + search + '&api_key=' + APIKEY)
        .then(response => {
            return response.json();
        })
        .then(data => {
            return data;
        })
        .catch(error => {
            return error;
        });
    return found;
}

//GIF SUGGESTIONS

function hashtagCreator(stringToConvert) {
    let finalString = '';
    let index = stringToConvert.indexOf(' ');
    while(index != -1) {
        finalString = finalString + stringToConvert.slice(0, index);
        stringToConvert = stringToConvert.slice(index + 1);
        index = stringToConvert.indexOf(' ');
    }
    return '#' + finalString + stringToConvert;
}

function hashtagCreatorForTrends(stringToConvert) {
    let finalString = '';
    let index = stringToConvert.indexOf(' ');
    
    while(index != -1) {

        finalString = finalString + stringToConvert.slice(0, index) + ' #';
        stringToConvert = stringToConvert.slice(index + 1);
        index = stringToConvert.indexOf(' ');
    }
    return '#' + finalString + stringToConvert;
}

async function getRandomGif() {
    const consultRandom = await fetch('https://api.giphy.com/v1/gifs/random?api_key=' + APIKEY + '&tag=&rating=G')
        .then(response => {
            return response.json();
        })
        .catch(error => {
            return error;
        })
    return consultRandom;
}

async function loadRandomGif() {
    const suggestionImgNodes = document.querySelectorAll('.suggestions .gif-container img');
    const suggestionHashtagNodes = document.querySelectorAll('.suggestions .bar p');
    
    for (let i = 0; i < 4; i++) {
        const gif = await getRandomGif();
        suggestionImgNodes[i].setAttribute('src', gif.data.images.downsized.url);
        suggestionHashtagNodes[i].innerHTML = hashtagCreator(gif.data.title);
    }
}


//trends GIFS

const trendDivNode = document.querySelector('.trends .gif-grid');

async function getTrendGifs() {
    const consultTrend = await fetch('https://api.giphy.com/v1/gifs/trending?api_key=' + APIKEY + '&limit=' + LIMITGIFS + '&rating=G')
        .then(response => {
            return response.json();
        })
        .catch(error => {
            return error;
        })
    return consultTrend;
}

//Por cada tirada de LIMITGIFS que me trae la API, cargo uno por uno con loadGif()
function loadTrendGifs(gifs) {
    gifs.data.forEach(gif => loadGif(gif));
}

//Cargo gif por gif del arreglo de LIMITGIFS
function loadGif(gif) {
    const gifURL = gif.images.fixed_height.url; //VER SI NO USO OTRA
    const gifHashtag = gif.title;

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

    trendDivNode.append(div);
}

loadTheme();
loadRandomGif();
getTrendGifs().then(response => loadTrendGifs(response));


//https://api.giphy.com/v1/gifs/random?api_key=' + APIKEY + '&tag=&rating=G

// const consultTrend = await fetch('https://api.giphy.com/v1/gifs/trending?api_key=Zn4f1vgWPpB8sJJWHu6xhkVn5L7yMo9k&limit=25&rating=G');
// const consultParam = await fetch('http://api.giphy.com/v1/gifs/search?q=${searchParam}&api_key=WMgym4yAIPYofgGPrganKNA7n1vg2D5Y');
// const consultRandom = await fetch('https://api.giphy.com/v1/gifs/random?api_key=Zn4f1vgWPpB8sJJWHu6xhkVn5L7yMo9k&tag=&rating=G');

