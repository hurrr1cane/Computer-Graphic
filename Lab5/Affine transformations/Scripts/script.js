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
    if (i / unitSegmentSize === 0) {
      continue;
    }
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
    if (i / unitSegmentSize === 0) {
      ctx.fillText(i / unitSegmentSize, 10, 10);
      continue;
    }
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

let currentTriangle;

function drawCurrentTriangle() {
  if (currentTriangle) {
    currentTriangle.draw();
  }
}

function zoomIn() {
  unitSegmentSize += 3;
  drawGrid();
  
  drawCurrentTriangle();
}

function zoomOut() {
  if (unitSegmentSize > 5) {
    unitSegmentSize -= 3;
    drawGrid();
    
    drawCurrentTriangle();
  }
}

class Triangle {
  constructor(x1, y1, x2, y2, x3, y3) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.x3 = x3;
    this.y3 = y3;
    
    if (!this.checkIfTriangle()) {
      throw new Error('The points do not form a triangle');
    }
  }
  
  checkIfTriangle() {
    return this.getArea() !== 0;
  }
  
  draw() {
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.moveTo(transformCoordinatesToRealX(this.x1), transformCoordinatesToRealY(this.y1));
    ctx.lineTo(transformCoordinatesToRealX(this.x2), transformCoordinatesToRealY(this.y2));
    ctx.lineTo(transformCoordinatesToRealX(this.x3), transformCoordinatesToRealY(this.y3));
    ctx.lineTo(transformCoordinatesToRealX(this.x1), transformCoordinatesToRealY(this.y1));
    
    //Fill with blue-yellow gradient
    let gradient = ctx.createLinearGradient(transformCoordinatesToRealX(this.x1), transformCoordinatesToRealY(this.y1), transformCoordinatesToRealX(this.x2), transformCoordinatesToRealY(this.y2));
    gradient.addColorStop(0, '#06007d');
    gradient.addColorStop(1, '#ffc012');
    ctx.fillStyle = gradient;
    ctx.fill();
    
    ctx.stroke();
    ctx.restore();
  }
  
  getArea() {
    return Math.abs((this.x1 * (this.y2 - this.y3) + this.x2 * (this.y3 - this.y1) + this.x3 * (this.y1 - this.y2)) / 2);
  }
  
  equals(triangle) {
    return this.x1 === triangle.x1 && this.y1 === triangle.y1 &&
      this.x2 === triangle.x2 && this.y2 === triangle.y2 &&
      this.x3 === triangle.x3 && this.y3 === triangle.y3;
    
  }
}



class Animation {
  constructor(triangle, coefficient, duration) {
    //this.triangle = triangle;
    this.coefficient = coefficient;
    this.duration = duration;
    
    this.animation = false;
    currentTriangle = triangle;
    this.startTriangle = true;
    
    
  }
  
  play() {
    if (!this.animationInterval) {
      this.animate();
    }
    this.animation = true;
  }
  
  pause() {
    clearInterval(this.animationInterval);
    this.animationInterval = null;
    this.animation = false;
  }
  
  animate() {
    this.animationInterval = setInterval(() => {
      if (this.animation) {
        let currentMatrix = new Matrix();
        currentMatrix.addRow([currentTriangle.x1, currentTriangle.y1, 1]);
        currentMatrix.addRow([currentTriangle.x2, currentTriangle.y2, 1]);
        currentMatrix.addRow([currentTriangle.x3, currentTriangle.y3, 1]);
        
        let matrix;
        let result;
        if (this.startTriangle) {
          matrix = this.getMatrixThatWay(currentTriangle, this.coefficient);
        } else {
          matrix = this.getMatrixAnotherWay(currentTriangle, this.coefficient);
        }
        
        result = currentMatrix.multiply(matrix);
        
        currentTriangle.x1 = result.matrix[0][0];
        currentTriangle.y1 = result.matrix[0][1];
        currentTriangle.x2 = result.matrix[1][0];
        currentTriangle.y2 = result.matrix[1][1];
        currentTriangle.x3 = result.matrix[2][0];
        currentTriangle.y3 = result.matrix[2][1];
        this.startTriangle = !this.startTriangle;
        
        
        this.redraw();
      }
    }, this.duration);
  }
  
  getMatrixThatWay(triangle, coefficient) {
    let matrixes = [];
    matrixes.push(this.getMatrixToMoveToCenter(triangle));
    matrixes.push(this.getMatrixToRotate(triangle));
    matrixes.push(this.getMatrixToMirror());
    matrixes.push(this.getMatrixToScale(coefficient));
    matrixes.push(this.getMatrixToRotateBack(triangle));
    matrixes.push(this.getMatrixToMoveBack(triangle));
    
    //Return all matrixes multiplied
    let result = matrixes[0];
    for (let i = 1; i < matrixes.length; i++) {
      result = result.multiply(matrixes[i]);
    }
    return result;
  }
  
