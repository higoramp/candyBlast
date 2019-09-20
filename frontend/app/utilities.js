
//===UTILITIES



function playMusic() {
    if (sndMusic&&!sndMusic.isPlaying()) {
        sndMusic.setVolume(0.25);
        sndMusic.setLoop(true);
        sndMusic.play();
    }

}

function disableSound() {
    getAudioContext().suspend();

    soundEnabled = false;
}

function enableSound() {
    soundEnabled = true;
    getAudioContext().resume();
}

//Call this function on sound button click
function toggleSound() {
    if (canMute) {

        canMute = false;

        if (soundEnabled) {
            disableSound();
        } else {enableSound();
        }

        //A timeout is required to prevent double registering of touch input on mobile
        setTimeout(() => {
            canMute = true;
        }, 100);
    }

}

//===Basic Sound button with an on/off function
function SoundButton() {
    this.pos = createVector(50, 50);
    this.size = createVector(objSize, objSize);

    this.render = function () {
        this.pos.x = width - this.size.x * 1.5;
        this.pos.y = height - this.size.y * 1.5;

        let img;
        if (soundEnabled) {
            img = soundImage;
        } else {
            img = muteImage;
        }

        image(img, this.pos.x, this.pos.y, this.size.x, this.size.y); //draw
    }

    this.checkClick = function () {

        if (mouseX >= this.pos.x &&
            mouseX <= this.pos.x + this.size.x &&
            mouseY >= this.pos.y &&
            mouseY <= this.pos.y + this.size.y) {
            return true;
        } else {
            return false;
        }
    }

}

class MessageBox {
    
    //Position 2 = middle
    constructor(text, widthBox, heightBox, position=2, sizeText = 18) {
      this.width = 0;
      this.height = 0;
      this.color = "#da79f1";			//Background color of the clickable
      this.cornerRadius = 10;			//Corner radius of the clickable
      this.strokeWeight = 2;			//Stroke width of the clickable
      this.stroke = "#000000";		//Border color of the clickable
      this.text = text;			//Text of the clickable
      this.textColor = "#FFFFFF";	
      this.textSize = sizeText;
      this.lines=this.text.split('\n').length;
      this.removable = false;
      textSize(this.textSize);
      let tWidth = textWidth(this.text.split('\n')[0]);
      if(!widthBox){
        widthBox=tWidth*1.2;
      }
      if(!heightBox){
        heightBox = textAscent()*this.lines*1.5;
        console.log(textAscent());
      }
      this.finalWidth = widthBox;
      this.finalHeight = heightBox;
      this.position = position;
      this.pos = createVector(width/2 - this.width / 2, height / position - this.height/2);

      this.posText = createVector(this.pos.x+tWidth/2, this.pos.y-this.lines*this.textSize/2);
      
    }

    update() {
      this.width = Smooth(this.width, this.finalWidth, 18);
      this.height = Smooth(this.height, this.finalHeight, 18);
      this.pos = createVector(width / 2 - this.width / 2, height / this.position - this.height/2);
    }

    render(){
      fill(this.color);
		  stroke(this.stroke);
		  
      rect(this.pos.x, this.pos.y, this.width, this.height, this.cornerRadius);
  
      if(this.width>=this.finalWidth*0.8){
        textSize(this.textSize);
        let tWidth = textWidth(this.text.split('\n')[0]);
        strokeWeight(0.5);
        fill(this.textColor);
        text(this.text, this.posText.x, this.posText.y);
      }

    }

    checkClick() {
        if (mouseX < this.pos.x ||
            mouseX > this.pos.x + this.finalWidth ||
            mouseY < this.pos.y ||
            mouseY > this.pos.y +this.finalHeight) {
            return true;
        } else {
            return false;
        }
    }
}

class PanelBox extends MessageBox {
     constructor(text, width, height, callback, img = imgNext) {
         super(text, width, height, 3, 24);//Position = TOP
         this.imgBp = panelBackground;
         this.buttons=[];
         this.posText.y=this.posText.y-this.finalHeight/8;
         this.pos.y=this.pos.y*0.8;
         this.callback = callback;
         this.addButton(img);
     }

     addButton(img){
         let sizeButton=objSize*3;
         let x = this.pos.x;
         let y = this.pos.y+this.finalHeight/3;
         this.buttons.push(new Button(img,x, y, sizeButton, sizeButton , this.callback));
     }

      render(){
      fill(this.color);
	  stroke(this.stroke);

       push();
       translate(this.pos.x, this.pos.y);
       image(this.imgBp, 0, 0, this.width, this.height);
       pop();
		  
      if(this.width>=this.finalWidth*0.8){
        textSize(this.textSize);
        let tWidth = textWidth(this.text.split('\n')[0]);
        strokeWeight(0.5);
        fill(this.textColor);
        text(this.text, this.posText.x, this.posText.y);

        //render buttons
        for(let btt of this.buttons){
            btt.update();
            btt.render();
        }
      }
      

    }

    checkClick() {
        let click=false;
        for(let btt of this.buttons){
          click=btt.checkClick()||click;
        }
        return click;
    }
    
}

