/*LOAD THEME*/
function loadTheme() {
    const theme = sessionStorage.getItem('theme') || SAILORDAY;
    const body = document.getElementsByTagName('body')[0];

    body.setAttribute('theme', theme);

    //TODO Esto se tiene que ejecutar SOLAMENTE si estoy en el index
    if(theme === SAILORDAY) {
        lupaElement.setAttribute('src', lupaInactive);
    } else {
        lupaElement.setAttribute('src', lupaInactiveNight);
    }
}

/*OPEN THEME BUTTON*/
var buttonOpen = false;
const themeButton = document.getElementById('theme');
const lupaImg = document.querySelector('.search-button img');

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
    }
    else {
        body.setAttribute('theme', SAILORDAY);
        lupaImg.setAttribute('src', './assets/img/lupa_inactive.svg');
        sessionStorage.setItem('theme', SAILORDAY);
    }
}

loadTheme();

