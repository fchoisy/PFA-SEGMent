/**
* script-image.js
*
* Functions for displaying and contolling each element on the scene
*/

'use strict'; // Turns on "strict mode", preventing use of non-declared variables

// ========================================================================================
//                               ***Memos TODO (unused)***
// ========================================================================================

// --------------------------------------- Clément ----------------------------------------

// Toujours fondue pour les backClickZone

// ---------------------------------------- Hind ------------------------------------------

// --------------------------------------- Pierre -----------------------------------------

// -------------------------------------- Eleonore ----------------------------------------

// --------------------------------------- Emeric -----------------------------------------


// Verifier pour le changement de scene que tous les gifs sont sur la bonne frame

// Faire les images que l'on passe pour les état d'objets

// -------------------------------------- Corentin ----------------------------------------

// Pour les gifs IsOnZone, retourner un resTab[] pour pouvoir obtenir l'ID du gif et ainsi pouvoir jouer le son ?

// Pour les transitions Uniques, si on a plusieurs puzzles dans une même scène qui mènent à des scènes différentes, avec une transition unique,
// que doit-on faire ? (faire test).

// Pas utile de mettre un objet qui prend toute la page en z index grand car on check la position de la souris de toute façon.
// Seule façon de faire : check en variable globale

// ---------------------------------------- Jean ------------------------------------------

//Mettre les bonnes phrases en cas d'erreur sur le digicode

// ========================================================================================
//                               ***Global variables***
// ========================================================================================

const FADE_OUT_TIME = 1500; //Fade out time for fade transitions
const FADE_IN_TIME = 1500; //Fade out time for fade transitions

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
let canPlay = false;
let canPlayGif = true;
let isPuzzleScene = false;
let tabPos = [];

// ========================================================================================
//                               ***Signals***
// ========================================================================================

window.onload = initialisation();
window.addEventListener("mousemove", changeCursor, false);
window.addEventListener("click", verifyClick, false);
window.addEventListener("resize", resize);

// ========================================================================================
//                          ***functions unrelated to any enigma***
// ========================================================================================

// ------------------------------------ Initialisation ------------------------------------

/**
* Function to be called when scene is opened
*/
function initialisation() {
  let isBack = JSON.parse(getCookieValue("isback"));
  scene_number = getLastElem(getCookieValue("scene_number"));
  let fade_global=getCookieValue("fade_global") == "true";
  if(isBack || findTransition(getTransitions(), getLastElem(removeLastElem(getCookieValue("scene_number"))), scene_number)){
    document.body.classList.add("fadein");
  }
  setTimeout(function(){document.body.classList.remove("fadein")}, 1500)
  backgroundModifier();
  playSoundScene();
  imgsize();
  setWindowsValues();
  if(sceneVisited(scene_number)==false){
    printOpeningText();
    addCurrentSceneToVisited(scene_number);
  }
  else{
    canPlay = true;
  }
  clickzone();
  Puzzled(scene_number);
  loadObjects();
}

/**
* Changes the background of "ping.html" (or "pong.html")
* according to 'scene_number'
*/
function backgroundModifier() {
  scene_number = getLastElem(getCookieValue("scene_number"));
  img_path = getSceneBackgroundById(parseInt(scene_number));
  document.body.style.cursor = "default";
  let elem = document.body;
  elem.style.backgroundImage = "url(" + img_path + ")";
};

/**
* Initializes the global field 'imgSize'
*/
function imgsize(){
  scene_number = getLastElem(getCookieValue("scene_number"));
  imgSize = getImageSizeByID(scene_number);
}

/**
* Initializes clickZones and BackClickZones arrays
*/
function clickzone() {
  scene_number = getLastElem(getCookieValue("scene_number"));
  clickZones = getClickZonesByScenesId(scene_number,false);
  backClickZones = getClickZonesByScenesId(scene_number,true);
}

// ----------------------------------- Cookie manager -------------------------------------

/**
* Returns the index of cookie whose name is 'cname' in 'cook'
* @param {string} cname
* @param {*} cook
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
* @param {string} cname
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

// -------------------------------- Visited Scenes ------------------------------

/**
* Return true if the 'scene_number' has been visited and false if not
* Use the cookie visited_scenes
* @param {number} sceneId
*/
function sceneVisited(sceneId){
  let visited = getCookieValue("visited_scenes");
  var Id;
  for (var i = 0; i < visited.length; i++) {
    if(visited[i]==","){
      if(Id==sceneId){
        return true;
      }else{
        Id="";
      }
    }else{
      Id=Id+visited[i];
    }
  }
  if(Id==sceneId){
    return true;
  }else{
    return false;
  }
}

/**
* Add the 'sceneId' scene to the cookie 'visited_scenes'
* @param {number} sceneId
*/
function addCurrentSceneToVisited(sceneId){
  document.cookie = "visited_scenes=" + getCookieValue("visited_scenes") + "," + sceneId + ";";
}

// ---------------------------------------- Resize ----------------------------------------

/**
* Functions to execute when resizing the window size
*/
function resize(){
  setWindowsValues();
  resizeGif();
  loadObjects();
}

/**
* Store the values of the window's width, height, image's width, height,
* the dx (in pixels), the dy (in pixels), the scale of the resized image
* into an array named windowsValues
*/
function setWindowsValues(){
  let winWidth=parseInt(window.innerWidth);
  let winHeight=parseInt(window.innerHeight);
  let imgWidth=imgSize[0].width;
  let imgHeight=imgSize[0].height;
  let dx=0;
  let dy=0;
  let scale;
  if (imgWidth/winWidth>=imgHeight/winHeight) { //Black borders on the top and the bottom of the window
    scale = 1.0/(imgWidth/winWidth);
    dy = (winHeight-(imgHeight*scale))/2;
  }else{
    scale = 1.0/(imgHeight/winHeight);
    dx=(winWidth-(imgWidth*scale))/2;
  }
  let array = [winWidth, winHeight, imgWidth, imgHeight, dx, dy, scale];
  windowsValues = array;
}

