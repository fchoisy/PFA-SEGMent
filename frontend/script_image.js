'use strict';

let img_path;

window.onload = backgroundModifier();

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