class Button {
    constructor (img, x, y, width, height, callback){
        this.img = img;
        this.pos = createVector(x, y);
        this.finalWidth = width;
        this.finalHeight = height;
        this.width = 0;
        this.height = 0;
        this.callback = callback;
             console.log(callback);
         console.log("CALLBACK");
    }

    update(){
        this.width = Smooth(this.width, this.finalWidth, 18);
        this.height = Smooth(this.height, this.finalHeight, 18);
    }

    render(){
       push();
       translate(this.pos.x, this.pos.y);
       image(this.img, -this.width/2, -this.height/2, this.width, this.height);
       pop();
    }

    checkClick() {
        if (mouseX >= this.pos.x -this.finalWidth/2 &&
            mouseX <= this.pos.x + this.finalWidth/2 &&
            mouseY >= this.pos.y-this.finalHeight/2 &&
            mouseY <= this.pos.y +this.finalHeight/2) {
            
            this.width = this.width*0.8;
            this.height = this.height*0.8;
            setTimeout(()=>{
                console.log(this.callback);
                this.callback();
                return true;
            }, 500);
            
        } else {
            return false;
        }
    }
}

class PlayButton {
    constructor() {
        this.btn = new Clickable();
        this.btn.textSize = floor(objSize * 0.9);
        this.btn.text = Koji.config.strings.playButtonText;
        this.btn.textColor = Koji.config.colors.buttonTextColor;

        this.size = createVector(this.btn.textWidth, this.btn.textSize);
        this.pos = createVector(width / 2 - this.size.x / 2, height / 2 - this.size.y / 2 + objSize * 2);

        if (this.size.y > width) {
            this.size.y = width;
        }

        this.btn.resize(this.size.x, this.size.y);

        this.btn.strokeWeight = 0;


        this.btn.onHover = function () {
            this.color = Koji.config.colors.buttonHoverColor;
        }
        this.btn.onOutside = function () {
            this.color = Koji.config.colors.buttonColor;
        }
        this.btn.onPress = function () {
            this.color = Koji.config.colors.buttonClickColor;
        }
        this.btn.onRelease = function () {
            gameBeginning = false;
            init();
        }
    }

    update() {

        //Resize button to fit text
        this.btn.textSize = floor(objSize * 0.9);
        this.size = createVector(this.btn.textWidth * 1.5, this.btn.textSize * 3);

        if (this.size.y > width) {
            this.size.y = width;
        }
        this.btn.resize(this.size.x, this.size.y);

        this.pos.x = width / 2 - this.size.x / 2;
        this.pos.y = height / 2 - this.size.y / 2 + objSize * 2;
        this.btn.locate(this.pos.x, this.pos.y);
    }
}

class LeaderboardButton {
    constructor() {
        this.btn = new Clickable();
        this.btn.textSize = floor(objSize * 0.9);
        this.btn.text = Koji.config.strings.leaderboardButtonText;
        this.btn.textColor = Koji.config.colors.buttonTextColor;

        this.size = createVector(this.btn.textWidth, this.btn.textSize);
        this.pos = createVector(width / 2 - this.size.x / 2, height/2 - this.size.y / 2 - objSize * 2);

        if (this.size.y > width) {
            this.size.y = width;
        }

        this.btn.resize(this.size.x, this.size.y);

        this.btn.strokeWeight = 0;


        this.btn.onHover = function () {
            this.color = Koji.config.colors.buttonHoverColor;
        }
        this.btn.onOutside = function () {
            this.color = Koji.config.colors.buttonColor;
        }
        this.btn.onPress = function () {
            this.color = Koji.config.colors.buttonClickColor;
        }
        this.btn.onRelease = function () {
            window.setAppView("leaderboard");
           
        }
    }

    update() {

        //Resize button to fit text
        this.btn.textSize = floor(objSize * 0.9);
        this.size = createVector(this.btn.textWidth * 1.5, this.btn.textSize * 3);

        if (this.size.y > width) {
            this.size.y = width;
        }
        this.btn.resize(this.size.x, this.size.y);

        this.pos.x = width / 2 - this.size.x / 2;
        this.pos.y = height/2 + this.size.y / 2 + objSize * 3;
        this.btn.locate(this.pos.x, this.pos.y);
    }
}

/*
    Basic smoothing function
    v = ((v * (N - 1)) + w) / N; 

    v - current value
    w - goal value
    The higher the factor, the slower v approaches w.
*/
function Smooth(current, goal, factor) {
    return ((current * (factor - 1)) + goal) / factor;
}


//===Isolate the font name from the font link provided in game settings
function getFontFamily(ff) {
    const start = ff.indexOf('family=');
    if (start === -1) return 'sans-serif';
    let end = ff.indexOf('&', start);
    if (end === -1) end = undefined;
    return ff.slice(start + 7, end);
}

//Returns true if the user is on mobile
//Use a global boolean like isMobile = detectMobile();
function detectMobile() {
    var check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};



//===Sine function, used for oscillations
function Sinusoid(value, frequency, amplitude, timer) {

    let val = value + (amplitude * Math.sin(timer * frequency));

    return val;
}



//===COsine function, used for oscillations
function Cosine(value, frequency, amplitude, timer) {

    let val = value + (amplitude * Math.cos(timer * frequency));

    return val;
}

function submitScore() {
   
  window.setScore(score);
  window.setAppView("setScore");
}

