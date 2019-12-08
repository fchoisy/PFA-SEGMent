'use strict';

let img_path;
let clickZones = [];
let imgSize = [];

class clickZone {
  constructor(x1,y1,x2,y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }
}

window.onload = initialisation();

function initialisation(){
    backgroundModifier();
    clickzone();
    img_Size();
}

function backgroundModifier(){
  //let elem = document.getElementById('backg');
  //elem.setAttribute("width",window.innerWidth);
  //elem.setAttribute("height",window.innerHeight);
  //console.log(document.cookie);
  img_path = getCookieValue("bckg_path");
  var image = new Image();

  console.log(img_path);
  //elem.setAttribute("src",img_path);
  //console.log(img_path);
  let elem = document.getElementById('style');
  elem.innerHTML = "html {height:100%;margin:0;padding:0;background:url(" + img_path +") no-repeat center fixed;background-color: black;-webkit-background-size: cover;background-size: contain;}"
  console.log(document.cookie);
  //return(elem.backgroundImage.width,elem.backgroundImage.height);
};

function clickzone(){
    let nb_zone = getCookieValue("nb_click_zones");
    nb_zone = parseInt(nb_zone);
    let x1,x2,y1,y2;
    for (let i=0;i<nb_zone;i++){
        x1=getCookieValue("coor_click_x1_"+i);
        x2=getCookieValue("coor_click_x2_" + i);
        y1=getCookieValue("coor_click_y1_" + i);
        y2=getCookieValue("coor_click_y2_" + i);
        let zone = new clickZone(parseFloat(x1),parseFloat(y1),parseFloat(x2),parseFloat(y2));
        clickZones.push(zone);
    }
    x1 = parseInt(parseFloat(x1)*500);
    y1 = parseInt(parseFloat(y1)*500);
    x2 = parseInt(parseFloat(x2)*500);
    y2 = parseInt(parseFloat(y2)*500);
}


function img_Size(){
    var w = getCookieValue("img_width");
    var h = getCookieValue("img_height");
    w = parseInt(w);
    h = parseInt(h);
    imgSize.push(w,h);
}



function verifyClick(event){
    //console.log(event);
    const X = event.clientX;
    const Y = event.clientY;
    if(isOnZone(X,Y)>=0){
        console.log("Coucou");
    }
}

function isOnZone(X,Y){
    let width = 0;
    let delta = 0;
    if (parseInt(window.innerWidth) >= imgSize[0]){
	width = imgSize[0]; // + (parseInt(window.innerWidth) - imgSize[0]) / 2;
	delta = (parseInt(window.innerWidth) - imgSize[0]) / 2;
    }
    else
	width = parseInt(window.innerWidth);
    let height = parseInt(window.innerHeight);
    X = X / (width+delta);
    Y = Y / height;
    let len = clickZones.length;
    for(let i=0;i<len;i++){
        if(X>=clickZones[i].x1 && X<=clickZones[i].x2 && Y>=clickZones[i].y1 && Y<=clickZones[i].y2){
            return i;
        }
    }
    return -1;
}

function changeCursor(event){
    let X = event.clientX;
    let Y = event.clientY;
    if(isOnZone(X,Y)>=0){
        document.body.style.cursor = 'pointer';
        return;
    }
    console.log("Hey");
    document.body.style.cursor = 'default';
}


function getIndexName(cname,cook){
  var toSearch =cname +"=";
  var i = 0;
  var begin_chaine = 0;
  while (i<cook.length){
      if(i==begin_chaine && cook[i]==" "){
        begin_chaine += 1;
      }
      if(cook[i] == "="){
          var str = cook.substring(begin_chaine,i+1);
          if(toSearch == str){
              return i;
          }
      }
      if(cook[i] == ";"){
        begin_chaine = i+1;
      }
      i += 1;
  }
  return -1;
}

function getCookieValue(cname){
  const cook = document.cookie;
  var ind = getIndexName(cname,cook);
  var i = ind;
  var j = 0;
  while(j == 0 && i<cook.length){
    if(cook[i] == ";"){
      j = i;
    }
    i = i+1;
  }
  j=i
  return cook.substring(ind+1,j);
}
window.addEventListener("click",verifyClick,false);
window.addEventListener("mousemove",changeCursor,false);
