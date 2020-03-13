/**
* global.js
*
* Contains every global variablees and classes that should be used in many other scripts
*/

'use strict'; // Turns on "strict mode", preventing use of non-declared variables

/**
* contains the path of the json file
*/
const CurrentURL = window.location.href;

/**
* Contains the informations of a clickzone (size, position, id of the next scene, id of the clickzone)
*/
class ClickZone {
  constructor(x1, y1, x2, y2, id, clickzoneId) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.id = id;
    this.clickzoneId = clickzoneId;
  }
}

/**
* Contains the informations of a back clickzone (size, position, id of the back clickzone)
*/
class BackClickZone {
  constructor(x1, y1, x2, y2, bckclickId) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.bckclickId = bckclickId;
  }
}

/**
* Global variable containing the JSON file of the game
*/
var GameJson;

const FADE_TIME = 1500; //Fade time for fade transitions

let img_path; // path of the background image
let clickZones = []; // array containing clickzone objects (definition of class ClickZone in json.js)
let backClickZones = []; // array containing backclickzone objects (definition of class BackClickZone in json.js)
let objectClickZones = []; // array containing clickzone objects related to image elements on the scene (definition of class ClickZone in json.js)
let digicodeClickZone = []; // array containing clickzone objects related to text zones for a digicode enigma (definition of class ClickZone in json.js)
let gifClickZone = []; // array containing clickzone objects related to gif elements for a gif enigma (definition of class ClickZone in json.js)
let scene_number = -1; // the number of the played scene
let imgSize = []; // contains the size of the image in the background
let gifOnScene = []; // contains all the gifs in the current scene
let buffer = ""; // String to memorize the answer of the user for a digicode enigma
let windowsValues; // contains information of the size of the current window, image and bands on sides and top/bottom
let canPlay = false; // boolean to check if we can verify the click
let canPlayGif = true; // TODO Emeric
let isPuzzleScene = false; // boolean that say if the current scene contain a puzzle
let tabPos = []; // Table of puzzle position on the screen
let canPlayFade = false; // Allow user to click on the clickzone
let fading = false; //Do the scene have a fade to begin
let gifOK = 0; // Number of Gif to be loaded on the scene
let audioSoundScene =  undefined; // The sound to stream on the scene
let diaryOnScene = false; // Is there the diary icon on the screen
let diaryOnScreen = false; // Is the diary now displaying
let diaryLoaded = false; // Is the diary loaded on scene
let addedToDiary = "" // Path of the images which is added to the diary
