/**
* json.js
*
* Functions for interpreting the 'segment.game' JSON file
*/

'use strict'; // Turns on "strict mode", preventing use of non-declared variables

// ========================================================================================
//                               ***Memos TODO (unused)***
// ========================================================================================

// --------------------------------------- Clément ----------------------------------------

// ---------------------------------------- Hind ------------------------------------------

// --------------------------------------- Pierre -----------------------------------------

// -------------------------------------- Eleonore ----------------------------------------

// --------------------------------------- Emeric -----------------------------------------

// -------------------------------------- Corentin ----------------------------------------

  // getTransitionByID can be optimized (no need for transitions)

  // Add commentaries for a lot of functions + return value

  // Video json ? Que intro ? Intro.mp4 ? Vidéo scène finale ?

  // voir NOTE de getElementId

  // TODO pour le nettoyage : vérifier si des fonctions sont unused
  // + vérifier si les commentaires sont compréhensibles pour tout le monde, ainsi que les noms de fonctions
  // + éventuellement séparer en plusieurs fichiers

  // getGifPointedScene, return 2000000 ?

  // storeGameFolderURL : changer pour détecter "index.html"

  // Mettre des zIndex plus cohérents

// ---------------------------------------- Jean ------------------------------------------

// ========================================================================================
//                              *** Global variables***
// ========================================================================================

/**
* contains the path of the json file
*/
const CurrentURL = window.location.href;
storeGameFolderURL();

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

/**
* Loads the json in variable at start
*/
window.onload = initialise();

// ========================================================================================
//                                ***Function at start***
// ========================================================================================

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

function loadSoundScene(){
  let scene = getSceneByID(scene_number);
  let SoundPath = scene.Ambience.Path;
  audioSoundScene = new Audio(getGameFolderURL() + SoundPath);
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
// ========================================================================================
//                                      ***Getters***
// ========================================================================================

// ------------------------------------ Basic Getters -------------------------------------

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
  return (getCookieValue("game_folder") + "game.segment");
}

/**
* Returns all the scenes of the JSON file (GameJson)
* @returns scene[]
*/
function getScenes() {
  var json = GameJson;
  return json.Document.Process.Scenes;
}

/**
* Returns path of the background image from the scene object specified
* @param {Scene object} scene
* @returns path
*/
function getSceneImage(scene) {
  return getGameFolderURL() + scene.Image;
}


/**
* Returns the id of the specified scene
* @param {Scene object} scene
* @returns scene id
*/
function getSceneId(scene) {
  return scene.id;
}

/**
* Note : may replace getSceneId
* Returns the id of an element
* @param {object} element
* @returns element id
*/
function getElementId(element) {
  return element.id;
}

/**
* Returns an array containing the current width and height of the scene
* @param {Scene object} scene
* @returns tabular containing the width and height of the scene
*/
function getImageSize(scene) {
  let image_size = [];
  image_size.push({
    'width': scene.ImageSize[0],
    'height': scene.ImageSize[1]
  });
  return image_size;
}

/**
* Returns the intial scene object from the game JSON
* NOTE : different from get_scene_by_id because there is a special type if
* a scene is an initial scene (i.e. SceneType = 1; Final = 2; Other = 0)
* @returns initial scene
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
* Returns the click areas described in the game JSON for the scene object 'scene'
* @param {Scene object} scene
* @returns click areas of the scene
*/
function getClickAreas(scene) {
  return scene.ClickAreas;
}

/**
* Returns the back click areas described in the game JSON for the scene object 'scene'
* @param {Scene object} scene
* @returns back click areas of the scene
*/
function getBackClickAreas(scene) {
  return scene.BackClickAreas;
}

/**
* Returns the FIRST back click areas described in the game JSON for the scene object 'scene'
* @param {Scene object} scene
* @returns first back click area of the scene
*/
function getBackClickArea(scene){
  return scene.BackClickAreas[0];
}

/**
* Returns the gifs described in the game JSON for the scene object 'scene'
* @param {Scene object} scene
* @returns gifs of the scene
*/
function getGifs(scene) {
  return scene.Gifs;
}

/**
* Returns the objects described in the game JSON for the scene object 'scene'
* @param {Scene object} scene
* @returns objects of the scene
*/
function getObjects(scene) {
  return scene.Objects;
}

