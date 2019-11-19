'use strict';

let img_path;

function backgroundModifier(){
  console.log("toto");
  var elem = document.getElementById("style");
  console.log(elem);
  elem.innerHTML = "html {margin:0;padding:0;background:url(" +'Game/Scenes/PorteDepart.png' +") no-repeat center fixed;-webkit-background-size: cover;background-size: cover;}"
  console.log(document.body.style.backgroundImage);
};
