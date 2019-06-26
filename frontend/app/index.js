let myFont; //The font we'll use throughout the app

let gameOver = false; //If it's true the game will render the main menu
let gameBeginning = true; //Should be true only before the user starts the game for the first time

//===Game objects
//Declare game objects here like player, enemies etc
let bubbles = [];
let bubbleParticles = [];
let popEffects = [];

//===Buttons
let playButton;
let soundButton;


//===Score data
let score = 0;
let highScore = 0;
let highscoreGained = false;
let scoreGain;

//===Data taken from Game Settings
let startingLives;
let lives;

let minVelocityY = 2;
let maxVelocityY = 3;

let spawnFrequency = 20;
let startingBubbles = 3;
let bombFrequency = 5;
let iceFrequency = 5;


//===Images
let imgBackground;
let imgLife;
let imgBubble = [];
let imgBubbleFrozen;
let imgBubbleParticle;
let imgPopEffect;
let imgExplosion;

//===Audio
let sndMusic;
let sndPop = [];
let sndExplosion;
let sndFreeze;

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

    imgLife = loadImage(Koji.config.images.lifeIcon);
    imgBubble[0] = loadImage(Koji.config.images.bubble);
    imgBubble[1] = loadImage(Koji.config.images.bubbleBomb);
    imgBubble[2] = loadImage(Koji.config.images.bubbleIce);
    imgBubbleFrozen = loadImage(Koji.config.images.bubbleFrozen);
    imgBubbleParticle = loadImage(Koji.config.images.bubbleSmall);
    imgPopEffect = loadImage(Koji.config.images.popEffect);
    imgExplosion = loadImage(Koji.config.images.explosion);

    soundImage = loadImage(Koji.config.images.soundImage);
    muteImage = loadImage(Koji.config.images.muteImage);

    //===Load Sounds
    sndMusic = loadSound(Koji.config.sounds.backgroundMusic);
    sndPop[0] = loadSound(Koji.config.sounds.pop1);
    sndPop[1] = loadSound(Koji.config.sounds.pop2);
    sndPop[2] = loadSound(Koji.config.sounds.pop3);
    sndExplosion = loadSound(Koji.config.sounds.explosion);
    sndFreeze = loadSound(Koji.config.sounds.freeze);

    //===Load settings from Game Settings
    startingLives = parseInt(Koji.config.strings.lives);
    lives = startingLives;
    scoreGain = parseInt(Koji.config.strings.scoreGain);
    spawnFrequency = parseInt(Koji.config.strings.spawnFrequency);
    startingBubbles = parseInt(Koji.config.strings.startingBubbles);
    bombFrequency = parseInt(Koji.config.strings.bombFrequency);
    iceFrequency = parseInt(Koji.config.strings.iceFrequency);

}
function setup() {

    // make a full screen canvas
    width = window.innerWidth;
    height = window.innerHeight;

    //===How much of the screen should the game take
    let sizeModifier = 0.75;
    if (height > width) {
        sizeModifier = 1;
    }

    createCanvas(width, height);

    //===Determine basic object size depending on size of the screen
    objSize = floor(min(floor(width / gameSize), floor(height / gameSize)) * sizeModifier);

    isMobile = detectMobile();


    //===Get high score data from local storage
    if (localStorage.getItem("highscore")) {
        highScore = localStorage.getItem("highscore");
    }

    textFont(myFont); //set our font

    playButton = new PlayButton();
    soundButton = new SoundButton();

    gameBeginning = true;

    playMusic();

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

        //===Draw score text after the game
        if (!gameBeginning) {
            textSize(objSize * 0.9);
            fill(Koji.config.colors.scoreColor);
            textAlign(CENTER, TOP);
            text(Koji.config.strings.scoreText + " " + score, width / 2, playButton.pos.y + objSize * 4);
        }

        //===Notify the player if they got a new high score, otherwise show the previous high score
        if (highscoreGained) {
            textSize(objSize * 1);
            fill(Koji.config.colors.highscoreColor);
            textAlign(CENTER, BOTTOM);
            text(Koji.config.strings.highscoreGainedText, width / 2, height - objSize);
        } else {
            textSize(objSize * 1);
            fill(Koji.config.colors.highscoreColor);
            textAlign(CENTER, BOTTOM);
            text(Koji.config.strings.highscoreText + "\n" + highScore, width / 2, height - objSize);
        }
    } else {


        //Update and render all game objects here

        checkSpawn();

        for (let i = 0; i < bubbles.length; i++) {
            bubbles[i].update();
            bubbles[i].render();
        }

        for (let i = 0; i < popEffects.length; i++) {
            popEffects[i].update();
            popEffects[i].render();
        }


        for (let i = 0; i < bubbleParticles.length; i++) {
            bubbleParticles[i].update();
            bubbleParticles[i].render();
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

    for (let i = 0; i < bubbles.length; i++) {
        if (bubbles[i].popped) {

            let particleCount = random(3, 8);
            for (let j = 0; j < particleCount; j++) {
                let pos = createVector(bubbles[i].pos.x + objSize * random(-0.5, 0.5) * bubbles[i].sizeMod / 2, bubbles[i].pos.y + objSize * random(-0.5, 0.5) * bubbles[i].sizeMod / 2);
                let particle = new BubbleParticle(pos.x, pos.y);
                particle.velocity.x = random(0.2, 0.4) * objSize * Math.sign(pos.x - bubbles[i].pos.x);
                bubbleParticles.push(particle);
            }

            if (bubbles[i].type == 1) {
                popBubbles();
                let popEffect = new Explosion(bubbles[i].pos.x, bubbles[i].pos.y, bubbles[i].sizeMod);
                popEffects.push(popEffect);
                sndExplosion.setVolume(0.5);
                PlaySound(sndExplosion);
            } else {
                if (bubbles[i].type == 2) {
                    freezeBubbles();
                    PlaySound(sndFreeze);
                } else {
                    PlaySound(sndPop[floor(random() * sndPop.length)]);
                }
                let popEffect = new PopEffect(bubbles[i].pos.x, bubbles[i].pos.y, bubbles[i].sizeMod);
                popEffects.push(popEffect);


            }

            score += scoreGain;

            checkHighscore();


            bubbles[i].removable = true;
        }

        if (bubbles[i].outOfScreen) {
            loseLife();
        }

        if (bubbles[i].removable) {
            bubbles.splice(i, 1);
        }
    }

    for (let i = 0; i < bubbleParticles.length; i++) {
        if (bubbleParticles[i].removable) {
            bubbleParticles.splice(i, 1);
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

    if (gameOver || gameBeginning) {

    }

    if (soundButton.checkClick()) {
        toggleSound();
        return;
    }

    if (!gameOver && !gameBeginning) {
        //Ingame
        touching = true;

        for (let i = 0; i < bubbles.length; i++) {
            if (bubbles[i].checkClick()) {
                bubbles[i].popped = true;
                break;
            }
        }

    }
}

function touchEnded() {
    touching = false;
}

function keyPressed() {
    if (!gameOver && !gameBeginning) {

    }
}

function keyReleased() {
    if (!gameOver && !gameBeginning) {

    }
}

//===Call this every time you want to start or reset the game
//This is a good place to clear all arrays like enemies, bullets etc before starting a new game
function init() {
    gameOver = false;

    highscoreGained = false;
    score = 0;
    lives = startingLives;

    floatingTexts = [];

    bubbles = [];
    bubbleParticles = [];
    popEffects = [];

    for (let i = 0; i < startingBubbles; i++) {
        spawnBubble(0);
    }

}

function checkSpawn() {

    //Check regular spawn
    let roll = random() * 100;
    if (roll < spawnFrequency / 200 * objSize) {
        spawnBubble(0);
    }

    //Check bomb spawn
    roll = random() * 100;
    if (roll < bombFrequency / 200 * objSize) {
        spawnBubble(1);
    }

    //Check ice spawn
    roll = random() * 100;
    if (roll < iceFrequency / 200 * objSize) {
        spawnBubble(2);
    }

    //If there are no bubbles, spawn a couple immediately
    if (bubbles.length < 1) {
        let count = floor(random() * 5)
        for (let i = 0; i < count; i++) {
            spawnBubble(0);
        }
    }
}

function spawnBubble(type) {
    let pos = createVector(random(objSize, width - objSize), height + objSize * 2);
    bubbles.push(new Bubble(pos.x, pos.y, type));
}

function freezeBubbles() {
    for (let i = 0; i < bubbles.length; i++) {
        if (bubbles[i].pos.y > 0 && bubbles[i].pos.y < height && bubbles[i].type == 0) {
            bubbles[i].frozen = true;
        }
    }

    floatingTexts.push(new FloatingText(width / 2, height / 2 - objSize * 3, Koji.config.strings.freezeText, Koji.config.colors.freezeColor, objSize * 3));

}

function popBubbles() {
    for (let i = 0; i < bubbles.length; i++) {

        bubbles[i].popped = true;

    }

    floatingTexts.push(new FloatingText(width / 2, height / 2 - objSize * 7, Koji.config.strings.bombText, Koji.config.colors.bombTextColor, objSize * 3));
}

//===Call this when a lose life event should trigger
function loseLife() {

    lives--;
    if (lives <= 0) {
        gameOver = true;

        checkHighscore();
    }

}

//===Floating text used for score
function FloatingText(x, y, txt, color, size) {
    this.pos = createVector(x, y);
    this.size = 1;
    this.maxSize = size;
    this.timer = 1;
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
