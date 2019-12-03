'use strict'; // Turns on "strict mode", preventing use of non-declared variables

var GameJson = game;

function loadJson(){
  console.log(game);
}


function getScenes(){ //Returns all the scenes from the json file
  var json = GameJson;
  console.log(GameJson);
  console.log(json);
  return json.Document.Process.Scenes;
}

function getIDScene(scene){
  return scene.id;
}

function getSceneByID(id){ // returns the scene number id. Note : les scènes commencent à id = 0
  var json = GameJson;
  const scenes = getScenes(json);
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

function getClickZones(scene){ //Returns array where each element contains the four positions of the four edges of the click zone, relatively to the image size.
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
      let currentArea = areas[i];
      area_arrays.push(
        		{
      		    'x1': currentArea.Pos[0],
      		    'y1': currentArea.Pos[1],
      		    'x2': currentArea.Size[0] + currentArea.Pos[0],
      		    'y2': currentArea.Size[1] + currentArea.Pos[1]
        		}
          );
        console.log(area_arrays[i]);
        console.log("in for : " + i);
      }
    console.log(area_arrays);
    return area_arrays;
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
