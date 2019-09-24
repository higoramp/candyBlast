let myFont; //The font we'll use throughout the app
let titleFont;

let gameOver = false; //If it's true the game will render the main menu
let gameBeginning = true; //Should be true only before the user starts the game for the first time
let stateGame = 'gamebeginning';//COuld be gamebeginning, playing, chooselevel or gameover
//===Game objects
//Declare game objects here like player, enemies etc
let balloons = [];
let balloonsParticles = [];
let popEffects = [];
let messageBox = [];

let levelsMap = [];


//===Buttons
let playButton;
let soundButton;
let leaderboardButton;
let chooselevelButton;
//Control game variables
let minVelocityY = 0;
let maxVelocityY;

let minVelocityX = 0;
let maxVelocityX;

let marginH = 50;
let marginV = 50;

let currentLevel = 0;

let clicksAvailable = 1;
let levelComplete = false;

let isClicking = false;

let nColumns;
let nRows;

let rowSize;
let columnSize;


//===Data taken from Game Settings


//===Score data

//===Images
let imgBackground;

let imgBalloon = [];
let imgBalloonParticle;
let imgPopEffect;

let panelBackground;
let imgNext;
let imgRetry;

//===Audio
let sndMusic;
let sndPop = [];

let levelUp;

let soundEnabled = true;
let canMute = true;

let soundImage;
let muteImage;


//===Size stuff
let objSize; //base size modifier of all objects, calculated based on screen size

//game size in tiles, using bigger numbers will decrease individual object sizes but allow more objects to fit the screen
//Keep in mind that if you change this, you might need to change text sizes as well
let gameSize = 18;


let isMobile = false;
let touching = false;




//===Load this before starting the game
function preload() {
  console.log("PRELOAD");
  console.log(this);
    //===Load font from google fonts link provided in game settings
    var link = document.createElement('link');
    link.href = Koji.config.strings.fontFamily;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    myFont = getFontFamily(Koji.config.strings.fontFamily);
    let newStr = myFont.replace("+", " ");
    myFont = newStr;
    var link = document.createElement('link');
    link.href = Koji.config.strings.titleFont;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    titleFont = getFontFamily(Koji.config.strings.titleFont).replace("+", " ");
    //===
    //===Load images

    //Load background if there's any
    if (Koji.config.images.background != "") {
        imgBackground = loadImage(Koji.config.images.background);
    }

    imgBalloon[0] = loadImage(Koji.config.images.candy1);
    imgBalloon[1] = loadImage(Koji.config.images.candy2);
    imgBalloon[2] = loadImage(Koji.config.images.candy3);
    imgBalloon[3] = loadImage(Koji.config.images.candy4);

    imgBalloonParticle = loadImage(Koji.config.images.duckSmall);
    panelBackground = loadImage(Koji.config.images.panelBackground);
    imgPopEffect = loadImage(Koji.config.images.popEffect);
    imgNext = loadImage(Koji.config.images.next);
    imgRetry = loadImage(Koji.config.images.retry);
    soundImage = loadImage(Koji.config.images.soundImage);
    muteImage = loadImage(Koji.config.images.muteImage);

    soundFormats('wav', 'mp3');

    //===Load Soundsfiring


    if (Koji.config.sounds.pop3) sndPop = loadSound(Koji.config.sounds.pop3);
    if (Koji.config.sounds.shot) sndShot = loadSound(Koji.config.sounds.shot);
    if (Koji.config.sounds.levelup) levelup = loadSound(Koji.config.sounds.levelup);
    //Background sound
    if (Koji.config.sounds.backgroundMusic) sndMusic = loadSound(Koji.config.sounds.backgroundMusic);

    //COlumns and rows
    nColumns = parseInt(Koji.config.levels.columns);
    nRows = parseInt(Koji.config.levels.rows);

    //Load levels Map
    levelsMap = Koji.config.levels.levelsMap;


}
function setup() {
    console.log("SETUP");
    // make a full screen canvas
    width = window.innerWidth;
    height = window.innerHeight;

    window.addEventListener('resize', resize, false);
    //Dont know Why touchStarted is not called on firefox
    window.addEventListener('mousedown', e => {
        touchStarted();
    });
    
		//delay animations candies
		for (let candy of imgBalloon){
			candy.delay(400);
		}

    //===How much of the screen should the game take
    let sizeModifier = 0.75;
    if (height > width) {
        sizeModifier = 1;
    }

    let canvas=createCanvas(width, height);

    
    objSize = floor(min(floor(width / gameSize), floor(height / gameSize)) * sizeModifier);

    maxVelocityX = objSize/10;
    maxVelocityY = objSize/10;
    console.log("OBJ SIZE:"+objSize);
    console.log("velocity: "+maxVelocityX+":"+maxVelocityY);
    
    columnSize = (width-2*marginH)/nColumns;
    rowSize =(height-2*marginV)/nRows;

    console.log(columnSize);
    console.log(rowSize);

    isMobile = detectMobile();

    textFont(myFont); //set our font
   
    document.body.style.fontFamily = myFont;

    playButton = new PlayButton();
    soundButton = new SoundButton();
    leaderboardButton = new LeaderboardButton();
    chooselevelButton = new ChooseLevelButton();

    stateGame = "gamebeginning";
    currentLevel = 0;
   

}
function resize(){
    resizeCanvas(window.innerWidth, window.innerHeight);
}

