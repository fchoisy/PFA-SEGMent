/**
* video_load.js
*
* functions needed to load and switch to the video scene
*/



/**
* loads all the information to play a video in cookies, then go to the video scene
* @param {String} vidName : Path to the video
* @param {String} type : type of the video (video/mp4, video/ogg, etc.)
* @param {String} sceneAfter : scene to go after quitting the video (go to game.html or index.html)
*/
function loadVideoScene(vidName,type,sceneAfter){
  document.cookie = "video_name=" + vidName + ";";
  document.cookie = "video_type=" + type + ";";
  document.cookie = "scene_after=" + sceneAfter + ";";
  document.location.href = 'video.html';
}

/**
* Plays the video in cookie, or skip it if it does not exist
*/
function playVid(){
  const vidName = getCookieValue("video_name");
  const type = getCookieValue("video_type");
  try{
    playVideo(vidName,type);
  }
  catch(err){
    if(err == "fileError"){
      skip();
    }
  }
}