/**
* Returns the textAreas described in the game JSON for the scene object 'scene'
* @param {Scene object} scene
* @returns text areas of the scene
*/
function getTexts(scene) {
  return scene.TextAreas;
}

/**
* Returns all the transitions
* @param {Scene object} scene
* @returns transition[]
*/
function getTransitions() {
  var json = GameJson;
  return json.Document.Process.Transitions;
}

/**
* Plays the sound described in the parsed part of JSON element
* @param {JSON object} element
* @returns sound path
*/
function getSoundPath(element) {
  return element.Sound.Path;
}

/**
* Searches for the ClickArea (in game JSON) whose path matches 'path'
* and returns the scene id to which it points
* @param {string} clickAreaPath
* @returns id of the next scene
*/
function getPointedScene(clickAreaPath) {
  let scene = GameJson.Document.Process;
  let len = scene.Transitions.length;
  for (let i = 0; i < len; i++) {
    if (scene.Transitions[i].Transition.Which == "ClickAreaToScene") {
      let elem = scene.Transitions[i].Transition;
      len = elem.ClickAreaToScene.To.length;
      if (elem.ClickAreaToScene.From == clickAreaPath) {
        while (elem.ClickAreaToScene.To[len]!=".") {
          len--;
        }
        return parseInt(elem.ClickAreaToScene.To.substring(len+1, elem.ClickAreaToScene.To.length));
      }
    }
  }
  return -1
}

/**
* Returns a tabular of all the puzzle objects in the scene id
* @param {Number} id
* @returns Objects[]
*/
function getPuzzlepieces(id){
  const scene = getSceneByID(id);
  let tab = [];
  for(let i = 0; i < scene.Objects.length; i++){
    if(scene.Objects[i].PuzzlePiece){
      tab.push(scene.Objects[i]);
    }
  }
  return tab;
}

/**
* Returns the id of the scene to go after solving the gif of the scene id
* @param {Number} id
* @returns next scene id
*/
function getGifPointedScene(id){
  const scene = getSceneByID(id);
  let transitions = getTransitions();
  const len = transitions.length;
  for(let i =0 ; i<len; i++){
    let sceneto = transitions[i].Transition.SceneToScene;
    if(!(sceneto === undefined)){
      if(!(sceneto.Riddle === undefined)){
        if(sceneto.Riddle.Which=="Gif" && getLastNumberTransition(sceneto.From) == id){
          return getLastNumberTransition(sceneto.To);
        }
      }
    }
  }
  return 2000000;
}

/**
* Return the type of the puzzle present in the given scene and the id of the nex transition
* @param {Scene object} id
* @returns tabular containing the type of the puzzle, and the id of the next transition
*/
function whatPuzzleItIs(id){
  const scene = getSceneByID(id);
  if (!(scene.Gifs.length == 0)){
    return ["Gif",id];
  }
  let transitions = getTransitions();
  const len = transitions.length;
  for(let i =0 ; i<len; i++){
    if(!(transitions[i].Transition.SceneToScene === undefined)){
      let comp_id = getLastNumberTransition(transitions[i].Transition.SceneToScene.From);
      if(comp_id == id){
        if(!(transitions[i].Transition.SceneToScene.Riddle === undefined)){
          return [transitions[i].Transition.SceneToScene.Riddle.Which,transitions[i].id];
        }
      }
    }
  }
  return "";
}

/**
* Given a path (ex : "Game/Scene.14") return the last number (in the example 14)
* @param {String} str
* @returns the last number of str (as an integer)
*/
function getLastNumberTransition(str){
  let len = str.length;
  while(str[len] !="."){
    len--;
  }
  return parseInt(str.substring(len+1,str.length));
}

/**
* Given a path (ex : "Game/Scene.14") return id of the scene if it is one (in the example : 14)
* @param {String} path
* @returns scene id, or -1 if not a scene path
*/
function getSceneIdFromPath(path){
  let len = path.length;
  let len2 = len;
  let len3 = len;
  while(len >= 0){
    if(path[len] == "."){
      len3 = len2;
      len2 = len;
      len--;
    }
    if(path[len] == "/"){
      if(path.substring(len+1,len2) == "Scene"){
        return path.substring(len2+1,len3);
      }
      len3 = len2;
      len2 = len;
      len--;
    }
    len--;
  }
  return -1;
}

// ------------------------------------ Get <...> By Id -------------------------------------

