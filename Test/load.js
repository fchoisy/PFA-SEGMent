$(window).on('load', handler);


/**
* Function to wait for everything to be loaded before showing the scene
* (see $(window).on('load', handler);)
*/
function handler(){
  document.body.style.opacity = 0;
  if(fading && gifOK == 0){
    playSoundScene(audioSoundScene);
    document.getElementById("scene").style.opacity = 1;
    document.body.style.opacity = 1;
    document.body.classList.add("fadein");
    setTimeout(function(){document.body.classList.remove("fadein");
    canPlayFade = true;}, FADE_TIME);
  }else if(gifOK == 0){
    playSoundScene(audioSoundScene);
    document.getElementById("scene").style.opacity = 1;
    document.body.style.opacity = 1;
    canPlayFade = true;
  }
  hideLoading();
}

// To remove ?
function loadSoundScene(){
  let scene = getSceneByID(scene_number);
  let SoundPath = scene.Ambience.Path;
  audioSoundScene = new Audio(getGameFolderURL() + SoundPath);
}

/**
* Changes the background of "game.html"
* according to 'scene_number'
*/
function backgroundModifier() {
  scene_number = getLastElem(getCookieValue("scene_number"));
  img_path = getSceneBackgroundById(parseInt(scene_number));
  document.body.style.cursor = "default";
  let elem = document.body;
  elem.style.backgroundImage = "url(" + img_path + ")";
};

/**
* Initializes the global field 'imgSize'
*/
function imgsize(){
  scene_number = getLastElem(getCookieValue("scene_number"));
  imgSize = getImageSizeByID(scene_number);
}
