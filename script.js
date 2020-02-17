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
 * @param {event} event
 */
function startScene(event){
  event.preventDefault();
  // Stack of the visited scenes
  document.cookie = "scene_number=" + getSceneId(getInitialScene()) + ";";
  // Was a backclick zone activated
  document.cookie = "isback=" + false +";";
  // List of unic transition scenes
  document.cookie = "skip=" + 0 + ";";
  // List of already visited scene
  document.cookie = "visited_scenes=" + 0 + ";";
  // State of a gif
  document.cookie = "gif_state=0/;";
  // Different position of the puzzle given a scene
  document.cookie = "puzzle_pos=0/;";
  loadVideoScene("Intro.mp4","video/mp4","ping.html");
};
