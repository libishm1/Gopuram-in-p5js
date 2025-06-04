
// Gopuram Procedural Generator in p5.js

let scaleXSlider, scaleYSlider, scaleZSlider;
let striationSlider, noiseIntensitySlider, baseScaleSlider;
let doorHeightSlider, columnCountSlider, animationTierSlider;
let statueModel;

function preload() {
  const url =
    'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/' +
    'master/1.0/Duck/glTF-Binary/Duck.glb';
  statueModel = loadModel(url, true);
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(DEGREES);
  colorMode(RGB);
  noStroke();

  createP("Gopuram Width Scale (X-axis)");
  scaleXSlider = createSlider(0.5, 2.0, 1.0, 0.1);
  createP("Gopuram Height Scale (Y-axis)");
  scaleYSlider = createSlider(0.5, 2.0, 1.0, 0.1);
  createP("Gopuram Depth Scale (Z-axis)");
  scaleZSlider = createSlider(0.5, 2.0, 1.0, 0.1);
  createP("Number of Striations (Tiers)");
  striationSlider = createSlider(3, 15, 7, 1);
  createP("Perlin Noise Intensity");
  noiseIntensitySlider = createSlider(0, 30, 10, 1);
  createP("Base Height Scale");
  baseScaleSlider = createSlider(0.5, 2.0, 1.0, 0.1);
  createP("Door Vertical Offset (%)");
  doorHeightSlider = createSlider(0.0, 1.0, 1.0, 0.05);
  createP("Number of Columns per Stripe");
  columnCountSlider = createSlider(2, 10, 4, 1);
  createP("Visible Tiers (for Animation)");
  animationTierSlider = createSlider(1, 15, 15, 1);
}

function draw() {
  background(230);
  orbitControl();
  rotateX(-30);
  rotateY(frameCount * 0.2);
  ambientLight(150);
  directionalLight(200, 200, 200, -0.3, -1, -0.5);

  let scaleX = scaleXSlider.value();
  let scaleY = scaleYSlider.value();
  let scaleZ = scaleZSlider.value();
  let baseScale = baseScaleSlider.value();
  let doorOffsetPercent = doorHeightSlider.value();
  let columnCount = columnCountSlider.value();
  let visibleTiers = animationTierSlider.value();
  let tiers = striationSlider.value();
  let noiseAmp = noiseIntensitySlider.value();

  let baseW = 250 * scaleX;
  let baseD = 180 * scaleZ;
  let baseH = 100 * baseScale;
  let totalH = 720 * scaleY;
  let tierH = (totalH - baseH) / tiers;

  push();
  translate(0, -baseH / 2, 0);
  drawBase(baseW, baseH, baseD, doorOffsetPercent);
  translate(0, -baseH / 2, 0);

  let gopuramTopY = 0;

  for (let i = 0; i < tiers && i < visibleTiers; i++) {
    let t = i / tiers;
    let baseTierScale = 1 - t * 0.3;
    let subSteps = 2 + int(noise(i) * 2);
    for (let j = 0; j < subSteps; j++) {
      push();
      let subT = j / subSteps;
      let w = baseW * baseTierScale * (1 - subT * 0.1);
      let d = baseD * baseTierScale * (1 - subT * 0.1);
      let h = tierH / subSteps;
      let yOffset = i * tierH + j * h;
      let noiseOffset = noise((i + j) * 0.3) * noiseAmp;
      let y = -yOffset - noiseOffset;
      translate(0, y, 0);

      let tierColor = getPanchavarnamColor(i + j);
      ambientMaterial(tierColor);
      box(w, h, d);

      drawStripes(w, h, d, tierColor);
      drawMiniShrines(w, h, d);
      drawCornice(w, d, tierColor);
      drawColumns(w, h, d, columnCount, tierColor);

      if (i === tiers - 1 && j === subSteps - 1) {
        gopuramTopY = y - h / 2;
      }
      pop();
    }
  }

  drawTopKalashas(gopuramTopY, scaleX);
  pop();
}

