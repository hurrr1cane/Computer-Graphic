const controlContainer = document.querySelector('.control-container');

// Function to calculate total height of all child elements
function getTotalHeight(element) {
  return Array.from(element.children).reduce((acc, child) => {
    const styles = window.getComputedStyle(child);
    const marginTop = parseFloat(styles.marginTop);
    const marginBottom = parseFloat(styles.marginBottom);
    const paddingTop = parseFloat(styles.paddingTop);
    const paddingBottom = parseFloat(styles.paddingBottom);
    
    return acc + child.offsetHeight + marginTop + marginBottom + paddingTop + paddingBottom;
  }, 0);
}

function setJustifyContent() {
  const totalHeight = getTotalHeight(controlContainer);
  if (window.innerHeight > totalHeight && window.innerWidth > 600) {
    controlContainer.style.justifyContent = 'center';
  } else {
    controlContainer.style.justifyContent = 'flex-start';
  }
}

// Add viewport listener for screen resizing
// If the screen height is more than total height of child elements, then set justify-content to center, otherwise remove it
window.addEventListener('resize', setJustifyContent);


const rgbButton = document.getElementById('rgb-button');
const hsvButton = document.getElementById('hsv-button');
const rgbControls = document.querySelector('#rgb-controls');
const hsvControls = document.querySelector('#hsv-controls');

rgbButton.addEventListener('click', () => {
    rgbControls.classList.remove('hidden');
    hsvControls.classList.add('hidden');
    switchActiveTo(rgbButton);
    
    if (imageInHSV.length > 0) {
      imageInRGB = convertImageToRGB(imageInHSV);
      showRGBImage();
      displayChannelsRGB(rgbChannels[0], rgbChannels[1], rgbChannels[2]);
      endChangingCyan();
    }
  }
);

hsvButton.addEventListener('click', () => {
    changeToSHV();
  }
);

const uploadButton = document.getElementById('image-upload');
const downloadButton = document.getElementById('image-download');

uploadButton.addEventListener('click', (event) => {
    event.preventDefault();
    const fileInput = document.getElementById('image-input');
    fileInput.click();
    
    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      const reader = new FileReader();
      
      reader.onload = function () {
        const image = new Image();
        image.src = reader.result;
        image.onload = function () {
          rgbControls.classList.remove('hidden');
          hsvControls.classList.add('hidden');
          fillCanvasWithImage(image);
          imageInRGB = [];
          imageInHSV = [];
          storeRGBImage();
          switchActiveTo(rgbButton);
          endChangingCyan();
        }
      }
      reader.readAsDataURL(file);
    });
  }
);

downloadButton.addEventListener('click', (event) => {
    event.preventDefault();
    const image = getImage();
    const a = document.createElement('a');
    a.href = image;
    // Set the file name as the current date and time
    a.download = 'Gender-neutral_color_kayfoeditor' + new Date().toISOString() + '.png';
    a.click();
    a.remove();
  }
);


const cyanSlider = document.getElementById('cyan-slider');
const cyanCurrent = document.getElementById('cyan-current');

cyanSlider.addEventListener('input', () => {
    cyanCurrent.textContent = cyanSlider.value;
  }
);

function switchActiveTo(element) {
  const active = document.querySelector('#color-scheme-switcher .button.active');
  if (active === element) return;
  if (active !== null)
    active.classList.remove('active');
  element.classList.add('active');
}


canvas.addEventListener('mousemove', (event) => {
  const rect = canvas.getBoundingClientRect(); // get the bounding rectangle of the canvas
  const scaleX = canvas.width / rect.width;     // scale factor in X
  const scaleY = canvas.height / rect.height;   // scale factor in Y
  
  // Adjust mouse coordinates relative to the canvas
  const x = (event.clientX - rect.left) * scaleX;
  const y = (event.clientY - rect.top) * scaleY;
  
  const imageData = ctx.getImageData(x, y, 1, 1).data;
  
  const [r, g, b] = imageData;
  const [h, s, v] = convertRGBToHSV(r, g, b);
  
  const rgbText = `R: ${r}, G: ${g}, B: ${b}`;
  const hsvText = `H: ${h}, S: ${s}, V: ${v}`;
  
  document.getElementById('rgb-info').textContent = rgbText;
  document.getElementById('hsv-info').textContent = hsvText;
});

canvas.addEventListener('mouseleave', () => {
  document.getElementById('rgb-info').textContent = `R: 0, G: 0, B: 0`;
  document.getElementById('hsv-info').textContent = `H: 0, S: 0, V: 0`;
});

const rgbChecks = rgbControls.querySelectorAll('input[type="checkbox"]');
const hsvChecks = hsvControls.querySelectorAll('input[type="checkbox"]');

const rgbChannels = [true, true, true];
const hsvChannels = [true, true, true];

rgbChecks.forEach((checkbox) => {
  checkbox.addEventListener('change', () => {
    if (checkbox.id === 'controls-r') {
      rgbChannels[0] = checkbox.checked;
    }
    if (checkbox.id === 'controls-g') {
      rgbChannels[1] = checkbox.checked;
    }
    if (checkbox.id === 'controls-b') {
      rgbChannels[2] = checkbox.checked;
    }
    displayChannelsRGB(rgbChannels[0], rgbChannels[1], rgbChannels[2]);
  });
});

hsvChecks.forEach((checkbox) => {
  checkbox.addEventListener('change', () => {
    if (checkbox.id === 'controls-h') {
      hsvChannels[0] = checkbox.checked;
    }
    if (checkbox.id === 'controls-s') {
      hsvChannels[1] = checkbox.checked;
    }
    if (checkbox.id === 'controls-v') {
      hsvChannels[2] = checkbox.checked;
    }
    displayChannelsHSV(hsvChannels[0], hsvChannels[1], hsvChannels[2]);
  });
});

const changeValueForCyan = document.querySelector('#change-value-for-cyan');

let isNowChangingCyan = false;
changeValueForCyan.addEventListener('click', () => {
  isNowChangingCyan = !isNowChangingCyan;
  
  if (isNowChangingCyan) {
    changeValueForCyan.classList.add('active');
    
    changeToSHV();
    
    imageForChange = [...imageInHSV];
    canvas.addEventListener('click', cyanChanger);
    //console.log('Now changing cyan');
  } else {
    endChangingCyan();
    //console.log('Stopped changing cyan');
  }
});

function changeToSHV() {
  hsvControls.classList.remove('hidden');
  rgbControls.classList.add('hidden');
  switchActiveTo(hsvButton);
  
  imageInHSV = convertImageToHSV(imageInRGB);
  showHSVImage();
  displayChannelsHSV(hsvChannels[0], hsvChannels[1], hsvChannels[2]);
}

function cyanChanger(event) {
  const rect = canvas.getBoundingClientRect(); // get the bounding rectangle of the canvas
  const scaleX = canvas.width / rect.width;     // scale factor in X
  const scaleY = canvas.height / rect.height;   // scale factor in Y
  
  // Adjust mouse coordinates relative to the canvas
  const x = (event.clientX - rect.left) * scaleX;
  const y = (event.clientY - rect.top) * scaleY;
  
  const cyanValue = parseInt(cyanSlider.value);
  changeCyanValue(cyanValue, [x, y]);
  
}

function endChangingCyan() {
  canvas.removeEventListener('click', cyanChanger);
  isNowChangingCyan = false;
  changeValueForCyan.classList.remove('active');
}