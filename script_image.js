'use strict';

const FADE_OUT_TIME = 1500;
const FADE_IN_TIME = 1500;

let img_path;
let clickZones = [];
let backClickZones = [];
let scene_number;
let imgSize = [];


window.onload = initialisation();

/**
 * Function to be called when scene is opened
 */
function initialisation() {
    scene_number = getLastElem(getCookieValue("scene_number"));
    let isback = getCookieValue("isback");
    if(!(isback == "true")){
      backgroundModifier();
    }
      playSoundScene();
      printOpeningText();
      clickzone();
      imgsize();
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
 * Initializes the global array 'clickZones'
 */
function clickzone() {
  scene_number = getLastElem(getCookieValue("scene_number"));
  clickZones = getClickZonesByScenesId(scene_number,false);
  backClickZones = getClickZonesByScenesId(scene_number,true);
  let len = clickZones.length;
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
function verifyClick(event) {
  const X = event.clientX;
  const Y = event.clientY;
  let sId = isOnZone(X, Y);
  if (sId >= 0) {
    playSoundClickZone(1); // NOTE : Remplacé en dur, changer "1" par l'ID de la clickzone
    if (window.location.pathname == "/pong.html") {
      changeScene(event, "ping.html", sId, false);
    } else {
      changeScene(event, "pong.html", sId, false);
    }
  }
  if(isOnBackZone(X, Y)){
    playSoundBackClickArea(1); // NOTE : Remplacé en dur, changer "1" par l'ID de la clickzone
    let passedScene = getLastElem(getCookieValue("scene_number"));
    let sId = 0;
    if (window.location.pathname == "/pong.html") {
      changeScene(event, "ping.html", sId, true);
    } else {
      changeScene(event, "pong.html", sId, true);
    }
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
    //console.log("scene "+scene_number);

    let winWidth=parseInt(window.innerWidth);
    let winHeight=parseInt(window.innerHeight);
    let imgWidth=imgSize[0].width;
    let imgHeight=imgSize[0].height;

    let scale;
    let dx=0;
    let dy=0;
    if (imgWidth/winWidth>=imgHeight/winHeight) { //Black borders on the top and the bottom of the window
      scale = 1.0/(imgWidth/winWidth);
      dy = (winHeight-(imgHeight*scale))/2;
    }else{                                        //Black borders on the left and the right of the window
      scale=1.0/(imgHeight/winHeight);
      dx=(winWidth-(imgWidth*scale))/2;
    }

    X = (X-dx)/(winWidth-2*dx);
    Y = (Y-dy)/(winHeight-2*dy);

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
            return clickZones[i].id;
        }
    }
    return -1;
}

function isOnBackZone(X,Y){

    let winWidth=parseInt(window.innerWidth);
    let winHeight=parseInt(window.innerHeight);
    let imgWidth=imgSize[0].width;
    let imgHeight=imgSize[0].height;

    let scale;
    let dx=0;
    let dy=0;
    if (imgWidth/winWidth>=imgHeight/winHeight) { //Black borders on the top and the bottom of the window
      scale = 1.0/(imgWidth/winWidth);
      dy = (winHeight-(imgHeight*scale))/2;
    }else{                                        //Black borders on the left and the right of the window
      scale=1.0/(imgHeight/winHeight);
      dx=(winWidth-(imgWidth*scale))/2;
    }

    X = (X-dx)/(winWidth-2*dx);
    Y = (Y-dy)/(winHeight-2*dy);

    let len = backClickZones.length;
    for(let i=0;i<len;i++){
        if(X>=backClickZones[i].x1 && X<=backClickZones[i].x2 && Y>=backClickZones[i].y1 && Y<=backClickZones[i].y2){
            return true;
        }
    }
    return false;
}

/**
 * Changes the mouse pointer icon in reponse to an event
 * @param {MouseEvent} event
 */
function changeCursor(event) {
  let X = event.clientX;
  let Y = event.clientY;
  if (isOnZone(X, Y) >= 0 || isOnBackZone(X,Y)) {
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
    if(getCookieValue("isback") == "false;" && back){
        const lst = removeLastElem(lstSceneNumber);
        document.cookie = "scene_number=" + lst + ";";
        document.cookie = "isback=" + true +";";
        document.location.href = html;
        return;
    }
    else{
      if(back){
        const lst = removeLastElem(lstSceneNumber);
        document.cookie = "scene_number=" + lst + ";";
        document.cookie = "isback=" + "falsesecond" +";";
      }
      else{
        document.cookie = "isback=" + false +";";
        document.cookie = "scene_number=" + lstSceneNumber + "," + id + ";"; // + stri);
      }
    }
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

function removeLastElem(lst){
    let len = lst.length;
    console.log(lst);
    while(lst[len] !=","){
        len = len - 1;
    }
    return lst.substring(0,len);
}

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
