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

  // ---------------------------------------- Hind ------------------------------------------

  // --------------------------------------- Pierre -----------------------------------------

  // -------------------------------------- Eleonore ----------------------------------------

  // --------------------------------------- Emeric -----------------------------------------

    // Penser à remplir gifOnScene

    // Verifier pour le changement de scene que tous les gifs sont sur la bonne frame

    // Faire les images que l'on passe pour les état d'objets

  // -------------------------------------- Corentin ----------------------------------------

    // Séparer le code de verifyClick et Puzzled en plusieurs sous-fonctions

    // Pour les gifs IsOnZone, retourner un resTab[] pour pouvoir obtenir l'ID du gif et ainsi pouvoir jouer le son ?

  // ---------------------------------------- Jean ------------------------------------------

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
let scene_number; // the number of the played scene
let imgSize = []; // contains the size of the image in the background
let gifOnScene = []; // contains all the gifs in the current scene
let buffer = ""; // String to memorize the answer of the user for a digicode enigma
let windowsValues; //contains information of the size of the current window, image and bands on sides and top/bottom

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
    scene_number = getLastElem(getCookieValue("scene_number"));
    backgroundModifier();
    playSoundScene();
    imgsize();
    setWindowsValues();
    printOpeningText();
    clickzone();
    Puzzled(scene_number);
    loadObjects();
    $("#fade").fadeOut(FADE_OUT_TIME); // jQuery method
}

/**
 * Changes the background of "ping.html" (or "pong.html")
 * according to 'scene_number'
 */
function backgroundModifier() {
  scene_number = getLastElem(getCookieValue("scene_number"));
  img_path = getSceneBackgroundById(parseInt(scene_number));
  document.body.style.cursor = "default";
  let elem = document.getElementById('html');
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
 * @param {*} cname
 * @param {*} cook
 * @returns : Beginning index of the cookie cname. -1 if not exist
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
 * @returns : Value of cookie cname. "" if not exist.
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

// ---------------------------------------- Resize ----------------------------------------

/**
 * Functions to execute when resizing the window size
 */
function resize(){
  setWindowsValues();
  printOpeningText();
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
 * @returns : void
 */
function changeCursor(event) {
  let X = event.clientX;
  let Y = event.clientY;
  if (isOnZone(X, Y)[0] >= 0 || isOnBackZone(X,Y)[0] || isOnDigicodeZone(X,Y)[0]!=-1 || isOnGifZone(X,Y)!=-1 || isOnObjectZone(X,Y)[0]!=-1) {
    document.body.style.cursor = 'pointer';
    return;
  }
  document.body.style.cursor = 'default';
}

// ------------------------------------- Change scene -------------------------------------

/**
 * Fades in the screen and moves to a new scene
 * @param {Event} event (ignored)
 * @param {string} html path of page to go to
 * @param {number} id id of scene to go to
 * @param {boolean} back if the changeScene load a backclickZone
 */
function changeScene(event, html, id, back) {
  event.preventDefault();
  $("#fade").fadeIn(FADE_IN_TIME, () => {
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
            lst = removeLastElem(lstSceneNumber);
            document.cookie = "scene_number=" + lst + ";";
        }
      }else{
        if(getLastElem(lstSceneNumber)==scene_number){
            document.cookie = "scene_number=" + lstSceneNumber + "," + id + ";";
        }
      }
      document.location.href = html;
  })
};

// -------------------------------- Get/Remove last element -------------------------------

/**
 * Remove the last element from a string of this form "1,2,3,4"
 * @param {String} lst the string you want to remove the last element
 * @returns : list without the last element
*/
function removeLastElem(lst){
    let len = lst.length;
    while(lst[len] !=","){
        len = len - 1;
    }
    return lst.substring(0,len);
}

/**
 * Get the last element from a string of this form "1,2,3,4"
 * @param {String} lst the string you want to get the last element
 * @returns : Last element of the list
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
  const X = event.clientX;
  const Y = event.clientY;
  verifyClickZone(X,Y);
  verifyBackZone(X,Y);
  verifyDigicode(X,Y);
  verifyObject(X,Y);
  verifyGif(X,Y);
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
    changeScene(event, "ping.html", resClickZone[0], false);
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
    let sId = 0;
    changeScene(event, "ping.html", sId, true);
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
      playSoundText(resDigi[1]);
      if(resDigi[0][0] =="Validate"){
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
          console.log(buffer);
      }
  }
  if(bool){
    let sId = 0;
    sId = digicodeClickZone[digicodeClickZone.length-1]
    sId = sId[sId.length-1];
    changeScene(event, "ping.html", sId, false);
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
    changeScene(event, "ping.html", sId, false);
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
        while(first || gifClickZone[resGif].id[2][currentFrame] == 0){
          let newFrame = (currentFrame + 1) % gifClickZone[resGif].id[0];
          gifOnScene[resGif].move_to(newFrame);
          currentFrame = gifOnScene[resGif].get_current_frame();
          first = false;
        }
        if(areGifWellSet()){
              changeScene(event, "ping.html", gifClickZone[resGif].id[3] , false);
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
//                                    ***Digicode functions***
// ========================================================================================

/**
* Implements the validation behavior of a digicode click zone
* @returns : if the code is the right code
**/

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

