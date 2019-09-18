let myFont; //The font we'll use throughout the app

let gameOver = false; //If it's true the game will render the main menu
let gameBeginning = true; //Should be true only before the user starts the game for the first time

//===Game objects
//Declare game objects here like player, enemies etc
let balloons = [];
let balloonsParticles = [];
let popEffects = [];


//===Buttons
let playButton;
let soundButton;
let leaderboardButton;

//Control game variables
let minVelocityY = 0;
let maxVelocityY = 1;

let minVelocityX = 0;
let maxVelocityX = 1;

let marginH = 50;
let marginV = 50;

let phase = 1;

let clicksAvailable = 1;

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

//===Audio
let sndMusic;
let sndPop = [];

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
    //===Load font from google fonts link provided in game settings
    var link = document.createElement('link');
    link.href = Koji.config.strings.fontFamily;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    myFont = getFontFamily(Koji.config.strings.fontFamily);
    let newStr = myFont.replace("+", " ");
    myFont = newStr;
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

    imgPopEffect = loadImage(Koji.config.images.popEffect);
  
    soundImage = loadImage(Koji.config.images.soundImage);
    muteImage = loadImage(Koji.config.images.muteImage);

    soundFormats('wav', 'mp3');

    //===Load Soundsfiring

    if (Koji.config.sounds.pop1) sndPop[0] = loadSound(Koji.config.sounds.pop1);
    if (Koji.config.sounds.pop2) sndPop[1] = loadSound(Koji.config.sounds.pop2);
    if (Koji.config.sounds.pop3) sndPop[2] = loadSound(Koji.config.sounds.pop3);
    if (Koji.config.sounds.shot) sndShot = loadSound(Koji.config.sounds.shot);
    //Background sound
    if (Koji.config.sounds.backgroundMusic) sndMusic = loadSound(Koji.config.sounds.backgroundMusic);

    //COlumns and rows
    nColumns = parseInt(Koji.config.levels.columns);
    nRows = parseInt(Koji.config.levels.rows);



}
function setup() {
    
    // make a full screen canvas
    width = window.innerWidth;
    height = window.innerHeight;

    window.addEventListener('resize', resize, false);
    //Dont know Why touchStarted is not called on firefox
    window.addEventListener('mousedown', e => {
        touchStarted();
    });
    
    //LoadPhase
        

    //===How much of the screen should the game take
    let sizeModifier = 0.75;
    if (height > width) {
        sizeModifier = 1;
    }

    let canvas=createCanvas(width, height);

    
    objSize = floor(min(floor(width / gameSize), floor(height / gameSize)) * sizeModifier);
    
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

    gameBeginning = true;

   

}
function resize(){
    resizeCanvas(window.innerWidth, window.innerHeight);
}
function draw() {
    //Draw background or a solid color
    if (imgBackground) {
        background(imgBackground);
    } else {
        background(Koji.config.colors.backgroundColor);
    }

    //===Draw UI
    if (gameOver || gameBeginning) {

        //===Draw title
        let titleText = Koji.config.strings.title;
        let titleSize = floor(objSize * 2);
        textSize(titleSize);

        //Resize title until it fits the screen
        while (textWidth(titleText) > width * 0.9) {
            titleSize *= 0.9;
            textSize(titleSize);
        }

        fill(Koji.config.colors.titleColor);
        textAlign(CENTER, TOP);
        text(Koji.config.strings.title, width / 2, objSize * 3);

        //===Draw instructions

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

        textSize(instructionsSize[0]);
        fill(Koji.config.colors.instructionsColor);
        textAlign(CENTER, TOP);
        text(instructionsText[0], width / 2, objSize * 6);

        textSize(instructionsSize[1]);
        fill(Koji.config.colors.instructionsColor);
        textAlign(CENTER, TOP);
        text(instructionsText[1], width / 2, objSize * 8);

        textSize(instructionsSize[2]);
        fill(Koji.config.colors.instructionsColor);
        textAlign(CENTER, TOP);
        text(instructionsText[2], width / 2, objSize * 10);


        //===
        playButton.update();
        playButton.btn.draw();

        leaderboardButton.update();
        leaderboardButton.btn.draw();


    } else {

        //Update and render all game objects here
        checkPhase();

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
        
        //===Score draw
        let clicksX = width - objSize / 2;
        let clicksY = objSize / 3;
        textSize(objSize * 2);
        fill(Koji.config.colors.scoreColor);
        textAlign(RIGHT, TOP);
        text(clicksAvailable, clicksX, clicksY);

        
        cleanup();

    }

    soundButton.render();
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
           
            let id = floor(random() * sndPop.length);

            if (sndPop[id]) sndPop[id].play();
            
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

    
}

//===Handle input

function touchStarted() {

    if (soundButton && soundButton.checkClick()) {
        toggleSound();
        return;
    }

    if (!gameOver && !gameBeginning) {
        //Ingame
        if (!isClicking){ //Prevent accidental double click
            if (sndShot) {
                    sndShot.setVolume(0.5);
                    sndShot.play();
                    
            }
            
            for (let i = 0; i < balloons.length; i++) {
                if (balloons[i].checkClick()) {
                    balloons[i].popIt();
                    clicksAvailable--;
                    break;
                }
            }
            setTimeout(() => {
                isClicking = false;
            }, 100);
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
    gameOver = false;


    floatingTexts = [];

    balloons = [];
    balloonsParticles = [];

 

    playMusic();
createBalloon(1, 0, 0);
createBalloon(0, 1, 1);

createBalloon(0, 2, 2);
createBalloon(0, 2, 4);
createBalloon(2, 5, 4);
}


function checkPhase() {
    

    
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
