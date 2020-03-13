// ========================================================================================
//                                    ***Gifs functions***
// ========================================================================================


/**
* Function to search when to stop if the gif has a part where many images can be displayed in one click
* @param {Number} resGif : TODO
* @param {Number} currentFrame : Current image of the gif displayed
* @returns : the next index where the gif should stop before a click
*/
function findNextUnskippedFrame(resGif, currentFrame){
  let i = currentFrame + 1;
  const len = gifClickZone[resGif].id[0];
  while(i != currentFrame){
    if(i >=len){
      i = 0;
    }
    if(gifClickZone[resGif].id[2][i] != 0){
      return i
    }
    i++;
  }
  return -1;
}

/*
* Refreshes the size of every gif on the scene
*/
function resizeGif(){
  for(let i = 0; i < gifOnScene.length; i++){
    let top = windowsValues[5] + gifClickZone[i].y1 * windowsValues[3] * windowsValues[6];
    let left = windowsValues[4] + gifClickZone[i].x1 * windowsValues[2] * windowsValues[6];
    let width = windowsValues[2] * windowsValues[6] * (gifClickZone[i].x2-gifClickZone[i].x1);
    let height = windowsValues[3] * windowsValues[6] * (gifClickZone[i].y2-gifClickZone[i].y1);
    gifOnScene[i].resize(width, height, left, top);
  }
}

/*
* Check if all the gifs are set to the right frame.
*/
function areGifWellSet(){
  let bool = true;
  let i = 0 ;
  const len = gifClickZone.length;
  while(i < len && bool){
    if(gifClickZone[i].id[2][gifOnScene[i].get_current_frame()] != 2){
      bool = false;
    }
    i++;
  }
  return bool;
}
