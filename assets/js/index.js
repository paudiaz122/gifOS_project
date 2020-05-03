const LIMITGIFS = 25;
const searchButtonElement = document.getElementById('search');
const trendsInput = document.querySelector('.trends input');
const suggestionContainer = document.getElementsByClassName('search-suggestions')[0];
const searchInput = document.querySelector('.search-box input');
const suggestionsSection = document.querySelector('section.suggestions');

let randomSuggestionsArray = ['Love', 'Cats', 'Animals', 'Dogs', 'Sports', 'Famous', 'Funny', 'Reaction', 'Mood', 'Saturday'];
let searchInputValue = '';
let showSuggestions = false;

//CREATE GUIFOS
function goToCreateGuifos(event, element) {
    event.preventDefault();
    sessionStorage.setItem('createGif', true);
    window.location.href = element.href;
}

/*USING GIPHY API*/
//SEARCH
function prepareSearch() {
    sessionStorage.setItem('search', searchInputValue); //TODO completar botones azules
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
    trendDivNode.innerHTML = '';
    searchGifs.data.forEach(gif => loadGif(gif));
}

//SEARCH SUGGESTIONS
function randomSuggestion() {
    let randomNumber = Math.round(Math.random() * 9);
    return randomSuggestionsArray[randomNumber];
}

function onSearchInputChange() {
    searchInputValue = searchInput.value.trim();
    showSuggestions = searchInputValue.length >= 3;
    
    toggleSearchButtonStatus();
    toggleSuggestions();
}

function onSearchInputKeydown(event) {
    if (event.keyCode === 13) { // Manda la busqueda cuando se aprieta enter
        showSuggestions = false;

        searchInput.blur();
        toggleSuggestions();
        prepareSearch();
    }
}

function toggleSearchButtonStatus() { 
    if (searchInputValue) {
        searchButtonElement.classList.add('ready');
        lupaElement.setAttribute('src', lupaActive);
    } else {
        searchButtonElement.classList.remove('ready');
        if(sessionStorage.getItem('theme') === SAILORDAY) {
            lupaElement.setAttribute('src', lupaInactive);
        } else {
            lupaElement.setAttribute('src', lupaInactiveNight);
        }
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

// const suggestionResultNode = document.getElementsByClassName('suggestion-result');
// suggestionResultNode.addEventListener('click', event => {
//     searchInput.value = event.target.innerHTML;
//     prepareSearch();
// })

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