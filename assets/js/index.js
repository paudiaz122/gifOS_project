const APIKEY = 'Zn4f1vgWPpB8sJJWHu6xhkVn5L7yMo9k';
const LIMITGIFS = 25;
const lupaActive = './assets/img/lupa.svg';
const lupaInactive = './assets/img/lupa_inactive.svg';

//CREATE GUIFOS
function goToCreateGuifos(event, element) {
    event.preventDefault();
    sessionStorage.setItem('createGif', true);
    window.location.href = element.href;
}

/*USING GIPHY API*/

const searchButtonElement = document.getElementById('search');
const trendsInput = document.querySelector('.trends input');
const lupaElement = document.querySelector('.search-button img');
const suggestionContainer = document.getElementsByClassName('search-suggestions')[0];
const searchInput = document.querySelector('.search-box input');
const suggestionsSection = document.querySelector('section.suggestions');
const trendDivNode = document.querySelector('.trends .gif-grid');
const gifGrid = document.getElementsByClassName('gif-grid')[0];

//SEARCH
function prepareSearch() {
    localStorage.setItem('search', searchInputValue);
    suggestionContainer.classList.add('hidden');
    suggestionsSection.classList.add('hidden');
    searchInputValue = searchInput.value.trim();
    getSearchResults(searchInputValue).then(response => loadSearchPage(response));
}

async function getSearchResults(search) {
    const found = await fetch('https://api.giphy.com/v1/gifs/search?api_key=' + APIKEY + '&q=' + search + '&limit=' + LIMITGIFS + '&offset=0&rating=G&lang=en')
        .then(response => {
            return response.json();
        })
        .catch(error => {
            return error;
        });
    return found;
}

function loadSearchPage(searchGifs) {
    trendsInput.placeholder = searchInputValue + ' (resultados)';
    gifGrid.innerHTML = '';
    searchGifs.data.forEach(gif => loadSearchGif(gif));
}

function loadSearchGif(gif) {
    const gifURL = gif.images.downsized.url;

    const div = document.createElement('div');
    const img = document.createElement('img');

    div.classList.add('gif-container');
    img.setAttribute('src', gifURL);

    div.append(img);

    trendDivNode.append(div);
}

//SEARCH SUGGESTIONS
let randomSuggestionsArray = ['Love', 'Cats', 'Animals', 'Dogs', 'Sports', 'Famous', 'Funny', 'Reaction', 'Mood', 'Saturday'];
let searchInputValue = '';
let showSuggestions = false;

function randomSuggestion() {
    let randomNumber = Math.round(Math.random() * 9);
    return randomSuggestionsArray[randomNumber];
}

function onSearchInputChange(event) {
    searchInputValue = searchInput.value.trim();
    showSuggestions = searchInputValue.length >= 3;
    if (event.keyCode === 13) { // Mandás la busqueda cuando se aprieta enter
        prepareSearch();
    }
    toggleSearchButtonStatus();
    toggleSuggestions();
}

function toggleSearchButtonStatus() { 
    if (searchInputValue) {
        searchButtonElement.classList.add('ready');
        lupaElement.setAttribute('src', lupaActive);
    } else {
        searchButtonElement.classList.remove('ready');
        lupaElement.setAttribute('src', lupaInactive);
    }
}

function toggleSuggestions() {
    suggestionContainer.innerHTML = ''
    if (showSuggestions) {
        suggestionContainer.classList.remove('hidden');
        for(let i=0; i<3; i++) {
            const div = document.createElement('div');
            const p = document.createElement('p');
            p.innerText = randomSuggestion();
            div.classList.add('suggestion-result');
            div.append(p);
            suggestionContainer.append(div);
        }
    } else {
        suggestionContainer.classList.add('hidden');
    }
}

// function prepareSearch() {
//     getSearchResults(searchInputValue); 
// }

//---------------------------------------------------


// function showSuggestions() {
//     suggestionContainer.innerHTML = '';
//     for(let i=0; i<3; i++) {
//         const div = document.createElement('div');
//         const p = document.createElement('p');
//         p.innerText = randomSuggestion();

//         div.classList.add('suggestion-result');
//         div.append(p);
//         suggestionContainer.append(div);
//     }
// }

// let flag = true;
// function addButtonClass() {
//     if(inputElement.value !== ''){
//         searchButtonElement.classList.add('ready');
//         lupaElement.setAttribute('src', lupaActive);

//         if(inputElement.value.length >= 3) {
//             suggestionContainer.classList.remove('hidden');
//             if(flag === true) {
//                 showSuggestions();
//                 flag = false;
//             }
//         } else {
//             suggestionContainer.classList.add('hidden');
//             flag = true;
//         }
//     } else {
//         searchButtonElement.classList.remove('ready');
//         lupaElement.setAttribute('src', lupaInactive);
//     }
// }

//HASHTAG CREATOR FUNCTIONS
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

//GIF SUGGESTIONS (Random GIFs)
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

//TREND GIFs
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
    const gifURL = gif.images.downsized.url;
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

loadRandomGif();
getTrendGifs().then(response => loadTrendGifs(response));