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

loadTheme();


//https://api.giphy.com/v1/gifs/random?api_key=' + APIKEY + '&tag=&rating=G

// const consultTrend = await fetch('https://api.giphy.com/v1/gifs/trending?api_key=Zn4f1vgWPpB8sJJWHu6xhkVn5L7yMo9k&limit=25&rating=G');
// const consultParam = await fetch('http://api.giphy.com/v1/gifs/search?q=${searchParam}&api_key=WMgym4yAIPYofgGPrganKNA7n1vg2D5Y');
// const consultRandom = await fetch('https://api.giphy.com/v1/gifs/random?api_key=Zn4f1vgWPpB8sJJWHu6xhkVn5L7yMo9k&tag=&rating=G');

