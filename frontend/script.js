'use strict'; // Turns on "strict mode", preventing use of non-declared variables

let json;

window.onload = loadJson();


function startScene(event){
  // let json = await returnJson();
  event.preventDefault();
  document.cookie = "scene_number=" + getIDScene(getInitialScene()) + ";";
  document.location.href = 'ping.html';
};