function drawTopKalashas(yTop, scaleX) {
  let r = 20 * scaleX;
  let h = 40 * scaleX;
  let positions = [
    [0, yTop, 0],
    [-r * 2, yTop, r * 2],
    [r * 2, yTop, r * 2]
  ];
  for (let [x, y, z] of positions) {
    push();
    translate(x, y - r * 0.6, z);
    ambientMaterial(255, 215, 0);
    sphere(r * 0.6);
    translate(0, -h / 2, 0);
    rotateX(180);
    cone(r * 0.6, h);
    pop();
  }
}

function drawBase(w, h, d, doorOffsetPercent) {
  push();
  ambientMaterial(160);
  box(w, h, d);
  let doorW = w * 0.2;
  let doorH = h * 0.6;
  let doorY = -h / 2 + doorH * doorOffsetPercent;

  for (let side = -1; side <= 1; side += 2) {
    push();
    translate(0, doorY, (d / 2 + 1) * side);
    if (side === 1) rotateY(180);
    ambientMaterial(60);
    plane(doorW, doorH);
    pop();
  }
  pop();
}

function drawStripes(w, h, d, tierColor) {
  let stripeCount = 3;
  let stripeH = 2;
  ambientMaterial(tierColor);
  for (let i = 0; i < stripeCount; i++) {
    let yOffset = h / 2 - (i + 1) * (h / (stripeCount + 1));

    for (let side = -1; side <= 1; side += 2) {
      push();
      translate(0, yOffset, (d / 2 + 0.5) * side);
      plane(w * 0.95, stripeH);
      pop();

      push();
      translate((w / 2 + 0.5) * side, yOffset, 0);
      rotateY(90);
      plane(d * 0.95, stripeH);
      pop();
    }
  }
}

function drawColumns(w, h, d, count, colorVal) {
  let y = h / 4;
  for (let side = -1; side <= 1; side += 2) {
    push();
    translate(0, y, (d / 2 + 1) * side);
    for (let k = 0; k < count; k++) {
      let x = map(k, 0, count - 1, -w / 2 + 5, w / 2 - 5);
      push();
      translate(x, 0, 0);
      ambientMaterial(colorVal);
      cylinder(3, 16);
      pop();
    }
    pop();

    push();
    translate((w / 2 + 1) * side, y, 0);
    rotateY(90);
    for (let k = 0; k < count; k++) {
      let z = map(k, 0, count - 1, -d / 2 + 5, d / 2 - 5);
      push();
      translate(z, 0, 0);
      ambientMaterial(colorVal);
      cylinder(3, 16);
      pop();
    }
    pop();
  }
}

function drawCornice(w, d, baseColor) {
  push();
  translate(0, -2, 0);
  let darker = lerpColor(baseColor, color(0), 0.2);
  ambientMaterial(darker);
  box(w * 1.05, 4, d * 1.05);
  pop();
}

function drawMiniShrines(w, h, d) {
  let miniW = w * 0.15;
  let miniD = d * 0.15;
  let miniH = h * 1.2;
  let sides = [
    [-w / 2 + miniW / 2, 0, 0, 0],
    [w / 2 - miniW / 2, 0, 0, 180],
    [0, 0, -d / 2 + miniD / 2, 0],
    [0, 0, d / 2 - miniD / 2, 180]
  ];

  for (let [x, y, z, rot] of sides) {
    push();
    translate(x, -miniH / 2, z);
    ambientMaterial(255, 200, 150);
    box(miniW, miniH, miniD);
    push();
    scale(6);
    rotateY(rot);
    model(statueModel);
    pop();
    push();
    translate(0, miniH / 4, miniD / 2 + 1);
    rotateY(rot);
    ambientMaterial(100);
    plane(miniW * 0.6, miniH * 0.5);
    pop();
    pop();
  }
}

function getPanchavarnamColor(index) {
  const colors = [
    color(255, 153, 153),
    color(255, 204, 153),
    color(255, 255, 153),
    color(204, 255, 153),
    color(153, 204, 255)
  ];
  return colors[index % colors.length];
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
