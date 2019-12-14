'use strict'; // Turns on "strict mode", preventing use of non-declared variables

window.onload = initialise();

class clickZone {
  constructor(x1,y1,x2,y2,id) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.id = id;
  }
}

//let GameURL;
var GameJson;
//window.onload = loadJson();

function initialise(){
    var str = window.sessionStorage.getItem("json");
    //console.log(str);
    GameJson = JSON.parse(str);
}

function loadJson(){
  //GameURL = "./Game/game.segment";
  //GameJson = jsonTest;
return new Promise (function(resolve,reject){
  $.ajax({
    type: 'GET',
    url: "../Game/game.segment",
    async: true,
    dataType: 'json',
      success: function (data) {
	  GameJson = data;
	  window.sessionStorage.setItem("json",JSON.stringify(data));
    }
  });});
}

function getSceneBackgroundById(id){
    return getSceneImage(getSceneByID(id));
}

function getScenes(){ //Returns all the scenes from the json file
  var json = GameJson;
  return json.Document.Process.Scenes;
}

function getIDScene(scene){
  return scene.id;
}

function playSound(SoundPath){
  if(SoundPath == ""){
    console.log("Sound not defined !");
  }
  else{
    var audio = new Audio('Game/' + SoundPath);
    audio.loop = false;
    audio.play();
  }
}

function playSoundLoop(SoundPath){
  if(SoundPath == ""){
    console.log("Sound not defined !");
  }
  else{
    var audio = new Audio('Game/' + SoundPath);
    audio.loop = true;
    audio.play();
  }
}

