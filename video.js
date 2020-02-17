/**
* video.js
*
* Page where a video should be displayed (either mp4 or ogg)
*/

window.onload = playIntro();
window.addEventListener("resize", resizeVideo);
document.getElementById("video").addEventListener('ended',skip,false);

document.getElementById("video").addEventListener('pause', function(){ //Disables the pause by playing the video as soon as it is paused
  document.getElementById("video").play()
});

window.onkeydown = function(event){
  event.preventDefault();
  if(event.keyCode == 27){ //27 = ESC key
    console.log("Esc pressed");
    skip();
  }
}

/**
* Plays the video in cookie, or skip it if it does not exist
*/
function playIntro(){
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

/**
* Skips the video and goes to ping.html
*/
function skip(){
  const sceneAfter = getCookieValue("scene_after");
  document.location.href = sceneAfter;
}
