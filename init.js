/**
* Loads the json in variable at start
*/
window.onload = initialise();

/**
* Retrieves the game JSON from session storage
*/
function initialise() {
  var str = window.sessionStorage.getItem("json");
  GameJson = JSON.parse(str);
}

/**
* Stores the folder "Game" URL in the cookie "game_folder"
* Note : changer pour ne pas avoir à vider les cookies si on veut changer de jeu
*/
function storeGameFolderURL(){
  if(getCookieValue("game_folder") == ""){
    const GameFolder = CurrentURL + "Game/";
    document.cookie = "game_folder=" + GameFolder + ";";
  }
}

/**
* Loads 'game.segment'
*/
function loadJson() {
  return new Promise(function (resolve, reject) {
    $.ajax({
      type: 'GET',
      url: getGameJsonURL(),
      async: true,
      dataType: 'json',
      success: function (data) {
        GameJson = data;
        window.sessionStorage.setItem("json", JSON.stringify(data));
      }
    });
  });
}

/**
* Shows the loading screen (in front of the background)
*/
function showLoading(){
  let loading = document.getElementById("loading");
  loading.zIndex = 16;
  loading.style.display = "inline";
  loading.style.position = "absolute";
  loading.style.width = window.innerWidth + "px";
  loading.style.height = window.innerHeight + "px";
  loading.style.borderStyle = "solid";
  loading.style.borderColor = "black";
  loading.style.backgroundColor = "black";
  loading.style.color = "white";
  loading.style.fontSize = "xx-large"; // extra extra large
  loading.style.textAlign = "center";
  loading.style.padding = "auto";
  loading.innerHTML = "Loading ...";
}

/**
* Hides the loading screen
*/
function hideLoading(){
  let loading = document.getElementById("loading");
  loading.innerHTML = "";
  loading.style.display = "none";
}

/**
* Checks if a file located at url exists
* @param {String} url
* @returns true if the file exists, false otherwise
*/
function fileExists(url)
{
  var http = new XMLHttpRequest();
  http.open('HEAD', url, false);
  http.send();
  return http.status!=404;
}

/**
* Returns the URL of the Game folder
* @returns URL as a string
*/
function getGameFolderURL(){
  return getCookieValue("game_folder");
}

/**
* Returns the URL of the Game JSON file
* @returns URL as a string
*/
function getGameJsonURL(){
  return (getCookieValue("game_folder") + "Game.segment");
}
