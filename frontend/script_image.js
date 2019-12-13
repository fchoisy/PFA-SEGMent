'use strict';

const FADE_OUT_TIME = 1500;
const FADE_IN_TIME = 1500;

let img_path;
let clickZones = [];
let scene_number;
let imgSize = [];


window.onload = initialisation();

function initialisation() {
    backgroundModifier();
    //playSound('Sounds/Sound.mp3');
    clickzone();
    imgsize();
    $("#fade").fadeOut(FADE_OUT_TIME); // jQuery method
}

function backgroundModifier() {
  //let elem = document.getElementById('backg');
  //elem.setAttribute("width",window.innerWidth);
  //elem.setAttribute("height",window.innerHeight);
  //console.log(document.cookie);
  scene_number = getCookieValue("scene_number");
  img_path = getSceneBackgroundById(parseInt(scene_number));
  document.body.style.cursor = "default";
  //elem.setAttribute("src",img_path);
  //console.log(img_path);
  let elem = document.getElementById('html');
  elem.style.backgroundImage = "url(" + img_path + ")";
  // elem.innerHTML = "html {height:100%;margin:0;padding:0;background:url(" + img_path +") no-repeat center fixed;background-color: black;-webkit-background-size: cover;background-size: contain;}"
  //return(elem.backgroundImage.width,elem.backgroundImage.height);
};

function clickzone() {
  scene_number = getCookieValue("scene_number");
  clickZones = getClickZonesByScenesId(scene_number);
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

function imgsize(){
    scene_number = getCookieValue("scene_number");
    imgSize = getImageSizeByID(scene_number);
}

function verifyClick(event) {
  const X = event.clientX;
  const Y = event.clientY;
  if (isOnZone(X, Y) >= 0) {
    playSoundTest(1); // NOTE : Remplacé en dur, changer "1" par l'ID de la clickzone
    if (window.location.pathname == "/pong.html") {
      changeScene(event, "ping.html", isOnZone(X, Y));
    } else {
      changeScene(event, "pong.html", isOnZone(X, Y));
    }
  }
}

function playSoundTest(clickZoneId){
  var Scene = getSceneByID(scene_number);
  console.log(Scene);
  var clickAreas = getClickAreas(Scene);
  console.log(clickAreas);
  var clickArea = getClickAreaByID(clickAreas,clickZoneId);
  console.log(clickArea);
  var SoundPath = getSoundPath(clickArea);
  playSound(SoundPath);
}

function isOnZone(X,Y){
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
    let len = clickZones.length;
    for(let i=0;i<len;i++){
        if(X>=clickZones[i].x1 && X<=clickZones[i].x2 && Y>=clickZones[i].y1 && Y<=clickZones[i].y2){
            return clickZones[i].id;
        }
    }
    return -1;
}
function changeCursor(event) {
  let X = event.clientX;
  let Y = event.clientY;
  if (isOnZone(X, Y) >= 0) {
    document.body.style.cursor = 'pointer';
    return;
  }
  document.body.style.cursor = 'default';
}

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

function getCookieValue(cname) {
  const cook = document.cookie;
  var ind = getIndexName(cname, cook);
  var i = ind;
  var j = 0;
  while (j == 0 && i < cook.length) {
    if (cook[i] == ";") {
      j = i;
    }
    i = i + 1;
  }
  j = i
  return cook.substring(ind + 1, j);
}

function changeScene(event, html, id) {
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
    document.cookie = "scene_number=" + id + ";"; // + stri);
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


window.addEventListener("mousemove", changeCursor, false);
window.addEventListener("click", verifyClick, false);
