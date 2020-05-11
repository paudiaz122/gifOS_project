const LIMITGIFS = 25;
const searchButtonElement = document.getElementById('search');
const trendsInput = document.querySelector('.trends input');
const suggestionContainer = document.getElementsByClassName('search-suggestions')[0];
const searchInput = document.querySelector('.search-box input');
const suggestionsSection = document.querySelector('section.suggestions');
const suggestionResultNode = document.getElementsByClassName('suggestion-result');

let pTextToSearch;
let searchInputValue = '';
let showSuggestions = false;

let searchSuggestionAbortController;

//CREATE GUIFOS
function goToCreateGuifos(event, element) {
    event.preventDefault();
    sessionStorage.setItem('createGif', true);
    window.location.href = element.href;
}

/*USING GIPHY API*/
//SEARCH
function prepareSearch() {
    // sessionStorage.setItem('search', searchInputValue);
    searchInputValue = searchInput.value.trim();

    if (searchInputValue) {
        suggestionContainer.classList.add('hidden');
        suggestionsSection.classList.add('hidden');
        getSearchResults(searchInputValue).then(response => loadSearchPage(response));
    }
}

function seeMore(event) {
    const pGifBarTitle = event.path[2].childNodes[1].childNodes[1];
    const pGifBarTitleText = pGifBarTitle.innerHTML;

    pTextToSearch = pGifBarTitleText.trim().replace(/#+/g, '').replace(/\s+/g, '+');

    suggestionContainer.classList.add('hidden');
    suggestionsSection.classList.add('hidden');
    getSearchResults(pTextToSearch).then(response => loadSearchPage(response));
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
    if(searchInputValue) {
        trendsInput.placeholder = searchInputValue + ' (resultados)';
    } else {
        trendsInput.placeholder = pTextToSearch + ' (resultados)';
    }
    
    trendDivNode.innerHTML = '';

    const RATIO = 1.7;
    let sum = 0, i=0;
    let rectangule;
    let gifRatio;
    let gif;

    do {
        // console.log(searchGifs);
        gif = searchGifs.data[i];
        // console.log(gif);
        gifRatio = gif.images.downsized.width / gif.images.downsized.height;

        if(gifRatio > RATIO){
            rectangule = 2;
        } else {
            rectangule = 1;
        }
        if(sum + rectangule <= 4) {
            loadGif(gif, rectangule);
            sum += rectangule;
            searchGifs.data.splice(i, 1);

            if(sum === 4) {
                sum = 0;
                i = 0;
            }
        } else {
            i++;
        }
    } while (searchGifs.data.length > 0)
}

//SEARCH SUGGESTIONS
async function searchSuggestion(text) {
    if (searchSuggestionAbortController) {
        searchSuggestionAbortController.abort();
    }

    searchSuggestionAbortController = new AbortController();

    const suggestionResult = await fetch('https://api.giphy.com/v1/tags/related/' + text + '?api_key=' + APIKEY, {
        signal: searchSuggestionAbortController.signal
    })
        .then(response => {
            searchSuggestionAbortController = null;
            return response.json();
        })
        .catch(error => {
            console.log('Error: ', error);
            return;
        });
    
    return suggestionResult;
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

async function toggleSuggestions() {
    suggestionContainer.innerHTML = ''
    if (showSuggestions) {
        suggestionContainer.classList.remove('hidden');

        let searchInputText = searchInput.value;
        const suggestionsArray = await searchSuggestion(searchInputText);
        
        if (suggestionsArray) {
            for(let i=0; i<3; i++) {
                const suggestionText = suggestionsArray.data[i].name;
                const div = document.createElement('div');
                const p = document.createElement('p');
    
                p.innerText = suggestionText;
                div.classList.add('suggestion-result');
                div.append(p);
                suggestionContainer.append(div);
    
                div.onclick = () => {
                    searchInput.value = suggestionText;
                    prepareSearch();
                };
            }
        }
    } else {
        suggestionContainer.classList.add('hidden');
    }
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

async function reloadRandomGif(event) {
    console.log(event);
    const ImgForNewGif = event.path[3].childNodes[3].childNodes[1];
    const pBarForNewGif = event.path[2].childNodes[1];

    const gif = await getRandomGif();
    ImgForNewGif.setAttribute('src', gif.data.images.downsized.url);
    pBarForNewGif.innerHTML = hashtagCreator(gif.data.title);
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

function loadTrendGifs(gifs) {
    const RATIO = 1.7;
    let sum = 0, i=0;
    let rectangule;
    let gifRatio;
    let gif;

    do {
        // console.log(gifs);
        gif = gifs.data[i];
        // console.log(gif);
        gifRatio = gif.images.downsized.width / gif.images.downsized.height;

        if(gifRatio > RATIO){
            rectangule = 2;
        } else {
            rectangule = 1;
        }
        if(sum + rectangule <= 4) {
            loadGif(gif, rectangule);
            sum += rectangule;
            gifs.data.splice(i, 1);

            if(sum === 4) {
                sum = 0;
                i = 0;
            }
        } else {
            i++;
        }
    } while (gifs.data.length > 0)
}

//Cargo gif por gif del arreglo de LIMITGIFS
function loadGif(gif, rectangule) {
    const gifURL = gif.images.downsized.url;
    const gifHashtag = gif.title;

    const div = document.createElement('div');
    const img = document.createElement('img');
    const divBar = document.createElement('div');
    const p = document.createElement('p');

    div.classList.add('gif-container');
    if(rectangule === 2) {
        div.classList.add('rectangule');
    }
    divBar.classList.add('bar');
    img.setAttribute('src', gifURL);
    p.innerHTML = hashtagCreator(gifHashtag);

    div.append(img);
    divBar.append(p);
    div.append(divBar);

    trendDivNode.append(div);
}

loadRandomGif();
getTrendGifs().then(response => loadTrendGifs(response));