function getSceneByID(id){ // returns the scene number id. Note : les scènes commencent à id = 0
  var json = GameJson;
  const scenes = getScenes(json);
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

function getImageSize(scene){
    let image_size = [];
    image_size.push(
	{
	'width': scene.ImageSize[0],
	'height': scene.ImageSize[1]
	}
    );
    console.log(image_size);
    return image_size;
}

function getImageSizeByID(id){
    return getImageSize(getSceneByID(id));
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

function getClickZonesByScenesId(id){ //Returns array where each element contains the four positions of the four edges of the click zone, relatively to the image size.
    const scene = getSceneByID(id);
    let area_arrays = [];
    let areas = scene.ClickAreas;
    // var i = 0;
    //console.log(areas.length);
    // while (i<=areas.length){
    // 	if (i != areas.length){
    //
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

    /*Commentaires:
    La position de l'image est bien relative par rapport à la taille de l'image.
    Le size est calculé proportionnellement par rapport à la longueur de l'image.
    */
    let array = [];
    for(var i = 0; i < areas.length; i++){
      let currentArea = areas[i];
      let heightPourcentage = currentArea.Size[1] * scene.ImageSize[0] / scene.ImageSize[1];
      //let clickzone = new clickZone(currentArea.Pos[0],currentArea.Pos[1],currentArea.Size[0] + currentArea.Pos[0],currentArea.Size[1] + currentArea.Pos[1],getPointedScene(currentArea.Path));
      let clickzone = new clickZone(currentArea.Pos[0],currentArea.Pos[1],currentArea.Size[0] + currentArea.Pos[0],heightPourcentage + currentArea.Pos[1],getPointedScene(currentArea.Path));
      array.push(clickzone);
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
    return array;
    //return area_arrays;
}


function getClickAreas(scene){
  return scene.ClickAreas;
}

function getClickAreaByID(clickArea,id){
  for (var i = 0; i < clickArea.length; i++) {
    if(clickArea[i].id == id){
      return clickArea[i];
    }
  }
  console.log("clickArea " + id + "not found");
}

//Plays the sound described in the parsed part of JSON element
function getSoundPath(element){
    return element.Sound.Path;
}


function getPointedScene(path){
//     const leng = path.length - 1;
//     let scene = getSceneByID(path.substring(leng,path.length));
    let scene = GameJson.Document.Process;
    let len = scene.Transitions.length;
    for(let i=0;i<len;i++){
        if(scene.Transitions[i].Transition.Which == "ClickAreaToScene"){
            let elem = scene.Transitions[i].Transition;
            if(elem.ClickAreaToScene.From == path){
                len = elem.ClickAreaToScene.To.length - 1;
                return parseInt(elem.ClickAreaToScene.To.substring(len,elem.ClickAreaToScene.To.length));
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
  return cook.substring(ind+1,cook.length-1);
}




let GameJsonTest = {
    "Document": {
        "ObjectName": "SEGMentDocument",
        "Process": {
            "Components": [
            ],
            "Metadata": {
                "Color": "Base1",
                "Comment": "",
                "Label": "",
                "ScriptingName": "Process.0"
            },
            "ObjectName": "SEGMentProcess",
            "Scenes": [
                {
                    "Ambience": {
                        "Path": "",
                        "Range": 0,
                        "Repeat": true,
                        "Volume": 0.7
                    },
                    "BackClickAreas": [
                        {
                            "Components": [
                            ],
                            "Metadata": {
                                "Color": "Base1",
                                "Comment": "",
                                "Label": "",
                                "ScriptingName": ""
                            },
                            "ObjectName": "BackClickArea",
                            "Path": "/SEGMentDocument.1/SEGMentProcess.0/Scene.4/BackClickArea.1",
                            "Pos": [
                                0,
                                0.7984387150274538
                            ],
                            "Size": [
                                0.14771412514798687,
                                0.1379750983787998
                            ],
                            "Sound": {
                                "Path": "",
                                "Range": 0,
                                "Repeat": true,
                                "Volume": 0.7
                            },
                            "Z": 0,
                            "id": 1
                        }
                    ],
                    "ClickAreas": [
                    ],
                    "Components": [
                    ],
                    "Gifs": [
                        {
                            "Components": [
                            ],
                            "Default": 0,
                            "Frames": [
                                1,
                                1,
                                2
                            ],
                            "Image": "Objects/gifRGB.gif",
                            "Metadata": {
                                "Color": "Base1",
                                "Comment": "",
                                "Label": "",
                                "ScriptingName": ""
                            },
                            "ObjectName": "GifObject",
                            "Path": "/SEGMentDocument.1/SEGMentProcess.0/Scene.4/GifObject.1",
                            "Pos": [
                                0.6641468473196922,
                                0.3372703061054895
                            ],
                            "Size": [
                                0.1440687899074925,
                                0.05004987181851202
                            ],
                            "Sound": {
                                "Path": "",
                                "Range": 0,
                                "Repeat": true,
                                "Volume": 0.7
                            },
                            "Z": 0,
                            "id": 1
                        },
                        {
                            "Components": [
                            ],
                            "Default": 0,
                            "Frames": [
                                1,
                                2,
                                1
                            ],
                            "Image": "Objects/gifRGB.gif",
                            "Metadata": {
                                "Color": "Base1",
                                "Comment": "",
                                "Label": "",
                                "ScriptingName": ""
                            },
                            "ObjectName": "GifObject",
                            "Path": "/SEGMentDocument.1/SEGMentProcess.0/Scene.4/GifObject.2",
                            "Pos": [
                                0.6623096859013992,
                                0.2659490068248879
                            ],
                            "Size": [
                                0.139528315108205,
                                0.048472499079798496
                            ],
                            "Sound": {
                                "Path": "",
                                "Range": 0,
                                "Repeat": true,
                                "Volume": 0.7
                            },
                            "Z": 0,
                            "id": 2
                        },
                        {
                            "Components": [
                            ],
                            "Default": 0,
                            "Frames": [
                                2,
                                1,
                                1
                            ],
                            "Image": "Objects/gifRGB.gif",
                            "Metadata": {
                                "Color": "Base1",
                                "Comment": "",
                                "Label": "",
                                "ScriptingName": ""
                            },
                            "ObjectName": "GifObject",
                            "Path": "/SEGMentDocument.1/SEGMentProcess.0/Scene.4/GifObject.3",
                            "Pos": [
                                0.6636903564901484,
                                0.19390717555690057
                            ],
                            "Size": [
                                0.14406878990749258,
                                0.050049871818512046
                            ],
                            "Sound": {
                                "Path": "",
                                "Range": 0,
                                "Repeat": true,
                                "Volume": 0.7
                            },
                            "Z": 0,
                            "id": 3
                        }
                    ],
                    "Image": "Scenes/SceneLavabo.png",
                    "ImageSize": [
                        1153,
                        803
                    ],
                    "Metadata": {
                        "Color": "Base1",
                        "Comment": "",
                        "Label": "SceneLavabo",
                        "ScriptingName": ""
                    },
                    "ObjectName": "Scene",
                    "Objects": [
                        {
                            "Components": [
                            ],
                            "Image": "Objects/Feuille.png",
                            "Metadata": {
                                "Color": "Base1",
                                "Comment": "",
                                "Label": "",
                                "ScriptingName": ""
                            },
                            "ObjectName": "SimpleObject",
                            "Path": "/SEGMentDocument.1/SEGMentProcess.0/Scene.4/SimpleObject.2",
                            "Pos": [
                                0.0024347566922968086,
                                0.8430797087338465
                            ],
                            "PuzzlePiece": false,
                            "Size": [
                                0.1428446117633932,
                                0.10685048613680125
                            ],
                            "Sound": {
                                "Path": "",
                                "Range": 0,
                                "Repeat": true,
                                "Volume": 0.7
                            },
                            "Z": 0,
                            "id": 2
                        },
                        {
                            "Components": [
                            ],
                            "Image": "Objects/BouteilleVide.png",
                            "Metadata": {
                                "Color": "Base1",
                                "Comment": "",
                                "Label": "",
                                "ScriptingName": ""
                            },
                            "ObjectName": "SimpleObject",
                            "Path": "/SEGMentDocument.1/SEGMentProcess.0/Scene.4/SimpleObject.1",
                            "Pos": [
                                0.5663262391611583,
                                0.04163937112242123
                            ],
                            "PuzzlePiece": false,
                            "Size": [
                                0.35517473430627944,
                                0.2663810507297098
                            ],
                            "Sound": {
                                "Path": "",
                                "Range": 0,
                                "Repeat": true,
                                "Volume": 0.7
                            },
                            "Z": 0,
                            "id": 1
                        }
                    ],
                    "Path": "/SEGMentDocument.1/SEGMentProcess.0/Scene.4",
                    "Rect": [
                        8.87264320259203,
                        -768.8614225606182,
                        400,
                        400
                    ],
                    "RepeatText": false,
                    "SceneType": 0,
                    "Sonar": false,
                    "StartText": "",
                    "TextAreas": [
                    ],
                    "id": 4
                },
                {
                    "Ambience": {
                        "Path": "",
                        "Range": 0,
                        "Repeat": true,
                        "Volume": 0.7
                    },
                    "BackClickAreas": [
                        {
                            "Components": [
                            ],
                            "Metadata": {
                                "Color": "Base1",
                                "Comment": "",
                                "Label": "",
                                "ScriptingName": ""
                            },
                            "ObjectName": "BackClickArea",
                            "Path": "/SEGMentDocument.1/SEGMentProcess.0/Scene.3/BackClickArea.1",
                            "Pos": [
                                0,
                                0.7700632134834523
                            ],
                            "Size": [
                                0.13567403892083535,
                                0.13567403892083535
                            ],
                            "Sound": {
                                "Path": "",
                                "Range": 0,
                                "Repeat": true,
                                "Volume": 0.7
                            },
                            "Z": 0,
                            "id": 1
                        }
                    ],
                    "ClickAreas": [
                    ],
                    "Components": [
                    ],
                    "Gifs": [
                    ],
                    "Image": "Scenes/Scene Blanche.png",
                    "ImageSize": [
                        1338,
                        803
                    ],
                    "Metadata": {
                        "Color": "Base1",
                        "Comment": "",
                        "Label": "Scene Blanche",
                        "ScriptingName": ""
                    },
                    "ObjectName": "Scene",
                    "Objects": [
                        {
                            "Components": [
                            ],
                            "Image": "Objects/Feuille.png",
                            "Metadata": {
                                "Color": "Base1",
                                "Comment": "",
                                "Label": "",
                                "ScriptingName": ""
                            },
                            "ObjectName": "SimpleObject",
                            "Path": "/SEGMentDocument.1/SEGMentProcess.0/Scene.3/SimpleObject.5",
                            "Pos": [
                                0,
                                0.8033140238766255
                            ],
                            "PuzzlePiece": false,
                            "Size": [
                                0.15465459607360657,
                                0.11568457899642216
                            ],
                            "Sound": {
                                "Path": "",
                                "Range": 0,
                                "Repeat": true,
                                "Volume": 0.7
                            },
                            "Z": 0,
                            "id": 5
                        },
                        {
                            "Components": [
                            ],
                            "Image": "Objects/FeuillePart3.png",
                            "Metadata": {
                                "Color": "Base1",
                                "Comment": "",
                                "Label": "",
                                "ScriptingName": ""
                            },
                            "ObjectName": "SimpleObject",
                            "Path": "/SEGMentDocument.1/SEGMentProcess.0/Scene.3/SimpleObject.4",
                            "Pos": [
                                0.24387958314372676,
                                0.0681664688138102
                            ],
                            "PuzzlePiece": true,
                            "Size": [
                                0.33543272644481575,
                                0.4221825694908886
                            ],
                            "Sound": {
                                "Path": "",
                                "Range": 0,
                                "Repeat": true,
                                "Volume": 0.7
                            },
                            "Z": 0,
                            "id": 4
                        },
                        {
                            "Components": [
                            ],
                            "Image": "Objects/FeuillePart2.png",
                            "Metadata": {
                                "Color": "Base1",
                                "Comment": "",
                                "Label": "",
                                "ScriptingName": ""
                            },
                            "ObjectName": "SimpleObject",
                            "Path": "/SEGMentDocument.1/SEGMentProcess.0/Scene.3/SimpleObject.3",
                            "Pos": [
                                0.3644966326826971,
                                0.07962248006870076
                            ],
                            "PuzzlePiece": true,
                            "Size": [
                                0.2012787723785166,
                                0.24964430263451926
                            ],
                            "Sound": {
                                "Path": "",
                                "Range": 0,
                                "Repeat": true,
                                "Volume": 0.7
                            },
                            "Z": 0,
                            "id": 3
                        },
                        {
                            "Components": [
                            ],
                            "Image": "Objects/FeuillePart1.png",
                            "Metadata": {
                                "Color": "Base1",
                                "Comment": "",
                                "Label": "",
                                "ScriptingName": ""
                            },
                            "ObjectName": "SimpleObject",
                            "Path": "/SEGMentDocument.1/SEGMentProcess.0/Scene.3/SimpleObject.2",
                            "Pos": [
                                0.22372544053944365,
                                0.05003641680996651
                            ],
                            "PuzzlePiece": true,
                            "Size": [
                                0.14242413446555968,
                                0.12500982981474898
                            ],
                            "Sound": {
                                "Path": "",
                                "Range": 0,
                                "Repeat": true,
                                "Volume": 0.7
                            },
                            "Z": 0,
                            "id": 2
                        }
                    ],
                    "Path": "/SEGMentDocument.1/SEGMentProcess.0/Scene.3",
                    "Rect": [
                        -942.969133161135,
                        -50.84563520232349,
                        400,
                        400
                    ],
                    "RepeatText": false,
                    "SceneType": 0,
                    "Sonar": false,
                    "StartText": "",
                    "TextAreas": [
                    ],
                    "id": 3
                },
                {
                    "Ambience": {
                        "Path": "",
                        "Range": 0,
                        "Repeat": true,
                        "Volume": 0.7
                    },
                    "BackClickAreas": [
                    ],
                    "ClickAreas": [
                        {
                            "Components": [
                            ],
                            "Metadata": {
                                "Color": "Base1",
                                "Comment": "",
                                "Label": "",
                                "ScriptingName": ""
                            },
                            "ObjectName": "ClickArea",
                            "Path": "/SEGMentDocument.1/SEGMentProcess.0/Scene.1/ClickArea.1",
                            "Pos": [
                                0.7164135641738855,
                                0.45380150639724415
                            ],
                            "Size": [
                                0.1614661512248101,
                                0.16942867545555151
                            ],
                            "Sound": {
                                "Path": "",
                                "Range": 0,
                                "Repeat": true,
                                "Volume": 0.7
                            },
                            "Z": 0,
                            "id": 1
                        }
                    ],
                    "Components": [
                    ],
                    "Gifs": [
                    ],
                    "Image": "Scenes/PorteDepart.png",
                    "ImageSize": [
                        1170,
                        830
                    ],
                    "Metadata": {
                        "Color": "Base1",
                        "Comment": "",
                        "Label": "PorteDepart",
                        "ScriptingName": ""
                    },
                    "ObjectName": "Scene",
                    "Objects": [
                        {
                            "Components": [
                            ],
                            "Image": "Objects/Feuille.png",
                            "Metadata": {
                                "Color": "Base1",
                                "Comment": "",
                                "Label": "",
                                "ScriptingName": ""
                            },
                            "ObjectName": "SimpleObject",
                            "Path": "/SEGMentDocument.1/SEGMentProcess.0/Scene.1/SimpleObject.1",
                            "Pos": [
                                0.010724989740436529,
                                0.8318372124147274
                            ],
                            "PuzzlePiece": false,
                            "Size": [
                                0.13334541800197305,
                                0.09974490855298149
                            ],
                            "Sound": {
                                "Path": "",
                                "Range": 0,
                                "Repeat": true,
                                "Volume": 0.7
                            },
                            "Z": 0,
                            "id": 1
                        }
                    ],
                    "Path": "/SEGMentDocument.1/SEGMentProcess.0/Scene.1",
                    "Rect": [
                        -1174.1258911120576,
                        -653.0113759823787,
                        400,
                        400
                    ],
                    "RepeatText": false,
                    "SceneType": 1,
                    "Sonar": false,
                    "StartText": "",
                    "TextAreas": [
                    ],
                    "id": 1
                },
                {
                    "Ambience": {
                        "Path": "",
                        "Range": 0,
                        "Repeat": true,
                        "Volume": 0.7
                    },
                    "BackClickAreas": [
                        {
                            "Components": [
                            ],
                            "Metadata": {
                                "Color": "Base1",
                                "Comment": "",
                                "Label": "",
                                "ScriptingName": ""
                            },
                            "ObjectName": "BackClickArea",
                            "Path": "/SEGMentDocument.1/SEGMentProcess.0/Scene.2/BackClickArea.1",
                            "Pos": [
                                0.0062979148426001354,
                                0.8962473608815241
                            ],
                            "Size": [
                                0.14249823384758312,
                                0.07112186563144966
                            ],
                            "Sound": {
                                "Path": "",
                                "Range": 0,
                                "Repeat": true,
                                "Volume": 0.7
                            },
                            "Z": 0,
                            "id": 1
                        }
                    ],
                    "ClickAreas": [
                    ],
                    "Components": [
                    ],
                    "Gifs": [
                    ],
                    "Image": "Scenes/digicode.png",
                    "ImageSize": [
                        1170,
                        830
                    ],
                    "Metadata": {
                        "Color": "Base1",
                        "Comment": "",
                        "Label": "digicode",
                        "ScriptingName": ""
                    },
                    "ObjectName": "Scene",
                    "Objects": [
                        {
                            "Components": [
                            ],
                            "Image": "Objects/B.png",
                            "Metadata": {
                                "Color": "Base1",
                                "Comment": "",
                                "Label": "",
                                "ScriptingName": ""
                            },
                            "ObjectName": "SimpleObject",
                            "Path": "/SEGMentDocument.1/SEGMentProcess.0/Scene.2/SimpleObject.1",
                            "Pos": [
                                0,
                                0.9241301137400117
                            ],
                            "PuzzlePiece": false,
                            "Size": [
                                0.1240659445398878,
                                0.04310083138236365
                            ],
                            "Sound": {
                                "Path": "",
                                "Range": 0,
                                "Repeat": true,
                                "Volume": 0.7
                            },
                            "Z": 0,
                            "id": 1
                        }
                    ],
                    "Path": "/SEGMentDocument.1/SEGMentProcess.0/Scene.2",
                    "Rect": [
                        -573.8384185271715,
                        -859.1180567524755,
                        400,
                        400
                    ],
                    "RepeatText": false,
                    "SceneType": 0,
                    "Sonar": false,
                    "StartText": "",
                    "TextAreas": [
                        {
                            "Behaviour": 3,
                            "Components": [
                            ],
                            "Metadata": {
                                "Color": "Base1",
                                "Comment": "",
                                "Label": "",
                                "ScriptingName": ""
                            },
                            "ObjectName": "TextArea",
                            "Path": "/SEGMentDocument.1/SEGMentProcess.0/Scene.2/TextArea.10",
                            "Pos": [
                                0.35264073826274095,
                                0.808496356665458
                            ],
                            "Size": [
                                0.19025156723831788,
                                0.09902650653303711
                            ],
                            "Sound": {
                                "Path": "",
                                "Range": 0,
                                "Repeat": true,
                                "Volume": 0.7
                            },
                            "Text": "",
                            "Z": 0,
                            "id": 10
                        },
                        {
                            "Behaviour": 0,
                            "Components": [
                            ],
                            "Metadata": {
                                "Color": "Base1",
                                "Comment": "",
                                "Label": "",
                                "ScriptingName": ""
                            },
                            "ObjectName": "TextArea",
                            "Path": "/SEGMentDocument.1/SEGMentProcess.0/Scene.2/TextArea.9",
                            "Pos": [
                                0.5875594566994855,
                                0.6040047055432018
                            ],
                            "Size": [
                                0.1280982291753791,
                                0.11807349722974403
                            ],
                            "Sound": {
                                "Path": "",
                                "Range": 0,
                                "Repeat": true,
                                "Volume": 0.7
                            },
                            "Text": "9",
                            "Z": 0,
                            "id": 9
                        },
                        {
                            "Behaviour": 0,
                            "Components": [
                            ],
                            "Metadata": {
                                "Color": "Base1",
                                "Comment": "",
                                "Label": "",
                                "ScriptingName": ""
                            },
                            "ObjectName": "TextArea",
                            "Path": "/SEGMentDocument.1/SEGMentProcess.0/Scene.2/TextArea.8",
                            "Pos": [
                                0.3798325111736324,
                                0.6008466477085256
                            ],
                            "Size": [
                                0.1280982291753791,
                                0.11205865806236281
                            ],
                            "Sound": {
                                "Path": "",
                                "Range": 0,
                                "Repeat": true,
                                "Volume": 0.7
                            },
                            "Text": "8",
                            "Z": 0,
                            "id": 8
                        },
                        {
                            "Behaviour": 0,
                            "Components": [
                            ],
                            "Metadata": {
                                "Color": "Base1",
                                "Comment": "",
                                "Label": "",
                                "ScriptingName": ""
                            },
                            "ObjectName": "TextArea",
                            "Path": "/SEGMentDocument.1/SEGMentProcess.0/Scene.2/TextArea.7",
                            "Pos": [
                                0.1780479067537083,
                                0.5858414291976137
                            ],
                            "Size": [
                                0.12408833639712519,
                                0.1291007023699428
                            ],
                            "Sound": {
                                "Path": "",
                                "Range": 0,
                                "Repeat": true,
                                "Volume": 0.7
                            },
                            "Text": "7",
                            "Z": 0,
                            "id": 7
                        },
                        {
                            "Behaviour": 0,
                            "Components": [
                            ],
                            "Metadata": {
                                "Color": "Base1",
                                "Comment": "",
                                "Label": "",
                                "ScriptingName": ""
                            },
                            "ObjectName": "TextArea",
                            "Path": "/SEGMentDocument.1/SEGMentProcess.0/Scene.2/TextArea.6",
                            "Pos": [
                                0.5853545156580764,
                                0.36580093516232237
                            ],
                            "Size": [
                                0.14313532709383203,
                                0.13010317556450626
                            ],
                            "Sound": {
                                "Path": "",
                                "Range": 0,
                                "Repeat": true,
                                "Volume": 0.7
                            },
                            "Text": "6",
                            "Z": 0,
                            "id": 6
                        },
                        {
                            "Behaviour": 0,
                            "Components": [
                            ],
                            "Metadata": {
                                "Color": "Base1",
                                "Comment": "",
                                "Label": "",
                                "ScriptingName": ""
                            },
                            "ObjectName": "TextArea",
                            "Path": "/SEGMentDocument.1/SEGMentProcess.0/Scene.2/TextArea.5",
                            "Pos": [
                                0.3651229044982912,
                                0.35911894693895374
                            ],
                            "Size": [
                                0.14213285389926864,
                                0.12509080959168858
                            ],
                            "Sound": {
                                "Path": "",
                                "Range": 0,
                                "Repeat": true,
                                "Volume": 0.7
                            },
                            "Text": "5",
                            "Z": 0,
                            "id": 5
                        },
                        {
                            "Behaviour": 0,
                            "Components": [
                            ],
                            "Metadata": {
                                "Color": "Base1",
                                "Comment": "",
                                "Label": "",
                                "ScriptingName": ""
                            },
                            "ObjectName": "TextArea",
                            "Path": "/SEGMentDocument.1/SEGMentProcess.0/Scene.2/TextArea.4",
                            "Pos": [
                                0.17451550120777748,
                                0.3465815165859072
                            ],
                            "Size": [
                                0.1301031755645062,
                                0.12208339000799803
                            ],
                            "Sound": {
                                "Path": "",
                                "Range": 0,
                                "Repeat": true,
                                "Volume": 0.7
                            },
                            "Text": "4",
                            "Z": 0,
                            "id": 4
                        },
                        {
                            "Behaviour": 0,
                            "Components": [
                            ],
                            "Metadata": {
                                "Color": "Base1",
                                "Comment": "",
                                "Label": "",
                                "ScriptingName": ""
                            },
                            "ObjectName": "TextArea",
                            "Path": "/SEGMentDocument.1/SEGMentProcess.0/Scene.2/TextArea.3",
                            "Pos": [
                                0.5879869452687384,
                                0.12533823504510141
                            ],
                            "Size": [
                                0.13511554153732389,
                                0.12709575598081574
                            ],
                            "Sound": {
                                "Path": "",
                                "Range": 0,
                                "Repeat": true,
                                "Volume": 0.7
                            },
                            "Text": "3",
                            "Z": 0,
                            "id": 3
                        },
                        {
                            "Behaviour": 0,
                            "Components": [
                            ],
                            "Metadata": {
                                "Color": "Base1",
                                "Comment": "",
                                "Label": "",
                                "ScriptingName": ""
                            },
                            "ObjectName": "TextArea",
                            "Path": "/SEGMentDocument.1/SEGMentProcess.0/Scene.2/TextArea.2",
                            "Pos": [
                                0.37728007942388325,
                                0.12569373874131298
                            ],
                            "Size": [
                                0.12208339000799803,
                                0.12408833639712512
                            ],
                            "Sound": {
                                "Path": "",
                                "Range": 0,
                                "Repeat": true,
                                "Volume": 0.7
                            },
                            "Text": "2",
                            "Z": 0,
                            "id": 2
                        },
                        {
                            "Behaviour": 0,
                            "Components": [
                            ],
                            "Metadata": {
                                "Color": "Base1",
                                "Comment": "",
                                "Label": "",
                                "ScriptingName": ""
                            },
                            "ObjectName": "TextArea",
                            "Path": "/SEGMentDocument.1/SEGMentProcess.0/Scene.2/TextArea.1",
                            "Pos": [
                                0.1804353429153246,
                                0.11564483426174439
                            ],
                            "Size": [
                                0.12308586320256161,
                                0.12709575598081566
                            ],
                            "Sound": {
                                "Path": "",
                                "Range": 0,
                                "Repeat": true,
                                "Volume": 0.7
                            },
                            "Text": "1",
                            "Z": 0,
                            "id": 1
                        }
                    ],
                    "id": 2
                },
                {
                    "Ambience": {
                        "Path": "",
                        "Range": 0,
                        "Repeat": true,
                        "Volume": 0.7
                    },
                    "BackClickAreas": [
                    ],
                    "ClickAreas": [
                    ],
                    "Components": [
                    ],
                    "Gifs": [
                    ],
                    "Image": "Scenes/GG.png",
                    "ImageSize": [
                        641,
                        803
                    ],
                    "Metadata": {
                        "Color": "Base1",
                        "Comment": "",
                        "Label": "GG",
                        "ScriptingName": ""
                    },
                    "ObjectName": "Scene",
                    "Objects": [
                    ],
                    "Path": "/SEGMentDocument.1/SEGMentProcess.0/Scene.5",
                    "Rect": [
                        468.4420102724878,
                        -792.313325144613,
                        400,
                        400
                    ],
                    "RepeatText": false,
                    "SceneType": 2,
                    "Sonar": false,
                    "StartText": "",
                    "TextAreas": [
                    ],
                    "id": 5
                }
            ],
            "Transitions": [
                {
                    "Color": [
                        0,
                        0,
                        0,
                        255
                    ],
                    "Components": [
                    ],
                    "Fade": 1,
                    "Metadata": {
                        "Color": "Base1",
                        "Comment": "",
                        "Label": "",
                        "ScriptingName": ""
                    },
                    "ObjectName": "Transition",
                    "Sound": {
                        "Path": "",
                        "Range": 0,
                        "Repeat": true,
                        "Volume": 0.7
                    },
                    "Transition": {
                        "SceneToScene": {
                            "From": "/SEGMentDocument.1/SEGMentProcess.0/Scene.2",
                            "Riddle": {
                                "MaxTime": "none",
                                "Text": {
                                    "Expected": "13672",
                                    "FuzzyMatches": [
                                        "12345"
                                    ],
                                    "IfCorrect": "",
                                    "IfWrong": "",
                                    "Question": "Code ?",
                                    "UseStars": false
                                },
                                "Which": "Text"
                            },
                            "Source": 10,
                            "Target": 4,
                            "To": "/SEGMentDocument.1/SEGMentProcess.0/Scene.4"
                        },
                        "Which": "SceneToScene"
                    },
                    "Unique": false,
                    "id": 4
                },
                {
                    "Color": [
                        0,
                        0,
                        0,
                        255
                    ],
                    "Components": [
                    ],
                    "Fade": 1,
                    "Metadata": {
                        "Color": "Base1",
                        "Comment": "",
                        "Label": "",
                        "ScriptingName": ""
                    },
                    "ObjectName": "Transition",
                    "Sound": {
                        "Path": "",
                        "Range": 0,
                        "Repeat": true,
                        "Volume": 0.7
                    },
                    "Transition": {
                        "SceneToScene": {
                            "From": "/SEGMentDocument.1/SEGMentProcess.0/Scene.3",
                            "Riddle": {
                                "MaxTime": "none",
                                "Puzzle": {
                                },
                                "Which": "Puzzle"
                            },
                            "Source": 2,
                            "Target": 6,
                            "To": "/SEGMentDocument.1/SEGMentProcess.0/Scene.2"
                        },
                        "Which": "SceneToScene"
                    },
                    "Unique": false,
                    "id": 3
                },
                {
                    "Color": [
                        0,
                        0,
                        0,
                        255
                    ],
                    "Components": [
                    ],
                    "Fade": 1,
                    "Metadata": {
                        "Color": "Base1",
                        "Comment": "",
                        "Label": "",
                        "ScriptingName": ""
                    },
                    "ObjectName": "Transition",
                    "Sound": {
                        "Path": "",
                        "Range": 0,
                        "Repeat": true,
                        "Volume": 0.7
                    },
                    "Transition": {
                        "ObjectToScene": {
                            "From": "/SEGMentDocument.1/SEGMentProcess.0/Scene.1/SimpleObject.1",
                            "Source": 8,
                            "Target": 0,
                            "To": "/SEGMentDocument.1/SEGMentProcess.0/Scene.3"
                        },
                        "Which": "ObjectToScene"
                    },
                    "Unique": false,
                    "id": 2
                },
                {
                    "Color": [
                        0,
                        0,
                        0,
                        255
                    ],
                    "Components": [
                    ],
                    "Fade": 1,
                    "Metadata": {
                        "Color": "Base1",
                        "Comment": "",
                        "Label": "",
                        "ScriptingName": ""
                    },
                    "ObjectName": "Transition",
                    "Sound": {
                        "Path": "",
                        "Range": 0,
                        "Repeat": true,
                        "Volume": 0.7
                    },
                    "Transition": {
                        "ClickAreaToScene": {
                            "From": "/SEGMentDocument.1/SEGMentProcess.0/Scene.1/ClickArea.1",
                            "Source": 9,
                            "Target": 4,
                            "To": "/SEGMentDocument.1/SEGMentProcess.0/Scene.2"
                        },
                        "Which": "ClickAreaToScene"
                    },
                    "Unique": false,
                    "id": 1
                },
                {
                    "Color": [
                        0,
                        0,
                        0,
                        255
                    ],
                    "Components": [
                    ],
                    "Fade": 1,
                    "Metadata": {
                        "Color": "Base1",
                        "Comment": "",
                        "Label": "",
                        "ScriptingName": ""
                    },
                    "ObjectName": "Transition",
                    "Sound": {
                        "Path": "",
                        "Range": 0,
                        "Repeat": true,
                        "Volume": 0.7
                    },
                    "Transition": {
                        "SceneToScene": {
                            "From": "/SEGMentDocument.1/SEGMentProcess.0/Scene.4",
                            "Riddle": {
                                "Gif": {
                                },
                                "MaxTime": "none",
                                "Which": "Gif"
                            },
                            "Source": 10,
                            "Target": 3,
                            "To": "/SEGMentDocument.1/SEGMentProcess.0/Scene.5"
                        },
                        "Which": "SceneToScene"
                    },
                    "Unique": false,
                    "id": 5
                }
            ],
            "id": 0
        },
        "id": 1
    },
    "Plugins": {
    },
    "Version": 2
}
