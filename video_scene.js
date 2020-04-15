/**
* video_scene.js
*
* functions needed to display the video on the scene (should be only used with video.html)
*/


window.onload = playVid();
window.addEventListener("resize", resizeVideo);
// Skips to the next scene if video ends
document.getElementById("video").addEventListener('ended',skip,false);

document.getElementById("video").addEventListener('pause', function(){ //Disables the pause by playing the video as soon as it is paused
  document.getElementById("video").play()
});

// Skips to the next scene if escape key is pressed
window.onkeydown = function(event){
  event.preventDefault();
  if(event.keyCode == 27){ //27 = ESC key
    console.log("Esc pressed");
    skip();
  }
}

/**
* Plays the video located at vidName (ex : Video.mp4) with type "type" (video/mp4, video/ogg, etc.).
* Throw an "fileError" if it does not exist
* @param {String} vidName
* @param {String} type
*/
function playVideo(vidName, type)
{
  if(fileExists(vidName)){
    var video = document.getElementById("video");
    video.innerHTML = "";
    video.width = parseInt(window.innerWidth);
    video.height = parseInt(window.innerHeight);
    video.zIndex = 16;
    var source = document.createElement("source");
    source.src = vidName;
    source.type = type;
    video.appendChild(source);
    video.play();
  }
  else{
    throw "fileError";
  }
}

/**
* resizes the video to the size of the window
*/
function resizeVideo(){
  var video = document.getElementById("video");
  video.width = parseInt(window.innerWidth);
  video.height = parseInt(window.innerHeight);
}

/**
* Skips the video and goes to ping.html
*/
function skip(){
  const sceneAfter = getCookieValue("scene_after");
  document.location.href = sceneAfter;
}