/**
* Returns the path to the background image of the scene whose id is 'id'
* @param {Number} id
* @returns path of the background image as a String
*/
function getSceneBackgroundById(id) {
  return getSceneImage(getSceneByID(id));
}

/**
* Returns the scene object whose identifier in the game JSON is 'id'
* Throws an error if no scene matches the given id
* Note : scene identifiers start at 0
* @param {Number} id
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
* Returns the width and height of the scene background image
* @param {Number} id
* @returns tabular containing the width and height of the background image
*/
function getImageSizeByID(id) {
  return getImageSize(getSceneByID(id));
}

/**
* Returns an array where each element contains the four positions of the
* four edges of the click zone and the id pointed by the click zone,
* relatively to the image size.
* @param {Number} id,
* @param {bool} back
* @returns array of class ClickZone/BackClickZone
*/
function getClickZonesByScenesId(id,back) {
  const scene = getSceneByID(id);
  let areas;
  if(back){
    areas = scene.BackClickAreas;
    if(areas === null){
      areas = [];
    }
  }
  else{
    areas = scene.ClickAreas;
  }
  /*Commentaires:
  La position de l'image est bien relative par rapport à la taille de l'image.
  Le size est calculé proportionnellement par rapport à la longueur de l'image.
  */
  let array = [];
  for(var i = 0; i < areas.length; i++){
    let currentArea = areas[i];
    let heightPourcentage = currentArea.Size[1] * scene.ImageSize[0] / scene.ImageSize[1];
    let clickzone = 0;
    let id;
    if(back){
      clickzone = new BackClickZone(currentArea.Pos[0],currentArea.Pos[1],currentArea.Size[0] + currentArea.Pos[0],heightPourcentage + currentArea.Pos[1], getElementId(currentArea));
    }else{
      clickzone = new ClickZone(currentArea.Pos[0],currentArea.Pos[1],currentArea.Size[0] + currentArea.Pos[0],heightPourcentage + currentArea.Pos[1],getPointedScene(currentArea.Path), getElementId(currentArea));
      id = getPointedScene(currentArea.Path);
    }
    array.push(clickzone);
  }
  return array;
}

/**
* Returns the ClickArea whose id is 'id'
* Throws an error if not found
* @param {Number} clickArea
* @param {Number} id
* @returns ClickArea
*/
function getClickAreaByID(clickArea, id) {
  for (var i = 0; i < clickArea.length; i++) {
    if (clickArea[i].id == id) {
      return clickArea[i];
    }
  }
  throw "clickArea " + id + " not found";
}

/**
* Returns the BackClickArea whose id is 'id'
* Throws an error if not found
* @param {Number} backClickArea
* @param {Number} id*
* @returns BackClickArea
*/
function getBackClickAreaByID(backClickArea, id) {
  for (var i = 0; i < backClickArea.length; i++) {
    if (backClickArea[i].id == id) {
      return backClickArea[i];
    }
  }
  throw "BackClickArea " + id + " not found";
}

/**
* Returns the gif whose id is 'id'
* Throws an error if not found
* @param {Number} gifs
* @param {Number} id
* @returns Gif
*/
function getGifByID(gifs, id) {
  for (var i = 0; i < gifs.length; i++) {
    if (gifs[i].id == id) {
      return gifs[i];
    }
  }
  throw "Gif " + id + " not found";
}

/**
* Returns the object whose id is 'id'
* Throws an error if not found
* @param {Number} objects
* @param {Number} id
* @returns Object
*/
function getObjectByID(objects, id) {
  for (var i = 0; i < objects.length; i++) {
    if (objects[i].id == id) {
      return objects[i];
    }
  }
  throw "Object " + id + " not found";
}

/**
* Returns the text whose id is 'id'
* Throws an error if not found
* @param {Number} texts
* @param {Number} id
* @returns text
*/
function getTextByID(texts, id) {
  for (var i = 0; i < texts.length; i++) {
    if (texts[i].id == id) {
      return texts[i];
    }
  }
  throw "Text " + id + " not found";
}

/**
* Returns the transitions whose id is 'id'
* Throws an error if not found
* @param {Number} transitions
* @param {Number} id
* @returns transition
*
*/
function getTransitionByID(transitions, id) {
  for (var i = 0; i < transitions.length; i++) {
    if (transitions[i].id == id) {
      return transitions[i];
    }
  }
  throw "Transition " + id + " not found";
}

