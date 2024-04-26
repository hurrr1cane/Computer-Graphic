let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
canvas.width = 900;
canvas.height = 900;

let width = canvas.width;
let height = canvas.height;

paintCoordinates(width, height, ctx);
setRandomColors();
setDrawParallelogramButton(width, height, ctx);

function paintCoordinates(width, height, ctx) {
  drawLine({ x: width / 2, y: 0 }, { x: width / 2, y: height }, ctx);
  drawLine({ x: 0, y: height / 2 }, { x: width, y: height / 2 }, ctx);
  //Draw arrows
  let arrowSize = width / 50;
  drawLine(
    { x: width / 2, y: 0 },
    { x: width / 2 - arrowSize, y: arrowSize * 2 },
    ctx
  );
  drawLine(
    { x: width / 2, y: 0 },
    { x: width / 2 + arrowSize, y: arrowSize * 2 },
    ctx
  );
  drawLine(
    {
      x: width,
      y: height / 2,
    },
    { x: width - arrowSize * 2, y: height / 2 - arrowSize },
    ctx
  );
  drawLine(
    { x: width, y: height / 2 },
    { x: width - arrowSize * 2, y: height / 2 + arrowSize },
    ctx
  );

  //Draw numbers and lines
  let countOfSteps = 20;
  let step = width / countOfSteps;
  let stepCount = 0;
  for (let i = 0; i < width; i += step) {
    drawLine(
      { x: i, y: height / 2 - height / 100 },
      { x: i, y: height / 2 + height / 100 },
      ctx
    );
    //Set bigger text
    ctx.font = "20px Arial";
    let text = 19 !== stepCount? stepCount - countOfSteps / 2: 'x';
    ctx.fillText(
      //stepCount - countOfSteps / 2,
      text,
      i + width / 200,
      height / 2 + height / 40
    );
    stepCount++;
  }
  stepCount = 0;
  for (let i = 0; i < height; i += step) {
    drawLine(
      { x: width / 2 - width / 100, y: i },
      { x: width / 2 + width / 100, y: i },
      ctx
    );
    //Set bigger text
    ctx.font = "20px Arial";
    let text = 0 !== stepCount? countOfSteps / 2 - stepCount: 'y';
    ctx.fillText(
      //countOfSteps / 2 - stepCount,
      text,
      width / 2 + width / 200,
      i + height / 40
    );
    stepCount++;
  }
}

//Draw line
function drawLine(point1, point2, ctx, color = "black") {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.moveTo(point1.x, point1.y);
  ctx.lineTo(point2.x, point2.y);
  ctx.stroke();
  ctx.closePath();
}

function setRandomColors() {
  document.querySelectorAll("input[type='color']").forEach((input) => {
    input.value = "#" + Math.floor(Math.random() * 16777215).toString(16);
  });
}

function setDrawParallelogramButton(width, height, ctx) {
  document.querySelector(".control-draw").addEventListener("click", () => {
    //Check if all inputs are filled correctly
    //Get values from inputs
    //RegEx should be "number;number"
    let pointInputs = document.querySelectorAll(
      ".control-point-coordinates-input"
    );

    let wrongFormat = false;
    let points = [];
    pointInputs.forEach((input) => {
      if (
        !input.value.match(
          /^\s*(\+|-)?\d+\.\d+|\d+\s*;\s*(\+|-)?\d+\.\d+|\d+\s*$/
        )
      ) {
        setWrongFormatMessage(true);
        wrongFormat = true;
        return;
      }

      setWrongFormatMessage(false);
      wrongFormat = false;
      let values = input.value.split(";");
      points.push({ x: parseFloat(values[0]), y: parseFloat(values[1]) });

      if (parseFloat(values[0]) < -10 || parseFloat(values[0]) > 0) {
        setWrongIntervalMessage(true);
        wrongFormat = true;
        return;
      }
      if (parseFloat(values[1]) < 0 || parseFloat(values[1]) > 10) {
        setWrongIntervalMessage(true);
        wrongFormat = true;
        return;
      }
      setWrongIntervalMessage(false);
    });

    if (!wrongFormat) {
      let sides = checkIfParallelogram(points);

      if (sides) {
        console.log(sides);
        let justSides = [];
        sides.forEach((side) => {
          justSides.push(side[0]);
          justSides.push(side[1]);
        });
        drawParallelogram(justSides, ctx);
        drawDiagonals(findDiagonals(points, justSides), ctx);

        drawHeightOfParallelogram(justSides, ctx);
      } else {
        alert("This is not a parallelogram!");
      }
    }
  });
}

