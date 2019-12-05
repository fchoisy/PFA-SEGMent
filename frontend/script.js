'use strict'; // Turns on "strict mode", preventing use of non-declared variables

let json;




function startScene(event){
  console.log("coucou");
  // let json = await returnJson();
  let json = returnJson();
  console.log("salut");
  event.preventDefault();
  document.cookie = "scene_number=" + getIDScene(getInitialScene()) + ";"
  console.log(json);
  document.cookie = "json=" + json +";";
  document.location.href = 'ping.html';
};
