'use strict';

let img_path;

window.onload = LoadScene();

function LoadScene(){
  backgroundModifier();
  clickZones();
}

function backgroundModifier(){
  //let elem = document.getElementById('backg');
  //elem.setAttribute("width",window.innerWidth);
  //elem.setAttribute("height",window.innerHeight);
  //console.log(document.cookie);
  img_path = getCookieValue("bckg_path");
  console.log(img_path);
  //elem.setAttribute("src",img_path);
  //console.log(img_path);
  let elem = document.getElementById('style');
  elem.innerHTML = "html {margin:0;padding:0;background:url(" + img_path +") no-repeat center fixed;background-color: black;-webkit-background-size: cover;background-size: contain;}"
  console.log(document.body.style.backgroundImage);
};

function clickZones(){
  var parent = document.getElementById('clickZones');
  // parent.insertAdjacentHTML('afterbegin', '<span>Text</span>');
  const length = parseInt(getCookieValue("nb_click_zones"));
  console.log(length);
  const strx1 = "coor_click_x1_";
  const stry1 = "coor_click_y1_";
  const strx2 = "coor_click_x2_";
  const stry2 = "coor_click_y2_";
  for(var i = 0; i < length; i++){
    var sx1 = strx1 + i;
    var sy1 = stry1 + i;
    var sx2 = strx2 + i;
    var sy2 = stry2 + i;
    var x1 = parseFloat(getCookieValue(sx1));
    var y1 = parseFloat(getCookieValue(sy1));
    var x2 = parseFloat(getCookieValue(sx2));
    var y2 = parseFloat(getCookieValue(sy2));
    console.log(x1); // Note : j'ai pas reussi a avoir la largeur et longueur de la fenêtre dans script.js, donc les valeurs sont trop petites
    console.log(x2);
    console.log(y1);
    console.log(y2);
    var area = '<area shape="rect" coords="'+ x1 + "," + y1 + "," + x2 + "," + y2 + '"href="" target="" alt="" />';
    console.log(area);
    parent.insertAdjacentHTML('afterbegin', area);
  }
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
