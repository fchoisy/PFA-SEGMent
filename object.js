/**
* object.js
*
* functions related to load and display every object of the scene, except puzzle pieces
*/



/*
* Gets all objects and display those
*/
function loadObjects(){
  let scene = getSceneByID(scene_number);
  let transitions = getTransitions();
  let objects = getObjects(scene);
  setWindowsValues();
  if(diaryOnScene){
      let canvas = document.getElementById("canvas");
      canvas.style.position = "absolute";
      canvas.width  = windowsValues[0];
      canvas.height = windowsValues[1];
      var ctx = canvas.getContext('2d');
      var img = new Image();
      img.onload = function() {
          ctx.drawImage(img, windowsValues[4] + (0.92 * windowsValues[2] * windowsValues[6]), windowsValues[5]+ (0.97 * windowsValues[3] * windowsValues[6])-0.05 * windowsValues[2] * windowsValues[6], 0.05 * windowsValues[2] * windowsValues[6], 0.05 * windowsValues[2] * windowsValues[6]);
      };
      img.src =  "diaryicon.png";
  }
  for (var i = 0; i < objects.length; i++) {
    if (!objects[i].PuzzlePiece){
      displayObject(objects[i], transitions, scene);
    }
  }
}


/**
* Display the object on the scene
* @param {Object} object
* @param {Transistion[]} transitions
* @param {Int} scene
*/
function displayObject(object,transitions,scene){
  var canvas = document.getElementById("canvas");
  canvas.style.position = "absolute";
  canvas.width  = windowsValues[0];
  canvas.height = windowsValues[1];
  var ctx = canvas.getContext('2d');
  var img = new Image();
  img.onload = function() {
    ctx.drawImage(img, windowsValues[4] + (object.Pos[0] * windowsValues[2] * windowsValues[6]), windowsValues[5]+ (object.Pos[1] * windowsValues[3] * windowsValues[6]), object.Size[0] * windowsValues[2] * windowsValues[6], object.Size[1] * windowsValues[2] * windowsValues[6]);
  };
  img.src = getGameFolderURL() + object.Image;

  for (var i = 0; i < transitions.length; i++) {
    if(transitions[i].Transition.ObjectToScene != undefined) {
      if (transitions[i].Transition.ObjectToScene.From == object.Path) {
        let heightPourcentage = object.Size[1] * scene.ImageSize[0] / scene.ImageSize[1];
        let transitionSceneId = getLastNumberTransition(transitions[i].Transition.ObjectToScene.To);
        let clickZoneId = object.id
        let objectClickZone = new ClickZone(object.Pos[0],object.Pos[1],object.Size[0] + object.Pos[0], object.Pos[1] + heightPourcentage ,transitionSceneId,clickZoneId);
        objectClickZones.push(objectClickZone);
      }
    }
  }
}
