// -------------------------------------------- Diary relative functions

function displayDiary(){
    const tabImagesToAdd = SplitInTable(getCookieValue("diary_images"));
    updateDiary(tabImagesToAdd);
    // Falta le canvas
    let link = sessionStorage.getItem('diary');
    const img = new Image();
    img.onload =  function() {
     ctx.drawImage(img, windowsValues[4], windowsValues[5], windowsValues[2], windowsValues[3]);
    };
    img.src = link;
}

function SplitInTable(imagesToAdd){
    remember = 0;
    tab = [];
    for(let i=0;i<imagesToAdd.length;i++){
        if(imagesToAdd[i] = ","){
            tab.push(imagesToAdd.substring(0,i));
            remember = i + 1;
        }
    }
    return tab;
}

function updateDiary(){

}
