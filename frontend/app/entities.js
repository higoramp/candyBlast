
/*
    Base entity class, can be used as a base for other drawable objects, used for drawing and checking basic collisions

    IMPORTANT: Make sure to assign it an img variable after instantiating

    Common way to use it:

    let myObject;
    ...
    myObject = new Entity(x, y);
    myObject.img = myImage;

    ...

    draw(){
        ...

        myObject.render();
    }

    If you want to check for collisions with another Entity:

    if(myObject.collisionWith(anotherObject)){
        //do stuff
    }
    
*/
class Entity {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.rotation = 0;
        this.img; //Assign this after instantiating
        this.sizeMod = 1; //Size multiplier on top of objSize
        this.removable = false;
        this.scale = createVector(1, 1);
    }

    render() {
        let size = objSize * this.sizeMod;

        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.rotation);
        scale(this.scale.x, this.scale.y);
        image(this.img, -size / 2, -size / 2, size, size);
        pop();
    }

    //Basic circle collision
    collisionWith(other) {
        let distCheck = (objSize * this.sizeMod + objSize * other.sizeMod) / 2;

        if (dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y) < distCheck) {
            return true;
        } else {
            return false;
        }
    }

}

class Bubble extends Entity {
    constructor(x, y, type) {
        super(x, y);
        this.type = type;
        this.img = imgBubble[type];
        this.rotation = random() * Math.PI;
        this.sizeMod = random(2, 3);
        this.sizeModX = this.sizeMod;
        this.sizeModY = this.sizeMod;
        this.directionX = 1;
        this.directionY = 1;
        this.maxVelocity = createVector(random(minVelocityX, maxVelocityX), random(minVelocityY, maxVelocityY));
        this.velocity = createVector(0, 0);
        this.popped = false;
        this.outOfScreen = false;
        this.animationTimer = 0;
        this.frozen = false;
    }

    update() {
        this.animationTimer += 1 / frameRate();

        if (!this.frozen) {
            this.sizeModX = Sinusoid(this.sizeModX, 4, 0.01, this.animationTimer);
            this.sizeModY = Cosine(this.sizeModY, 4, 0.01, this.animationTimer);
            this.velocity.y = Smooth(this.velocity.y, this.maxVelocity.y, 12);
            this.velocity.x = Smooth(this.velocity.x, this.maxVelocity.x, 12);
        } else {
            this.velocity.y = Smooth(this.velocity.y, 0, 12);
            this.velocity.x = Smooth(this.velocity.x, 0, 12);
            this.rotation = 0;
        }
        
        

        //Check boundaries and change direction if needed
        if((this.pos.x<=0 && this.directionX<0) || (this.pos.x>width && this.directionX>0)){
            this.directionX=-this.directionX;
        }else{
            // check if duck will turn direction randomly
            if (random(0,1)>0.98){
                this.directionX= -this.directionX;  
            }
        }
        if((this.pos.y<=0 && this.directionY<0) || (this.pos.y>height*spawnPosY && this.directionY>0)){
            this.directionY=-this.directionY;
        }else{
            if ((random(0,1)>0.98 && this.directionY>0)||(random(0,1)>0.995)){
                this.directionY= -this.directionY;  
            }
        }

        this.pos.add(this.directionX*this.velocity.x, this.directionY*this.velocity.y);
        if (this.pos.y < -objSize * this.sizeMod) {
            this.removable = true;
            this.outOfScreen = true;
        }
    }

    //override
    render() {
        let sizeX = objSize * this.sizeModX;
        let sizeY = objSize * this.sizeModY;
        this.img = imgBubble[this.type];
        if (this.frozen) {
            this.img = imgBubbleFrozen;
        }

        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.rotation);
        scale(this.scale.x, this.scale.y);
        image(this.img, -sizeX / 2, -sizeY / 2, sizeX, sizeY);
        pop();
    }

    checkClick() {
        if (mouseX >= this.pos.x - objSize * this.sizeMod / 2 &&
            mouseX <= this.pos.x + objSize * this.sizeMod / 2 &&
            mouseY >= this.pos.y - objSize * this.sizeMod / 2 &&
            mouseY <= this.pos.y + objSize * this.sizeMod / 2) {
            return true;
        } else {
            return false;
        }
    }
}

//Small bubbles that emerge when you pop a big one
class BubbleParticle extends Bubble {
    constructor(x, y) {
        super(x, y);
        this.img = imgBubbleParticle;
        this.rotation = random() * Math.PI;
        this.maxSize = random(0.5, 1);
        this.sizeMod = 0.1;
        this.maxVelocity = createVector(0, random(minVelocityY, maxVelocityY) * 3);
        this.velocity = createVector(0, -minVelocityY / 2);
        this.timer = 0.5;
    }

    update() {
        super.update();

        this.timer -= 1 / frameRate();

        if (this.timer > 0.25) {
            this.sizeMod = Smooth(this.sizeMod, this.maxSize, 4);
        } else {
            this.sizeMod = Smooth(this.sizeMod, 0.1, 8);
        }

        this.velocity.x = Smooth(this.velocity.x, 0, 4);

        if (this.timer <= 0) {
            this.removable = true;
        }
    }

    //override
    render() {
        let size = objSize * this.sizeMod;

        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.rotation);
        scale(this.scale.x, this.scale.y);
        image(this.img, -size / 2, -size / 2, size, size);
        pop();
    }
}

//A quick effect that spawns for a moment after popping a bubble
class PopEffect extends Entity {
    constructor(x, y, size) {
        super(x, y);
        this.img = imgPopEffect;
        this.rotation = random() * Math.PI;
        this.maxSize = size;
        this.sizeMod = 0.1;
        this.timer = 0.15;
    }

    update() {

        this.timer -= 1 / frameRate();

        this.sizeMod = Smooth(this.sizeMod, this.maxSize, 3);

        if (this.timer <= 0) {
            this.removable = true;
        }
    }
}

//Same as pop effect but an explosion instead
class Explosion extends PopEffect {
    constructor(x, y, size) {
        super(x, y);
        this.img = imgExplosion;
        this.rotation = random() * Math.PI;
        this.maxSize = size * 3;
        this.sizeMod = 0.1;
        this.timer = 0.15;
    }
}