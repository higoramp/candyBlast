let myFont; //The font we'll use throughout the app

let gameOver = false; //If it's true the game will render the main menu
let gameBeginning = true; //Should be true only before the user starts the game for the first time

//===Game objects
//Declare game objects here like player, enemies etc
let ducks = [];
let duckParticles = [];
let shotEffects = [];

let bullets = 6;

//===Buttons
let playButton;
let soundButton;
let leaderboardButton;

//Control game variables
let firing = false;
let lives;
let numberDucks;
let createdDucks;
let ducksKilled;
let minVelocityY = 1;
let maxVelocityY = 3;

let minVelocityX = 2;
let maxVelocityX = 4;

//===Data taken from Game Settings

let startingDucks = 3;
let ducksIncrease = 3;
let spawnPosY = 0.7;
let startingLives;
let timeToAlert;
let timeToEscape;
//===Score data
let score = 0;
let scoreGain;


//===Images
let imgBackground;
let imgLife;
let imgBullet;
let imgDuck = [];
let imgHelm;
let imgDuckParticle;
let imgShotEffect;

let alertIcon;

//===Audio
let sndMusic;
let sndPop = [];
let sndShot;
let sndLoseLife;
let alertSound;
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

let currentGunArea = 1.5;

let round = 0;


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
    console.log("TESTE: ");
    console.log(Koji.config.strings.testeArray);
    //===Load images

    //Load background if there's any
    if (Koji.config.images.background != "") {
        imgBackground = loadImage(Koji.config.images.background);
    }

    imgLife = loadImage(Koji.config.images.lifeIcon);
    imgBullet = loadImage(Koji.config.images.ammoIcon);
    imgDuck[0] = loadImage(Koji.config.images.duck);

    imgHelm = loadImage(Koji.config.images.helm);
    imgDuckParticle = loadImage(Koji.config.images.duckSmall);
    imgShotEffect = loadImage(Koji.config.images.shotEffect);
  
    imgAlertIcon = loadImage(Koji.config.images.alertIcon);
    firing = false;
    soundImage = loadImage(Koji.config.images.soundImage);
    muteImage = loadImage(Koji.config.images.muteImage);

    soundFormats('wav', 'mp3');

    //===Load Sounds

    if (Koji.config.sounds.pop1) sndPop[0] = loadSound(Koji.config.sounds.pop1);
    if (Koji.config.sounds.pop2) sndPop[1] = loadSound(Koji.config.sounds.pop2);
    if (Koji.config.sounds.pop3) sndPop[2] = loadSound(Koji.config.sounds.pop3);
    if (Koji.config.sounds.shot) sndShot = loadSound(Koji.config.sounds.shot);
    if (Koji.config.sounds.loseLife) sndLoseLife = loadSound(Koji.config.sounds.loseLife);
    if (Koji.config.sounds.loseLife) alertSound = loadSound(Koji.config.sounds.alertSound);

    //===Load settings from Game Settings
    startingLives = parseInt(Koji.config.strings.lives);
    
    lives = startingLives;
    scoreGain = parseInt(Koji.config.strings.scoreGain);
    startingDucks = parseInt(Koji.config.strings.startingDucks);
    startingBullets = parseInt(Koji.config.strings.startingBullets);
    numberDucks = startingDucks;
    createdDucks = 0;
    ducksIncrease = parseInt(Koji.config.strings.ducksIncrease);
    round = 0;
    ducksKilled = 0;
    spawnPosY = parseFloat(Koji.config.strings.spawnPosY) || spawnPosY;
		timeToAlert = parseInt(Koji.config.strings.timeToAlert);
		timeToEscape = parseInt(Koji.config.strings.timeToEscape);

}
function setup() {
    
    // make a full screen canvas
    width = window.innerWidth;
    height = window.innerHeight;

    window.addEventListener('resize', resize, false);
        
    //===How much of the screen should the game take
    let sizeModifier = 0.75;
    if (height > width) {
        sizeModifier = 1;
    }

    createCanvas(width, height);
    //imgDuck[0].delay(250);
    //===Determine basic object size depending on size of the screen
    objSize = floor(min(floor(width / gameSize), floor(height / gameSize)) * sizeModifier);
    
    isMobile = detectMobile();

    textFont(myFont); //set our font
    document.body.style.fontFamily = myFont;

    playButton = new PlayButton();
    soundButton = new SoundButton();
    leaderboardButton = new LeaderboardButton();

    gameBeginning = true;

    if (Koji.config.sounds.backgroundMusic) sndMusic = loadSound(Koji.config.sounds.backgroundMusic);

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

        checkSpawn();

        for (let i = 0; i < ducks.length; i++) {
            ducks[i].update();
            ducks[i].render();
        }

        for (let i = 0; i < shotEffects.length; i++) {
            shotEffects[i].update();
            shotEffects[i].render();
        }

        for (let i = 0; i < duckParticles.length; i++) {
            duckParticles[i].update();
            duckParticles[i].render();
        }

        //===Update all floating text objects
        for (let i = 0; i < floatingTexts.length; i++) {
            floatingTexts[i].update();
            floatingTexts[i].render();
        }

        //===Ingame UI

        //===Score draw
        let scoreX = width - objSize / 2;
        let scoreY = objSize / 3;
        textSize(objSize * 2);
        fill(Koji.config.colors.scoreColor);
        textAlign(RIGHT, TOP);
        text(score, scoreX, scoreY);

        //Lives draw
        let lifeSize = objSize;
        for (let i = 0; i < lives; i++) {
            image(imgLife, lifeSize / 2 + lifeSize * i, lifeSize / 2, lifeSize, lifeSize);
        }

        // //Bullets draw
        // let ratio = imgBullet.height/imgBullet.width;
        // let bulletSize = objSize;
        
        // for (let i = 0; i < bullets; i++) {
        //     image(imgBullet, bulletSize / 2 , height - bulletSize*ratio*i - bulletSize*3 / 2  , bulletSize, bulletSize);
        // }

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

    let nDucksShot =0;
    //Check to see if a Duck is popped
    for (let i = 0; i < ducks.length; i++) {
        if (ducks[i].popped) {

            let particleCount = random(3, 8);
            for (let j = 0; j < particleCount; j++) {
                let pos = createVector(ducks[i].pos.x + objSize * random(-0.5, 0.5) * ducks[i].sizeMod / 2, ducks[i].pos.y + objSize * random(-0.5, 0.5) * ducks[i].sizeMod / 2);
                let particle = new DuckParticle(pos.x, pos.y);
                particle.velocity.x = random(0.2, 0.4) * objSize * Math.sign(pos.x - ducks[i].pos.x);
                duckParticles.push(particle);
                
            }
            floatingTexts.push(new FloatingText(ducks[i].pos.x, ducks[i].pos.y, "+"+scoreGain, Koji.config.colors.roundTextColor, objSize, 0.7));
            ducksKilled++;
            
            let id = floor(random() * sndPop.length);

            if (sndPop[id]) sndPop[id].play();
            
            let shotEffect = new ShotEffect(ducks[i].pos.x, ducks[i].pos.y, ducks[i].sizeMod);
              shotEffects.push(shotEffect);
            
            nDucksShot++;
            
            ducks[i].removable = true;
        }

        if(nDucksShot>0){
            score += scoreGain*nDucksShot;
            
        }

        if (ducks[i].outOfScreen) {
            loseLife();
        }

        if (ducks[i].removable) {
            ducks.splice(i, 1);
        }
    }

    for (let i = 0; i < duckParticles.length; i++) {
        if (duckParticles[i].removable) {
            duckParticles.splice(i, 1);
        }
    }

    for (let i = 0; i < shotEffects.length; i++) {
        if (shotEffects[i].removable) {
            shotEffects.splice(i, 1);
        }
    }
}

