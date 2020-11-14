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

function setup() {
  createCanvas(600, 600, WEBGL);
  colorMode(HSB, 360, 100, 100);
  cursor(CROSS);

  // ------ mesh ------
  tileCount = 50;
  zScale = 150;

  // ------ noise ------
  noiseXRange = 10;
  noiseYRange = 10;
  octaves = 4;
  falloff = 0.5;

  // ------ mesh coloring ------
  topColor = color(0, 0, 200);
  midColor = color(200, 109, 63);
  bottomColor = color(0, 0, 100);
  strokeColor = color(80, 0, 0);
  threshold = 0.0;

  // ------ mouse interaction ------
  offsetX = 0;
  offsetY = 0;
  clickX = 0;
  clickY = 0;
  zoom = -300;
  rotationX = 0;
  rotationZ = 0;
  targetRotationX = PI / 3;
  targetRotationZ = 0;
}

function draw() {
  background(0, 0, 100);
  ambientLight(150);

  // ------ set view ------
  push();
  translate(width * 0.05, height * 0.05, zoom);

  if (mouseIsPressed && mouseButton == RIGHT) {
    offsetX = mouseX - clickX;
    offsetY = mouseY - clickY;
    targetRotationX = min(max(clickRotationX + offsetY / float(width) * TWO_PI, -HALF_PI), HALF_PI);
    targetRotationZ = clickRotationZ + offsetX / float(height) * TWO_PI;
  }
  rotationX += (targetRotationX - rotationX) * 0.25;
  rotationZ += (targetRotationZ - rotationZ) * 0.25;
  rotateX(-rotationX);
  rotateZ(-rotationZ);

  // ------ mesh noise ------
  if (mouseIsPressed && mouseButton == LEFT) {
    noiseXRange = mouseX / 10;
    noiseYRange = mouseY / 10;
  }

  noiseDetail(octaves, falloff);
  var noiseYMax = 0;

  var tileSizeY = height / tileCount;
  var noiseStepY = noiseYRange / tileCount;

  for (var meshY = 0; meshY <= tileCount; meshY++) {
    beginShape(TRIANGLE_STRIP);
    for (var meshX = 0; meshX <= tileCount; meshX++) {

      var x = map(meshX, 0, tileCount, -width / 2, width / 2);
      var y = map(meshY, 0, tileCount, -height / 2, height / 2);

      var noiseX = map(meshX, 0, tileCount, 0, noiseXRange);
      var noiseY = map(meshY, 0, tileCount, 0, noiseYRange);
      var z1 = noise(noiseX, noiseY);
      var z2 = noise(noiseX, noiseY + noiseStepY);

      noiseYMax = max(noiseYMax, z1);
      var interColor;
      colorMode(RGB);
      var amount;
      if (z1 <= threshold) {
        amount = map(z1, 0, threshold, 0.15, 1);
        interColor = lerpColor(bottomColor, midColor, amount);
      } else {
        amount = map(z1, threshold, noiseYMax, 0, 1);
        interColor = lerpColor(midColor, topColor, amount);
      }
      fill(interColor);
      stroke(strokeColor);
      strokeWeight(1);
      vertex(x, y, z1 * zScale);
      vertex(x, y + tileSizeY, z2 * zScale);
    }
    endShape();
  }
  pop();

}

function mousePressed() {
  clickX = mouseX;
  clickY = mouseY;
  clickRotationX = rotationX;
  clickRotationZ = rotationZ;
}

function keyReleased() {
  if (keyCode == UP_ARROW) falloff += 0.05;
  if (keyCode == DOWN_ARROW) falloff -= 0.05;
  if (falloff > 1.0) falloff = 1.0;
  if (falloff < 0.0) falloff = 0.0;

  if (keyCode == LEFT_ARROW) octaves--;
  if (keyCode == RIGHT_ARROW) octaves++;
  if (octaves < 0) octaves = 0;

  if (keyCode == 187) zoom += 20; // '+'
  if (keyCode == 189) zoom -= 20; // '-'

  if (key == 's' || key == 'S') saveCanvas(gd.timestamp(), 'png');
  if (key == ' ') noiseSeed(floor(random(100000)));
}
