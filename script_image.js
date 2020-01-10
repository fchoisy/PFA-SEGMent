'use strict';

const FADE_OUT_TIME = 1500;
const FADE_IN_TIME = 1500;

let img_path;
let clickZones = [];
let backClickZones = [];
let scene_number;
let imgSize = [];
let digicodeClickZone = [];
let buffer = "";
let windowsValues;

window.onload = initialisation();

function resize(){
  console.log("resize");
  printOpeningText();
  setWindowsValues();
  loadObjects();
}

/**
 * Function to be called when scene is opened
 */
function initialisation() {
    //document.getElementById("canvas").height = window.innerHeight;
    //document.getElementById("canvas").width = window.innerWidth;
    scene_number = getLastElem(getCookieValue("scene_number"));
    //let isback = getCookieValue("isback");
    //if(!(isback == "true")){
    backgroundModifier();
    //}
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
  //let elem = document.getElementById('backg');
  //elem.setAttribute("width",window.innerWidth);
  //elem.setAttribute("height",window.innerHeight);
  //console.log(document.cookie);
  scene_number = getLastElem(getCookieValue("scene_number"));
  img_path = getSceneBackgroundById(parseInt(scene_number));
  document.body.style.cursor = "default";
  //elem.setAttribute("src",img_path);
  //console.log(img_path);
  let elem = document.getElementById('html');
  elem.style.backgroundImage = "url(" + img_path + ")";
  // elem.innerHTML = "html {height:100%;margin:0;padding:0;background:url(" + img_path +") no-repeat center fixed;background-color: black;-webkit-background-size: cover;background-size: contain;}"
  //return(elem.backgroundImage.width,elem.backgroundImage.height);
};

/**
 * Store the values of the window's width, height, image's width, height,
 * the dx (in pixels), the dy (in pixels), the scale of the resized image
 * into an array named windowsValues
 */
