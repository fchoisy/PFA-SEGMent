'use strict';

let img_path;

function backgroundModifier(){
  var start = document.cookie.indexOf('bckg_path:'); //Get the location of the cookie value
  var stop = document.cookie.indexOf(';'); //Get the end of the cookie value

  var path = document.cookie.substring(stop,start+10);
  document.body.style.backgroundImage = "url('Game/Scenes/PorteDepart.png')";
  console.log(document.body.style.backgroundImage);
};