//Set messages
function setWrongFormatMessage(isWrong) {
  let message = document.querySelector(".wrong-format-message");
  if (isWrong) {
    message.style.display = "block";
  } else {
    message.style.display = "none";
  }
}

function setWrongIntervalMessage(isWrong) {
  let message = document.querySelector(".wrong-interval-message");
  if (isWrong) {
    message.style.display = "block";
  } else {
    message.style.display = "none";
  }
}

//Check if it is a parallelogram
function checkIfParallelogram(points) {
  if (points.length !== 4) {
    // Quadrilateral must have four points
    return false;
  }

  let parallelSides = [];
  let sides = [];
  sides.push([points[0], points[1]]);
  sides.push([points[0], points[2]]);
  sides.push([points[1], points[3]]);
  sides.push([points[2], points[3]]);
  sides.push([points[0], points[3]]);
  sides.push([points[1], points[2]]);

  //X1 / X2 = Y1 / Y2 || X1 / -X2 = Y1 / -Y2

  for (let i = 0; i < 6; i++) {
    for (let j = i + 1; j < 6; j++) {
      let x1 = sides[i][1].x - sides[i][0].x;
      let y1 = sides[i][1].y - sides[i][0].y;
      let x2 = sides[j][1].x - sides[j][0].x;
      let y2 = sides[j][1].y - sides[j][0].y;

      if (
        x1 / x2 === y1 / y2 ||
        x1 / -x2 === y1 / -y2 ||
        (x1 === 0 && x2 === 0) ||
        (y1 === 0 && y2 === 0)
      ) {
        //console.log("Parallel sides");
        parallelSides.push([sides[i], sides[j]]);
      } else {
        //console.log("Not parallel sides");
      }
    }
  }

  if (parallelSides.length === 2) {
    return parallelSides;
  } else {
    return false;
  }
}

//Find diagonals
function findDiagonals(points, sides) {
  let diagonals = [];

  let allSections = [];
  allSections.push([points[0], points[2]]);
  allSections.push([points[1], points[3]]);
  allSections.push([points[0], points[3]]);
  allSections.push([points[1], points[2]]);
  allSections.push([points[0], points[1]]);
  allSections.push([points[2], points[3]]);

  allSections.forEach((section) => {
    //Just find the section that is not a side
    let isSide = false;
    for (let i = 0; i < sides.length; i++) {
      if (
        (checkSamePoints(section[0], sides[i][0]) &&
          checkSamePoints(section[1], sides[i][1])) ||
        (checkSamePoints(section[0], sides[i][1]) &&
          checkSamePoints(section[1], sides[i][0]))
      ) {
        isSide = true;
      }
    }

    if (!isSide) {
      diagonals.push(section);
    }
  });

  return diagonals;
}

//Draw parallelogram
function drawParallelogram(sides, ctx) {
  ctx.beginPath();

  let usedPoints = [];
  let previousPoint = null;

  for (let i = 0; i < 4; i++) {
    let nextPoint = findNextPoint(sides, usedPoints, previousPoint);
    console.log(nextPoint);

    ctx.lineTo(
      getRealCoordinateX(nextPoint.x),
      getRealCoordinateY(nextPoint.y)
    );

    usedPoints.push(nextPoint);
    previousPoint = nextPoint;
  }

  ctx.lineTo(
    getRealCoordinateX(sides[0][0].x),
    getRealCoordinateY(sides[0][0].y)
  );

  ctx.strokeStyle = "black";
  //Set random color
  ctx.fillStyle = "#" + Math.floor(Math.random() * 16777215).toString(16);
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
}