function setWindowsValues(){
  let winWidth=parseInt(window.innerWidth);
  let winHeight=parseInt(window.innerHeight);
  //console.log(imgSize);
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


/**
 * Initializes the global array 'clickZones'
 */
function clickzone() {
  scene_number = getLastElem(getCookieValue("scene_number"));
  clickZones = getClickZonesByScenesId(scene_number,false);
  backClickZones = getClickZonesByScenesId(scene_number,true);
  //if(!(backClickZones.length == 0)){
    //displayBackClickImage(backClickZones[0]);

  //}
  // let x1,x2,y1,y2;
  // for (let i=0;i<nb_zone;i++){
  //     x1=getCookieValue("coor_click_x1_"+i);
  //     x2=getCookieValue("coor_click_x2_" + i);
  //     y1=getCookieValue("coor_click_y1_" + i);
  //     y2=getCookieValue("coor_click_y2_" + i);
  //     let zone = new clickZone(parseFloat(x1),parseFloat(y1),parseFloat(x2),parseFloat(y2),);
  //     clickZones.push(zone);
  // }
  // x1 = parseInt(parseFloat(x1)*500);
  // y1 = parseInt(parseFloat(y1)*500);
  // x2 = parseInt(parseFloat(x2)*500);
  // y2 = parseInt(parseFloat(y2)*500);
}

//function displayBackClickImage(backClick=backClickZones[0]){
/*function displayBackClickImage(){
  if(!(backClickZones.length == 0)){
    let backClick=backClickZones[0];
    var canvas = document.getElementById("canvas");
    canvas.width  = windowsValues[0];
    canvas.height = windowsValues[1];
    var ctx = canvas.getContext('2d');
    var img = new Image();
    img.onload = function() {
      ctx.drawImage(img, windowsValues[4] + (backClick.x1 * windowsValues[2] * windowsValues[6]), windowsValues[5]+ (backClick.y1 * windowsValues[3] * windowsValues[6]), (backClick.x2 - backClick.x1) * windowsValues[2] * windowsValues[6], (backClick.y2-backClick.y1) * windowsValues[3] * windowsValues[6]);
    };
    img.src = "Game/" + backClick.image;
  }
}*/

function loadObjects(){
  let scene = getSceneByID(scene_number);
  let transitions = getTransitions();
  let objects = getObjects(scene);
  console.log(objects);

  setWindowsValues();
  let objectsZone = document.getElementById("objects");
  objectsZone.innerHTML = "";

  for (var i = 0; i < objects.length; i++) {
    displayObject(objects[i]);
  }
}

function displayObject(object){
  
  var canvas = document.getElementById("canvas");
  canvas.style.position = "absolute";
  canvas.width  = windowsValues[0];
  canvas.height = windowsValues[1];
  var ctx = canvas.getContext('2d');
  var img = new Image();
  console.log(object);
  img.onload = function() {
    ctx.drawImage(img, windowsValues[4] + (object.Pos[0] * windowsValues[2] * windowsValues[6]), windowsValues[5]+ (object.Pos[1] * windowsValues[3] * windowsValues[6]), object.Size[0] * windowsValues[2] * windowsValues[6], object.Size[1] * windowsValues[2] * windowsValues[6]);
  };
  img.src = "Game/" + object.Image;
}

/*
* The function parse the different information of the JSON according to the puzzle type
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
      //console.log(puzzleImagesZone);
      let i;
      for (i = 0; i < puzzlePieces.length; i++) {
        var img = document.createElement("IMG");
        img.id = "draggable" + i;
        let top = Math.floor(Math.random() * 65) / 100 * windowsValues[3] * windowsValues[6];
        let left = Math.floor(Math.random() * 65) / 100 * windowsValues[2] * windowsValues[6];
        //console.log(top,left);
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
      function verify(){
        let currentdiffX = [];
        let currentdiffY = [];
        let currentOriginX = parseInt(document.getElementById("draggable"+0).x);
        let currentOriginY = parseInt(document.getElementById("draggable"+0).y);
        let result = true ;
        let currentX;
        let currentY;
        for (var i = 1; i < puzzlePieces.length; i++) {
          currentX=parseInt(document.getElementById("draggable" + i).x);
          currentY=parseInt(document.getElementById("draggable" + i).y);
          //console.log(currentX - currentOriginX);
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

  }
}

/**
 * Initializes the global field 'imgSize'
 */
function imgsize(){
  scene_number = getLastElem(getCookieValue("scene_number"));
  imgSize = getImageSizeByID(scene_number);
}

/**
 * Check wether a mouse click is inside a click zone
 * and launches 'changeScene' if it is
 * @param {MouseEvent} event
 */
function verifyClick(event) { // NOTE : make separate functions for each case ?
  const X = event.clientX;
  const Y = event.clientY;
  const resClickZone = isOnZone(X,Y); // NOTE : resTab[0] = id pointed scene; resTab[1] = clickzone id
  if (resClickZone[0] >= 0) {
    playSoundClickZone(resClickZone[1]);
    changeScene(event, "ping.html", resClickZone[0], false);
    // if (window.location.pathname == "/pong.html") {
    //   changeScene(event, "ping.html", resClickZone[0], false);
    // } else {
    //   changeScene(event, "pong.html", resClickZone[0], false);
    // }
  }
  const resBackZone = isOnBackZone(X, Y); // NOTE : resTab[0] = is on back zone; resTab[1] = back click zone id
  if(resBackZone[0]){
    playSoundBackClickArea(resBackZone[1]);
    let passedScene = getLastElem(getCookieValue("scene_number"));
    let sId = 0;
    changeScene(event, "ping.html", sId, true);
    // if (window.location.pathname == "/pong.html") {
    //   changeScene(event, "ping.html", sId, true);
    // } else {
    //   changeScene(event, "pong.html", sId, true);
    // }
  }
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
    // if (window.location.pathname == "/pong.html") {
    //   sId = digicodeClickZone[digicodeClickZone.length-1]
    //   sId = sId[sId.length-1];
    //   changeScene(event, "ping.html", sId, false);
    // } else {
    //   sId = digicodeClickZone[digicodeClickZone.length-1]
    //   sId = sId[sId.length-1];
    //   changeScene(event, "pong.html", sId, false);
    // }
  }
}

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