// ------------------------------------ Change cursor  ------------------------------------

/**
* Changes the mouse pointer icon in reponse to an event
* @param {MouseEvent} event
*/
function changeCursor(event) {
  if(canPlay){
    let X = event.clientX;
    let Y = event.clientY;
    if (isOnZone(X, Y)[0] >= 0 || isOnBackZone(X,Y)[0] || isOnDigicodeZone(X,Y)[0]!=-1 || isOnGifZone(X,Y)!=-1 || isOnObjectZone(X,Y)[0]!=-1) {
      document.body.style.cursor = 'pointer';
      return;
    }
    document.body.style.cursor = 'default';
  }
}

// ------------------------------------- Change scene -------------------------------------

/**
* Fades in the screen and moves to a new scene
* @param {Event} event (ignored)
* @param {string} html path of page to go to
* @param {number} id id of scene to go to
* @param {boolean} back is a back transition
* @param {boolean} fade need a fade transition ?
*/
function changeScene(event, html, id, back, fade,) {
  event.preventDefault();
  let trueId = id;
  // Save the position of the gifs
  if(gifOnScene.length > 0){
    let state = getCookieValue("gif_state");
    let toAdd = "";
    toAdd = toAdd + scene_number + ":";
    for(let i=0;i<gifOnScene.length-1;i++){
      toAdd += gifOnScene[i].get_current_frame() +",";
    }
    toAdd += gifOnScene[gifOnScene.length-1].get_current_frame() + "/";
    addGifStateCookie(state,scene_number,toAdd);
  }
  if(isPuzzleScene){
    storePuzzleInCookie(getCookieValue("puzzle_pos"),tabPos,scene_number);
  }
  if(isInSkip(id,back)){
    trueId = getNextSceneSkip(id,back);
  }
  if(fade){
    document.body.classList.add("fadeout");
  }
  let cook = document.cookie;
  let i = 0;
  while (cook[i] != ";" && i < cook.length) {
    i = i + 1;
  }
  let lstSceneNumber = getCookieValue("scene_number")
  if(lstSceneNumber.length > 0 ){
    lstSceneNumber = lstSceneNumber.substring(0,lstSceneNumber.length);
  }
  else{
    lstSceneNumber = "";
  }
  if(back){
    let lst;
    if(getLastElem(lstSceneNumber)==scene_number){
      if(trueId==-1){
        trueId = removeLastElem(lstSceneNumber);
      }
      if(getCookieValue("scene_number").length==1){
        trueId = getCookieValue("scene_number");
      }
      document.cookie = "scene_number=" + trueId + ";";
    }
  }else{
    if(getLastElem(lstSceneNumber)==scene_number){
      document.cookie = "scene_number=" + lstSceneNumber + "," + trueId + ";";
    }
  }
  setTimeout(function(){document.location.href = html}, 1500)
  // if(fade){
  //   document.body.addEventListener("animationend", function(){document.location.href = html;})
  // } else {
  //   document.location.href = html;
  // }
};

// -------------------------------- Get/Remove last element -------------------------------

/**
* Remove the last element from a string of this form "1,2,3,4"
* @param {String} lst the string you want to remove the last element
*/
function removeLastElem(lst){
  let len = lst.length;
  while(lst[len] !="," && len>=0){
    len = len - 1;
  }
  return lst.substring(0,len);
}

/**
* Get the last element from a string of this form "1,2,3,4"
* @param {String} lst the string you want to get the last element
*/
function getLastElem(lst){
  let len = lst.length;
  while(lst[len] !="," && len!=0){
    len = len-1;
  }
  let ret = lst.length;
  if(len != 0 ){
    len = len+1;
    ret = ret+1;
  }
  return lst.substring(len,ret);
}

function getStateBySceneId(scene_number,cook){
  let len = cook.length-1;
  let len2 = cook.length-1;
  let len3 = cook.length-1;
  while(len>=0){
    if(cook[len] ==":"){
      len2=len;
    }
    if(cook[len] == "/"){
      if(cook.substring(len+1,len2)==scene_number){
        return(cook.substring(len2+1,len3));
      }
      len3 = len;
    }
    len = len - 1;
  }
  if(cook.substring(len,len2)==scene_number){
    return(cook.substring(len2+1,len3));
  }
  return "";
}

function getIndexStateBySceneId(scene_number,cook){
  let len = cook.length-1;
  let len2 = cook.length-1;
  let len3 = cook.length-1;
  while(len>=0){
    if(cook[len] ==":"){
      len2=len;
    }
    if(cook[len] == "/"){
      if(cook.substring(len+1,len2)==scene_number){
        return[len+1,len3+1];
      }
      len3 = len;
    }
    len = len - 1;
  }
  if(cook.substring(len,len2)==scene_number){
    return[len+1,len3+1];
  }
  return [cook.length,cook.length];
}

function addGifStateCookie(state,sceneNumber,toAdd){
  const indexes = getIndexStateBySceneId(sceneNumber,state);
  document.cookie = "gif_state=" + state.substring(0,indexes[0]) + toAdd + state.substring(indexes[1]);

}

function storePuzzleInCookie(cook,topPos,sceneNb){
  console.log(topPos);
  let indexes =  getIndexStateBySceneId(sceneNb,cook);
  document.cookie = "puzzle_pos="+cook.substring(0,indexes[0])+sceneNb +":"+topPos+cook.substring(indexes[1])+"/";
}

