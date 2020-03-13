/**
* main.js
*
* main functions, to open the scene, and to handle the resize of the window
*/



window.onload = initialisation();

/**
* Function to be called when scene is opened
*/
function initialisation() {
  showLoading();
  diaryOnScene = JSON.parse(getCookieValue("diary_on_scene"));
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
  if(diaryOnScene){
      updateDiary();
  }else{
      diaryLoaded = true;
  }
  clickzone();
  Puzzled(scene_number);
  loadObjects();
}

window.addEventListener("resize", resize);

/**
* Functions to execute when resizing the window size
*/
function resize(){
  setWindowsValues();
  resizeGif();
  loadObjects();
  resizeDiary();
  if(diaryOnScreen){
      document.getElementById("canvas").style.display = "none";
      document.getElementById("diaryDisplayedCanvas").style.display = "initial";
  }else{
      document.getElementById("canvas").style.display = "initial";
      document.getElementById("diaryDisplayedCanvas").style.display = "none";
  }
}