/*
* Implements the replacing behavior of a digicode click zone
*/
function changingBuffer(digi){
    buffer = digi;
}

/*
* Implements the adding behavior of a digicode click zone
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

/**
 * Checks wether the point of coordinates (X,Y) is inside a click zone
 * @param {coordinate} X
 * @param {coordinate} Y
 *
 * @returns id of the corresponding click zone, -1 if there is none
 */
function isOnZone(X,Y){
    //console.log(X,Y);
    X = (X-windowsValues[4])/(windowsValues[0]-2*windowsValues[4]);
    Y = (Y-windowsValues[5])/(windowsValues[1]-2*windowsValues[5]);
    let resTab = [];
    //console.log(X,Y);

/*
    let width = 0;
    let height = 0;
    let Dx = 0;
    let Dy = 0;

    if (parseInt(window.innerWidth) >= imgSize[0].width){
	width = imgSize[0].width;
	Dx = (parseInt(window.innerWidth) - imgSize[0].width) / 2;
    }
    else
	width = parseInt(window.innerWidth);

    if (parseInt(window.innerHeight) >= imgSize[0].height){
	height = imgSize[0].height;
	Dy = (parseInt(window.innerHeight) - imgSize[0].height) / 2;
    }
    else
	height = parseInt(window.innerHeight);

    X = (X - Dx) / width;
    Y = (Y - Dy) / height;

    */
    //console.log(clickZones);
    let len = clickZones.length;
    for(let i=0;i<len;i++){
        if(X>=clickZones[i].x1 && X<=clickZones[i].x2 && Y>=clickZones[i].y1 && Y<=clickZones[i].y2){
            resTab[0] = clickZones[i].id; // NOTE : resTab[0] = id pointed scene; resTab[1] = clickzone id
            resTab[1] = clickZones[i].clickzoneId;
            return resTab;
        }
    }
    resTab[0] = -1
    resTab[1] = -1
    return resTab;
}

/*
* Check if the mouse cursor is on a backclick zone. If so, return true
*/
function isOnBackZone(X,Y){
    let resTab = [];
    X = (X-windowsValues[4])/(windowsValues[0]-2*windowsValues[4]);
    Y = (Y-windowsValues[5])/(windowsValues[1]-2*windowsValues[5]);

    let len = backClickZones.length;
    for(let i=0;i<len;i++){
        if(X>=backClickZones[i].x1 && X<=backClickZones[i].x2 && Y>=backClickZones[i].y1 && Y<=backClickZones[i].y2){
            resTab[0] = true; // NOTE : resTab[0] = is on back zone; resTab[1] = back click zone id
            resTab[1] = backClickZones[i].bckclickId;
            return resTab;
        }
    }
    resTab[0] = false;
    resTab[1] = -1;
    return resTab;
}

/*
* Check if the mouse cursor is on a digicodeclick zone. If so, return true
*/
function isOnDigicodeZone(X,Y){
  let resTab = [];
  X = (X-windowsValues[4])/(windowsValues[0]-2*windowsValues[4]);
  Y = (Y-windowsValues[5])/(windowsValues[1]-2*windowsValues[5]);
  let len = digicodeClickZone.length - 1;
  for(let i=0;i<len;i++){
      if(X>=digicodeClickZone[i].x1 && X<=digicodeClickZone[i].x2 && Y>=digicodeClickZone[i].y1 && Y<=digicodeClickZone[i].y2){
          resTab[0] = digicodeClickZone[i].id; // NOTE : resTab[0] = value of text; resTab[1] = clickzone id
          resTab[1] = digicodeClickZone[i].clickzoneId;
          return resTab;
      }
  }
  resTab[0] = -1;
  resTab[1] = -1;
  return resTab;
}