function findNextUnskippedFrame(resGif,currentFrame){
    let i = currentFrame + 1;
    const len = gifClickZone[resGif].id[0]
    while(i != currentFrame){
            if(i >=len){
                i = 0;
            }
            if(gifClickZone[resGif].id[2][i]!=0){
                return i
            }
            i++;
    }
    return -1;
}
// ========================================================================================
//                                     ***Transitions***
// ========================================================================================

// ------------------------------------- Skip to Scene -------------------------------------

/** TODO
*
* @param {} sceneId
*/
function addSkip(sceneId){
  document.cookie = "skip=" + getCookieValue("skip") + "," + sceneId + ";";
}

/** TODO
*
* @param {} sceneId
* @param {} back
*/
function isInSkip(sceneId,back){
  let skip = getCookieValue("skip");
  skip = skip+",";
  var IdStr;
  var Id;
  let sid=sceneId;
  if(back && getCookieValue("scene_number").length>1){
    sid = getLastElem(removeLastElem(getCookieValue("scene_number")));
  }
  for (var i = 0; i < skip.length; i++) {
    if(skip[i] == ","){
      Id = parseInt(IdStr);
      IdStr = "";
      if(Id == sid){
        return true;
      }
    }
    else{
      IdStr += skip[i];
    }
  }
  return false;
}

/** TODO
*
* @param {} sceneId
* @param {} back
*/
function getNextSceneSkip(sceneId,back){
  if(!back){
    const transition = findTransitionBySceneId(sceneId);
    const transitionType = transition.Transition.Which;
    const transitionData = transition.Transition[transitionType];
    return getLastNumberTransition(transitionData.To);
  }
  let lst = removeLastElem(getCookieValue("scene_number"));
  while(isInSkip(getLastElem(lst))){
    lst = removeLastElem(lst);
  }
  return lst;
}

/** TODO
*
* @param {} sceneId
*/
function findTransitionBySceneId(sceneId){
  let transitions = getTransitions();
  var transitionType;
  var transition;
  var transitionData;
  for (var i = 0; i < transitions.length; i++) {
    transition = transitions[i];
    transitionType = transition.Transition.Which;
    transitionData = transition.Transition[transitionType];
    if(getSceneIdFromPath(transitionData.From) == sceneId){
      return transition;
    }
  }
}

// ========================================================================================
//                                    ***Tests on click***
// ========================================================================================

// ---------------------------------- Verify if on a zone ---------------------------------

/**
* Check wether a mouse click is inside a click zone
* and launches 'changeScene' if it is
* @param {MouseEvent} event
*/
function verifyClick(event) { // NOTE : make separate functions for each case ?
  if(canPlay){
    const X = event.clientX;
    const Y = event.clientY;
    verifyClickZone(X,Y);
    verifyBackZone(X,Y);
    verifyDigicode(X,Y);
    verifyObject(X,Y);
    verifyGif(X,Y);
    if(isSceneFinal(getSceneByID(scene_number))){
      document.location.href = 'outro.html';
    }
  }
}

// -------------------------------------- verify[...] -------------------------------------

/**
* Verifies if clicked on a ClickZone, and changes scene if so
* @param {coordinate} X
* @param {coordinate} Y
*/
function verifyClickZone(X,Y){
  const resClickZone = isOnZone(X,Y); // NOTE : resTab[0] = id pointed scene; resTab[1] = clickzone id
  if (resClickZone[0] >= 0) {
    playSoundClickZone(resClickZone[1]);
    if(isTransitionUnique(findTransitionBySceneId(scene_number))){
      addSkip(scene_number);
    }
    document.cookie = "isback=" + false +";";
    let fade = findTransition(getTransitions(), scene_number, resClickZone[0])
    changeScene(event, "ping.html", resClickZone[0], false, fade);
  }

}

/**
* Verifies if clicked on a BackClickZone, and changes scene if so
* @param {coordinate} X
* @param {coordinate} Y
*/
function verifyBackZone(X,Y){
  const resBackZone = isOnBackZone(X, Y); // NOTE : resTab[0] = is on back zone; resTab[1] = back click zone id
  if(resBackZone[0]){
    playSoundBackClickArea(resBackZone[1]);
    let passedScene = getLastElem(getCookieValue("scene_number"));
    let sId = -1;
    document.cookie = "isback=" + true +";";
    changeScene(event, "ping.html", sId, true, true);
  }
}

/**
* Verifies if clicked on a Digicode letter/validate, memorizes the letter or checks if the answer is correct
* @param {coordinate} X
* @param {coordinate} Y
*/
function verifyDigicode(X,Y){
  const resDigi = isOnDigicodeZone(X, Y); // NOTE : resTab[0] = value of text; resTab[1] = clickzone id
  let bool = false;
  if(resDigi[0] != -1){
    var digiBox = document.getElementById("digiBox");
    var currentSceneId= getLastElem(getCookieValue("scene_number"));
    var digiSuccess = getDigicodeQSF(currentSceneId,"SUCCESS");
    if (digiSuccess==undefined) {
      digiSuccess=="";
    }
    var digiFailure = getDigicodeQSF(currentSceneId,"FAILURE");
    if (digiFailure==undefined) {
      digiFailure=="";
    }
    var clickValidate = false;
    playSoundText(resDigi[1]);
    if(resDigi[0][0] =="Validate"){
      clickValidate = true;
      bool = validatingBuffer();
    }
    else if(resDigi[0][0] == "Delete"){
      deletingBuffer();
    }
    else if(resDigi[0][0] == "Replace"){
      changingBuffer(resDigi[0][1]);
    }
    else{
      addingBuffer(resDigi[0][1]);
    }
    if(clickValidate){
      clickValidate = false ;
      if (bool) {
        digiBox.innerHTML = digiSuccess;
      }else {
        digiBox.innerHTML = digiFailure;
      }
    }else {
      digiBox.innerHTML=buffer;
    }
  }
  if(bool){
    let sId = 0;
    sId = digicodeClickZone[digicodeClickZone.length-1]
    sId = sId[sId.length-1];
    if(isTransitionUnique(findTransitionBySceneId(scene_number))){
      addSkip(scene_number);
    }
    document.cookie = "isback=" + false +";";
    let fade  = findTransition(getTransitions(), scene_number, sId)

    changeScene(event, "ping.html", sId, false, fade);
  }
}

