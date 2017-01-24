//report information
var numKeysPressed = 0;
var numChars = 0;
var numWords = 0;

//creating and initialising the canvas
var myCanvas = document.createElement("canvas");
myCanvas.width=1000;
myCanvas.height=1000;
var ctx = myCanvas.getContext("2d");

//array of CSS colours to use
var colours = ["#a0d0ff","#a3d3ff","#a6d6ff","#a9d9ff","#acdcff","#afdfff"];

function drawCircles() {
  ctx.clearRect(0,0,1000,1000);
  //create 100x100 circles
  for (i=0;i<11;i++){
    for(j=0;j<11;j++){

      ctx.beginPath();
      //draw a circle
      ctx.arc(100*j, 100*i, 100, 0, Math.PI * 2, false);

      //set transparency for all circles
      ctx.globalAlpha = 0.2;
      //choose a random index from the colours array
      var randomIndex = Math.round(Math.random() * (colours.length-1));
      ctx.fillStyle = colours[randomIndex];
      //fill the circle with the randomly selected colour
      ctx.fill();
      //done drawing circle
      ctx.closePath();
    }
  }
}

//sets the circles drawn as the background
function setDynamicBackground(){
  drawCircles();
  var imageDataURL = myCanvas.toDataURL();
  document.body.style.background = 
  "transparent url('"+imageDataURL+"') repeat";
}


function countWords(){
  s = document.getElementById("textbox").value;
  s = s.replace(/(^\s*)|(\s*$)/gi,"");
  s = s.replace(/[ ]{2,}/gi," ");
  s = s.replace(/\n /,"\n");
  numWords = s.split(' ').length;
}

//var startHour, startMin, startSec, startMilli;
var timeHour, timeMin, timeSec, timeMilli;

var startTime, endTime, elapsedTime;

var TAB_KEY = 9;
var ENTER_KEY = 13;
var CTRL_KEY = 17;
var ALT_KEY = 18;
var CAPS_LOCK_KEY = 20;
var E_KEY = 101;
var OPEN_CURLY_BRACKET = 123;
var CLOSE_CURLY_BRACKET = 125;
var TILDE_KEY = 126;
var prevKey = null;

//key that stops the timer when pressed
var endKey = TILDE_KEY;

function initTimer() {
  startTime = new Date();
}

function stopTimer() {
  endTime = new Date();

  elapsedTime = endTime - startTime;
  timeMilli = elapsedTime % 1000;
  elapsedTime /= 1000;
  timeSec = Math.round(elapsedTime % 60);
  elapsedTime = Math.floor(elapsedTime / 60);
  timeMin = Math.round(elapsedTime % 60);
  elapsedTime = Math.floor(elapsedTime / 60);
  timeHour = Math.round(elapsedTime % 24);

  //for checking
  console.log("Minutes = " + timeMin);
  console.log("Seconds = " + timeSec);
  console.log("Milli = " + timeMilli);
}

function indent() {
  //TODO: Override tab switch default
  //TODO: Input 3 white spaces to act as a tab
}

function unindent() {
  //TODO: Override tab switch default
  //TODO: Remove 3 white spaces IF spaces exist. Else, do nothing.
}

//detects keys being pressed
function keyPress(e){
  var key;

  var modal = document.getElementById('endModal');
  modal.style.display = "none";

  if(window.event) { // IE                    
    key = e.keyCode;
  } else if(e.which){ // Netscape/Firefox/Opera                   
    key = e.which;
  }

  //first key pressed
  if (prevKey == null) {
    initTimer();
  }

  prevKey = key;

  //end key pressed
  if (key == endKey) {
    stopTimer();

    //start endModal report
    var text = document.getElementById('modalTime');
    //make modal visible
    modal.style.display = "block";
    text.innerHTML = "You pressed " + numKeysPressed + " keys in ";
    text.innerHTML += (timeHour == 0) ? "" : timeHour + " hour";
    text.innerHTML += (timeMin == 0) ? "" : timeMin + " minute";
    text.innerHTML += timeSec + " second";
    text.innerHTML += (timeSec == 1) ? " " : "s ";
    text.innerHTML += timeMilli + " millisecond";
    text.innerHTML += (timeMilli == 1) ? "." : "s.";
    countWords();
    text.innerHTML += "<br> You typed " + numWords + " words.";
    var totalSeconds = timeHour * 3600 + timeMin * 60 + timeSec;
    if (totalSeconds != 0) {
      text.innerHTML += "<br> You pressed " + numKeysPressed / totalSeconds + " keys per second."; 
      text.innerHTML += "<br> You typed " + numWords / totalSeconds + " words per second.";
    }

    var span = document.getElementsByClassName("close")[0];
    span.onclick = function() {
      modal.style.display = "none";
    }

    //reset timer
    prevKey = null;
    initTimer();
    //reset presses
    numKeysPressed = 0;
  }

  if (key == TAB_KEY) {
    indent();
  }

  if (key == ENTER_KEY) {
    //Function not implemented yet
    //scrollToBottom();
    if (prevKey == OPEN_CURLY_BRACKET) {
      //TODO: auto indent next line
      indent();
    }
    if (prevKey == CLOSE_CURLY_BRACKET) {
      //TODO: auto unindent next line
      unindent();
    }
  }

  //For checking purposes
  console.log(key);

  numKeysPressed++;

  //NOTE: Commented out because it causes a lot of lag
  //change the background every time a key is pressed
  //setDynamicBackground();
}