/**
* test_clicks.js
*
* functions check if the user clicked on a specific zone
*/



window.addEventListener("mousemove", changeCursor, false);
window.addEventListener("click", verifyClick, false);

/**
* Initializes clickZones and BackClickZones arrays
*/
function clickzone() {
  scene_number = getLastElem(getCookieValue("scene_number"));
  clickZones = getClickZonesByScenesId(scene_number, false);
  backClickZones = getClickZonesByScenesId(scene_number, true);
}

// ------------------------------------ Change cursor  ------------------------------------

/**
* Changes the mouse pointer icon in reponse to an event
* @param {MouseEvent} event
*/
function changeCursor(event) {
  if(canPlay && canPlayFade){
    let X = event.clientX;
    let Y = event.clientY;
    if(((isOnZone(X, Y)[0] >= 0 || isOnBackZone(X,Y)[0] || isOnDigicodeZone(X,Y)[0]!=-1
    || isOnGifZone(X,Y)!=-1 || isOnObjectZone(X,Y)[0]!=-1) && !diaryOnScreen) || isOnDiaryZone(X,Y)[0]!=-1){
      document.body.style.cursor = 'pointer';
      return;
    }
    document.body.style.cursor = 'default';
  }
}

// ========================================================================================
//                                    ***Tests on click***
// ========================================================================================

// ---------------------------------- Verify if on a zone ---------------------------------

/**
* Check wether a mouse click is inside a click zone
* and launches 'changeScene' if it is
* @param {MouseEvent} event
*/
function verifyClick(event) {
  if(canPlay && canPlayFade){
    const X = event.clientX;
    const Y = event.clientY;
    if(diaryOnScreen){
        verifyDiaryZone(X,Y);
    }else{
        verifyDiaryZone(X,Y);
        verifyClickZone(X, Y);
        verifyBackZone(X, Y);
        verifyDigicode(X, Y);
        verifyObject(X, Y);
        verifyGif(X, Y);
        if(isSceneFinal(getSceneByID(scene_number))){
            loadVideoScene("Outro.mp4", "video/mp4", "index.html");
        }
    }
  }
}

// -------------------------------------- verify[...] -------------------------------------

/**
* Verifies if clicked on a ClickZone, and changes scene if so
* @param {Coordinate} X
* @param {Coordinate} Y
*/
function verifyClickZone(X, Y){
  const resClickZone = isOnZone(X, Y); // NOTE : resTab[0] = id pointed scene; resTab[1] = clickzone id
  if(resClickZone[0] >= 0){
    playSoundClickZone(resClickZone[1]);
    if(isTransitionUnique(findTransitionBySceneId(scene_number))){
      addSkip(scene_number);
    }
    document.cookie = "isback=" + false + ";";
    playSoundTransition(findTransitionBySceneId(scene_number).id);
    let fade = findTransition(getTransitions(), scene_number, resClickZone[0])
    changeScene(event, "game.html", resClickZone[0], false, fade);
  }
}

/**
* Verifies if clicked on a BackClickZone, and changes scene if so
* @param {Coordinate} X
* @param {Coordinate} Y
*/
function verifyBackZone(X, Y){
  const resBackZone = isOnBackZone(X, Y); // NOTE : resTab[0] = is on back zone; resTab[1] = back click zone id
  if(resBackZone[0]){
    playSoundBackClickArea(resBackZone[1]);
    let passedScene = getLastElem(getCookieValue("scene_number"));
    let sId = -1;
    let fade = findTransition(getTransitions(), getLastElem(removeLastElem(getCookieValue("scene_number"))), scene_number);
    changeScene(event, "game.html", sId, true, fade);
  }
}

