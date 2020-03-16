/**
* diary.js
*
* function related to the diary displaying and management
*/



/**
* Display the diary by hiding the playing canvas and displaying the diary canvas
*/
function displayDiary(){
    document.getElementById("diaryDisplayedCanvas").style.display = "initial";
    document.getElementById("canvas").style.display = "none";
}

/**
* Function that update the ghost canvas and the diaryDisplayedCanvas
* Add the image of the scene or just rewrite the same diary as the previous
* scene
*/
function updateDiary(){
    let canvasSize = getCookieValue("canvas_size");
    console.log(canvasSize.split(","));
    const canvas = document.getElementById("diaryCanvas");
    const canvasDisplayed = document.getElementById("diaryDisplayedCanvas");
    canvasDisplayed.style.display = "none";
    canvas.style.display = "none";
    setWindowsValues();
    canvasDisplayed.position = "absolute";
    canvasDisplayed.style.top = windowsValues[5]+"px";
    canvasDisplayed.style.left = windowsValues[4] +"px";
    canvasDisplayed.width = Math.ceil(windowsValues[0]-2*windowsValues[4]);
    canvasDisplayed.height = Math.ceil(windowsValues[1]-2*windowsValues[5]);
    let ctx=canvas.getContext("2d");
    let ctxDisp = canvasDisplayed.getContext("2d");
    let link = sessionStorage.getItem('diary');
    let img = new Image();
    if(link==""){
            console.log(addedToDiary);
            let img1 = new Image();
            img1.src = addedToDiary;
            img1.onload = function(){
                canvasSize = [Math.min(this.width,1280),Math.min(this.height,720)];
                canvas.width = canvasSize[0];
                canvas.height = canvasSize[1];
                console.log(canvasSize);
                document.cookie = "canvas_size=" + canvasSize + ";";
                drawPicture(addedToDiary,ctx,canvas,canvasDisplayed,ctxDisp,canvasSize,true);
            }
    }else{
        canvasSize = canvasSize.split(",");
        img.src = link;
        img.onload =  function() {
            canvas.width = canvasSize[0];
            canvas.height = canvasSize[1];
            ctx.drawImage(img,0,0,canvasSize[0],canvasSize[1]);
            if(addedToDiary == ""){
                ctxDisp.drawImage(img,0,0,canvasDisplayed.width,canvasDisplayed.height);
                if(!diaryLoaded){
                    diaryLoaded = true;
                    handler();
                }
            }else{
                drawPicture(addedToDiary,ctx,canvas,canvasDisplayed,ctxDisp,canvasSize,false);
            }
        };
    }
}

/**
* Function that update the ghost canvas and the diaryDisplayedCanvas
* Add the image of the scene or just rewrite the same diary as the previous
* scene
* @param {String} link Link to the image to draw on diary
* @param {Context element} ctx context of the ghost canvas
* @param {Canvas element} canvas ghost canvas
* @param {Canvas element} canvasDisplayed displayed canvas
* @param {Context element} ctxDisp context of the displayed canvas
* @param {Table} canvasSize width and height of ghost canvas
* @param {Boolean} first is it the first image to draw (if so,
* draw diary icon on canvas)
*/
function drawPicture(link,ctx,canvas,canvasDisplayed,ctxDisp,canvasSize,first){
    let img = new Image();
    //Recup dans le storage
    img.src = link;
    img.onload = function() {
        ctx.drawImage(img,0,0,canvasSize[0],canvasSize[1]);
        let img1 = new Image();
        var l = canvas.toDataURL();
        img1.src = l;
        img1.onload = function(){
            console.log(img1.src);
            ctxDisp.drawImage(img1,0,0,canvasDisplayed.width,canvasDisplayed.height);
            if(first){
                displayDiaryIcon(canvas,ctx,canvasDisplayed,ctxDisp);
            }else{
                sessionStorage.setItem('diary',l);
                diaryLoaded = true;
                handler();
            }
        }
    };
    img.onerror = function(){
        alert("L'image de journal à ajouter a été mal renseignée et n'a pas pu être trouvée");
    };
}

function resizeDiary(){
    const canvasDisplayed = document.getElementById("diaryDisplayedCanvas");
    setWindowsValues();
    canvasDisplayed.position = "absolute";
    canvasDisplayed.style.top = windowsValues[5]+"px";
    canvasDisplayed.style.left = windowsValues[4] +"px";
    canvasDisplayed.width = Math.ceil(windowsValues[0]-2*windowsValues[4]);
    canvasDisplayed.height = Math.ceil(windowsValues[1]-2*windowsValues[5]);
    let ctxDisp = canvasDisplayed.getContext("2d");
    let link = sessionStorage.getItem('diary');
    let img = new Image();
    img.src = link;
    img.onload = function(){
        ctxDisp.drawImage(img,0,0,canvasDisplayed.width,canvasDisplayed.height);
    };
}

/**
* Store the diary images contained in the opening text in addedToDiary
* @param {String} text Opening text
*/
function getDiaryFromText(text){
    let i = 0
    while(text[i] == " " && i<text.length){
        i++;
    }
    buffer = "";
    if(text[i] == "|"){
        diaryOnScene = true;
        flashingDiary = true;
        document.cookie = "diary_on_scene=true;";
        i++;
        while(text[i] != "|"){
            buffer += text[i];
            i++;
        }
        i++;
    }
    if(text[i] == "["){
        diaryOnScene = true;
        document.cookie = "diary_on_scene=true;";
        i++;
        while(text[i] != "]"){
            buffer += text[i]
            i++;
        }
        i++;
    }
    return [buffer,i];
}

/**
* Draw the diary icon on both canvas
* @param {Canvas element} canvas ghost canvas
* @param {Context element} ctx context of the ghost canvas
* @param {Canvas element} canvasDisplayed displayed canvas
* @param {Context element} ctxDisp context of the displayed canvas
*/
function displayDiaryIcon(canvas,ctx,canvasDisplayed,ctxDisp){
    var img = new Image();
    img.src =  "diaryicon.png";
    console.log("kikou");
    img.onload = function() {
        ctx.drawImage(img, 0.92*canvas.width, (0.97 * canvas.height - 0.05 * canvas.width), 0.05 * canvas.width, 0.05*canvas.width);
        var img1 = new Image();
        img1.src = "diaryicon.png";
        // img1.class = "diary-blink"; A TESTER (animation clignotement)
        var l = canvas.toDataURL();
        sessionStorage.setItem('diary',l);
        img1.onload = function() {
            ctxDisp.drawImage(img1, 0.92*canvasDisplayed.width, (0.97 * canvasDisplayed.height - 0.05 * canvasDisplayed.width), 0.05 * canvasDisplayed.width, 0.05*canvasDisplayed.width);
            diaryLoaded = true;
            console.log("Hey");
            handler();
        }
    };
}
