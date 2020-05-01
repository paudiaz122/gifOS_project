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
var buttonOpen = false;

/*LOAD THEME*/
function loadTheme() {
    const theme = sessionStorage.getItem('theme') || SAILORDAY;
    const body = document.getElementsByTagName('body')[0];

    body.setAttribute('theme', theme);

    //TODO Esto se tiene que ejecutar SOLAMENTE si estoy en el index
    if(theme === 'light') {
        sailorDayButton.classList.add('selected');
        sailorNightButton.classList.remove('selected');
    } else {
        sailorDayButton.classList.remove('selected');
        sailorNightButton.classList.add('selected');
    }

    if (lupaElement) {
        if(theme === 'light') {
            lupaElement.setAttribute('src', lupaInactive);
        } else {
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
        body.setAttribute('theme', SAILORNIGHT);
        lupaImg.setAttribute('src', './assets/img/combined_shape.svg');
        sessionStorage.setItem('theme', SAILORNIGHT);
        sailorDayButton.classList.remove('selected');
        sailorNightButton.classList.add('selected');
    }
    else {
        body.setAttribute('theme', SAILORDAY);
        lupaImg.setAttribute('src', './assets/img/lupa_inactive.svg');
        sessionStorage.setItem('theme', SAILORDAY);
        sailorDayButton.classList.add('selected');
        sailorNightButton.classList.remove('selected');
    }
}

loadTheme();

