const { STROKE } = require("./p5");

function setup() {
  createCanvas(700, 400);
  frameRate(900);
}

function draw() {

  for(let i = 0; i < 20; i++){
  stroke(random (250), random (250), random (250));
  strokeWeight(random (2, 20));
  point(random(width), random(height));
  }
}