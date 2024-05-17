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
const k = document.getElementById('k');

const startAnimationButton = document.getElementById('start-animation');
const stopAnimationButton = document.getElementById('stop-animation');
const saveMatrixButton = document.getElementById('save-matrix');
const saveImageButton = document.getElementById('save-image');

const verificationAllError = document.getElementById('verification-all-error');

startAnimationButton.addEventListener('click', (event) => {
  if (verifyAllFields()) {
    try {
      startAnimation(x1.value, x2.value, x3.value, y1.value, y2.value, y3.value, k.value);
    } catch (error) {
      showError();
    }
  }
});

stopAnimationButton.addEventListener('click', (event) => {
  pauseAnimation();
});

saveMatrixButton.addEventListener('click', (event) => {
  event.preventDefault();
  const matrix = getMatrix();
  if (matrix) {
    const a = document.createElement('a');
    a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(matrix);
    // Set the file name as the current date and time
    a.download = 'No-clue-kayfoeditor-of-changes-' + new Date().toISOString() + '.txt';
    a.click();
    a.remove();
  } else {
    if (verifyAllFields()) {
      try {
        startAnimation(x1.value, x2.value, x3.value, y1.value, y2.value, y3.value, k.value);
        
        const matrix = getMatrix();
        
        const a = document.createElement('a');
        a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(matrix);
        // Set the file name as the current date and time
        a.download = 'No-clue-kayfoeditor-of-changes-' + new Date().toISOString() + '.txt';
        a.click();
        a.remove();
      } catch (error) {
        showError();
      }
    }
  }
});

saveImageButton.addEventListener('click', (event) => {
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
  if (!verifyField(k)) {
    error = true;
  }
  
  
  if (error) {
    // Remove hidden class for 3 seconds
    showError();
  }
  
  return !error;
}

function showError() {
  verificationAllError.classList.remove('hidden');
  setTimeout(() => {
    verificationAllError.classList.add('hidden');
  }, 3000);
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

drawGrid();