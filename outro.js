/**
* outro.js
*
* Page to display the outroduction video (Must be a mp4 video and be named "Outro.mp4")
* Note : if videos can be played on each transition, try putting the name in cookies, and play it here with it.
*/

window.onload = playOutro();

/**
* Plays the intro video, or skip it if it does not exist
*/
function playOutro(){
  try{
    playVideo("Outro.mp4","video/mp4");
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
function skipOutro(event){
  event.preventDefault();
  skip();
}

/**
* Skips the video and goes to ping.html
*/
function skip(){
  document.location.href = 'index.html';
}
