
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
        //rotate(this.rotation);
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

class Balloon extends Entity {
    constructor(x, y, type) {
        super(x, y);
        this.type = type;
        this.img = imgBalloon[type];
        this.sizeMod = (type+4)/2;
        this.sizeModX = this.sizeMod;
        this.sizeModY = this.sizeMod;
        this.popped = false;
        this.animationTimer = 0;
    }

    update() {
        this.animationTimer += 1 / frameRate();
    }

    //override
    render() {
        let sizeModX = this.sizeModX;
        let sizeModY = this.sizeModY;

        //Just for animation effect
        sizeModX = Sinusoid(this.sizeModX, 2, 0.3, this.animationTimer);
        sizeModY = Cosine(this.sizeModY, 2, 0.3, this.animationTimer);
    
        let sizeX = objSize * sizeModX;
        let sizeY = objSize * sizeModY;

        this.img = imgBalloon[this.type];
        console.log("Render Ballooon"+this.pos.x+" - "+ this.pos.y);
        console.log(objSize+ " - "+ sizeModX);
        push();
        translate(this.pos.x, this.pos.y);
        scale(this.scale.x, this.scale.y);

        image(this.img, -sizeX / 2, -sizeY / 2, sizeX, sizeY);

        pop();
    }

    checkClick() {
        if (mouseX >= this.pos.x - (objSize * this.sizeMod / 2) &&
            mouseX <= this.pos.x + (objSize * this.sizeMod / 2) &&
            mouseY >= this.pos.y - (objSize * this.sizeMod / 2) &&
            mouseY <= this.pos.y + (objSize * this.sizeMod / 2)) {
            return true;
        } else {
            return false;
        }
    }
}

//Small bubbles that emerge when you pop a big one
class BalloonParticle extends Entity {
    constructor(x, y, type, directionX, directionY) {
        super(x, y);
        this.img = imgBalloon[type];
        this.minSize = 0.5
        this.sizeMod = 1;
        this.maxVelocity = createVector(directionX*maxVelocityX, directionY*maxVelocityY);
        this.velocity = createVector(directionX*minVelocityX, directionY*minVelocityY);
    }


    update() {
        this.velocity.y = Smooth(this.velocity.y, this.maxVelocity.y, 18);
        this.velocity.x = Smooth(this.velocity.x, this.maxVelocity.x, 18);

        this.pos.add(this.velocity.x, this.velocity.y);

        this.timer -= 1 / frameRate();

        
        this.sizeMod = Smooth(this.sizeMod, this.minSize, 4);
       

        //Check if particle is out of screen
        if (this.pos.x <0 || this.pos.x>width ||this.pos.y<0 || this.pos.y>height) {
            this.removable = true;
        }
    }

    //override
    render() {
        let size = objSize * this.sizeMod;

        console.log("RENDER PARTICLE");
        console.log(size);
        push();
        translate(this.pos.x, this.pos.y);
        scale(this.scale.x, this.scale.y);
        image(this.img, -size / 2, -size / 2, size, size);
        pop();
    }
}

//A quick effect that spawns for a moment after popping a duck
class ShotEffect extends Entity {
    constructor(x, y, size) {
        super(x, y);
        this.img = imgShotEffect;
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

// //Not using yet
// class Explosion extends ShotEffect {
//     constructor(x, y, size) {
//         super(x, y);
//         this.img = imgExplosion;
//         this.rotation = random() * Math.PI;
//         this.maxSize = size * 3;
//         this.sizeMod = 0.1;
//         this.timer = 0.15;
//     }
// }