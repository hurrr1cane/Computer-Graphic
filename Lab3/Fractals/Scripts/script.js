let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
canvas.width = 900;
canvas.height = 900;

const width = canvas.width;
const height = canvas.height;

function drawDragon(
  offsetX = 0,
  offsetY = 0,
  scale = 1,
  depth = 10,
  thickness = 1,
  color = 1
) {
  scale = 1 / scale;
  ctx.beginPath();
  ctx.lineWidth = thickness;
  ctx.strokeStyle = color;
  drawDragonRecursive(
    offsetX + width / 2 - width / scale / 2,
    offsetY + height / 2 - height / scale / 2,
    offsetX + width / 2 + width / scale / 2,
    offsetY + height / 2 + height / scale / 2,
    depth
  );

  ctx.stroke();
  ctx.closePath();
}

function drawDragonRecursive(x1, y1, x2, y2, k) {
  let tx, ty;
  if (k === 0) {
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    return;
  }
  tx = (x1 + x2) / 2 + (y2 - y1) / 2;
  ty = (y1 + y2) / 2 - (x2 - x1) / 2;
  drawDragonRecursive(x2, y2, tx, ty, k - 1);
  drawDragonRecursive(x1, y1, tx, ty, k - 1);
}

function drawAlgebraic(
  offsetX,
  offsetY,
  scale,
  depth,
  radius,
  constantReal,
  constantImaginary,
  startColor,
  endColor
) {
  colors = getColors(depth, startColor, endColor);
  for (let y = 0; y < ctx.canvas.height; y++) {
    for (let x = 0; x < ctx.canvas.width; x++) {
      let p = setPixel(
        x + 0.5,
        y + 0.5,
        offsetX,
        offsetY,
        scale,
        depth,
        radius,
        constantReal,
        constantImaginary,
        width,
        colors
      );
      ctx.fillStyle = p;
      ctx.fillRect(x, y, 1, 1);
    }
  }
}

function setPixel(
  x,
  y,
  offsetX,
  offsetY,
  scale,
  depth,
  radius,
  constantReal,
  constantImaginary,
  resolution,
  colors
) {
  let zx = (x + offsetX - resolution / 2) / resolution / scale;
  let zy = ((y - offsetY - resolution / 2) / resolution / scale) * -1;
  let iteration = 0;
  let tempX;
  while (
    zx * zx + zy * zy < Math.pow(parseFloat(radius), 2) &&
    iteration < depth
  ) {
    tempX = zx;
    zx = zx * zx - zy * zy + constantReal;
    zy = 2 * tempX * zy + constantImaginary;
    iteration++;
  }
  return colors[iteration];
}

function getColors(depth, startColor, endColor) {
  //let startColor = "#ffffff";
  //let endColor = "#000000";
  let colorsArray = [];
  let firstColor = parseInt(startColor.substring(1), 16);
  let lastColor = parseInt(endColor.substring(1), 16);
  let step = Math.floor(Math.abs(lastColor - firstColor) / depth);
  for (let i = 0; i <= depth; i++) {
    colorsArray.push(decimalToRGB(firstColor));
    if (firstColor > lastColor) {
      firstColor -= step;
    } else {
      firstColor += step;
    }
  }

  return colorsArray;
}

function decimalToRGB(decimalColor) {
  const r = (decimalColor >> 16) & 255;
  const g = (decimalColor >> 8) & 255;
  const b = decimalColor & 255;
  return `rgb(${r}, ${g}, ${b})`;
}
