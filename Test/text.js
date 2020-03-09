// -------------------------------- Visited Scenes ------------------------------

/**
* Return true if the 'scene_number' has been visited and false if not
* Use the cookie visited_scenes
* @param {Number} sceneId
* @returns true if scene visited, false otherwise
*/
function sceneVisited(sceneId){
  let visited = getCookieValue("visited_scenes");
  let Id;
  for (let i = 0; i < visited.length; i++) {
    if(visited[i] == ","){
      if(Id == sceneId){
        return true;
      }else{
        Id = "";
      }
    }else{
      Id = Id + visited[i];
    }
  }
  if(Id == sceneId){
    return true;
  }else{
    return false;
  }
}



/**
* Add the 'sceneId' scene to the cookie 'visited_scenes'
* @param {Number} sceneId
*/
function addCurrentSceneToVisited(sceneId){
  document.cookie = "visited_scenes=" + getCookieValue("visited_scenes") + "," + sceneId + ";";
}

// ========================================================================================
//                                      ***Texts***
// ========================================================================================

function sceneWithText(id){
  return getSceneTextBySceneId(id) != "";
}

/**
* TODO
* @param {String} string
* @param {Number} px : TODO
* @param {Number} fontsize : TODO
* @returns : TODO
*/
function splitThroughPixel(string, px, fontsize = null){
  let words = string.split(' ');
  let split = [];
  let div = document.createElement('div');
  div.style.cssText = "white-space:nowrap; display:inline;";
  if(fontsize != null){
    div.style.cssText = "white-space:nowrap; display:inline;font-size:" + fontsize + ";";
  }
  document.body.appendChild(div);
  for (let i = 0; i < words.length; i++) {
    div.innerText = (div.innerText + ' ' + words[i]).trim();
    let width = Math.ceil(div.getBoundingClientRect().width);
    if (width > px && div.innerText.split(' ').length > 1) {
      let currentWords = div.innerText.split(' ');
      let lastWord = currentWords.pop();
      split.push(currentWords.join(' '));
      div.innerText = lastWord;
    }
  }
  if(div.innerText !== ''){
    split.push(div.innerText);
  }
  document.body.removeChild(div);
  return split;
}

/**
* Prints the text at the start of a scene
*/
function printOpeningText(){
  let text;
  let textBox;
  let i=0; let j=0;
  let timer = null;
  let split_text;
  let count;
  let textBoxTop;
  let textBoxBottom;
  let printSpeed = 60;

  /**
  * Initializes the html code to display the textbox
  */
  function initTextBox() {
    textBox = document.getElementById("textbox");
    textBox.innerHTML="";
    textBox.style.zIndex = 11;
    textBox.style.borderStyle = "solid";
    textBox.style.borderColor = "black";
    textBox.style.color = "white";
    textBox.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    textBox.style.boxSizing = "border-box";

    textBoxTop = document.createElement("div");
    textBoxTop.id = "texttop";
    textBoxTop.style.height = "50%";
    textBoxTop.style.width = "100%";

    textBoxBottom = document.createElement("div");
    textBoxBottom.id = "textbottom";
    textBoxBottom.style.height = "50%";
    textBoxBottom.style.width = "100%";

    resizeTextBox();
    textBox.appendChild(textBoxTop);
    textbox.appendChild(textBoxBottom);
  }

  /**
  * TODO
  */
  function reset() {
    clearTimeout(timer);
    textBox = document.getElementById("textbox");
    text = getSceneTextBySceneId(scene_number);
    split_text = splitThroughPixel(text, textBox.clientWidth, textBoxTop.clientHeight + "px");
    count = split_text.length;
    if(text.length == 0){
      canPlay = true;
    }
  }

  /**
  * Prints the next character to display in the textbox
  */
  function charByChar() {
    if(j < count){
      if(j == 0){
        if (i < split_text[j].length) {
          textBoxTop.innerHTML += split_text[j][i];
          i++;
          timer = setTimeout(charByChar, printSpeed);
        }
        if(i == split_text[j].length){
          clearTimeout(timer);
          j++;
          i = 0;
          timer = setTimeout(charByChar, printSpeed);
        }
      }else{
        let textB;
        if(j % 2 == 1){
            textB = textBoxBottom;
        }
        else{
            textB = textBoxTop;
        }
        if (i < split_text[j].length) {
          textB.innerHTML += split_text[j][i];
          i++;
          timer=setTimeout(charByChar, printSpeed);
        }
        if (i == split_text[j].length){
          clearTimeout(timer);
          timer = null;
          j++;
          i = 0;
          if(j < count && j%2 == 1){
            //textBoxTop.innerHTML = ""//textBoxBottom.innerHTML;
            //textBoxBottom.innerHTML = "";
            timer = setTimeout(charByChar, printSpeed);
          } else{
            timer = null;
          }
        }
      }
  }else{
      timer = "end";
    }
  }

  /**
  * Prints all the text in the textbox in one time
  */
  function instantPrinting(){
    clearTimeout(timer);
    if(j >= count){
      textBox.innerHTML = "";
      setTimeout(function(){canPlay = true;}, printSpeed);
      textBox.style.display = 'none';
    }else{
      if(count == 1){
        textBoxTop.innerHTML = split_text[count-1];
        textBoxBottom.innerHTML = "";
      }else{
        if(j%2 == 0){
            textBoxTop.innerHTML = split_text[j];
            if(j<count-1){
                textBoxBottom.innerHTML = split_text[j+1];
            }
            i=0;
            j=j+2;
        }else{
            textBoxTop.innerHTML = split_text[j-1];
            textBoxBottom.innerHTML = split_text[j];
            i=0;
            j++;
        }
        if(j<count){
            timer = null;
        }else{
            timer = "end";
        }
      }
      /*if(j >= count){
          i=-1;
      }*/
      timer = null;
    }
  }

  /**
  * Resizes the textbox to the correct values (after a resize of the window)
  */
  function resizeTextBox(){
    if(canPlay == false){
      setWindowsValues();
      textBox.style.top = (windowsValues[5] + 0.841 * windowsValues[3] * windowsValues[6]) + "px";
      textBox.style.height = (0.16 * windowsValues[3] * windowsValues[6]) + "px";
      textBox.style.left = windowsValues[4] + "px";
      textBox.style.right = windowsValues[4] + "px";
      textBoxTop.style.fontSize = (0.06 * windowsValues[3] * windowsValues[6]) + "px";
      textBoxBottom.style.fontSize = (0.06 * windowsValues[3] * windowsValues[6]) + "px";
    }
  }

  function clickText(){
      if(j >= count){
          instantPrinting();
      }else if(timer != null){
          instantPrinting();
      }else{
          textBoxTop.innerHTML = ""//textBoxBottom.innerHTML;
          textBoxBottom.innerHTML = "";
          charByChar();
      }
  }

  initTextBox();
  reset();
  charByChar();
  document.addEventListener("click", clickText);

  let resizeTimer;
  window.addEventListener("resize", function(){
    clearTimeout(timer);
    clearTimeout(resizeTimer);
    resizeTextBox();
    resizeTimer = setTimeout(function() {
      setTimeout(charByChar, printSpeed);
    }, 250);
  });
}
