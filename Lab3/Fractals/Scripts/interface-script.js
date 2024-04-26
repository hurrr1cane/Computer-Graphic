let isAlgebraic = false;

const dragonButton = document.querySelector("#select-dragon");
const algebraicButton = document.querySelector("#select-algebraic");

const dragonControls = document.querySelector(".dragon-controls");
const algebraicControls = document.querySelector(".algebraic-controls");

const scaleInput = document.querySelector("#scale");

const drawButton = document.querySelector(".draw-button");
const saveButton = document.querySelector(".save-button");

dragonButton.addEventListener("click", () => {
  isAlgebraic = false;
  dragonControls.style.display = "flex";
  algebraicControls.style.display = "none";
  drawButton.style.backgroundColor = "#ffc0cb";
  saveButton.style.backgroundColor = "#ffc0cb";
});

algebraicButton.addEventListener("click", () => {
  isAlgebraic = true;
  algebraicControls.style.display = "flex";
  dragonControls.style.display = "none";
  drawButton.style.backgroundColor = "#add8e6";
  saveButton.style.backgroundColor = "#add8e6";
});

drawButton.addEventListener("click", drawFractal);
scaleInput.addEventListener("input", drawFractal);

function drawFractal() {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  if (isAlgebraic) {
    let offsetX = parseFloat(document.querySelector("#offset-x").value);
    let offsetY = parseFloat(document.querySelector("#offset-y").value);
    let scale = parseFloat(document.querySelector("#scale").value);
    let depth = parseInt(document.querySelector("#depth").value);
    let radius = parseFloat(
      document.querySelector("#algebraic-convergence").value
    );
    let constantReal = parseFloat(
      document.querySelector("#algebraic-real").value
    );
    let constantImaginary = parseFloat(
      document.querySelector("#algebraic-imaginary").value
    );
    let startColor = document.querySelector("#algebraic-color-start").value;
    let endColor = document.querySelector("#algebraic-color-end").value;
    drawAlgebraic(
      offsetX,
      offsetY,
      scale,
      depth,
      radius,
      constantReal,
      constantImaginary,
      startColor,
      endColor
    );
  } else {
    let offsetX = parseFloat(document.querySelector("#offset-x").value);
    let offsetY = parseFloat(document.querySelector("#offset-y").value);
    let scale = parseFloat(document.querySelector("#scale").value);
    let depth = parseInt(document.querySelector("#depth").value);
    let width = parseInt(document.querySelector("#dragon-thickness").value);
    let color = document.querySelector("#dragon-color").value;

    drawDragon(offsetX, offsetY, scale, depth, width, color);
  }
}

saveButton.addEventListener("click", () => {
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = "fractal.png";
  link.click();
});
