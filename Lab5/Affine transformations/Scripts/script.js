let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
canvas.width = 900;
canvas.height = 900;

const width = canvas.width;
const height = canvas.height;


function getImage() {
  return canvas.toDataURL('image/png');
}

let unitSegmentSize = 30.0;

function transformCoordinatesToRealX(coordinate) {
  return width / 2 + coordinate * unitSegmentSize;
}

function transformCoordinatesToRealY(coordinate) {
  return height / 2 - coordinate * unitSegmentSize;
  
}

function drawGrid() {
  // Draw the grid with coordinates, arrows
  ctx.clearRect(0, 0, width, height);
  ctx.beginPath();
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 1;
  ctx.font = '12px Arial';
  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.beginPath();
  // X
  ctx.moveTo(-width / 2, 0);
  ctx.lineTo(width / 2, 0);
  // Y
  ctx.moveTo(0, -height / 2);
  ctx.lineTo(0, height / 2);
  ctx.stroke();
  // Arrows
  ctx.beginPath();
  
  // Y arrow on top
  ctx.moveTo(0, -height / 2);
  ctx.lineTo(5, -height / 2 + 15);
  ctx.moveTo(0, -height / 2);
  ctx.lineTo(-5, -height / 2 + 15);
  
  // X arrow on right
  ctx.moveTo(width / 2, 0);
  ctx.lineTo(width / 2 - 15, 5);
  ctx.moveTo(width / 2, 0);
  ctx.lineTo(width / 2 - 15, -5);
  
  
  ctx.stroke();
  ctx.fillText('X', width / 2 - 10, 10);
  ctx.fillText('Y', 10, -height / 2 + 10);
  ctx.restore();
  ctx.save();
  
  // Draw the markings on the grid
  
  // The unit segment size is the distance between two lines on the grid
  // But it is the "1" in the grid
  
  // Draw the lines on x-axis
  ctx.translate(width / 2, height / 2);
  ctx.beginPath();
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 1;
  ctx.font = '12px Arial';
  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  for (let i = 0; i <= width / 2; i += unitSegmentSize) {
    ctx.moveTo(i, -5);
    ctx.lineTo(i, 5);
    ctx.moveTo(-i, -5);
    ctx.lineTo(-i, 5);
    ctx.fillText(i / unitSegmentSize, i, 10);
    ctx.fillText(-i / unitSegmentSize, -i, 10);
  }
  ctx.stroke();
  ctx.restore();
  
  // Draw the lines on y-axis
  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.beginPath();
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 1;
  ctx.font = '12px Arial';
  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let i = 0; i <= height / 2; i += unitSegmentSize) {
    ctx.moveTo(-5, i);
    ctx.lineTo(5, i);
    ctx.moveTo(-5, -i);
    ctx.lineTo(5, -i);
    ctx.fillText(i / unitSegmentSize, 10, -i);
    ctx.fillText(-i / unitSegmentSize, 10, i);
  }
  ctx.stroke();
  ctx.restore();
  
  
}

function zoomIn() {
  unitSegmentSize += 3;
  drawGrid();
}

function zoomOut() {
  if (unitSegmentSize > 5) {
    unitSegmentSize -= 3;
    drawGrid();
  }
}