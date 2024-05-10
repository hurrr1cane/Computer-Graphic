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


const x1 = document.getElementById('x1');
const y1 = document.getElementById('y1');
const x2 = document.getElementById('x2');
const y2 = document.getElementById('y2');
const x3 = document.getElementById('x3');
const y3 = document.getElementById('y3');
const x = document.getElementById('x');
const y = document.getElementById('y');
const k = document.getElementById('k');

const startAnimation = document.getElementById('start-animation');
const stopAnimation = document.getElementById('stop-animation');
const saveMatrix = document.getElementById('save-matrix');
const saveImage = document.getElementById('save-image');

const verificationAllError = document.getElementById('verification-all-error');

startAnimation.addEventListener('click', (event) => {
  if (verifyAllFields()) {
  
  }
});

saveImage.addEventListener('click', (event) => {
    event.preventDefault();
    const image = getImage();
    const a = document.createElement('a');
    a.href = image;
    // Set the file name as the current date and time
    a.download = 'No-clue-kayfoeditor-of-changes-' + new Date().toISOString() + '.png';
    a.click();
    a.remove();
  }
);

canvas.addEventListener('wheel', (event) => {
  event.preventDefault();
  const delta = event.deltaY;
  if (delta < 0) {
    zoomIn();
  } else {
    zoomOut();
  }
});

function verifyAllFields() {
  let error = false;
  if (!verifyField(x1)) {
    error = true;
  }
  if (!verifyField(y1)) {
    error = true;
  }
  if (!verifyField(x2)) {
    error = true;
  }
  if (!verifyField(y2)) {
    error = true;
  }
  if (!verifyField(x3)) {
    error = true;
  }
  if (!verifyField(y3)) {
    error = true;
  }
  if (!verifyField(x)) {
    error = true;
  }
  if (!verifyField(y)) {
    error = true;
  }
  if (!verifyField(k)) {
    error = true;
  }
  
  if (error) {
    // Remove hidden class for 3 seconds
    verificationAllError.classList.remove('hidden');
    setTimeout(() => {
      verificationAllError.classList.add('hidden');
    }, 3000);
  }
  
  return !error;
}

function verifyField(field) {
  //Add field on 3 seconds
  if (field.value === '') {
    field.classList.add('error');
    setTimeout(() => {
      field.classList.remove('error');
    }, 3000);
  }
  return field.value !== '';
}

