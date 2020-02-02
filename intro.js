/**
* intro.js
*
* Page to display the introduction video (Must be a mp4 video and be named "Intro.mp4")
* Note : if videos can be played on each transition, try putting the name in cookies, and play it here with it.
*/

window.onload = playIntro();
window.addEventListener("resize", resizeVideo);

/**
* Plays the intro video, or skip it if it does not exist
*/
function playIntro(){
  try{
    playVideo("Intro.mp4","video/mp4");
  }
  catch(err){
    if(err == "fileError"){
      skip();
    }
  }
}

/**
* Skips the video if the button "Skip" is pressed
* @param{event} event
*/
function skipIntro(event){
  event.preventDefault();
  skip();
}

/**
* Skips the video and goes to ping.html
*/
function skip(){
  document.location.href = 'ping.html';
}