function checkGameOver(){
    if(!levelComplete){
        if(balloons.length==0){
        if (levelsMap.length>(currentLevel+1)){
            pushMessage("Great! Next level", imgNext, ()=>{
               
                currentLevel++;
                let lastLevel = localStorage.getItem("lastLevel", 0);
                if (currentLevel>lastLevel){
                    localStorage.setItem("lastLevel", currentLevel);
                }
                
                
                loadMap();
            });
        }else{
         
            pushMessage("Congratulations!\n No more levels!", imgNext, ()=>{
                stateGame = "gamebeginning";
            });
        
        }
        
        levelComplete = true;
        }else{
            if(clicksAvailable==0 && balloonsParticles.length==0&&popEffects.length==0){
                if (balloons.filter((value)=>value.popping == true || value.popped).length==0){
                    levelComplete = true;
        
                    pushMessage("Try Again?",  imgRetry, ()=>{
                        loadMap();
                    });
                   
                }
            }
        }
    }
}

function pushMessage(text, img, callback){
    setTimeout(()=>{
        let wPanel;
        let hPanel;
        if(width>height){
            wPanel = Math.floor(width*0.5);
        }else{
            wPanel = Math.floor(width*0.8);
        }
        hPanel=Math.floor(wPanel/1.25);
        messageBox.push(new PanelBox(text, wPanel, hPanel, callback, img));
    }, 1500);

}

function draw() {
    //Draw background or a solid color
    if (imgBackground) {
        background(imgBackground);
    } else {
        background(Koji.config.colors.backgroundColor);
    }

    //===Draw UI
    if (stateGame == "gamebeginning") {

        //===Draw title
        let titleText = Koji.config.strings.title;
        let titleSize = floor(objSize * 2.5);
        textSize(titleSize);

        //Resize title until it fits the screen
        while (textWidth(titleText) > width * 0.9) {
            titleSize *= 0.9;
            textSize(titleSize);
        }
        textFont(titleFont); //set our font
        fill(Koji.config.colors.titleColor);
        textAlign(CENTER, TOP);
        text(Koji.config.strings.title, width / 2, objSize * 3);
        
        //===Draw instructions
        textFont(myFont); //set our font
        let instructionsText = [];
        instructionsText[0] = Koji.config.strings.instructions1;
        instructionsText[1] = Koji.config.strings.instructions2;
        instructionsText[2] = Koji.config.strings.instructions3;

        let instructionsSize = [];

        for (let i = 0; i < instructionsText.length; i++) {
            instructionsSize[i] = floor(objSize * 0.75);
            textSize(instructionsSize[i]);

            //Resize text until it fits the screen
            while (textWidth(instructionsText[i]) > width * 0.9) {
                instructionsSize[i] *= 0.9;
                textSize(instructionsSize[i]);
            }
        }
        textAlign(CENTER, CENTER);
        textSize(instructionsSize[0]);
        fill(Koji.config.colors.instructionsColor);
        
        text(instructionsText[0], width / 2, objSize * 8);

        textSize(instructionsSize[1]);
        fill(Koji.config.colors.instructionsColor);
        textAlign(CENTER, CENTER);
        text(instructionsText[1], width / 2, objSize * 10);

        textSize(instructionsSize[2]);
        fill(Koji.config.colors.instructionsColor);
        textAlign(CENTER, CENTER);
        text(instructionsText[2], width / 2, objSize * 12);


        //===
        playButton.update();
        playButton.btn.draw();

        // leaderboardButton.update();
        // leaderboardButton.btn.draw();

        
        chooselevelButton.update();
        chooselevelButton.btn.draw();


    } else {

        if(stateGame =="playing"){

            //Update and render all game objects here

            for (let i = 0; i < balloons.length; i++) {
                balloons[i].update();
                balloons[i].render();
            }



            for (let i = 0; i < balloonsParticles.length; i++) {
                balloonsParticles[i].update();
                balloonsParticles[i].render();
            }

            //===Update all floating text objects
            for (let i = 0; i < floatingTexts.length; i++) {
                floatingTexts[i].update();
                floatingTexts[i].render();
            }

            //Update pop Effects
            //===Update all floating text objects
            for (let i = 0; i < popEffects.length; i++) {
                popEffects[i].update();
                popEffects[i].render();
            }
            //Message box
            for (let i = 0; i < messageBox.length; i++) {
                messageBox[i].update();
                messageBox[i].render();
            }

            
            //===Score draw
            let clicksX = width - objSize / 2;
            let clicksY = objSize / 3;
            textSize(objSize * 2);
            fill(Koji.config.colors.scoreColor);
            textAlign(RIGHT, TOP);
            text("Moves: "+clicksAvailable, clicksX, clicksY);

            //Level draw
            
            
            textSize(objSize * 2);
            let textLevel= "Level: "+(currentLevel+1);
            let widthT = textWidth(textLevel);
            clicksX = widthT*1.1;
            clicksY = objSize / 3;
            fill(Koji.config.colors.scoreColor);
            text(textLevel, clicksX, clicksY);

            
            cleanup();
            checkGameOver();
        }else{
            //Choose level....
        }

    }

    soundButton.render();
}