/**
* Verifies if clicked on an object, and changes scene if so
* @param {coordinate} X
* @param {coordinate} Y
*/
function verifyObject(X,Y){
  const resObject = isOnObjectZone(X, Y);
  if(resObject[0] != -1){
    playSoundObject(resObject[1]);
    let sId = resObject[0];
    if(isTransitionUnique(findTransitionBySceneId(scene_number))){
      addSkip(scene_number);
    }
    document.cookie = "isback=" + false +";";
    let fade = findTransition(getTransitions(), scene_number, sId)

    changeScene(event, "ping.html", sId, false, fade);
  }
}

/**
* Verifies if clicked on a gif, if so, changes the image of the gif, and if the combination is correct, changes scene
* @param {coordinate} X
* @param {coordinate} Y
*/
function verifyGif(X,Y){
  const resGif = isOnGifZone(X,Y);
  if(resGif!=-1){
    let currentFrame = gifOnScene[resGif].get_current_frame();
    let first = true;
    while(first && canPlayGif){
      let newFrame = (currentFrame + 1) % gifClickZone[resGif].id[0];
      if(gifClickZone[resGif].id[2][newFrame] == 0){
        let nextScene = findNextUnskippedFrame(resGif,currentFrame);
        if(currentFrame == nextScene){
            gifOnScene[resGif].move_to(newFrame);
        }
        gifOnScene[resGif].play_until(nextScene);
      }
      else{
        gifOnScene[resGif].pause();
        gifOnScene[resGif].move_to(newFrame);
      }
      currentFrame = gifOnScene[resGif].get_current_frame();
      first = false;
    }
    if(areGifWellSet()){
      canPlayGif = false;
      if(isTransitionUnique(findTransitionBySceneId(scene_number))){
        addSkip(scene_number);
      }
      document.cookie = "isback=" + false +";";
      let fade = findTransition(getTransitions(), scene_number, gifClickZone[resGif].id[3])

      changeScene(event, "ping.html", gifClickZone[resGif].id[3] , false, fade);
    }
  }
}

// ------------------------------------- isOn[...]Zone ------------------------------------

/**
* Checks wether the point of coordinates (X,Y) is inside a click zone
* @param {coordinate} X
* @param {coordinate} Y
*
* @returns resTab :  resTab[0] = id pointed scene; resTab[1] = clickzone id
*/
function isOnZone(X,Y){
  X = (X-windowsValues[4])/(windowsValues[0]-2*windowsValues[4]);
  Y = (Y-windowsValues[5])/(windowsValues[1]-2*windowsValues[5]);
  let resTab = [];
  let len = clickZones.length;
  for(let i=0;i<len;i++){
    if(X>=clickZones[i].x1 && X<=clickZones[i].x2 && Y>=clickZones[i].y1 && Y<=clickZones[i].y2){
      resTab[0] = clickZones[i].id;
      resTab[1] = clickZones[i].clickzoneId;
      return resTab;
    }
  }
  resTab[0] = -1
  resTab[1] = -1
  return resTab;
}

/**
* Checks wether the point of coordinates (X,Y) is inside a back click zone
* @param {coordinate} X
* @param {coordinate} Y
*
* @returns resTab : resTab[0] = is on back zone; resTab[1] = back click zone id
*/
function isOnBackZone(X,Y){
  let resTab = [];
  X = (X-windowsValues[4])/(windowsValues[0]-2*windowsValues[4]);
  Y = (Y-windowsValues[5])/(windowsValues[1]-2*windowsValues[5]);

  let len = backClickZones.length;
  for(let i=0;i<len;i++){
    if(X>=backClickZones[i].x1 && X<=backClickZones[i].x2 && Y>=backClickZones[i].y1 && Y<=backClickZones[i].y2){
      resTab[0] = true;
      resTab[1] = backClickZones[i].bckclickId;
      return resTab;
    }
  }
  resTab[0] = false;
  resTab[1] = -1;
  return resTab;
}

/**
* Checks wether the point of coordinates (X,Y) is inside a back click zone
* @param {coordinate} X
* @param {coordinate} Y
*
* @returns resTab : resTab[0] = value of text; resTab[1] = clickzone id
*/
function isOnDigicodeZone(X,Y){
  let resTab = [];
  X = (X-windowsValues[4])/(windowsValues[0]-2*windowsValues[4]);
  Y = (Y-windowsValues[5])/(windowsValues[1]-2*windowsValues[5]);
  let len = digicodeClickZone.length - 1;
  for(let i=0;i<len;i++){
    if(X>=digicodeClickZone[i].x1 && X<=digicodeClickZone[i].x2 && Y>=digicodeClickZone[i].y1 && Y<=digicodeClickZone[i].y2){
      resTab[0] = digicodeClickZone[i].id;
      resTab[1] = digicodeClickZone[i].clickzoneId;
      return resTab;
    }
  }
  resTab[0] = -1;
  resTab[1] = -1;
  return resTab;
}