/**
* Verifies if clicked on a Digicode letter/validate, memorizes the letter or checks if the answer is correct
* @param {Coordinate} X
* @param {Coordinate} Y
*/
function verifyDigicode(X, Y){
  const resDigi = isOnDigicodeZone(X, Y); // NOTE : resTab[0] = value of text; resTab[1] = clickzone id
  let bool = false;
  if(resDigi[0] != -1){
    let digiBox = document.getElementById("digiBox");
    let currentSceneId= getLastElem(getCookieValue("scene_number"));
    let digiSuccess = getDigicodeQSF(currentSceneId,"SUCCESS");
    digiBox.classList.remove("blinkDigicode");
    if(digiSuccess == undefined){ // TODO : factoriser ? (isUndefined)
      digiSuccess == "";
    }
    let digiFailure = getDigicodeQSF(currentSceneId, "FAILURE");
    if(digiFailure == undefined){
      digiFailure == "";
    }
    let clickValidate = false;
    playSoundText(resDigi[1]);
    if(resDigi[0][0] == "Validate"){
      clickValidate = true;
      bool = validatingBuffer();
    }else if(resDigi[0][0] == "Delete"){
      deletingBuffer();
    }else if(resDigi[0][0] == "Replace"){
      changingBuffer(resDigi[0][1]);
    }else{
      addingBuffer(resDigi[0][1]);
    }
    if(clickValidate){
      let text;
      if(bool){
        text = digiSuccess;
      }else{
        text = digiFailure;
        digiBox.classList.add("blinkDigicode");
      }
      clickValidate = false ;
      const split_texting = splitThroughPixel(text, digiBox.clientWidth, digiBox.clientHeight + "px")
      if(split_texting.length > 1){
        digiBox.innerHTML = '';
        digiBox.classList.add("defileDigicode");
        let digiSpan = document.createElement("div");
        digiSpan.innerHTML = text;
        digiBox.appendChild(digiSpan);
      }else{
        digiBox.innerHTML = text;
      }
    }else{
      digiBox.innerHTML = buffer;
    }
  }
  if(bool){
    let sId = 0;
    sId = digicodeClickZone[digicodeClickZone.length-1]
    sId = sId[sId.length-1];
    if(isTransitionUnique(findTransitionBySceneId(scene_number))){
      addSkip(scene_number);
    }
    document.cookie = "isback=" + false + ";";
    playSoundTransition(findTransitionBySceneId(scene_number).id);
    let fade = findTransition(getTransitions(), scene_number, sId);
    changeScene(event, "game.html", sId, false, fade);
  }
}

/**
* Verifies if clicked on an object, and changes scene if so
* @param {Coordinate} X
* @param {Coordinate} Y
*/
function verifyObject(X, Y){
  const resObject = isOnObjectZone(X, Y);
  if(resObject[0] != -1){
    playSoundObject(resObject[1]);
    let sId = resObject[0];
    if(isTransitionUnique(findTransitionBySceneId(scene_number))){
      addSkip(scene_number);
    }
    document.cookie = "isback=" + false + ";";
    playSoundTransition(findTransitionBySceneId(scene_number).id);
    let fade = findTransition(getTransitions(), scene_number, sId);
    changeScene(event, "game.html", sId, false, fade);
  }
}

/**
* Verifies if clicked on a gif, if so, changes the image of the gif, and if the combination is correct, changes scene
* @param {Coordinate} X
* @param {Coordinate} Y
*/
function verifyGif(X, Y){
  const resGif = isOnGifZone(X, Y);
  if(resGif != -1 && !gifOnScene[resGif].get_playing()){
    let currentFrame = gifOnScene[resGif].get_current_frame();
    playSoundGif(gifClickZone[resGif].clickzoneId);
    let first = true;
    while(first && canPlayGif){
      let newFrame = (currentFrame + 1) % gifClickZone[resGif].id[0];
      if(gifClickZone[resGif].id[2][newFrame] == 0){
        let nextScene = findNextUnskippedFrame(resGif, currentFrame);
        if(currentFrame == nextScene){
          gifOnScene[resGif].move_to(newFrame);
        }
        gifOnScene[resGif].play_until(nextScene);
      }
      else{
        gifOnScene[resGif].pause();
        gifOnScene[resGif].move_to(newFrame);
      }
      currentFrame = gifOnScene[resGif].get_current_frame();
      first = false;
    }
    if(areGifWellSet()){
      canPlayGif = false;
      if(isTransitionUnique(findTransitionBySceneId(scene_number))){
        addSkip(scene_number);
      }
      document.cookie = "isback=" + false + ";";
      playSoundTransition(findTransitionBySceneId(scene_number).id);
      let fade = findTransition(getTransitions(), scene_number, gifClickZone[resGif].id[3]);
      changeScene(event, "game.html", gifClickZone[resGif].id[3], false, fade);
    }
  }
}

/**
* Verifies if clicked on the Diary Zone, and display diary if so
* @param {Coordinate} X
* @param {Coordinate} Y
*/
function verifyDiaryZone(X, Y){
  const resClickZone = isOnDiaryZone(X, Y); // NOTE : resTab[0] = id pointed scene; resTab[1] = clickzone id
  if(resClickZone[0] >= 0){
      if(!diaryOnScreen){
          displayDiary();
          diaryOnScreen = true;
      }else{
          diaryOnScreen = false;
          document.getElementById("diaryDisplayedCanvas").style.display = "none";
          document.getElementById("diaryIconCanvas").style.display = "initial";
          document.getElementById("canvas").style.display = "initial";
      }
  }
}
// ------------------------------------- isOn[...]Zone ------------------------------------

/**
* Checks wether the point of coordinates (X,Y) is inside a click zone
* @param {Coordinate} X
* @param {Coordinate} Y
* @returns resTab :  resTab[0] = id pointed scene; resTab[1] = clickzone id
*/
function isOnZone(X, Y){
  X = (X - windowsValues[4]) / (windowsValues[0] - 2 * windowsValues[4]);
  Y = (Y - windowsValues[5]) / (windowsValues[1] - 2 * windowsValues[5]);
  let resTab = [];
  let len = clickZones.length;
  for(let i = 0; i < len; i++){
    if(X >= clickZones[i].x1 && X <= clickZones[i].x2 && Y >= clickZones[i].y1 && Y <= clickZones[i].y2){
      resTab[0] = clickZones[i].id;
      resTab[1] = clickZones[i].clickzoneId;
      return resTab;
    }
  }
  resTab[0] = -1
  resTab[1] = -1
  return resTab;
}

