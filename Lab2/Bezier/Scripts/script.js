let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
canvas.width = 900;
canvas.height = 900;

const width = canvas.width;
const height = canvas.height;

paintCoordinates(width, height, ctx);
setRandomColors();

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
    let text = 19 !== stepCount ? stepCount - countOfSteps / 2 : "x";
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
    let text = 0 !== stepCount ? countOfSteps / 2 - stepCount : "y";
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

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getRealX() {
    return width / 2 + (this.x * width) / 20;
  }

  getRealY() {
    return height / 2 - (this.y * height) / 20;
  }
}

class BezierCurve {
  #tStep = 0.01;

  constructor(name, color, points) {
    this.name = name;
    this.color = color;
    this.points = points;
  }

  draw(ctx) {
    this.#drawPoints(ctx, this.color);
    this.#drawBezierCurve(ctx, this.color);
  }

  drawWithParameter(ctx) {
    this.#drawPoints(ctx, this.color);
    this.#drawBezierCurveParameter(ctx, this.color);
  }

  #drawBezierCurveParameter(ctx, color) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.moveTo(this.points[0].getRealX(), this.points[0].getRealY());

    let t = 0;
    while (t <= 1) {
      let x = 0;
      let y = 0;
      let point;
      for (let i = 0; i < this.points.length; i++) {
        x +=
          this.getBernsteinPolynome(i, this.points.length - 1, t) *
          this.points[i].x;
        y +=
          this.getBernsteinPolynome(i, this.points.length - 1, t) *
          this.points[i].y;
      }
      point = new Point(x, y);
      ctx.lineTo(point.getRealX(), point.getRealY());
      t += this.#tStep;
    }

    ctx.lineTo(
      this.points[this.points.length - 1].getRealX(),
      this.points[this.points.length - 1].getRealY()
    );
    ctx.stroke();
    ctx.closePath();
  }

  #drawPoints(ctx, color) {
    ctx.beginPath();
    ctx.lineWidth = 1;

    for (let i = 0; i < this.points.length; i++) {
      ctx.beginPath();
      ctx.fillStyle = i === 0 || i === this.points.length - 1 ? "black" : color;
      ctx.strokeStyle =
        i === 0 || i === this.points.length - 1 ? "black" : color;

      ctx.moveTo(this.points[i].getRealX(), this.points[i].getRealY());
      ctx.arc(
        this.points[i].getRealX(),
        this.points[i].getRealY(),
        5,
        0,
        2 * Math.PI
      );
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
    }
  }

  #drawBezierCurve(ctx, color) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.moveTo(this.points[0].getRealX(), this.points[0].getRealY());

    let t = 0;
    while (t <= 1) {
      let point = this.getCoordinatesForT(t, this.points);
      ctx.lineTo(point.getRealX(), point.getRealY());
      t += this.#tStep;
    }
    ctx.lineTo(
      this.points[this.points.length - 1].getRealX(),
      this.points[this.points.length - 1].getRealY()
    );
    ctx.stroke();
    ctx.closePath();
  }

  getCoordinatesForT(t, arrayPoints) {
    if (arrayPoints.length == 1) {
      return arrayPoints[0];
    } else {
      let interpolatedPoints = [];
      for (let i = 0; i < arrayPoints.length - 1; i++) {
        let x = (1 - t) * arrayPoints[i].x + t * arrayPoints[i + 1].x;
        let y = (1 - t) * arrayPoints[i].y + t * arrayPoints[i + 1].y;
        interpolatedPoints.push(new Point(x, y));
      }
      return this.getCoordinatesForT(t, interpolatedPoints);
    }
  }

  getBernsteinPolynome(i, n, t) {
    return (
      (this.getFactorial(n) /
        (this.getFactorial(i) * this.getFactorial(n - i))) *
      Math.pow(t, i) *
      Math.pow(1 - t, n - i)
    );
  }

  getFactorial(n) {
    n = parseInt(n);
    if (n === 0 || n === 1) {
      return 1;
    } else {
      return n * this.getFactorial(n - 1);
    }
  }
}

let points = [
  new Point(0, 0),
  new Point(0, 8),
  new Point(8, 8),
  new Point(4, 4),
];
let bezierCurve = new BezierCurve("Super", "blue", points);
bezierCurve.draw(ctx);