/**
* Checks wether the point of coordinates (X,Y) is inside a back click zone
* @param {coordinate} X
* @param {coordinate} Y
*
* @returns index of the gif click zone if is on zone, else returns -1
*/
function isOnGifZone(X,Y){
  X = (X-windowsValues[4])/(windowsValues[0]-2*windowsValues[4]);
  Y = (Y-windowsValues[5])/(windowsValues[1]-2*windowsValues[5]);
  let len = gifClickZone.length;
  for(let i=0;i<len;i++){
    if(X>=gifClickZone[i].x1 && X<=gifClickZone[i].x2 && Y>=gifClickZone[i].y1 && Y<=gifClickZone[i].y2){
      return i;
    }
  }
  return -1;
}

/**
* Checks wether the point of coordinates (X,Y) is inside a back click zone
* @param {coordinate} X
* @param {coordinate} Y
*
* @returns resTab : resTab[0] = id of the scene to load ; resTab[1] = clickzone id
*/
function isOnObjectZone(X,Y){
  let resTab = [];
  X = (X-windowsValues[4])/(windowsValues[0]-2*windowsValues[4]);
  Y = (Y-windowsValues[5])/(windowsValues[1]-2*windowsValues[5]);
  let len = objectClickZones.length ;
  for(let i=0;i<len;i++){
    if(X>=objectClickZones[i].x1 && X<=objectClickZones[i].x2 && Y>=objectClickZones[i].y1 && Y<=objectClickZones[i].y2){
      resTab[0] = objectClickZones[i].id;
      resTab[1] = objectClickZones[i].clickzoneId;
      return resTab;
    }
  }
  resTab[0] = -1;
  resTab[1] = -1;
  return resTab;
}

// ========================================================================================
//                                      ***Texts***
// ========================================================================================

function findKeyframesRule(rule,nav="") {
  // Gather all stylesheets into an array
  var ss = document.styleSheets;
  var startText="@"+nav;
  // Storing all the rules that match the nav
  var tabRules=[];
  // Loop through the stylesheets
  for (var i = 0; i < ss.length; ++i) {
    // Loop through all the rules
    for (var j = 0; j < ss[i].cssRules.length; ++j) {
      // Find the rule whose name matches our passed over parameter starting with nav and adding that rule to the tab
      if ((ss[i].cssRules[j].type == window.CSSRule.KEYFRAMES_RULE) && ss[i].cssRules[j].name == rule && ss[i].cssRules[j].cssText.startsWith(startText))
      tabRules.push([ss[i], ss[i].cssRules[j]]);
    }
  }
  // Rule(s) found
  if (tabRules.length!=0) {
    //console.log(ss);
    //console.log(tabRules);
    return tabRules;
  }
  // Rule not found
  return null;
}


/** TODO
*
*/
function printOpeningText(){
  var text;
  var textBox;
  var i=0;
  var t;
  //Creating the textBox
  function reset() {
    setWindowsValues();
    clearTimeout(t);
    text = getSceneTextBySceneId(scene_number);
    textBox = document.getElementById("textbox");
    textBox.style.position="absolute";
    textBox.style.left = (windowsValues[4] + 0.15 * windowsValues[2] * windowsValues[6]) + "px";
    textBox.style.right = (windowsValues[4] + 0.15  * windowsValues[2] * windowsValues[6]) + "px";
    textBox.style.top = (windowsValues[5] + 0.75 * windowsValues[3] * windowsValues[6]) + "px";
    textBox.style.height = (0.16 * windowsValues[3] * windowsValues[6]) + "px";
    textBox.style.color = "#ffffff";
    textBox.style.boxSizing="border-box";
    if (text!="") {
      textBox.classList.add("defileTexte");
    } else {
      textBox.classList.remove("defileTexte");
      textBox.style.display = "none";
    }
    if(text.length == 0){
      canPlay = true;
    }
  }
  reset();

  //Creating the div that will scroll in the textBox
  let textDiv = document.createElement("div");
  textDiv.id="textDiv";
  textDiv.style.fontSize = (0.07 * windowsValues[3] * windowsValues[6]) + "px";
  textDiv.style.position="relative";
  textDiv.style.boxSizing="border-box";
  textDiv.innerHTML=text;
  textBox.appendChild(textDiv);


  //Changing the rules of the scrolling
  function setTextKeyframes(){
    //Set the keyframes rules with dynamic values
    const arrayNav=["","-webkit-","-o-","-moz-","-ms-"];
    //const arrayNav=["","-webkit-"];
    for (const nav of arrayNav) {
      var results = findKeyframesRule("defilement-texte",nav);
      //console.log(results,nav);
      if (results!=null) {
        for (let i = 0; i < results.length; i++) {
          var style_sheet = results[i][0];
          var rule = results[i][1];
          rule.deleteRule("0%");
          rule.deleteRule("100%");
          rule.appendRule("0% { transform: translate3d(0px," + (textBox.clientHeight+ 0.01 * windowsValues[3] * windowsValues[6])  +"px,0px); }")
          rule.appendRule("100% { transform: translate3d(0px,-" + (textDiv.clientHeight-textBox.clientHeight) + "px,0px); }")
        }
      }
      //console.log(rule);
    }
  }
  setTextKeyframes();

  //Changing the font size automatically
  window.addEventListener("resize", function () {
    reset();
    setTextKeyframes();
    textDiv.style.fontSize = (0.07 * windowsValues[3] * windowsValues[6]) + "px";
  });

  //Changing the comportment on click
  let alreadyClicked=false;
  function instantPrinting(){
    if (alreadyClicked) {
      setTimeout(function(){
        textBox.style.display="none";
      }, 100);
      setTimeout(function(){ canPlay=true; }, 100);
    } else {
      textDiv = document.getElementById("textDiv");
      textDiv.style.animationName = 'none';
      textDiv.style.WebkitAnimationName = 'none';
      textDiv.style.animation = "defilement-texte 1ms 1 normal linear forwards";
      textDiv.style.WebkitAnimationName = "defilement-texte";
      textDiv.style.WebkitAnimationDuration = "1ms";
      textDiv.style.WebkitAnimationIterationCount = "1";
      textDiv.style.WebkitAnimationDirection = "normal";
      textDiv.style.WebkitAnimationTimingFunction = "linear";
      textDiv.style.WebkitAnimationFillMode = "forwards";
      alreadyClicked=true;
    }
  }

  document.addEventListener("click", instantPrinting);

  textDiv.addEventListener("animationend",function() {
    alreadyClicked=true;
    console.log("end");
  });

}