/**
* Find if we have a fade transition for the transition between source and
* destination
* @param {object} transitions
* @param {Number} source
* @param {Number} destination
* @returns true if it is a fade transition, false otherwise
*/
function findTransition(transitions, source, destination) {
  for (var i = 0; i < transitions.length; i++) {
    if((getSceneIdFromPath(transitions[i].Transition[transitions[i].Transition.Which].To) == destination) && (getSceneIdFromPath(transitions[i].Transition[transitions[i].Transition.Which].From) == source)){
      return transitions[i].Fade == 1;
    }
  }
  return false
  throw "Transition from " + source + " to " + destination + " not found";
}

/**
* Returns the start text that has to be displayed at the
* begining of the scene whose id is 'scene_id'
* @param {Number} sceneId
* @returns text
*/
function getSceneTextBySceneId(sceneId) {
  const scene = getSceneByID(sceneId);
  const text = scene.StartText;
  return text;
}

/**
* Returns the text in the text areas of the
* scene whose id is "sceneId"
* @param {Number} sceneId
* @returns tabular of text areas
*/
function getSceneTextAreasBySceneId(sceneId) {
  const scene = getSceneByID(sceneId);
  const text_areas = [];
  for (var i = 0; i < scene.TextAreas.length; i++) {
    text_areas[i] = scene.TextAreas[i].Text;
  }
  return text_areas;
}

/**
* Returns the text to show depending on whether it is a Question, a Success or a Failure
* in the scene sceneId
* @param {Number} sceneId
* @param {Number} text
* @returns string
*/
function getDigicodeQSF(sceneId,text){
  var transitions = getTransitions();
  var sceneToScene;
  var len = transitions.length;
  var riddleText;
  for (var i = 0; i < len; i++) {
    if(transitions[i].Transition.Which == "SceneToScene"){
      sceneToScene = transitions[i].Transition.SceneToScene;
      var startSceneId = getLastNumberTransition(sceneToScene.From);
      if (startSceneId == sceneId) {
        riddleText = sceneToScene.Riddle.Text;
      }
    }
  }
  switch (text) {
    case "QUESTION":
    return riddleText.Question;
    break;
    case "SUCCESS":
    return riddleText.IfCorrect;
    break;
    case "FAILURE":
    return riddleText.IfWrong;
    break;
    default:
    return"";
  }
}

// ========================================================================================
//                                      ***Sounds***
// ========================================================================================

/**
* Plays the sound located at soundPath, at the volume "volume".
* The sound loops if loop is true (false by default)
* @param {string} soundPath
* @param {bool} loop
* @param {float} volume
*/
function playSound(SoundPath,loop=false,volume=1.0,audioSound=undefined){
  if(SoundPath == ""){
    console.log("Sound not defined !");
  }
  else{
    var audio
    if(audioSound === undefined){
        audio = new Audio(getGameFolderURL() + SoundPath);
    }else{
        audio = audioSound;
    }
    audio.loop = loop;
    audio.volume = volume;
    audio.play();
  }
}

/**
* Plays the Ambience sound of the current scene
*/
function playSoundScene(audio=undefined){
  let scene = getSceneByID(scene_number);
  let SoundPath = scene.Ambience.Path;
  let loop = scene.Ambience.Repeat;
  let volume = scene.Ambience.Volume;
  playSound(SoundPath,loop,volume,audio);
}

/**
* Plays the sound associated to clickZoneId
* @param {Number} clickZoneId
*/
function playSoundClickZone(clickZoneId){
  var Scene = getSceneByID(scene_number);
  var clickAreas = getClickAreas(Scene);
  var clickArea = getClickAreaByID(clickAreas,clickZoneId);
  var SoundPath = getSoundPath(clickArea);
  playSound(SoundPath);
}

/**
* Plays the sound associated to backClickAreaId
* @param {Number} backClickAreaId
*/
function playSoundBackClickArea(backClickAreaId){
  var Scene = getSceneByID(scene_number);
  var backClickAreas = getBackClickAreas(Scene);
  var backClickArea = getBackClickAreaByID(backClickAreas,backClickAreaId);
  var SoundPath = getSoundPath(backClickArea);
  playSound(SoundPath);
}

