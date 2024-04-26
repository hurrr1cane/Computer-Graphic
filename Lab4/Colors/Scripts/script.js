let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
canvas.width = 900;
canvas.height = 900;

const width = canvas.width;
const height = canvas.height;


function fillCanvasWithImage(image) {
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(image, 0, 0, width, height);
}

function getImage() {
  return canvas.toDataURL('image/png');
}


let imageInRGB = [];
let imageInHSV = [];
let imageForChange = [];

function convertRGBToHSV(r, g, b, a) {
  r /= 255;
  g /= 255;
  b /= 255;
  
  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  
  let h, s, v = max;
  
  let d = max - min;
  s = max === 0 ? 0 : d / max;
  
  if (max === min) {
    h = 0;
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(v * 100)];
}


function convertHSVToRGB(h, s, v, a) {
  let r, g, b;
  
  h /= 60;
  s /= 100;
  v /= 100;
  
  const c = v * s;
  const x = c * (1 - Math.abs(h % 2 - 1));
  const m = v - c;
  
  let r1, g1, b1;
  
  if (h >= 0 && h < 1) {
    [r1, g1, b1] = [c, x, 0];
  } else if (h >= 1 && h < 2) {
    [r1, g1, b1] = [x, c, 0];
  } else if (h >= 2 && h < 3) {
    [r1, g1, b1] = [0, c, x];
  } else if (h >= 3 && h < 4) {
    [r1, g1, b1] = [0, x, c];
  } else if (h >= 4 && h < 5) {
    [r1, g1, b1] = [x, 0, c];
  } else {
    [r1, g1, b1] = [c, 0, x];
  }
  
  r = Math.round((r1 + m) * 255);
  g = Math.round((g1 + m) * 255);
  b = Math.round((b1 + m) * 255);
  
  return [r, g, b, a];
}


function convertImageToHSV(rgbArray) {
  let hsvArray = [];
  
  //console.log(rgbArray);
  
  for (let i = 0; i < rgbArray.length; i += 4) {
    let r = rgbArray[i];
    let g = rgbArray[i + 1];
    let b = rgbArray[i + 2];
    
    let hsv = convertRGBToHSV(r, g, b);
    
    hsvArray.push(hsv[0]);
    hsvArray.push(hsv[1]);
    hsvArray.push(hsv[2]);
    hsvArray.push(rgbArray[i + 3]);  // Preserve alpha channel
  }
  
  //console.log(hsvArray);
  return hsvArray;
}

function convertImageToRGB(hsvArray) {
  let rgbArray = [];
  
  for (let i = 0; i < hsvArray.length; i += 4) {
    let h = hsvArray[i];
    let s = hsvArray[i + 1];
    let v = hsvArray[i + 2];
    let a = hsvArray[i + 3];
    
    let rgb = convertHSVToRGB(h, s, v, a);
    
    rgbArray.push(rgb[0]);
    rgbArray.push(rgb[1]);
    rgbArray.push(rgb[2]);
    rgbArray.push(rgb[3]);  // Preserve alpha channel
  }
  
  return rgbArray;
}

function storeRGBImage() {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  imageInRGB = imageData.data;
  //console.log(imageInRGB);
}

function showHSVImage() {
  // Convert HSV image data to RGB
  const rgbArray = convertImageToRGB(imageInHSV);
  
  // Create a new ImageData object with the RGB data
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;
  
  // Fill the imageData with the converted RGB values
  for (let i = 0; i < data.length; i += 4) {
    data[i] = rgbArray[i];
    data[i + 1] = rgbArray[i + 1];
    data[i + 2] = rgbArray[i + 2];
    data[i + 3] = rgbArray[i + 3];
  }
  
  // Put the RGB image data onto the canvas
  ctx.putImageData(imageData, 0, 0);
}

function showRGBImage() {
  // Create a new ImageData object with the RGB data
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;
  
  // Fill the imageData with the RGB values
  for (let i = 0; i < data.length; i += 4) {
    data[i] = imageInRGB[i];
    data[i + 1] = imageInRGB[i + 1];
    data[i + 2] = imageInRGB[i + 2];
    data[i + 3] = imageInRGB[i + 3];
  }
  
  // Put the RGB image data onto the canvas
  ctx.putImageData(imageData, 0, 0);
}

function displayChannelsRGB(r, g, b) {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    data[i] = r ? imageInRGB[i] : 0;
    data[i + 1] = g ? imageInRGB[i + 1] : 0;
    data[i + 2] = b ? imageInRGB[i + 2] : 0;
  }
  
  ctx.putImageData(imageData, 0, 0);
}

function displayChannelsHSV(h, s, v) {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    let [r,g,b] = convertHSVToRGB(h? imageInHSV[i] : 0, s? imageInHSV[i+1] : 0, v? imageInHSV[i+2] : 0, imageInHSV[i+3]);
    
    
    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
  }
  
  ctx.putImageData(imageData, 0, 0);
}

function changeCyanValue(cyanValue, coordinates, radius = 40) {
  
  
  for (let i = 0; i < imageForChange.length; i += 4) {
    let x = (i / 4) % width;
    let y = Math.floor((i / 4) / width);
    
    let distance = Math.sqrt((coordinates[0] - x) ** 2 + (coordinates[1] - y) ** 2);
    
    if (distance <= radius && imageForChange[i] > 160 && imageForChange[i] < 200) {
      imageForChange[i + 2] = cyanValue;
    }
  }
  
  let rgbArray = convertImageToRGB(imageForChange);
  
  const imageData = ctx.createImageData(width, height);
  
  for (let i = 0; i < imageData.data.length; i += 4) {
    imageData.data[i] = rgbArray[i];
    imageData.data[i + 1] = rgbArray[i + 1];
    imageData.data[i + 2] = rgbArray[i + 2];
    imageData.data[i + 3] = rgbArray[i + 3];
  }
  
  ctx.putImageData(imageData, 0, 0);
}