/**
* Implements the deleting behavior of a digicode click zone
* @returns : void
**/
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

/**
* Check if all the gifs are set to the right frame.
* @returns : if the Gif code is the right code
**/
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
* Display the objects on the scene
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
      let puzzlePieces = getPuzzlepieces(id);
      let diffX;
      let diffY;
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
      let i;
      for (i = 0; i < puzzlePieces.length; i++) {
        var img = document.createElement("IMG");
        img.id = "draggable" + i;
        let top = Math.floor(Math.random() * 65) / 100 * windowsValues[3] * windowsValues[6];
        let left = Math.floor(Math.random() * 65) / 100 * windowsValues[2] * windowsValues[6];
        img.style.position = "absolute";
        img.style.top = top + "px";
        img.style.left = left + "px";
        img.width = puzzlePieces[i].Size[0] * windowsValues[2] * windowsValues[6];
        img.height = puzzlePieces[i].Size[1] * windowsValues[2] * windowsValues[6];
        img.src = "Game/" + puzzlePieces[i].Image;
        puzzleImagesZone.appendChild(img);
      }
      var script = document.createElement("script");
      var scriptCode = "$( function() {\n";
      for (i = 0; i < puzzlePieces.length; i++) {
        scriptCode += "$( \"#draggable" + i + "\" ).draggable({ revert: \"invalid\" });\n";
      }
      scriptCode += " } );";
      script.innerHTML = scriptCode;
      document.body.appendChild(script);
      diffX=[];
      diffY=[];
      var delta = 0.05;
      let originX = windowsValues[4] + puzzlePieces[0].Pos[0] * windowsValues[2] * windowsValues[6];
      let originY = windowsValues[5] + puzzlePieces[0].Pos[1] * windowsValues[3] * windowsValues[6];
      let imgX;
      let imgY;
      let minX;
      let maxX;
      let minY;
      let maxY;
      for (i = 1; i < puzzlePieces.length; i++) {
        imgX = windowsValues[4] + puzzlePieces[i].Pos[0] * windowsValues[2] * windowsValues[6];
        imgY = windowsValues[5] + puzzlePieces[i].Pos[1] * windowsValues[3] * windowsValues[6];
        minX = imgX - originX - delta * windowsValues[2] * windowsValues[6];
        maxX = imgX - originX + delta * windowsValues[2] * windowsValues[6];
        minY = imgY - originY - delta * windowsValues[3] * windowsValues[6];
        maxY = imgY - originY + delta * windowsValues[3] * windowsValues[6];
        diffX.push([minX,maxX]);
        diffY.push([minY,maxY]);
      }
    }
    displayPuzzleImage();
    window.addEventListener("resize", displayPuzzleImage, false);
    const transition = getTransitionByID(getTransitions(),puzzle[1]);
    const idTransition = getLastNumberTransition(transition.Transition.SceneToScene.To);
    window.addEventListener("mouseup", verify, false);
    window.addEventListener("touchend", verify, false);
      function verify(){
        let currentdiffX = [];
        let currentdiffY = [];
        let currentOriginX = parseInt(document.getElementById("draggable"+0).x) * windowsValues[6];
        let currentOriginY = parseInt(document.getElementById("draggable"+0).y) * windowsValues[6];
        let result = true ;
        let currentX;
        let currentY;
        for (var i = 1; i < puzzlePieces.length; i++) {
          currentX = parseInt(document.getElementById("draggable" + i).x) * windowsValues[6];
          currentY = parseInt(document.getElementById("draggable" + i).y) * windowsValues[6];
          if (!((currentX - currentOriginX) >= diffX[i-1][0] && (currentX - currentOriginX) <= diffX[i-1][1])){
            result = false;
          }
          if (!((currentY - currentOriginY) >= diffY[i-1][0] && (currentY - currentOriginY) <= diffY[i-1][1])){
            result = false;
          }
        }
      if (result) {
        changeScene(event, "ping.html", idTransition, false);
      }
    }
  }else if(puzzle[0] == "Gif"){
      const scene = getSceneByID(id);
      let gifs = scene.Gifs;
      let clickz=[];
      let currentGif = [];
      let img;
      let gif;
      const ctx = canvas.getContext("2d");
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
          gifl.load(function(){
              gifOnScene.push(gifl);
          });
      }
   }
}
