/**
 * script.js
 *
 * First script to be executed, loads the json and starts the first scene when the button is pressed
 */

'use strict'; // Turns on "strict mode", preventing use of non-declared variables

let json;

window.onload = loadJson();

/**
 * Starts the scene when the button is pressed
 *
 * @param {event} event
 */
function startScene(event){
  event.preventDefault();
  document.cookie = "scene_number=" + getSceneId(getInitialScene()) + ";";
  document.cookie = "visited_scenes=" + 0 + ";";
  document.cookie = "isback=" + false +";";
  document.cookie = "skip=" + 0 + ";";
  document.location.href = 'ping.html';
};
