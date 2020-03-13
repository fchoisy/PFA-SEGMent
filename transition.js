/**
* transition.js
*
* functions related to the changement of a scene
*/



/**
* Fades in the screen and moves to a new scene
* @param {Event} event (ignored)
* @param {String} html path of page to go to
* @param {Number} id id of scene to go to
* @param {Boolean} back is a back transition
* @param {Boolean} fade is a fade transition
*/
function changeScene(event, html, id, back, fade){
  event.preventDefault();
  let trueId = id;
  // Save the position of the gifs
  if(gifOnScene.length > 0){
    let state = getCookieValue("gif_state");
    let toAdd = "";
    toAdd = toAdd + scene_number + ":";
    for(let i = 0; i<gifOnScene.length-1; i++){
      toAdd += gifOnScene[i].get_current_frame() + ",";
    }
    toAdd += gifOnScene[gifOnScene.length-1].get_current_frame() + "/";
    addGifStateCookie(state, scene_number, toAdd);
  }
  if(isPuzzleScene){
    storePuzzleInCookie(getCookieValue("puzzle_pos"), tabPos, scene_number);
  }
  if(isInSkip(id,back)){
    trueId = getNextSceneSkip(id,back);
  }
  if(fade){
    document.body.classList.add("fadeout");
  }
  let cook = document.cookie;
  let i = 0;
  while (cook[i] != ";" && i < cook.length) {
    i = i+1;
  }
  let lstSceneNumber = getCookieValue("scene_number")
  if(lstSceneNumber.length > 0 ){
    lstSceneNumber = lstSceneNumber.substring(0, lstSceneNumber.length);
  }else{
    lstSceneNumber = "";
  }
  if(back){
    let lst;
    if(getLastElem(lstSceneNumber) == scene_number){
      if(trueId == -1){
        id = getLastElem(lstSceneNumber);
        trueId = removeLastElem(lstSceneNumber);
        document.cookie = "isback=" + true + id + ";";
      }
      if(getCookieValue("scene_number").length == 1){
        trueId = getCookieValue("scene_number");
      }
      document.cookie = "scene_number=" + trueId + ";";
    }
  }else{
    if(getLastElem(lstSceneNumber) == scene_number){
      document.cookie = "scene_number=" + lstSceneNumber + "," + trueId + ";";
    }
  }
  setTimeout(function(){document.location.href = html}, FADE_TIME);
};

// -------------------------------- Get/Remove last element -------------------------------

/**
* Remove the last element from a string of this form "1,2,3,4"
* @param {String} lst the string you want to remove the last element
*/
function removeLastElem(lst){
  let len = lst.length;
  while(lst[len] != "," && len >= 0){
    len = len-1;
  }
  return lst.substring(0, len);
}

/**
* Get the last element from a string of this form "1,2,3,4"
* @param {String} lst the string you want to get the last element
*/
function getLastElem(lst){
  let len = lst.length;
  while(lst[len] != "," && len != 0){
    len = len-1;
  }
  let ret = lst.length;
  if(len != 0 ){
    len = len+1;
    ret = ret+1;
  }
  return lst.substring(len, ret);
}

// ------------------------------------- Skip to Scene -------------------------------------

/**
* Adds the id of the scene in the cookie containing the scenes to skip (if solved + unique)
* @param {Number} sceneId
*/
function addSkip(sceneId){
  document.cookie = "skip=" + getCookieValue("skip") + "," + sceneId + ";";
}

/**
* Checks if the scene is in the cookie containing the scenes to skip (if solved + unique)
* @param {Number} sceneId
* @param {Boolean} back : true if the user clicked on a back click zone
* @returns true if the scene should be skipped, false otherwise
*/
function isInSkip(sceneId, back){
  let skip = getCookieValue("skip");
  skip = skip + ",";
  var IdStr;
  var Id;
  let sid = sceneId;
  if(back && getCookieValue("scene_number").length > 1){
    sid = getLastElem(removeLastElem(getCookieValue("scene_number")));
  }
  for (let i = 0; i < skip.length; i++) {
    if(skip[i] == ","){
      Id = parseInt(IdStr);
      IdStr = "";
      if(Id == sid){
        return true;
      }
    }else{
      IdStr += skip[i];
    }
  }
  return false;
}

/**
* Returns the id of the scene to go if it is skipped
* @param {Number} sceneId
* @param {Boolean} back
*/
function getNextSceneSkip(sceneId,back){
  if(!back){
    const transition = findTransitionBySceneId(sceneId);
    const transitionType = transition.Transition.Which;
    const transitionData = transition.Transition[transitionType];
    return getLastNumberTransition(transitionData.To);
  }
  let lst = removeLastElem(getCookieValue("scene_number"));
  while(isInSkip(getLastElem(lst))){
    lst = removeLastElem(lst);
  }
  return lst;
}

/**
* returns the transition starting from the sceneId
* @param {Number} sceneId
*/
function findTransitionBySceneId(sceneId){
  let transitions = getTransitions();
  var transitionType;
  var transition;
  var transitionData;
  for (var i = 0; i < transitions.length; i++) {
    transition = transitions[i];
    transitionType = transition.Transition.Which;
    transitionData = transition.Transition[transitionType];
    if(getSceneIdFromPath(transitionData.From) == sceneId){
      return transition;
    }
  }
}

/**
* Returns true if the transition id is Unique
* @param {Number} transitionId
* @returns true if the transition is unique, false otherwise
*/
function isTransitionUnique(transition){
  return transition.Unique;
}

/**
* Checks if the scene is final
* @param {scene} scene
* @returns true if the scene is final, false otherwise
*/
function isSceneFinal(scene){
  return scene.SceneType == 2;
}