/**
* Plays the sound associated with gifId
* @param {Number} gifId
*/
function playSoundGif(gifId){
  var Scene = getSceneByID(scene_number);
  var gifs = getGifs(Scene);
  var gif = getGifByID(gifs, gifId);
  var SoundPath = getSoundPath(gif);
  playSound(SoundPath);
}

/**
* Plays the sound associated with objectId
* @param {Number} objectId
*/
function playSoundObject(objectId){
  var Scene = getSceneByID(scene_number);
  var objects = getObjects(Scene);
  var object = getObjectByID(objects, objectId);
  var SoundPath = getSoundPath(object);
  playSound(SoundPath);
}

/**
* Plays the sound associated to textId
* @param {Number} textId
*/
function playSoundText(textId){
  var Scene = getSceneByID(scene_number);
  var texts = getTexts(Scene);
  var text = getTextByID(texts, textId);
  var SoundPath = getSoundPath(text);
  playSound(SoundPath);
}

/**
* Plays the sound associated to transitionId
* @param {Number} transitionId
*/
function playSoundTransition(transitionId){
  var transitions = getTransitions();
  var transition = getTransitionByID(transitions, transitionId);
  var SoundPath = getSoundPath(transition);
  playSound(SoundPath);
}

// ========================================================================================
//                                      ***Transitions***
// ========================================================================================

/**
* Returns true if the transition id is Unique
* @param {Number} transitionId
* @returns true if the transition is unique, false otherwise
*/
function isTransitionUnique(transition){
  return transition.Unique;
}

// ========================================================================================
//                                      ***Video***
// ========================================================================================

/**
* loads all the information to play a video in cookies, then go to the video scene
* @param {String} vidName : Path to the video
* @param {String} type : type of the video (video/mp4, video/ogg, etc.)
* @param {String} sceneAfter : scene to go after quitting the video
*/
function loadVideoScene(vidName,type,sceneAfter){
  document.cookie = "video_name=" + vidName + ";";
  document.cookie = "video_type=" + type + ";";
  document.cookie = "scene_after=" + sceneAfter + ";";
  document.location.href = 'video.html';
}

/**
* Plays the video located at vidName (ex : Video.mp4) with type "type" (video/mp4, video/ogg, etc.).
* Throw an "fileError" if it does not exist
* @param {String} vidName
* @param {String} type
*/
function playVideo(vidName, type)
{
  if(fileExists(vidName)){
    var video = document.getElementById("video");
    video.innerHTML = "";
    video.width = parseInt(window.innerWidth);
    video.height = parseInt(window.innerHeight);
    video.zIndex = 16;
    var source = document.createElement("source");
    source.src = vidName;
    source.type = type;
    video.appendChild(source);
    video.play();
  }
  else{
    throw "fileError";
  }
}

/**
* resizes the video to the size of the window
*/
function resizeVideo(){
  var video = document.getElementById("video");
  video.width = parseInt(window.innerWidth);
  video.height = parseInt(window.innerHeight);
}

// ========================================================================================
//                                      ***Other***
// ========================================================================================
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
* Checks if the scene is final
* @param {scene} scene
* @returns true if the scene is final, false otherwise
*/
function isSceneFinal(scene){
  return scene.SceneType == 2;
}

// ----------------------------------- Cookie manager -------------------------------------

/**
* Returns the index of cookie whose name is 'cname' in cookie 'cook'
* @param {String} cname
* @param {Cookie} cook
* @returns the index of the cookie if it exists, -1 otherwise
*/
function getIndexName(cname, cook) {
  var toSearch = cname + "=";
  var i = 0;
  var begin_chaine = 0;
  while (i < cook.length) {
    if (i == begin_chaine && cook[i] == " ") {
      begin_chaine += 1;
    }
    if (cook[i] == "=") {
      var str = cook.substring(begin_chaine, i + 1);
      if (toSearch == str) {
        return i;
      }
    }
    if (cook[i] == ";") {
      begin_chaine = i + 1;
    }
    i += 1;
  }
  return -1;
}

/**
* Get the value of the cookie whose name is 'cname'
* @param {String} cname
* @returns value of the cookie (as a String)
*/
function getCookieValue(cname) {
  const cook = document.cookie;
  var ind = getIndexName(cname, cook);
  var i = ind;
  var j = 0;
  while (j == 0 && i < cook.length) {
    i = i + 1;
    if (cook[i] == ";") {
      j = i;
    }
  }
  j = i
  return cook.substring(ind + 1, j);
}
