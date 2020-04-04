// Constants
const THEME_ATTRIB_NAME = "theme";
const THEME_LIGHT = "light";
const THEME_DARK = "dark";


/* * * * * * * * * /
/* THEME CONTROL - BEGIN */
// Initialize the default theme
theme_light ? document.documentElement.setAttribute(THEME_ATTRIB_NAME, THEME_LIGHT) : document.documentElement.setAttribute(THEME_ATTRIB_NAME, THEME_DARK);

// Buttons behabours
document.getElementById("btn_theme_light").addEventListener('click', e => document.documentElement.setAttribute(THEME_ATTRIB_NAME, THEME_LIGHT));
document.getElementById("btn_theme_dark").addEventListener('click', e => document.documentElement.setAttribute(THEME_ATTRIB_NAME, THEME_DARK));
/* THEME CONTROL - END */
/* * * * * * * * */