// ========================================================================================
//                                    ***Digicode functions***
// ========================================================================================

/*
* Implements the validation behavior of a digicode click zone
*/
function validatingBuffer(){
  const answer = digicodeClickZone[digicodeClickZone.length-1];
  const len = answer[1].length;
  if(buffer == answer[0]){
    return true;
  }
  for(let i=0; i<len;i++){
    if(buffer == answer[1][i]){
      return true ;
    }
  }
  buffer = "";
  return false;
}

/**
* Implements the replacing behavior of a digicode click zone
* @param {String} digi
*/
function changingBuffer(digi){
  buffer = digi;
}

/**
* Implements the adding behavior of a digicode click zone
* @param {String} digi
*/
function addingBuffer(digi){
  buffer = buffer + digi;
}

/*
* Implements the deleting behavior of a digicode click zone
*/
function deletingBuffer(){
  if(buffer.length == 0){
    return;
  }
  else{
    buffer = buffer.substring(0,buffer.length-1);
  }
}

// ========================================================================================
//                                    ***Gifs functions***
// ========================================================================================

/*
* Refreshes the size of every gif on the scene
*/
function resizeGif(){
  for(let i=0;i<gifOnScene.length;i++){
    let top = windowsValues[5] + gifClickZone[i].y1 * windowsValues[3] * windowsValues[6];
    let left = windowsValues[4] + gifClickZone[i].x1 * windowsValues[2] * windowsValues[6];
    let width = windowsValues[2] * windowsValues[6] * (gifClickZone[i].x2-gifClickZone[i].x1);
    let height = windowsValues[3] * windowsValues[6] * (gifClickZone[i].y2-gifClickZone[i].y1);
    gifOnScene[i].resize(width,height,left,top);
  }
}

/*
* Check if all the gifs are set to the right frame.
*/
function areGifWellSet(){
  let bool = true;
  let i = 0 ;
  const len = gifClickZone.length;
  while(i<len && bool){
    if(gifClickZone[i].id[2][gifOnScene[i].get_current_frame()] != 2){
      bool = false;
    }
    i++;
  }
  return bool;
}

// ========================================================================================
//                       ***Objects functions***
// ========================================================================================

/*
* Gets all objects and display those
*/
function loadObjects(){
  let scene = getSceneByID(scene_number);
  let transitions = getTransitions();
  let objects = getObjects(scene);
  setWindowsValues();
  for (var i = 0; i < objects.length; i++) {
    if (!objects[i].PuzzlePiece){
      displayObject(objects[i],transitions,scene);
    }
  }
}

/**
* Display the object on the scene
* @param {object} object
* @param {transistion[]} transitions
* @param {Int} scene
*/
function displayObject(object,transitions,scene){
  var canvas = document.getElementById("canvas");
  canvas.style.position = "absolute";
  canvas.width  = windowsValues[0];
  canvas.height = windowsValues[1];
  var ctx = canvas.getContext('2d');
  var img = new Image();
  img.onload = function() {
    ctx.drawImage(img, windowsValues[4] + (object.Pos[0] * windowsValues[2] * windowsValues[6]), windowsValues[5]+ (object.Pos[1] * windowsValues[3] * windowsValues[6]), object.Size[0] * windowsValues[2] * windowsValues[6], object.Size[1] * windowsValues[2] * windowsValues[6]);
  };
  img.src = "Game/" + object.Image;

  for (var i = 0; i < transitions.length; i++) {
    if(transitions[i].Transition.ObjectToScene != undefined) {
      if (transitions[i].Transition.ObjectToScene.From == object.Path) {
        let heightPourcentage = object.Size[1] * scene.ImageSize[0] / scene.ImageSize[1];
        let transitionSceneId = getLastNumberTransition(transitions[i].Transition.ObjectToScene.To);
        let clickZoneId = object.id
        let objectClickZone = new ClickZone(object.Pos[0],object.Pos[1],object.Size[0] + object.Pos[0], object.Pos[1] + heightPourcentage ,transitionSceneId,clickZoneId);
        objectClickZones.push(objectClickZone);
      }
    }
  }
}

// ========================================================================================
//                       ***Puzzle functions***
// ========================================================================================