  getMatrixAnotherWay(triangle, coefficient) {
    let matrixes = [];
    matrixes.push(this.getMatrixToMoveToCenter(triangle));
    matrixes.push(this.getMatrixToRotate(triangle));
    matrixes.push(this.getMatrixToMirror());
    matrixes.push(this.getMatrixToScale(1.0 / coefficient));
    matrixes.push(this.getMatrixToRotateBack(triangle));
    matrixes.push(this.getMatrixToMoveBack(triangle));
    
    //Return all matrices multiplied
    let result = matrixes[0];
    for (let i = 1; i < matrixes.length; i++) {
      result = result.multiply(matrixes[i]);
    }
    return result;
  }
  
  // Перенесення, щоб точка А на 0 0
  // Поворот, щоб АВ була на ОХ
  // Відзеркалення відносно ОХ
  // Збільшення відносно 0 0
  // Поворот назад
  // Перенесення назад
  
  
  getMatrixToMoveToCenter(triangle) {
    return Matrix.translation(-triangle.x1, -triangle.y1);
  }
  
  getMatrixToRotate(triangle) {
    let angle = Math.atan2(triangle.y2 - triangle.y1, triangle.x2 - triangle.x1);
    return Matrix.rotation(angle);
  }
  
  getMatrixToMirror() {
    return Matrix.reflectionOX();
  }
  
  getMatrixToScale(coefficient) {
    return Matrix.scale(coefficient);
  }
  
  getMatrixToRotateBack(triangle) {
    let angle = Math.atan2(triangle.y2 - triangle.y1, triangle.x2 - triangle.x1);
    return Matrix.rotation(-angle);
  }
  
  getMatrixToMoveBack(triangle) {
    return Matrix.translation(triangle.x1, triangle.y1);
  }
  
  redraw() {
    drawGrid();
    currentTriangle.draw();
  }
  
}


class Matrix {
  constructor() {
    this.matrix = [];
  }
  
  addRow(row) {
    this.matrix.push(row);
  }
  
  multiply(matrix) {
    let result = new Matrix();
    for (let i = 0; i < this.matrix.length; i++) {
      let row = [];
      for (let j = 0; j < matrix.matrix[0].length; j++) {
        let sum = 0;
        for (let k = 0; k < this.matrix[i].length; k++) {
          sum += this.matrix[i][k] * matrix.matrix[k][j];
        }
        row.push(sum);
      }
      result.addRow(row);
    }
    return result;
  }
  
  // Create identity matrix
  static identity(size) {
    let matrix = new Matrix();
    for (let i = 0; i < size; i++) {
      let row = [];
      for (let j = 0; j < size; j++) {
        row.push(i === j ? 1 : 0);
      }
      matrix.addRow(row);
    }
    return matrix;
  }
  
  static translation(x, y) {
    let matrix = Matrix.identity(3);
    matrix.matrix[2][0] = parseFloat(parseFloat(x).toFixed(7));
    matrix.matrix[2][1] = parseFloat(parseFloat(y).toFixed(7));
    
    return matrix;
  }
  
  static scale(k) {
    let matrix = Matrix.identity(3);
    matrix.matrix[0][0] = k;
    matrix.matrix[1][1] = k;
    return matrix;
  }
  
  static rotation(angle) {
    let matrix = Matrix.identity(3);
    matrix.matrix[0][0] = Math.cos(angle).toFixed(7);
    matrix.matrix[0][1] = -Math.sin(angle).toFixed(7);
    matrix.matrix[1][0] = Math.sin(angle).toFixed(7);
    matrix.matrix[1][1] = Math.cos(angle).toFixed(7);
    return matrix;
  }
  
  static reflectionOX() {
    let matrix = Matrix.identity(3);
    matrix.matrix[1][1] = -1;
    return matrix;
  }
}

let allHailTriangle;
let allHailCoefficient;
let allHailAnimation;

function startAnimation(x1, x2, x3, y1, y2, y3, coefficient) {
  let triangle = new Triangle(x1, y1, x2, y2, x3, y3);
  if (allHailTriangle == null || !(triangle.equals(allHailTriangle) && allHailCoefficient === coefficient)) {
    allHailTriangle = triangle;
    allHailCoefficient = coefficient;
    if (allHailAnimation != null) {
      allHailAnimation.pause();
    }
    allHailAnimation = new Animation(triangle, coefficient, 1000);
    allHailAnimation.animate();
  }
  allHailAnimation.play();
}

function pauseAnimation() {
  if (allHailAnimation != null) {
    allHailAnimation.pause();
  }
}

function getMatrix() {
  if (allHailAnimation) {
    let matrix = allHailAnimation.getMatrixThatWay(allHailTriangle, allHailCoefficient);
    let result = '';
    for (let i = 0; i < matrix.matrix.length; i++) {
      result += matrix.matrix[i].join(' ') + '\n';
    }
    return result;
  }
  return null;
}