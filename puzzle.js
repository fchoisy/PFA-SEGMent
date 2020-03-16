/**
* puzzle.js
*
* function related to puzzle pieces management and displaying
*/



/**
* The function parse the different information of the JSON according to the puzzle type
* @param {Int} id
*/
function Puzzled(id){
  const puzzle = whatPuzzleItIs(id);
  if(puzzle[0] == "Text"){
    var digiBox = document.createElement("div");
    digiBox.id = "digiBox";
    setWindowsValues();
    digiBox.style.position = "absolute";
    digiBox.style.left = (windowsValues[4] + 0.35 * windowsValues[2] * windowsValues[6]) + "px";
    digiBox.style.right = (windowsValues[4] + 0.35 * windowsValues[2] * windowsValues[6]) + "px";
    digiBox.style.top = (windowsValues[5] + 0.9 * windowsValues[3] * windowsValues[6]) + "px";
    digiBox.style.height = (0.06 * windowsValues[3] * windowsValues[6]) + "px";
    digiBox.style.fontSize = (0.06 * windowsValues[3] * windowsValues[6]) + "px";
    let digiQuestion = getDigicodeQSF(id, "QUESTION");
    if(digiQuestion == undefined){
      digiQuestion == "";
    }else{
      digiBox.classList.add("defileDigicode");
      let digiSpan = document.createElement("div");
      digiSpan.innerHTML = digiQuestion;
      digiBox.appendChild(digiSpan);
    }

    /**
    * Put the digibox on the right place at the screen
    */
    function deplaceDigiBox(){
      setWindowsValues();
      digiBox.style.left = (windowsValues[4] + 0.35 * windowsValues[2] * windowsValues[6]) + "px";
      digiBox.style.right = (windowsValues[4] + 0.35 * windowsValues[2] * windowsValues[6]) + "px";
      digiBox.style.top = (windowsValues[5] + 0.9 * windowsValues[3] * windowsValues[6]) + "px";
      digiBox.style.height = (0.06 * windowsValues[3] * windowsValues[6]) + "px";
      digiBox.style.fontSize = (0.06 * windowsValues[3] * windowsValues[6]) + "px";
    }
    window.addEventListener("resize", deplaceDigiBox, false);
    document.getElementById("scene").appendChild(digiBox);
    const scene = getSceneByID(id);
    const sceneTextArea = scene.TextAreas;
    const len = sceneTextArea.length;
    let clickz = 0;
    for(let i =0; i<len; i++){
      let heightPourcentage = sceneTextArea[i].Size[1] * scene.ImageSize[0] / scene.ImageSize[1];
      if(sceneTextArea[i].Behaviour == 3){
        clickz = new ClickZone(sceneTextArea[i].Pos[0], sceneTextArea[i].Pos[1], sceneTextArea[i].Size[0] + sceneTextArea[i].Pos[0], heightPourcentage + sceneTextArea[i].Pos[1], ["Validate"], sceneTextArea[i].id);
      }else if(sceneTextArea[i].Behaviour == 2){
        clickz = new ClickZone(sceneTextArea[i].Pos[0],sceneTextArea[i].Pos[1], sceneTextArea[i].Size[0] + sceneTextArea[i].Pos[0], heightPourcentage + sceneTextArea[i].Pos[1], ["Delete"], sceneTextArea[i].id);
      }else if(sceneTextArea[i].Behaviour == 1){
        clickz = new ClickZone(sceneTextArea[i].Pos[0], sceneTextArea[i].Pos[1], sceneTextArea[i].Size[0] + sceneTextArea[i].Pos[0], heightPourcentage + sceneTextArea[i].Pos[1], ["Replace", sceneTextArea[i].Text], sceneTextArea[i].id)
      }else{
        clickz = new ClickZone(sceneTextArea[i].Pos[0], sceneTextArea[i].Pos[1], sceneTextArea[i].Size[0] + sceneTextArea[i].Pos[0], heightPourcentage + sceneTextArea[i].Pos[1], ["Add", sceneTextArea[i].Text], sceneTextArea[i].id);
      }
      digicodeClickZone.push(clickz);
    }
    const transition = getTransitionByID(getTransitions(), puzzle[1]);
    const riddle = transition.Transition.SceneToScene.Riddle;
    let array = [];
    const idTransition = getLastNumberTransition(transition.Transition.SceneToScene.To);
    array.push(riddle.Text.Expected);
    array.push(riddle.Text.FuzzyMatches);
    array.push(idTransition); // Attention cela doit toujours être en dernier
    digicodeClickZone.push(array);
  }else if (puzzle[0] == "Puzzle"){
    isPuzzleScene = true;
    devicePixelRatio = 1;
    let puzzlePieces = getPuzzlepieces(id);
    let diffX;
    let diffY;
    tabPos = [];
    let alreadyVisited =false;
    let statePuzzle = getStateBySceneId(scene_number, getCookieValue("puzzle_pos"));
    if(statePuzzle != ""){
      alreadyVisited = true;
    }
    if(alreadyVisited){
      let tmpTab = statePuzzle.split(",");
      for(let i = 0; i < tmpTab.length / 2; i++){
        let tempo = [0,0];
        tempo[0] = parseFloat(tmpTab[2 * i]);
        tempo[1] = parseFloat(tmpTab[2 * i + 1]);
        tabPos.push(tempo);
      }
    }
    let i;
    let firstLoad = 0;

    /**
    * displays and sets all the elements of a puzzle
    */
    function displayPuzzleImage() {
      setWindowsValues();
      let puzzleImagesZone = document.getElementById("puzzleImages");
      puzzleImagesZone.style.position = "absolute";
      puzzleImagesZone.style.top =  windowsValues[5] + "px";
      puzzleImagesZone.style.bottom =  windowsValues[5] + "px";
      puzzleImagesZone.style.left =  windowsValues[4] + "px";
      puzzleImagesZone.style.right =  windowsValues[4] + "px";
      puzzleImagesZone.innerHTML = "";
      puzzleImagesZone.width = windowsValues[0];
      puzzleImagesZone.height = windowsValues[1];
      let top;
      let left;
      let piece = [];
      let ctx = [];
      let img =[];
      for (let i = 0; i < puzzlePieces.length; i++) {
        piece[i] = document.createElement("canvas");
        piece[i].style.position = "absolute";
        piece[i].width = puzzlePieces[i].Size[0] * windowsValues[2] * windowsValues[6];
        piece[i].height = puzzlePieces[i].Size[1] * windowsValues[2] * windowsValues[6];
        piece[i].id = "draggable" + i;
        piece[i].classList.add("draggable");

        if (firstLoad  != puzzlePieces.length-1 && !alreadyVisited) {
          top = Math.floor(Math.random() * (101 - puzzlePieces[i].Size[1] * windowsValues[2] / windowsValues[3] * 100)) / 100 * windowsValues[3] * windowsValues[6];
          left = Math.floor(Math.random() * (101 - puzzlePieces[i].Size[0] * 100)) / 100 * windowsValues[2] * windowsValues[6];
          firstLoad = i;
          let posImg = [left/(windowsValues[2] * windowsValues[6]),top/(windowsValues[3] * windowsValues[6])];
          tabPos.push(posImg);
        }else{
          top = tabPos[i][1] * windowsValues[3] * windowsValues[6];
          left = tabPos[i][0] * windowsValues[2] * windowsValues[6];
        }
        piece[i].style.top = top + "px";
        piece[i].style.left = left + "px";
        puzzleImagesZone.appendChild(piece[i]);
        ctx[i]=piece[i].getContext("2d");
        $(".draggable").easyDrag({'container': "parent"});
      }
      console.log("ctx",ctx);
      i = 0;
      ctx.forEach(function(item){
        img[i] = new Image();
        img[i].onload =  function(i) {
          item.drawImage(img[i], 0, 0, piece[i].width, piece[i].height);
          console.log("Object drawn !" + i)
        }.bind(this, i);
        img[i].src = getGameFolderURL() + puzzlePieces[i].Image;
        i++;

      });

      diffX = [];
      diffY = [];
      var delta = 0.05;
      let originX = puzzlePieces[0].Pos[0];
      let originY = puzzlePieces[0].Pos[1];
      let imgX;
      let imgY;
      let minX;
      let maxX;
      let minY;
      let maxY;
      for (i = 1; i < puzzlePieces.length; i++) {
        imgX = puzzlePieces[i].Pos[0];
        imgY = puzzlePieces[i].Pos[1];
        minX = (imgX - originX - delta);
        maxX = (imgX - originX + delta);
        minY = (imgY - originY - delta);
        maxY = (imgY - originY + delta);
        diffX.push([minX, maxX]);
        diffY.push([minY, maxY]);
      }
    }
    displayPuzzleImage();
    window.addEventListener("resize", displayPuzzleImage, false);
    let currentOriginX;
    let currentOriginY;
    let currentX;
    let currentY;
    let pourcentX;
    let pourcentY;

    /**
    * stores the position of all the puzzle pieces in the variable "puzzleImagesZone"
    */
    function storeImagePosition(){
      for (i = 0; i < puzzlePieces.length; i++) {
        let puzzleImagesZone = document.getElementById("puzzleImages");
        currentX = parseInt(document.getElementById("draggable" + i).offsetLeft);
        currentY = parseInt(document.getElementById("draggable" + i).offsetTop);
        pourcentX = currentX / (windowsValues[0] - (2 * windowsValues[4]));
        pourcentY = currentY / (windowsValues[1] - (2 * windowsValues[5]));
        tabPos[i][0] = pourcentX;
        tabPos[i][1] = pourcentY;
      }
    }
    window.addEventListener("touchend", storeImagePosition, false);
    window.addEventListener("mouseup", storeImagePosition, false);
    const transition = getTransitionByID(getTransitions(), puzzle[1]);
    const idTransition = getLastNumberTransition(transition.Transition.SceneToScene.To);
    window.addEventListener("mouseup", verify, false);
    window.addEventListener("touchend", verify, false);

    /**
    * TODO
    */
    function verify(){
      currentOriginX = tabPos[0][0];
      currentOriginY = tabPos[0][1];
      let result = true ;
      for (let i = 1; i < puzzlePieces.length; i++) {
        currentX = tabPos[i][0];
        currentY = tabPos[i][1];
        if (!((currentX - currentOriginX) >= diffX[i-1][0] && (currentX - currentOriginX) <= diffX[i-1][1])){
          result = false;
        }
        if (!((currentY - currentOriginY) >= diffY[i-1][0] && (currentY - currentOriginY) <= diffY[i-1][1])){
          result = false;
        }
      }
      if (result) {
        if(isTransitionUnique(findTransitionBySceneId(scene_number))){
          addSkip(scene_number);
        }
        document.cookie = "isback=" + false + ";";
        playSoundTransition(findTransitionBySceneId(scene_number).id);
        let fade = findTransition(getTransitions(), scene_number, idTransition);
        changeScene(event, "game.html", idTransition, false, fade);
      }
    }
  }else if(puzzle[0] == "Gif"){
    const scene = getSceneByID(id);
    let gifs = scene.Gifs;
    let clickz=[];
    let currentGif = [];
    let img;
    let gif;
    let alreadyVisited = false;
    let stateArray = []
    let len = 0;
    const ctx = canvas.getContext("2d");
    for(let i = 0; i < gifs.length; i++){
      gifOnScene.push(0);
    }
    let state = getStateBySceneId(scene_number, getCookieValue("gif_state"));
    if(state != ""){
      state += "/";
      alreadyVisited = true;
      let buffer = "";
      while(len < state.length){
        if(state[len] == "," || state[len] == "/"){
          stateArray.push(parseInt(buffer));
          buffer = "";
        }else{
          buffer += state[len];
        }
        len++;
      }
    }
    gifOK = gifs.length;
    for(let i = 0; i < gifs.length; i++){
      currentGif = gifs[i];
      let heightPourcentage = currentGif.Size[1] * scene.ImageSize[0] / scene.ImageSize[1];
      clickz = new ClickZone(currentGif.Pos[0],currentGif.Pos[1], currentGif.Size[0] + currentGif.Pos[0], heightPourcentage + currentGif.Pos[1], [currentGif.Frames.length, 0, currentGif.Frames, getGifPointedScene(scene_number)], currentGif.id);
      gifClickZone.push(clickz);
      img = document.createElement("img");
      img.setAttribute("id", "gif" + i);
      img.setAttribute("rel:auto_play", "-1");
      img.setAttribute("src", getGameFolderURL() + currentGif.Image);
      let top = windowsValues[5] + clickz.y1 * windowsValues[3] * windowsValues[6];
      let left = windowsValues[4] + clickz.x1* windowsValues[2] * windowsValues[6];
      let width = windowsValues[2] * windowsValues[6] * (clickz.x2 - clickz.x1);
      let height = windowsValues[3] * windowsValues[6] * (clickz.y2 - clickz.y1);
      document.getElementById("gifImages").appendChild(img);
      let gifl= new SuperGif({ gif: img, imageX: left, imageY: top, imageWidth: width, imageHeight: height});
      var fram = 0;
      if(alreadyVisited){
        fram = stateArray[i];
      }
      gifl.load(fram,function(){
        gifOnScene[i] = gifl;
        gifOK--;
        gifl.pause();
        if(gifOK == 0){
          handler();
        }
      });
    }
  }
}