/**
* The function parse the different information of the JSON according to the puzzle type
* @param {Int} id
*/
function Puzzled(id){
  const puzzle = whatPuzzleItIs(id);
  if(puzzle[0] == "Text"){
    var digiBox = document.createElement("div");
    digiBox.id="digiBox";
    setWindowsValues();
    digiBox.style.position = "absolute";
    digiBox.style.left = (windowsValues[4] + 0.35 * windowsValues[2] * windowsValues[6]) + "px";
    digiBox.style.right = (windowsValues[4] + 0.35 * windowsValues[2] * windowsValues[6]) + "px";
    digiBox.style.top = (windowsValues[5] + 0.9 * windowsValues[3] * windowsValues[6]) + "px";
    digiBox.style.height = (0.06 * windowsValues[3] * windowsValues[6]) + "px";
    digiBox.style.fontSize = (0.06 * windowsValues[3] * windowsValues[6]) + "px";
    var digiQuestion = getDigicodeQSF(id,"QUESTION");
    if (digiQuestion==undefined) {
      digiQuestion=="";
    }else {
      digiBox.classList.add("defileDigicode");
      var digiSpan = document.createElement("div");
      digiSpan.innerHTML = digiQuestion;
      digiBox.appendChild(digiSpan);
    }
    function deplaceDigiBox(){
      setWindowsValues();
      digiBox.style.left = (windowsValues[4] + 0.35 * windowsValues[2] * windowsValues[6]) + "px";
      digiBox.style.right = (windowsValues[4] + 0.35 * windowsValues[2] * windowsValues[6]) + "px";
      digiBox.style.top = (windowsValues[5] + 0.9 * windowsValues[3] * windowsValues[6]) + "px";
      digiBox.style.height = (0.06 * windowsValues[3] * windowsValues[6]) + "px";
      digiBox.style.fontSize = (0.06 * windowsValues[3] * windowsValues[6]) + "px";
    }
    window.addEventListener("resize", deplaceDigiBox, false);
    document.body.appendChild(digiBox);
    const scene = getSceneByID(id);
    const sceneTextArea = scene.TextAreas;
    const len = sceneTextArea.length;
    let clickz = 0;
    for(let i =0; i<len; i++){
      let heightPourcentage = sceneTextArea[i].Size[1] * scene.ImageSize[0] / scene.ImageSize[1];
      if(sceneTextArea[i].Behaviour == 3){
        clickz = new ClickZone(sceneTextArea[i].Pos[0],sceneTextArea[i].Pos[1],sceneTextArea[i].Size[0] + sceneTextArea[i].Pos[0],heightPourcentage + sceneTextArea[i].Pos[1],["Validate"], sceneTextArea[i].id);
      }else if(sceneTextArea[i].Behaviour == 2){
        clickz = new ClickZone(sceneTextArea[i].Pos[0],sceneTextArea[i].Pos[1],sceneTextArea[i].Size[0] + sceneTextArea[i].Pos[0],heightPourcentage + sceneTextArea[i].Pos[1],["Delete"], sceneTextArea[i].id);
      }else if(sceneTextArea[i].Behaviour == 1){
        clickz = new ClickZone(sceneTextArea[i].Pos[0],sceneTextArea[i].Pos[1],sceneTextArea[i].Size[0] + sceneTextArea[i].Pos[0],heightPourcentage + sceneTextArea[i].Pos[1],["Replace",sceneTextArea[i].Text], sceneTextArea[i].id)
      }
      else{
        clickz = new ClickZone(sceneTextArea[i].Pos[0],sceneTextArea[i].Pos[1],sceneTextArea[i].Size[0] + sceneTextArea[i].Pos[0],heightPourcentage + sceneTextArea[i].Pos[1],["Add",sceneTextArea[i].Text], sceneTextArea[i].id);
      }
      digicodeClickZone.push(clickz);
    }
    const transition = getTransitionByID(getTransitions(),puzzle[1]);
    const riddle = transition.Transition.SceneToScene.Riddle;
    let array = [];
    const idTransition = getLastNumberTransition(transition.Transition.SceneToScene.To);
    array.push(riddle.Text.Expected);
    array.push(riddle.Text.FuzzyMatches);
    array.push(idTransition); // Attention cela doit toujours être en dernier
    digicodeClickZone.push(array);
  } else if (puzzle[0] == "Puzzle") {
    isPuzzleScene = true;
    devicePixelRatio = 1;
    let puzzlePieces = getPuzzlepieces(id);
    let diffX;
    let diffY;
    tabPos = [];
    let alreadyVisited =false;
    let statePuzzle = getStateBySceneId(scene_number,getCookieValue("puzzle_pos"));
    if(statePuzzle != ""){
      alreadyVisited = true;
    }
    if(alreadyVisited){
      let tmpTab = statePuzzle.split(",");
      console.log(tmpTab.length);
      for(let i=0;i<tmpTab.length/2; i++){
        let tempo = [0,0];
        tempo[0] = parseFloat(tmpTab[2*i]);
        tempo[1] = parseFloat(tmpTab[2*i+1]);
        tabPos.push(tempo);
      }
      console.log(tabPos);
      console.log(tmpTab);
    }
    var i;
    var firstLoad = 0;
    function displayPuzzleImage() {
      setWindowsValues();
      let puzzleImagesZone = document.getElementById("puzzleImages");
      puzzleImagesZone.style.position = "absolute";
      puzzleImagesZone.style.top =  windowsValues[5] + "px";
      puzzleImagesZone.style.bottom =  windowsValues[5] + "px";
      puzzleImagesZone.style.left =  windowsValues[4] + "px";
      puzzleImagesZone.style.right =  windowsValues[4] + "px";
      puzzleImagesZone.innerHTML = "";
      puzzleImagesZone.width = windowsValues[0];
      puzzleImagesZone.height = windowsValues[1];
      var top;
      var left;
      for (i = 0; i < puzzlePieces.length; i++) {
        var img;
        img = document.createElement("IMG");
        img.id = "draggable" + i;
        img.classList.add("draggable");
        if (firstLoad  != puzzlePieces.length-1 && !alreadyVisited) {
          top = Math.floor(Math.random() * 65) / 100 * windowsValues[3] * windowsValues[6];
          left = Math.floor(Math.random() * 65) / 100 * windowsValues[2] * windowsValues[6];
          firstLoad = i;
          let posImg = [left/(windowsValues[2] * windowsValues[6]),top/(windowsValues[3] * windowsValues[6])];
          tabPos.push(posImg);
        }else{
          top = tabPos[i][1] * windowsValues[3] * windowsValues[6];
          left = tabPos[i][0] * windowsValues[2] * windowsValues[6];
        }
        // C'est ici puzzle
        img.style.position = "absolute";
        img.style.top = top + "px";
        img.style.left = left + "px";
        img.width = puzzlePieces[i].Size[0] * windowsValues[2] * windowsValues[6];
        img.height = puzzlePieces[i].Size[1] * windowsValues[2] * windowsValues[6];
        img.src = "Game/" + puzzlePieces[i].Image;
        puzzleImagesZone.appendChild(img);
        $(".draggable").draggable({containment: "parent"});
      }

      diffX=[];
      diffY=[];
      var delta = 0.05;
      let originX = puzzlePieces[0].Pos[0];
      let originY = puzzlePieces[0].Pos[1];
      let imgX;
      let imgY;
      let minX;
      let maxX;
      let minY;
      let maxY;
      for (i = 1; i < puzzlePieces.length; i++) {
        imgX = puzzlePieces[i].Pos[0];
        imgY = puzzlePieces[i].Pos[1];
        minX = (imgX - originX - delta);
        maxX = (imgX - originX + delta);
        minY = (imgY - originY - delta);
        maxY = (imgY - originY + delta);
        diffX.push([minX,maxX]);
        diffY.push([minY,maxY]);
      }
    }
    displayPuzzleImage();
    window.addEventListener("resize", displayPuzzleImage, false);
    var currentOriginX;
    var currentOriginY;
    var currentX;
    var currentY;
    var pourcentX;
    var pourcentY;
    function storeImagePosition(){
      for (i = 0; i < puzzlePieces.length; i++) {
        let puzzleImagesZone = document.getElementById("puzzleImages");
        currentX = parseInt(document.getElementById("draggable"+i).offsetLeft);
        currentY = parseInt(document.getElementById("draggable"+i).offsetTop);
        pourcentX = currentX / (windowsValues[0]-(2*windowsValues[4]));
        pourcentY = currentY / (windowsValues[1]-(2*windowsValues[5]));
        tabPos[i][0]=pourcentX;
        tabPos[i][1]=pourcentY;
      }
    }
    window.addEventListener("touchend", storeImagePosition, false);
    window.addEventListener("mouseup", storeImagePosition, false);

    const transition = getTransitionByID(getTransitions(),puzzle[1]);
    const idTransition = getLastNumberTransition(transition.Transition.SceneToScene.To);
    window.addEventListener("mouseup", verify, false);
    window.addEventListener("touchend", verify, false);
    function verify(){
      currentOriginX = tabPos[0][0];
      currentOriginY = tabPos[0][1];
      let result = true ;
      for (var i = 1; i < puzzlePieces.length; i++) {
        currentX = tabPos[i][0];
        currentY = tabPos[i][1];
        if (!((currentX - currentOriginX) >= diffX[i-1][0] && (currentX - currentOriginX) <= diffX[i-1][1])){
          result = false;
        }
        if (!((currentY - currentOriginY) >= diffY[i-1][0] && (currentY - currentOriginY) <= diffY[i-1][1])){
          result = false;
        }
      }
      if (result) {
        if(isTransitionUnique(findTransitionBySceneId(scene_number))){
          addSkip(scene_number);
        }
        document.cookie = "isback=" + false +";";
        let fade = findTransition(getTransitions(), scene_number, idTransition);
        changeScene(event, "ping.html", idTransition, false, fade);
      }
    }
  }else if(puzzle[0] == "Gif"){
    const scene = getSceneByID(id);
    let gifs = scene.Gifs;
    let clickz=[];
    let currentGif = [];
    let img;
    let gif;
    let alreadyVisited = false;
    let stateArray = []
    let len =0;
    const ctx = canvas.getContext("2d");
    for(let i=0;i<gifs.length;i++){
      gifOnScene.push(0);
    }
    let state = getStateBySceneId(scene_number,getCookieValue("gif_state"));
    if(state !=""){
      console.log(state);
      state += "/";
      alreadyVisited = true;
      let buffer = "";
      while(len<state.length){
        if(state[len] == "," || state[len] =="/"){
          stateArray.push(parseInt(buffer));
          buffer = "";
        }
        else{
          buffer += state[len];
        }
        len++;
      }
    }
    for(let i=0;i<gifs.length;i++){
      currentGif = gifs[i];
      let heightPourcentage = currentGif.Size[1] * scene.ImageSize[0] / scene.ImageSize[1];
      clickz = new ClickZone(currentGif.Pos[0],currentGif.Pos[1],currentGif.Size[0] + currentGif.Pos[0],heightPourcentage + currentGif.Pos[1],[currentGif.Frames.length,0,currentGif.Frames,getGifPointedScene(scene_number)], currentGif.id);
      gifClickZone.push(clickz);
      img = document.createElement("img");
      img.setAttribute("id","gif"+i);
      img.setAttribute("rel:auto_play","-1");
      img.setAttribute("src","Game/"+currentGif.Image);
      let top = windowsValues[5] + clickz.y1 * windowsValues[3] * windowsValues[6];
      let left = windowsValues[4] + clickz.x1* windowsValues[2] * windowsValues[6];
      let width = windowsValues[2] * windowsValues[6] * (clickz.x2-clickz.x1);
      let height = windowsValues[3] * windowsValues[6] * (clickz.y2-clickz.y1);
      document.getElementById("gifImages").appendChild(img);
      let gifl=new SuperGif({ gif: img, imageX: left, imageY: top, imageWidth: width, imageHeight: height} );
      var fram =0;
      if(alreadyVisited){
        fram = stateArray[i];
      }
      gifl.load(fram,function(){
        gifOnScene[i] = gifl;
      });
    }
  }
}
