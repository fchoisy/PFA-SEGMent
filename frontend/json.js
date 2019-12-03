'use strict'; // Turns on "strict mode", preventing use of non-declared variables

const GameURL = "./Game/game.segment";
var GameJson;

function loadJson(){
  $.ajax({
    type: 'GET',
    url: GameURL,
    async: false,
    dataType: 'json',
    success: function (data) {
      GameJson=data;
    }
  });
  console.log(GameJson);
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

function getSceneTextBySceneId(scene_id){ // Returns the text starting the scene which id is "SceneId"
  const scene = getSceneByID(scene_id);
  const text = scene.StartText;
  return text;
}

function getSceneTextAreasBySceneId(scene_id){ // Returns the text in text areas of the scene which id is "SceneId"
  const scene = getSceneByID(scene_id);
  const text_areas = [];
  for(var i = 0; i < scene.TextAreas.length; i++){
    text_areas[i] = scene.TextAreas[i].Text;
  }
  return text_areas;
}
