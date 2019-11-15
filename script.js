'use strict';

function showInitialScene(event){
  event.preventDefault();
  console.log("call success");
  const testJSON = {"toto" : 1,"titi" : 2,"tutu" : 3};
  console.log(testJSON);
  const json = getJsonFile();
  console.log(json)
}

function getJsonFile(){
  var json = $.getJSON("Game/game.segment");
  return json
}