/**
* Checks wether the point of coordinates (X,Y) is inside a back click zone
* @param {Coordinate} X
* @param {Coordinate} Y
* @returns resTab : resTab[0] = is on back zone; resTab[1] = back click zone id
*/
function isOnBackZone(X, Y){
  let resTab = [];
  X = (X - windowsValues[4]) / (windowsValues[0] - 2 * windowsValues[4]);
  Y = (Y - windowsValues[5]) / (windowsValues[1] - 2 * windowsValues[5]);
  let len = backClickZones.length;
  for(let i = 0; i < len; i++){
    if(X >= backClickZones[i].x1 && X <= backClickZones[i].x2 && Y >= backClickZones[i].y1 && Y <= backClickZones[i].y2){
      resTab[0] = true;
      resTab[1] = backClickZones[i].bckclickId;
      return resTab;
    }
  }
  resTab[0] = false;
  resTab[1] = -1;
  return resTab;
}

/**
* Checks wether the point of coordinates (X,Y) is inside a back click zone
* @param {Coordinate} X
* @param {Coordinate} Y
*
* @returns resTab : resTab[0] = value of text; resTab[1] = clickzone id
*/
function isOnDigicodeZone(X, Y){
  let resTab = [];
  X = (X - windowsValues[4]) / ( windowsValues[0] - 2 * windowsValues[4]);
  Y = (Y - windowsValues[5]) / (windowsValues[1] - 2 * windowsValues[5]);
  let len = digicodeClickZone.length - 1;
  for(let i = 0; i < len; i++){
    if(X >= digicodeClickZone[i].x1 && X <= digicodeClickZone[i].x2 && Y >= digicodeClickZone[i].y1 && Y <= digicodeClickZone[i].y2){
      resTab[0] = digicodeClickZone[i].id;
      resTab[1] = digicodeClickZone[i].clickzoneId;
      return resTab;
    }
  }
  resTab[0] = -1;
  resTab[1] = -1;
  return resTab;
}

/**
* Checks wether the point of coordinates (X,Y) is inside a back click zone
* @param {Coordinate} X
* @param {Coordinate} Y
*
* @returns index of the gif click zone if is on zone, else returns -1
*/
function isOnGifZone(X, Y){
  X = (X - windowsValues[4]) / (windowsValues[0] - 2 * windowsValues[4]);
  Y = (Y - windowsValues[5]) / (windowsValues[1] - 2 * windowsValues[5]);
  let len = gifClickZone.length;
  for(let i = 0; i < len; i++){
    if(X >= gifClickZone[i].x1 && X <= gifClickZone[i].x2 && Y >= gifClickZone[i].y1 && Y <= gifClickZone[i].y2){
      return i;
    }
  }
  return -1;
}

/**
* Checks wether the point of coordinates (X,Y) is inside a back click zone
* @param {Coordinate} X
* @param {Coordinate} Y
*
* @returns resTab : resTab[0] = id of the scene to load ; resTab[1] = clickzone id
*/
function isOnObjectZone(X, Y){
  let resTab = [];
  X = (X - windowsValues[4]) / (windowsValues[0] - 2 * windowsValues[4]);
  Y = (Y - windowsValues[5]) / (windowsValues[1] - 2 * windowsValues[5]);
  let len = objectClickZones.length ;
  for(let i = 0; i < len; i++){
    if(X >= objectClickZones[i].x1 && X <= objectClickZones[i].x2 && Y >= objectClickZones[i].y1 && Y <= objectClickZones[i].y2){
      resTab[0] = objectClickZones[i].id;
      resTab[1] = objectClickZones[i].clickzoneId;
      return resTab;
    }
  }
  resTab[0] = -1;
  resTab[1] = -1;
  return resTab;
}

/**
* Check if the mouse position is on the diary click zone
* @param {Number} X position of the mouse on X-axis
* @param {Number} Y position of the mouse on Y-axis
*/
function isOnDiaryZone(X,Y){
    let resTab = [];
    X = (X - windowsValues[4]) / ( windowsValues[0] - 2 * windowsValues[4]);
    Y = (Y - windowsValues[5]) / (windowsValues[1] - 2 * windowsValues[5]);
    let size = (0.05 * windowsValues[2] * windowsValues[6])/(windowsValues[1] - 2 * windowsValues[5]);
    if(diaryOnScene && X >= 0.92 && X <= 0.97 && Y >= (0.97-size) && Y <= 0.97){
        resTab[0] = 0
        return resTab;
    }
    resTab[0] = -1;
    return resTab;
}
