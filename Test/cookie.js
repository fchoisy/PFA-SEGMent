/**
* Gets the state of the objects (position,etc.) in a scene
* @param {Number} scene_number : id of a scene
* @param {String} scene_number : cookie containing the value of the different states (from every scenes)
* @returns the part of the cookie corresponding to the scene scene_number
*/
function getStateBySceneId(scene_number, cook){
  let len = cook.length-1;
  let len2 = cook.length-1;
  let len3 = cook.length-1;
  while(len >= 0){
    if(cook[len] == ":"){
      len2 = len;
    }
    if(cook[len] == "/"){
      if(cook.substring(len+1, len2) == scene_number){
        return(cook.substring(len2+1, len3));
      }
      len3 = len;
    }
    len = len-1;
  }
  if(cook.substring(len, len2) == scene_number){
    return(cook.substring(len2+1, len3));
  }
  return "";
}

/**
* Gets the index of the states of the objects (position,etc.) in a scene
* @param {Number} scene_number : id of the scene
* @param {String} cook : cookie containing the value of the different states (from every scenes)
* @returns : TODO
*/
function getIndexStateBySceneId(scene_number, cook){
  let len = cook.length-1;
  let len2 = cook.length-1;
  let len3 = cook.length-1;
  while(len >= 0){
    if(cook[len] == ":"){
      len2 = len;
    }
    if(cook[len] == "/"){
      if(cook.substring(len+1, len2) == scene_number){
        return[len+1, len3+1];
      }
      len3 = len;
    }
    len = len-1;
  }
  if(cook.substring(len, len2) == scene_number){
    return[len+1, len3+1];
  }
  return [cook.length, cook.length];
}

/**
* adds the state of a gif (current image) to the cookie containing all the state of the objects (from all scenes)
* @param {String} state : current state of the gif
* @param {Number} scene_number : id of the scene
* @param {*} toAdd : value to add in the cookie
*/
function addGifStateCookie(state, sceneNumber, toAdd){
  const indexes = getIndexStateBySceneId(sceneNumber, state);
  document.cookie = "gif_state=" + state.substring(0, indexes[0]) + toAdd + state.substring(indexes[1]);

}

/**
* Adds the state of a puzzle (position) to the cookie containing all the state of the objects (from all scenes)
* @param {String} cook : cookie containing the value of the different states (from every scenes)
* @param {Number} topPos : TODO
* @param {Number} sceneNb : id of the scene
*/
function storePuzzleInCookie(cook, topPos, sceneNb){
  let indexes =  getIndexStateBySceneId(sceneNb, cook);
  document.cookie = "puzzle_pos=" + cook.substring(0, indexes[0]) + sceneNb + ":" + topPos + cook.substring(indexes[1]) + "/";
}

// ----------------------------------- Cookie manager -------------------------------------

/**
* Returns the index of cookie whose name is 'cname' in cookie 'cook'
* @param {String} cname
* @param {Cookie} cook
* @returns the index of the cookie if it exists, -1 otherwise
*/
function getIndexName(cname, cook) {
  var toSearch = cname + "=";
  var i = 0;
  var begin_chaine = 0;
  while (i < cook.length) {
    if (i == begin_chaine && cook[i] == " ") {
      begin_chaine += 1;
    }
    if (cook[i] == "=") {
      var str = cook.substring(begin_chaine, i + 1);
      if (toSearch == str) {
        return i;
      }
    }
    if (cook[i] == ";") {
      begin_chaine = i + 1;
    }
    i += 1;
  }
  return -1;
}

/**
* Get the value of the cookie whose name is 'cname'
* @param {String} cname
* @returns value of the cookie (as a String)
*/
function getCookieValue(cname) {
  const cook = document.cookie;
  var ind = getIndexName(cname, cook);
  var i = ind;
  var j = 0;
  while (j == 0 && i < cook.length) {
    i = i + 1;
    if (cook[i] == ";") {
      j = i;
    }
  }
  j = i
  return cook.substring(ind + 1, j);
}