//===Handle input

function touchStarted() {

firing
    if (soundButton && soundButton.checkClick()) {
        toggleSound();
        return;
    }
    let gotShot = false;
    if (!gameOver && !gameBeginning) {
        //Ingame
        if (!firing){ //Prevent accidental double click
            bullets--;
            if (sndShot) {
                    sndShot.setVolume(0.5);
                    sndShot.play();
            }
            setTimeout(() => {
                firing = false;
            }, 100);
        }
        for (let i = 0; i < ducks.length; i++) {
            if (ducks[i].checkClick()) {
                ducks[i].popped = true;
                gotShot = true;
                break;
            }
        }
        if(!gotShot&&!firing){
            
            floatingTexts.push(new FloatingText(mouseX, mouseY-objSize*2,Koji.config.strings.missText , Koji.config.colors.missTextColor, objSize, 0.5));
            let shotEffect = new ShotEffect(mouseX - objSize/12, mouseY-objSize/12, objSize/12);
                shotEffects.push(shotEffect);
        }
        firing = true;
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

    score = 0;
    lives = startingLives;

    floatingTexts = [];

    ducks = [];
    duckParticles = [];
    shotEffects = [];

    for (let i = 0; i < startingDucks; i++) {
        spawnDuck(0);
    }
    playMusic();
}
let creatingRound = false;
function newRound(){
    
    
    if (!creatingRound){
        if (ducksKilled>=(createdDucks-1)){
          console.log(ducksKilled +": "+createdDucks);
          pushText(Koji.config.strings.congratulationsText, Koji.config.colors.roundTextColor, objSize*2, 2);
        }
        setTimeout(()=>{
              pushText(Koji.config.strings.roundText, Koji.config.colors.roundTextColor, objSize*2, 2);
              //Prints the round
              //Since is zero based AND have not yet updated...+2
              pushText(round+2, Koji.config.colors.roundTextColor, objSize*2, 2, 1);
                setTimeout(() => {
                            round++;
                            numberDucks = floor( startingDucks + ducksIncrease * round);
                            bullets += numberDucks*1.5;
                            createdDucks = 0;
                            creatingRound = false;
                            ducksKilled=0;
                        }, 2000);

        }, 2500);
      
    }
    creatingRound = true;
   
    
}
function createDucksRound(){
    //will create Ducks??
    if (random(0, 1)>0.95 && createdDucks<numberDucks){
        let n = (numberDucks - createdDucks)>=2?Math.round(random(1,2)):1;
        for (let i = 0; i < n; i++) {
            spawnDuck(0);
        }
    }
}
function checkSpawn() {


    //If there are no ducks,  go to next round
    if (ducks.length < 1 && createdDucks>=numberDucks) {
        newRound();
    }
    //Create the ducks for round
    createDucksRound();
}

function spawnDuck(type) {
    let pos = createVector(random(objSize, width - objSize), parseInt(height*spawnPosY));
    ducks.push(new Duck(pos.x, pos.y, type));
    createdDucks++;
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

//===Call this when a lose life event should trigger
function loseLife() {
    lives--;
    if (sndLoseLife) sndLoseLife.play();
    if (lives <= 0) {
        gameOver = true;
        round=0;

        if (score > 0) {
            submitScore();
        }

    }
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
