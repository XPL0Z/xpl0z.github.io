const body = document.getElementById('body');

const main_title = document.getElementById('main_title');

const image = document.getElementById('image');

const video = document.getElementById("video");

const p_video = document.getElementById("p_video");

const author = document.getElementById('author');

const image_text = document.getElementById('image_text');

const title = document.getElementById('title');

const date = document.getElementById('date');

const settings = document.getElementById('main_settings');

const urlParams = new URLSearchParams(window.location.search);

let params = urlParams.get("DATE");

const today_date = new Date();

const today_date_ISO = today_date.toISOString().split('T')[0];

const btn_previous = document.getElementById("previous");

const btn_next = document.getElementById("next");

const previous_img = document.getElementById("previous_img");

const next_img = document.getElementById("next_img");

const theme_settings = document.getElementById("theme-settings");

const one_day = 24 * 60 * 60 * 1000;

let params_date = new Date(params);

let timestamp = params_date.getTime();    

let previous_date = new Date(timestamp - one_day);
  
let next_date = new Date(timestamp + one_day);

next_date = next_date.toISOString().split('T')[0];

const theme = document.getElementById("input");

count = 0;

let currentLocation = window.location;
function showSettings() {
  settings.hidden = false;
  settings.style.display = "grid";
  body.style.overflow = "hidden";
}

function closeSettings() {
  settings.hidden = true;
  settings.style.display = "none";
  body.style.overflow = "scroll";
}

function toggleTheme() {
  console.log(theme)
  if (theme.checked) {
    body.classList.remove ("dark");
    next_img.src = "src/arrow.svg";
    previous_img.src = "src/arrow.svg";
    console.log("Are you weird? DARK MODE IS BETTER");
  } else {
    body.classList.add("dark");
    theme_settings.classList.add("dark");
    next_img.src = "src/arrow_black.svg";
    previous_img.src = "src/arrow_black.svg";
  }
}

async function start() {

  

  let API_KEY = sessionStorage.getItem("API_KEY");

  settings.hidden = true;

  settings.style.display = "none";

  if (!API_KEY) {
    API_KEY = "DEMO_KEY";
  }

  if (!params){

    window.location.replace(`?DATE=${today_date_ISO}`);

  }

  console.log(API_KEY);

  const reponse = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${params}`);
  if (!reponse.ok) {
    console.error("Error fetching data:", reponse.statusText);
    alert("Failed to call the API. Please check your API key or try again later. If you don't have an API key, please use one instead of the demo key.");
    return;
  }
  const infos = await reponse.json();
  
  main_title.textContent = "KATA-APOD " + infos.date;

  title.textContent = infos.title;

  if (infos.copyright === undefined){
    author.textContent = "Author : No copyright";
  } else {
    author.textContent = "Author : " +   infos.copyright;
  }

  date.textContent = infos.date;
  
  if (infos.media_type === "video") {
    
      video.src = infos.url;
      image.hidden = true;
  }else{
    
    image.src = infos.hdurl;
    video.hidden = true;
    p_video.hidden = true;
  }

  image_text.textContent = infos.explanation;

  console.log(today_date_ISO);
  console.log(params);

  if (params === today_date_ISO) {
    btn_next.style.cursor = "not-allowed";
    btn_next.style.opacity = 0.5;
    }
  if (previous_date < "1995-06-16") {
  btn_previous.style.cursor = "not-allowed";
  btn_previous.style.opacity = 0.5;
  }
}


function setsessionStorage() {
  let api_key = document.getElementById('key').value;
  console.log(api_key);
  sessionStorage.setItem("API_KEY", api_key);
  start();
  closeSettings();

}
async function copy() {
  try {
    await navigator.clipboard.writeText(currentLocation);
    alert("Link copied to clipboard!");
  } catch (error) {
    console.error(error.message);
  }
}
btn_previous.onclick = function() {  
  
  previous_date = previous_date.toISOString().split('T')[0];

  count ++;

  if (previous_date < "1995-06-16") {
  }else{
    window.location.replace(`?DATE=${previous_date}`);
  }

  if (count === 3) {
    alert("You have reached the earliest available date.");
  }
};

btn_next.onclick = function() {

  count++;

  if (next_date <= today_date_ISO) {

    window.location.replace(`?DATE=${next_date}`);
  }

  if (count === 3) {
    alert("You have reached the latest available date.");
  }
};