const SAILORDAY = 'light';
const SAILORNIGHT = 'dark';


/*LOAD THEME*/
function loadTheme() {
    const theme = sessionStorage.getItem('theme') || SAILORDAY;
    const body = document.getElementsByTagName('body')[0];
    body.setAttribute('theme', theme);
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


//https://api.giphy.com/v1/gifs/random?api_key=' + APIKEY + '&tag=&rating=G

// const consultTrend = await fetch('https://api.giphy.com/v1/gifs/trending?api_key=Zn4f1vgWPpB8sJJWHu6xhkVn5L7yMo9k&limit=25&rating=G');
// const consultParam = await fetch('http://api.giphy.com/v1/gifs/search?q=${searchParam}&api_key=WMgym4yAIPYofgGPrganKNA7n1vg2D5Y');
// const consultRandom = await fetch('https://api.giphy.com/v1/gifs/random?api_key=Zn4f1vgWPpB8sJJWHu6xhkVn5L7yMo9k&tag=&rating=G');

