let img;

function setup() {
  // make a full screen canvas
  createCanvas(window.innerWidth, window.innerHeight);
  img = loadImage(koji.images.mouse); // Load the image
}

function draw() {
  // set the background color from the configuration options
  background(koji.colors.backgroundColor);

  // format our text
  textSize(24);
  fill(koji.colors.textColor);
  textAlign(CENTER);

  // print out our text
  text(koji.strings.content, window.innerWidth / 2, 100);

  // setup an image to follow our mouse
  let imageSize = 100;
  image(img, mouseX - (imageSize / 2), mouseY - (imageSize / 2), imageSize, imageSize);
}


// export our functions so p5 can find them
export default {
  setup,
  draw,
}
