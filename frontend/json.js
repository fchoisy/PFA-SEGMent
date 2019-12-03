'use strict'; // Turns on "strict mode", preventing use of non-declared variables

const GameURL = "../Game/game.segment";
var GameJson;

class clickZone {
  constructor(x1,y1,x2,y2,id) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.id = id;
  }
}

function loadJson(){
  event.preventDefault();
  $.getJSON( GameURL, function(data) {
    GameJson = data;
    document.location.href = 'display_picture.html';
};

function getScenes(){ //Returns all the scenes from the json file
  return GameJson.Document.Process.Scenes;
}

function getSceneByID(id){ // returns the scene number id. Note : les scènes commencent à id = 0
  const scenes = getScenes(GameJson);
  console.log(scenes);
  const length = Object.keys(scenes).length;
  for (var i = 0; i < length; i++){
    if (scenes[i].id == id){
      return scenes[i];
    }
  }
  console.log("Error : Scene " + id + " not found"); // TODO: replace with real error management ?
  return scenes[0];
}

function getSceneImage(scene){ //Returns path of the background image from the scene
  return "../Game/"+scene.Image;
}

function getClickZonesByScenesId(scene){ //Returns array where each element contains the four positions of the four edges of the click zone, relatively to the image size.
    let area_arrays = [];
    let areas = scene.ClickAreas;
    // var i = 0;
    console.log(areas.length);
    console.log(areas);
    // while (i<=areas.length){
    // 	let currentArea = areas[i];
    // 	if (i != areas.length){
    // 	    area_arrays.push(
    //     		{
    //     		    'x1': currentArea.Pos[0],
    //     		    'y1': currentArea.Pos[1],
    //     		    'x2': currentArea.Size[0] + currentArea.Pos[0],
    //     		    'y2': currentArea.Size[1] + currentArea.Pos[1]
    //     		}
  	//       );
  	//     console.log(area_arrays[i]);
    //     i += 1;
    //     console.log("in if : " + i);
  	//   }
    // }
    for(var i = 0; i < areas.length; i++){
      let clikzone = new clickZone(currentArea.Pos[0],currentArea.Pos[1],currentArea.Size[0] + currentArea.Pos[0],currentArea.Size[1] + currentArea.Pos[1],getPointedScene(currentArea.Metadata.Path));
      let currentArea = areas[i];
      let array = [];
      array.push(clikzone);
    }
      // area_arrays.push(
      //   		{
      // 		    'x1': currentArea.Pos[0],
      // 		    'y1': currentArea.Pos[1],
      // 		    'x2': currentArea.Size[0] + currentArea.Pos[0],
      // 		    'y2': currentArea.Size[1] + currentArea.Pos[1]
      //   		}
      //     );
      //   console.log(area_arrays[i]);
      //   console.log("in for : " + i);
      // }
    console.log(area_arrays);
    return array;
    //return area_arrays;
}

function getPointedScene(path){
    len = scene.Transitions.length();
    for(let i=0;i<len;i++){
        if(scene.Transitions[i].Which == "ClickAreaToScene"){
            let elem = scene.Transitions[i].Transition;
            if(elem.ClickAreaToScene.From == path){
                len = elem.To.length();
                return parseInt(elem.To.substring(len-1,len));
            }
        }
    }
    return -1
}

function getInitialScene(){ // NOTE : different from get_scene_by_id because there is a special type if a scene is a initial scene (i.e SceneType = 1; Final = 2; Other = 0)
  const scenes = getScenes();
  const length = Object.keys(scenes).length;
  for(var i = 0; i < length; i++){
    if(scenes[i].SceneType == 1){
      return scenes[i];
    }
  }
}
