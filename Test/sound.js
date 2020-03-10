// ========================================================================================
//                                      ***Sounds***
// ========================================================================================

/**
* Plays the sound located at soundPath, at the volume "volume".
* The sound loops if loop is true (false by default)
* @param {string} soundPath
* @param {bool} loop
* @param {float} volume
*/
function playSound(SoundPath,loop=false,volume=1.0,audioSound=undefined){
  if(SoundPath == ""){
    console.log("Sound not defined !");
  }
  else{
    var audio
    if(audioSound === undefined){
        audio = new Audio(getGameFolderURL() + SoundPath);
    }else{
        audio = audioSound;
    }
    audio.loop = loop;
    audio.volume = volume;
    audio.play();
  }
}

/**
* Plays the Ambience sound of the current scene
*/
function playSoundScene(audio=undefined){
  let scene = getSceneByID(scene_number);
  let SoundPath = scene.Ambience.Path;
  let loop = scene.Ambience.Repeat;
  let volume = scene.Ambience.Volume;
  playSound(SoundPath,loop,volume,audio);
}

/**
* Plays the sound associated to clickZoneId
* @param {Number} clickZoneId
*/
function playSoundClickZone(clickZoneId){
  var Scene = getSceneByID(scene_number);
  var clickAreas = getClickAreas(Scene);
  var clickArea = getClickAreaByID(clickAreas,clickZoneId);
  var SoundPath = getSoundPath(clickArea);
  playSound(SoundPath);
}

/**
* Plays the sound associated to backClickAreaId
* @param {Number} backClickAreaId
*/
function playSoundBackClickArea(backClickAreaId){
  var Scene = getSceneByID(scene_number);
  var backClickAreas = getBackClickAreas(Scene);
  var backClickArea = getBackClickAreaByID(backClickAreas,backClickAreaId);
  var SoundPath = getSoundPath(backClickArea);
  playSound(SoundPath);
}

/**
* Plays the sound associated with gifId
* @param {Number} gifId
*/
function playSoundGif(gifId){
  var Scene = getSceneByID(scene_number);
  var gifs = getGifs(Scene);
  var gif = getGifByID(gifs, gifId);
  var SoundPath = getSoundPath(gif);
  playSound(SoundPath);
}

/**
* Plays the sound associated with objectId
* @param {Number} objectId
*/
function playSoundObject(objectId){
  var Scene = getSceneByID(scene_number);
  var objects = getObjects(Scene);
  var object = getObjectByID(objects, objectId);
  var SoundPath = getSoundPath(object);
  playSound(SoundPath);
}

/**
* Plays the sound associated to textId
* @param {Number} textId
*/
function playSoundText(textId){
  var Scene = getSceneByID(scene_number);
  var texts = getTexts(Scene);
  var text = getTextByID(texts, textId);
  var SoundPath = getSoundPath(text);
  playSound(SoundPath);
}

/**
* Plays the sound associated to transitionId
* @param {Number} transitionId
*/
function playSoundTransition(transitionId){
  var transitions = getTransitions();
  var transition = getTransitionByID(transitions, transitionId);
  var SoundPath = getSoundPath(transition);
  playSound(SoundPath);
}