function loadMap(){
    let map = levelsMap[currentLevel];
    levelComplete = false;
    balloons = [];
    balloonsParticles =[];
    messageBox = [];
    clicksAvailable = map['maxClicks'];
    helpText = map['helpText'];
    map = map['map'];

     for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map.length; j++) {
            if(map[i][j]>=0){
                createBalloon(map[i][j], i, j);
            }
        }
     }
     if (helpText){
         messageBox.push(new MessageBox(helpText));
     }
}

//===Go through objects and see which ones need to be removed
//A good practive would be for objects to have a boolean like removable, and here you would go through all objects and remove them if they have removable = true;
function cleanup() {
    for (let i = 0; i < floatingTexts.length; i++) {
        if (floatingTexts[i].timer <= 0) {
            floatingTexts.splice(i, 1);
        }
    }

    //Check to see if a Duck is popped
    for (let i = 0; i < balloons.length; i++) {
        if (balloons[i].popped) {
           
         

            sndPop.play();
            
            balloons[i].removable = true;
        }

      
        if (balloons[i].outOfScreen) {
            //remove?
        }

        if (balloons[i].removable) {
            balloons.splice(i, 1);
        }
    }

    for (let i = 0; i < balloonsParticles.length; i++) {
        if (balloonsParticles[i].removable) {
            balloonsParticles.splice(i, 1);
        }
    }

    for (let i = 0; i < popEffects.length; i++) {
        if (popEffects[i].removable) {
            popEffects.splice(i, 1);
        }
    }
    for (let i = 0; i < messageBox.length; i++) {
        if (messageBox[i].removable) {
            messageBox.splice(i, 1);
        }
    }

    
}

//===Handle input

function touchStarted() {

    if (soundButton && soundButton.checkClick()) {
        toggleSound();
        return;
    }

    if (stateGame=="playing") {
			console.log("TOuch "+mouseX+": "+mouseY);
        //Ingame
        if (!isClicking){ //Prevent accidental double click
            if(clicksAvailable>0){
                for (let i = 0; i < balloons.length; i++) {
                    if (balloons[i].checkClick()) {
                        balloons[i].popIt();
                        clicksAvailable--;
                        break;
                    }
                }
            }
            for (let i = 0; i < messageBox.length; i++) {
                if (messageBox[i].checkClick()) {
                    messageBox[i].removable = true;
                    break;
                }
            }

            setTimeout(() => {
                isClicking = false;
            }, 500);


        }
        
        
        isClicking = true;
    }
}

function touchEnded() {
    
    //===This is required to fix a problem where the music sometimes doesn't start on mobile
    if (soundEnabled) {
        if (getAudioContext().state !== 'running') {
            getAudioContext().resume();
        }
    }
}

//===Call this every time you want to start or reset the game
//This is a good place to clear all arrays like enemies, bullets etc before starting a new game
function init() {
    stateGame = 'playing';

    floatingTexts = [];

    balloons = [];
    balloonsParticles = [];

    messageBox = [];

    playMusic();
    loadMap();

    
}



function createBalloon(type, row, column) {
    let pos = createVector(column*columnSize+marginH+columnSize/2, row*rowSize+marginV+rowSize/2);
    balloons.push(new Balloon(pos.x, pos.y, type));

    console.log("BAlloon at: "+pos.x+":"+pos.y);

}


function pushText(text, color, size, timer=1, line=0){
    textSize(size);

    //Resize until it fits the screen
    while (textWidth(text) > width * 0.9) {
        size *= 0.9;
        textSize(size);
    }
    floatingTexts.push(new FloatingText(width / 2, height / 2 - objSize * 3 +size*line, text, color, size, timer));
}



//===Floating text used for score
function FloatingText(x, y, txt, color, size, timer=1) {
    this.pos = createVector(x, y);
    this.size = 1;
    this.maxSize = size;
    this.timer = timer;
    this.txt = txt;
    this.color = color;

    this.update = function () {

        if (this.timer > 0.3) {
            if (this.size < this.maxSize) {
                this.size = Smooth(this.size, this.maxSize, 2);
            }
        } else {
            this.size = Smooth(this.size, 0.1, 2);
        }

        this.timer -= 1 / frameRate();
    }

    this.render = function () {
        textSize(this.size);
        fill(this.color);
        textAlign(CENTER, CENTER);
        text(this.txt, this.pos.x, this.pos.y);
    }
}