//Get real coordinates from the given coordinates
function getRealCoordinateX(x) {
  let realX = width / 2 + (x * width) / 20;
  return realX;
}

function getRealCoordinateY(y) {
  let realY = height / 2 - (y * height) / 20;
  return realY;
}

//Find next point to draw a line to
function findNextPoint(sides, usedPoints, previousPoint) {
  let pointToReturn = null;

  if (!previousPoint) {
    pointToReturn = sides[0][0];
  }

  sides.forEach((side) => {
    if (side[0] === previousPoint) {
      if (!isPresentInArray(usedPoints, side[1])) {
        pointToReturn = side[1];
      }
    }

    if (side[1] === previousPoint) {
      if (!isPresentInArray(usedPoints, side[0])) {
        pointToReturn = side[0];
      }
    }
  });

  if (!pointToReturn) {
    pointToReturn = sides[0][0];
  }

  return pointToReturn;
}

//Check if two points are the same
function checkSamePoints(point1, point2) {
  if (point1.x === point2.x && point1.y === point2.y) {
    return true;
  }
  return false;
}

function isPresentInArray(array, point) {
  for (let i = 0; i < array.length; i++) {
    if (checkSamePoints(array[i], point)) {
      return true;
    }
  }
  return false;
}

//Draw diagonals of parallelogram
function drawDiagonals(diagonals, ctx) {
  let colorSelectors = document.querySelectorAll("input[type='color']");
  let colors = [];
  colorSelectors.forEach((color) => {
    colors.push(color.value);
  });

  //console.log(colors);

  for (let i = 0; i < diagonals.length; i++) {
    drawLine(
      {
        x: getRealCoordinateX(diagonals[i][0].x),
        y: getRealCoordinateY(diagonals[i][0].y),
      },
      {
        x: getRealCoordinateX(diagonals[i][1].x),
        y: getRealCoordinateY(diagonals[i][1].y),
      },
      ctx,
      colors[i % diagonals.length]
    );
  }
}

//Draw height of parallelogram
function drawHeightOfParallelogram(sides, ctx) {
  let points = [];

  //let usedPoints = [];
  let previousPoint = null;

  for (let i = 0; i < 4; i++) {
    let nextPoint = findNextPoint(sides, points, previousPoint);

    points.push(nextPoint);
    previousPoint = nextPoint;
  }
  let pointToDrawTo = findHeight(points);

  //Draw height
  drawLine(
    {
      x: getRealCoordinateX(points[1].x),
      y: getRealCoordinateY(points[1].y),
    },
    {
      x: getRealCoordinateX(pointToDrawTo.x),
      y: getRealCoordinateY(pointToDrawTo.y),
    },
    ctx,
    "red"
  );

  //Draw continuation of side
  drawLine(
    {
      x: getRealCoordinateX(points[2].x),
      y: getRealCoordinateY(points[2].y),
    },
    {
      x: getRealCoordinateX(pointToDrawTo.x),
      y: getRealCoordinateY(pointToDrawTo.y),
    },
    ctx
  );
}

//Find a point that height is drawn to
function findHeight(points) {

  let p1 = 1;

  let k = findK(p1 + 1, p1 + 2, points),
    b = findB(p1 + 1, p1 + 2, points);
  let x = (-b * k + points[p1].x + points[p1].y * k) / (1 + k * k);
  let p2 = { x: x, y: k * x + b };

  console.log(p2);
  return p2;
}

function findK(coord1, coord2, points) {
  if (points[coord1].x - points[coord2].x === 0) return 0;
  let b =
    (points[coord1].y - points[coord2].y) /
    (points[coord1].x - points[coord2].x);
  return b;
}

function findB(coord1, coord2, points) {
  if (points[coord2].x - points[coord1].x === 0) return points[coord1].y;
  let n =
    -(
      ((points[coord2].y - points[coord1].y) * points[coord1].x) /
      (points[coord2].x - points[coord1].x)
    ) + points[coord1].y;
  return n;
}