/**
 * Changes the mouse pointer icon in reponse to an event
 * @param {MouseEvent} event
 */
function changeCursor(event) {
  let X = event.clientX;
  let Y = event.clientY;
  if (isOnZone(X, Y)[0] >= 0 || isOnBackZone(X,Y)[0] || isOnDigicodeZone(X,Y)[0]!=-1) {
    document.body.style.cursor = 'pointer';
    return;
  }
  document.body.style.cursor = 'default';
}

/**
 * Returns the index of cookie whose name is 'cname' in 'cook'
 * @param {*} cname
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

/**
 * Fades in the screen and moves to a new scene
 * @param {Event} event (ignored)
 * @param {string} html path of page to go to
 * @param {number} id id of scene to go to
 */
function changeScene(event, html, id, back) {
  event.preventDefault();
  $("#fade").fadeIn(FADE_IN_TIME, () => {
    let cook = document.cookie;
    let i = 0;
    while (cook[i] != ";" && i < cook.length) {
      i = i + 1;
    }
    // var stri = document.cookie.substring(i,document.cookie.length);
    // console.log("stri : " + stri);
    // document.cookie = "json=;expires=Thu, 01 Jan 1970 00:00:01 GMT"
    // //document.cookie = "scene_number=;expires=Thu, 01 Jan 1970 00:00:01 GMT"
    // console.log(document.cookie);
    // console.log("Ho " + document.cookie);
    let lstSceneNumber = getCookieValue("scene_number")
    if(lstSceneNumber.length > 0 ){
        lstSceneNumber = lstSceneNumber.substring(0,lstSceneNumber.length);
    }
    else{
        lstSceneNumber = "";
    }
    // if(getCookieValue("isback") == "false;" && back){
    //     let lst;
    //     if(getLastElem(lstSceneNumber)==scene_number){
    //         lst = removeLastElem(lstSceneNumber);
    //         document.cookie = "scene_number=" + lst + ";";
    //         document.cookie = "isback=" + true +";";
    //     }
    //     document.location.href = html;
    //     return;
    // }
    // else{
      if(back){
        let lst;
        if(getLastElem(lstSceneNumber)==scene_number){
            lst = removeLastElem(lstSceneNumber);
            document.cookie = "scene_number=" + lst + ";";
            //document.cookie = "isback=" + "falsesecond" +";";
        }
      }else{
        if(getLastElem(lstSceneNumber)==scene_number){
            //document.cookie = "isback=" + false +";";
            document.cookie = "scene_number=" + lstSceneNumber + "," + id + ";"; // + stri);
        }
      }
    //}
    //
    // $.getJSON( GameURL, function(data) {
    //   var scene = getSceneByID(data,id);
    //   var img = getSceneImage(scene);
    //   var clickZones = getClickZones(scene);
    //   const nbClickZones = clickZones.length;
    //   document.cookie = "nb_click_zones=" + nbClickZones + ";";
    //   for(var i = 0; i < nbClickZones; i++){
    //     var zones = clickZones[i];
    //     document.cookie = "coor_click_x1_" + i  + "=" + zones.x1 + ";";
    //     document.cookie = "coor_click_y1_" + i  + "=" + zones.y1 + ";";
    //     document.cookie = "coor_click_x2_" + i  + "=" + zones.x2 + ";";
    //     document.cookie = "coor_click_y2_" + i  + "=" + zones.y2 + ";";
    //   }
    //   document.cookie = "bckg_path="+ img +";";


    document.location.href = html;

    // });
  })
};

/**
 * Remove the last element from a string of this form "1,2,3,4"
 * @param {String} lst the string you want to remove the last element
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


window.addEventListener("mousemove", changeCursor, false);
window.addEventListener("click", verifyClick, false);
 window.addEventListener("resize", resize);
