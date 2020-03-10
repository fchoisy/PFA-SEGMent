window.onload = initialisation();

// ------------------------------------ Initialisation ------------------------------------

/**
* Function to be called when scene is opened
*/
function initialisation() {
  showLoading();
  document.getElementById("scene").style.opacity = 0;
  let isBack = getCookieValue("isback"); // boolean that say if we came to this scene with a backClick
  scene_number = getLastElem(getCookieValue("scene_number")); // update the scene number
  // Fade transition
  fading = findTransition(getTransitions(), getLastElem(removeLastElem(getCookieValue("scene_number"))), scene_number);
  if(isBack.substring(0, 4) == "true"){
    fading = findTransition(getTransitions(), scene_number, isBack.substring(4,5))
  }
  backgroundModifier();
  imgsize();
  setWindowsValues();
  loadSoundScene(); // TODO
  if(sceneVisited(scene_number) == false && sceneWithText(scene_number)){
    addCurrentSceneToVisited(scene_number);
    printOpeningText();
  }else{
    canPlay = true;
  }
  clickzone();
  Puzzled(scene_number);
  loadObjects();
}

window.addEventListener("resize", resize);

// ---------------------------------------- Resize ----------------------------------------

/**
* Functions to execute when resizing the window size
*/
function resize(){
  setWindowsValues();
  resizeGif();
  loadObjects();
}
