const APIKEY = 'Zn4f1vgWPpB8sJJWHu6xhkVn5L7yMo9k';
const lupaActive = './assets/img/lupa.svg';
const lupaInactive = './assets/img/lupa_inactive.svg';
const lupaInactiveNight = './assets/img/combined_shape.svg';
const SAILORDAY = 'light';
const SAILORNIGHT = 'dark';

const lupaElement = document.querySelector('.search-button img');
const themeButton = document.getElementById('theme');
const lupaImg = document.querySelector('.search-button img');
const sailorDayButton = document.getElementById('sailor-day');
const sailorNightButton = document.getElementById('sailor-night');
const trendDivNode = document.querySelector('.trends .gif-grid');
var buttonOpen = false;

/*LOAD THEME*/
function loadTheme() {
    const theme = sessionStorage.getItem('data-theme') || SAILORDAY;
    const body = document.getElementsByTagName('body')[0];

    body.setAttribute('data-theme', theme);

    if(theme === 'light') {
        sailorDayButton.classList.add('selected');
        sailorNightButton.classList.remove('selected');
        if(lupaElement) {
            lupaElement.setAttribute('src', lupaInactive);
        }
    } else {
        sailorDayButton.classList.remove('selected');
        sailorNightButton.classList.add('selected');
        if(lupaElement) {
            lupaElement.setAttribute('src', lupaInactiveNight);
        }
    }
}

/*OPEN THEME BUTTON*/
function toggleButton() {
    buttonOpen = !buttonOpen;
    themeButton.classList.toggle('button-open');
}

/*CHANGE THEME BUTTONS*/
function changeCSS(theme, event) {
    event.preventDefault();
    const body = document.body;
    if (theme === 'sailorNight') {
        body.setAttribute('data-theme', SAILORNIGHT);
        sessionStorage.setItem('data-theme', SAILORNIGHT);
        sailorDayButton.classList.remove('selected');
        sailorNightButton.classList.add('selected');
        if(lupaImg) {
            lupaImg.setAttribute('src', './assets/img/combined_shape.svg');
        }
    }
    else {
        body.setAttribute('data-theme', SAILORDAY);
        sessionStorage.setItem('data-theme', SAILORDAY);
        sailorDayButton.classList.add('selected');
        sailorNightButton.classList.remove('selected');
        if(lupaImg) {
            lupaImg.setAttribute('src', './assets/img/lupa_inactive.svg');
        }
    }
}

//HASHTAG CREATOR
function hashtagCreator(stringToConvert) {
    let finalString = '';
    let index = stringToConvert.indexOf(' ');
    
    if(stringToConvert) {
        while(index != -1) {

            finalString = finalString + stringToConvert.slice(0, index) + ' #';
            stringToConvert = stringToConvert.slice(index + 1);
            index = stringToConvert.indexOf(' ');
        }
        return '#' + finalString + stringToConvert;
    } else {
        return '#Suggestion #Gif';
    }
    
}

loadTheme();