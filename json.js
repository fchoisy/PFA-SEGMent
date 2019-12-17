/**
 * json.js
 *
 * Methods for interpreting the 'segment.game' JSON file
 */

'use strict'; // Turns on "strict mode", preventing use of non-declared variables

const GameURL = "../Game/game.segment"

window.onload = initialise();

/**
 * Holds the information of click zones in the game
 */
class ClickZone {
  constructor(x1, y1, x2, y2, id) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.id = id;
  }
}

/**
 * Global variable for containing game JSON
 */
var GameJson;

/**
 * Retrieves the game JSON from session storage
 */
function initialise() {
  var str = window.sessionStorage.getItem("json");
  //console.log(str);
  GameJson = JSON.parse(str);
}

/**
 * Loads 'segment.game' from file
 */
function loadJson() {
  //GameURL = "./Game/game.segment";
  //GameJson = jsonTest;
  return new Promise(function (resolve, reject) {
    $.ajax({
      type: 'GET',
      url: "../Game/game.segment",
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
 * Returns the path to the background image of the scene whose id is 'id'
 * @param {number} id
 */
function getSceneBackgroundById(id) {
  return getSceneImage(getSceneByID(id));
}

/**
 * Returns the part of the game JSON that holds the game's scenes
 */
function getScenes() {
  var json = GameJson;
  return json.Document.Process.Scenes;
}

/**
 * Returns the id of the specified scene
 * @param {Scene object} scene
 */
function getSceneId(scene) {
  return scene.id;
}

/**
 * Plays a sound
 *
 * @param {string} soundPath the path of the sound to play
 * @param {bool} loop wether to loop the sound or not
 * @param {float} volume the volume at which the sound should be played
 */
function playSound(SoundPath,loop=false,volume=1.0){
  if(SoundPath == ""){
    console.log("Sound not defined !");
  }
  else{
    var audio = new Audio('Game/' + SoundPath);
    audio.loop = loop;
    audio.volume = volume;
    audio.play();
  }
}

/**
 * Plays the sound of the current scene
 *
 */
function playSoundScene(){
  let scene = getSceneByID(scene_number);
  let SoundPath = scene.Ambience.Path;
  let loop = scene.Ambience.Repeat;
  let volume = scene.Ambience.Volume;
  playSound(SoundPath,loop,volume);
}

/**
 * Play sound associated with clickZoneId
 * @param {*} clickZoneId
 */
function playSoundClickZone(clickZoneId){
  var Scene = getSceneByID(scene_number);
  var clickAreas = getClickAreas(Scene);
  var clickArea = getClickAreaByID(clickAreas,clickZoneId);
  var SoundPath = getSoundPath(clickArea);
  playSound(SoundPath);
}

/**
 * Play sound associated with backClickAreaId
 * @param {*} backClickAreaId
 */
function playSoundBackClickArea(backClickAreaId){
  var Scene = getSceneByID(scene_number);
  var backClickAreas = getBackClickAreas(Scene);
  var backClickArea = getBackClickAreaByID(backClickAreas,backClickAreaId);
  var SoundPath = getSoundPath(backClickArea);
  playSound(SoundPath);
}

/**
 * Returns the scene object whose identifier in the game JSON is 'id'
 * Throws an error if no scene matches the given id
 * Note : scene identifiers start at 0
 *
 * @param {number} id
 */
function getSceneByID(id) {
  var json = GameJson;
  const scenes = getScenes(json);
  const length = Object.keys(scenes).length;
  for (var i = 0; i < length; i++) {
    if (scenes[i].id == id) {
      return scenes[i];
    }
  }
  console.error("Error : Scene " + id + " not found");
}


/**
 * Returns path of the background image from the scene object specified
 *
 * @param {Scene object} scene
 */
function getSceneImage(scene) {
  return "../Game/" + scene.Image;
}

/**
 * Returns an array containing the current width and height of the scene
 *
 * @param {Scene object} scene
 */
function getImageSize(scene) {
  let image_size = [];
  image_size.push({
    'width': scene.ImageSize[0],
    'height': scene.ImageSize[1]
  });
  console.log(image_size);
  return image_size;
}

/**
 * Returns the scene object whose identifier in the game JSON is 'id'
 *
 * @param {number} id
 */
function getImageSizeByID(id) {
  return getImageSize(getSceneByID(id));
}

/**
 * Returns the intial scene object from the game JSON
 *
 * NOTE : different from get_scene_by_id because there is a special type if
 * a scene is an initial scene (i.e. SceneType = 1; Final = 2; Other = 0)
 */
function getInitialScene() {
  const scenes = getScenes();
  const length = Object.keys(scenes).length;
  for (var i = 0; i < length; i++) {
    if (scenes[i].SceneType == 1) {
      return scenes[i];
    }
  }
}

/**
 * Returns array where each element contains the four positions of the
 * four edges of the click zone, relatively to the image size.
 *
 * @param {number} id
 */
function getClickZonesByScenesId(id) {
  const scene = getSceneByID(id);
  let areas = scene.ClickAreas;
  /*Commentaires:
  La position de l'image est bien relative par rapport à la taille de l'image.
  Le size est calculé proportionnellement par rapport à la longueur de l'image.
  */
  let array = [];
  for(var i = 0; i < areas.length; i++){
    let currentArea = areas[i];
    let heightPourcentage = currentArea.Size[1] * scene.ImageSize[0] / scene.ImageSize[1];
    let clickzone = new ClickZone(currentArea.Pos[0],currentArea.Pos[1],currentArea.Size[0] + currentArea.Pos[0],heightPourcentage + currentArea.Pos[1],getPointedScene(currentArea.Path));
    array.push(clickzone);
  }
  return array;
}

/**
 * Returns the click areas described in the game JSON for the scene object 'scene'
 *
 * @param {Scene object} scene
 */
function getClickAreas(scene) {
  return scene.ClickAreas;
}

/**
 * Returns the back click areas described in the game JSON for the scene object 'scene'
 *
 * @param {Scene object} scene
 */
function getBackClickAreas(scene) {
  return scene.BackClickAreas;
}


/**
 * Returns the ClickArea that whose id is 'id'
 * Throws an error if not found
 *
 * @param {number} clickArea
 * @param {number} id
 */
function getClickAreaByID(clickArea, id) {
  for (var i = 0; i < clickArea.length; i++) {
    if (clickArea[i].id == id) {
      return clickArea[i];
    }
  }
  throw "clickArea " + id + "not found";
}

/**
 * Returns the BackClickArea that whose id is 'id'
 * Throws an error if not found
 *
 * @param {number} backClickArea
 * @param {number} id
 */
function getBackClickAreaByID(backClickArea, id) {
  for (var i = 0; i < backClickArea.length; i++) {
    if (backClickArea[i].id == id) {
      return backClickArea[i];
    }
  }
  throw "clickArea " + id + "not found";
}

/**
 * Plays the sound described in the parsed part of JSON element
 *
 * @param {JSON object} element
 */
function getSoundPath(element) {
  return element.Sound.Path;
}

/**
 * Searches for the ClickArea (in game JSON) whose path matches 'path'
 * and returns the scene id to which it points
 *
 * @param {string} clickAreaPath
 */
function getPointedScene(clickAreaPath) {
  let scene = GameJson.Document.Process;
  let len = scene.Transitions.length;
  for (let i = 0; i < len; i++) {
    if (scene.Transitions[i].Transition.Which == "ClickAreaToScene") {
      let elem = scene.Transitions[i].Transition;
      if (elem.ClickAreaToScene.From == clickAreaPath) {
        len = elem.ClickAreaToScene.To.length - 1;
        return parseInt(elem.ClickAreaToScene.To.substring(len, elem.ClickAreaToScene.To.length));
      }
    }
  }
  return -1
}

/**
 * Returns the start text that has to be displayed at the
 * begining of the scene whose id is 'scene_id'
 *
 * @param {number} sceneId
 */
function getSceneTextBySceneId(sceneId) {
  const scene = getSceneByID(sceneId);
  const text = scene.StartText;
  return text;
}

/**
 * Returns the text in the text areas of the
 * scene whose id is "sceneId"
 *
 * @param {number} sceneId
 */
function getSceneTextAreasBySceneId(sceneId) {
  const scene = getSceneByID(sceneId);
  const text_areas = [];
  for (var i = 0; i < scene.TextAreas.length; i++) {
    text_areas[i] = scene.TextAreas[i].Text;
  }
  return text_areas;
}
