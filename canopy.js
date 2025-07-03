let widthInput, depthInput, heightInput, angleInput, no_of_pillarsInput;
let lastMouseX, lastMouseY;
let feetToPixels = 20;
let shedWidth = 20;
let shedDepth = 30;
let shedHeight = 10;
let roofAngleDeg = 20;
let noOfPillars = 5;
let roofAngleRad;
let rotationX = 0;
let rotationY = 0;
let dragging = false;
let bomDiv;
let roofAngleLen;
let colorPicker
let colorStru;
let postThickness = 10;
let zoom = 1;

function setup() {
  createCanvas(1400, 1000, WEBGL);
  let uiX = 1420;
  let uiY = 20;

  widthLabel = createP("Enter Shed Width:");
  widthLabel.position(uiX, uiY);
  widthInput = createInput(shedWidth.toString());
  widthInput.position(uiX, uiY + 40);

  depthLabel = createP("Enter Shed Depth:");
  depthLabel.position(uiX, uiY + 60);
  depthInput = createInput(shedDepth.toString());
  depthInput.position(uiX, uiY + 100);

  heightLabel = createP("Enter Pillar Height:");
  heightLabel.position(uiX, uiY + 120);
  heightInput = createInput(shedHeight.toString());
  heightInput.position(uiX, uiY + 160);

  no_of_pillarLabel = createP("No of on a side Pillars: ");
  no_of_pillarLabel.position(uiX, uiY + 180);
  no_of_pillarInput = createInput(noOfPillars.toString());
  no_of_pillarInput.position(uiX, uiY + 220);

  angleLabel = createP("Roof Angle (degrees):").position(uiX, uiY + 240);
  angleInput = createInput(roofAngleDeg.toString()).position(uiX, uiY + 280);
  angleInput.attribute("min", "0");
  angleInput.attribute("max", "60");

  let colorLabel = createP("Pick Color:");
  colorLabel.position(uiX, uiY + 300);
  colorPicker = createColorPicker("#1c355c");
  colorPicker.position(uiX, uiY + 340);

  let button = createButton("Update Shed Size");
  button.position(uiX, uiY + 380);
  button.mousePressed(updateShedSize); //callback

  let showButton = createButton("Show BOM");
  showButton.position(uiX, uiY + 400);
  showButton.mousePressed(showBOM);

  bomDiv = createDiv("");
  bomDiv.position(uiX, uiY + 420);
  bomDiv.style("white-space", "pre-line");

  updateShedSize();
}

function draw() {
  background(220);
  scale(zoom);
  rotateX(-rotationX + PI / 2); // base view with slight tilt
  rotateZ(rotationY); // horizontal spin
  colorStru = colorPicker.color();
  
  
  translate(-shedWidth / 2, -shedDepth / 2, 0);

  push();
  translate(shedWidth / 2, shedDepth / 2, 0);
  fill(88, 88, 88);
  drawQuadPlane(shedWidth, shedDepth);
  pop();
  drawPillars(shedWidth, shedHeight, shedDepth, roofAngleRad, noOfPillars);
}

function mousePressed() {
  lastMouseX = mouseX;
  lastMouseY = mouseY;
  dragging = true;
}

function mouseDragged() {
  if (dragging) {
    let dx = mouseX - lastMouseX;
    let dy = mouseY - lastMouseY;

    rotationY += dx * 0.01; // horizontal spin
    rotationX = constrain(rotationX + dy * 0.01, -PI / 6, PI / 6); // slight vertical tilt (up/down)

    lastMouseX = mouseX;
    lastMouseY = mouseY;
  }
}

function mouseReleased() {
  dragging = false;
}

function mouseWheel(event) {
  zoom += event.delta * -0.001;
  zoom = constrain(zoom, 0.2, 5); // Limit zoom level
  return false; // Prevent default page scroll
}

function updateShedSize() {
  let widthVal = parseFloat(widthInput.value());
  let depthVal = parseFloat(depthInput.value());
  let heightVal = parseFloat(heightInput.value());
  let angleVal = parseFloat(angleInput.value());
  let pillarsVal = int(no_of_pillarInput.value());

  if (isNaN(widthVal) || widthVal <= 0) {
    alert("Please enter a valid shed width.");
    return;
  }
  if (isNaN(depthVal) || depthVal <= 0) {
    alert("Please enter a valid shed depth.");
    return;
  }
  if (isNaN(heightVal) || heightVal <= 0) {
    alert("Please enter a valid pillar height.");
    return;
  }
  if (isNaN(angleVal) || angleVal < 0 || angleVal > 60) {
    alert("Please enter a roof angle between 0 and 60 degrees.");
    return;
  }
  if (isNaN(pillarsVal) || pillarsVal < 2) {
    alert("Please enter a valid number of pillars (minimum 2).");
    return;
  }

  shedWidth = widthVal * feetToPixels;
  shedDepth = depthVal * feetToPixels;
  shedHeight = heightVal * feetToPixels;
  roofAngleDeg = constrain(angleVal, 0, 60);
  roofAngleRad = radians(roofAngleDeg);
  noOfPillars = pillarsVal;
}

