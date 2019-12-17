'use strict'; // Turns on "strict mode", preventing use of non-declared variables

let json;

window.onload = loadJson();

function startScene(event){
  event.preventDefault();
  document.cookie = "scene_number=" + getSceneId(getInitialScene()) + ";";
  document.cookie = "isback=" + false +";";
  document.location.href = 'ping.html';
};
