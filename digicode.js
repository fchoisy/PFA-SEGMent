/**
* digicode.js
*
* functions related to the management of the inputs (question, answer, deletion) for the digicode
*/



/*
* Implements the validation behavior of a digicode click zone
*/
function validatingBuffer(){
  const answer = digicodeClickZone[digicodeClickZone.length-1];
  const len = answer[1].length;
  if(buffer == answer[0]){
    return true;
  }
  for(let i = 0; i < len; i++){
    if(buffer == answer[1][i]){
      return true ;
    }
  }
  buffer = "";
  return false;
}

/**
* Implements the replacing behavior of a digicode click zone
* @param {String} digi
*/
function changingBuffer(digi){
  buffer = digi;
}

/**
* Implements the adding behavior of a digicode click zone
* @param {String} digi
*/
function addingBuffer(digi){
  buffer = buffer + digi;
}

/*
* Implements the deleting behavior of a digicode click zone
*/
function deletingBuffer(){
  if(buffer.length == 0){
    return;
  }else{
    buffer = buffer.substring(0, buffer.length-1);
  }
}