function drawPillars(
  shedWidth,
  shedHeight,
  shedDepth,
  roofAngleRad,
  noOfPillars
) {
  let spacing = shedDepth / (noOfPillars - 1);
  for (let i = 0; i < noOfPillars; i++) {
    push();
    translate(0, i * spacing, 0);
    singleBeam(shedWidth, shedHeight, roofAngleRad);
    pop();
  }
  roofSheet(shedWidth, shedHeight, shedDepth, roofAngleRad);
}

function singleBeam(shedWidth, shedHeight, angleRad) {
  push();
  let halfSpan = shedWidth / 2;

  let postHeight = shedHeight;

  push();
  translate(0, 0, postHeight / 2);
  fill(colorStru);
  box(postThickness, postThickness, postHeight);
  pop();

  push();
  translate(shedWidth, 0, postHeight / 2);
  fill(colorStru);
  box(postThickness, postThickness, postHeight);
  pop();

  let roofLength = halfSpan / cos(angleRad);
  roofAngleLength = roofLength.toFixed();
  push();
  translate(0, 0, postHeight);
  rotateY(-angleRad);
  translate(roofLength / 2, 0, 0);
  //noStroke();
  fill(colorStru);
  box(roofLength, postThickness, postThickness);
  pop();

  push();
  translate(shedWidth, 0, postHeight);
  rotateY(angleRad);
  translate(-roofLength / 2, 0, 0);
  //noStroke();
  fill(colorStru);
  box(roofLength, postThickness, postThickness);
  pop();
  pop();
}

function roofSheet(shedWidth, shedHeight, shedDepth, roofAngleRad) {
  let halfSpan = shedWidth / 2;
  let roofLength = halfSpan / cos(roofAngleRad);
  let postHeight = shedHeight;
  let planeDepth = shedDepth;

  // Left roof
  push();
  fill(colorStru);
  stroke(0);  // enable border stroke
  translate(0, 0, postHeight+1+( postThickness/2));
  rotateY(-roofAngleRad);
  translate(roofLength / 2, planeDepth / 2, 0);
  drawQuadPlane(roofLength, planeDepth);
  pop();

  // Right roof
  push();
  fill(colorStru);
  stroke(0);  // enable border stroke
  translate(shedWidth, 0, postHeight+1+( postThickness/2));
  rotateY(roofAngleRad);
  translate(-roofLength / 2, planeDepth / 2, 0);
  drawQuadPlane(roofLength, planeDepth);
  pop();
}


function drawQuadPlane(w, h) {
  beginShape();
  vertex(-w / 2, -h / 2, 0);
  vertex(w / 2, -h / 2, 0);
  vertex(w / 2, h / 2, 0);
  vertex(-w / 2, h / 2, 0);
  endShape(CLOSE);
}

function showBOM() {
  let perPillarPerFeet = 250;
  let RoofPerSqft = 250;
  let totalOfPillers =
    noOfPillars * 2 * perPillarPerFeet * (shedHeight / feetToPixels);
  let totalOfRoof =
    (roofAngleLength / feetToPixels).toFixed(0) *
    (shedDepth / feetToPixels).toFixed(0) *
    RoofPerSqft;
  let totalOfSupport =
    (roofAngleLength / feetToPixels).toFixed(0) * perPillarPerFeet;
  let total = totalOfPillers + totalOfRoof + totalOfSupport;

  let bom = [
    ["Component", "Quantity", "Description", "Cost per Unit", "Cost"],
    [
      "Pillars",
      `${noOfPillars * 2}`,
      `each approx. ${(shedHeight / feetToPixels).toFixed(1)} ft height`,
      `Rs.${(perPillarPerFeet * (shedHeight / feetToPixels)).toFixed(
        0
      )} (per pillar cost)`,
      `Rs.${totalOfPillers.toFixed(0)}`,
    ],
    [
      "Roof Sheets",
      `2`,
      `${(roofAngleLength / feetToPixels).toFixed(0)} ft x ${(
        shedDepth / feetToPixels
      ).toFixed(0)} ft (each)`,
      `Rs.${RoofPerSqft} per sqft`,
      `Rs.${totalOfRoof.toFixed(0)}`,
    ],
    [
      "Support Beams",
      `${noOfPillars * 2}`,
      `each approx. ${(roofAngleLength / feetToPixels).toFixed(0)} ft wide`,
      `Rs.${(perPillarPerFeet * (shedHeight / feetToPixels)).toFixed(
        0
      )} (per beam cost)`,
      `Rs.${totalOfSupport.toFixed(0)}`,
    ],
    ["", "", "", "Total", `Rs.${total.toFixed(0)}`],
  ];

  let tableHTML = `
    <html>
    <head>
      <title>Shed BOM</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #333; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
      </style>
    </head>
    <body>
      <h2>Bill of Materials</h2>
      <table>
  `;

  for (let i = 0; i < bom.length; i++) {
    tableHTML += "<tr>";
    for (let j = 0; j < bom[i].length; j++) {
      let tag = i === 0 ? "th" : "td";
      tableHTML += `<${tag}>${bom[i][j]}</${tag}>`;
    }
    tableHTML += "</tr>";
  }

  tableHTML += `
      </table>
    </body>
    </html>
  `;

  // Open new window and write BOM
  let newWindow = window.open("", "_blank");
  newWindow.document.open();
  newWindow.document.write(tableHTML);
  newWindow.document.close();
}
