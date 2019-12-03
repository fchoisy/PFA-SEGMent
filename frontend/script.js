'use strict'; // Turns on "strict mode", preventing use of non-declared variables

function startScene(event){
  event.preventDefault();
  loadJson();
  document.cookie = "scene_number=" + getIDScene(getInitialScene()) + ";"
  document.location.href = 'ping.html';
};
