var curves = [];

var isEditing = false;

document.querySelector(".add-curve").addEventListener("click", () => {
  isEditing = false;
  let dialog = document.getElementById("curve-dialog");
  dialog.showModal();
});

document.querySelector(".close-dialog").addEventListener("click", () => {
  let dialog = document.getElementById("curve-dialog");
  dialog.close();
  clearDialog();
});

document
  .querySelector("#close-coordinates-dialog")
  .addEventListener("click", () => {
    let dialog = document.getElementById("coordinates-dialog");
    dialog.close();
  });

document
  .querySelector("#close-bernstein-dialog")
  .addEventListener("click", () => {
    let dialog = document.getElementById("bernstein-dialog");
    dialog.close();
    clearBernsteinDialog();
  });

function clearDialog() {
  document.querySelector("#curve-name").value = "";
  document.querySelector("#curve-color").value = "#000000";
  let points = document.querySelector(".curve-points");
  points.innerHTML = "";

  let nameWarning = document.querySelector(".warning-name");
  let pointsWarning = document.querySelector(".warning-points");
  let notEnoughPointsWarning = document.querySelector(
    ".warning-not-enough-points"
  );
  nameWarning.style.display = "none";
  pointsWarning.style.display = "none";
  notEnoughPointsWarning.style.display = "none";
}

document.querySelector(".add-point").addEventListener("click", () => {
  let points = document.querySelector(".curve-points");

  let point = document.createElement("div");
  point.classList.add("point");
  point.innerHTML = `
    <input type="number" class="x" placeholder="X">
    <input type="number" class="y" placeholder="Y">
    <button class="remove-point">x</button>
  `;
  points.appendChild(point);
  point.querySelector(".remove-point").addEventListener("click", removePoint);

  point.setAttribute("draggable", "true");
  point.addEventListener("dragstart", handleDragStart, false);
  point.addEventListener("dragover", handleDragOver, false);
  point.addEventListener("drop", handleDrop, false);
});

function removePoint() {
  this.parentNode.remove();
}

var currentEditingIndex = -1;

document.querySelector(".save-curve").addEventListener("click", () => {
  if (!validateForm()) {
    return;
  }

  let dialog = document.getElementById("curve-dialog");
  dialog.close();
  if (!isEditing) {
    let points = document.querySelectorAll(".curve-points .point");
    let curve = new BezierCurve(
      document.querySelector("#curve-name").value,
      document.querySelector("#curve-color").value,
      Array.from(points).map((point) => {
        return new Point(
          parseFloat(point.querySelector(".x").value),
          parseFloat(point.querySelector(".y").value)
        );
      })
    );
    curves.push(curve);
    drawCurves();
    updateList();
  } else {
    let index = currentEditingIndex;
    let points = document.querySelectorAll(".curve-points .point");
    curves[index].name = document.querySelector("#curve-name").value;
    curves[index].color = document.querySelector("#curve-color").value;
    curves[index].points = Array.from(points).map((point) => {
      return new Point(
        parseFloat(point.querySelector(".x").value),
        parseFloat(point.querySelector(".y").value)
      );
    });
    drawCurves();
    updateList();
  }
  clearDialog();
});

function drawCurves() {
  ctx.clearRect(0, 0, width, height);
  paintCoordinates(width, height, ctx);
  let parameterCheckbox = document.querySelector(
    "#checkbox-draw-with-parameter"
  );
  if (parameterCheckbox.checked) {
    curves.forEach((curve) => curve.drawWithParameter(ctx));
  } else {
    curves.forEach((curve) => curve.draw(ctx));
  }
}

function updateList() {
  let list = document.querySelector(".curves-list");
  list.innerHTML = "";
  curves.forEach((curve, index) => {
    let item = document.createElement("li");
    item.classList.add("curve-container");
    item.style.backgroundColor = curve.color;
    item.innerHTML = `
      <span>${curve.name}</span>
      <button class="edit-curve" data-index="${index}">Редагувати</button>
      <button class="remove-curve" data-index="${index}">Видалити</button>
    `;
    list.appendChild(item);
  });
  document.querySelectorAll(".edit-curve").forEach((button) => {
    button.addEventListener("click", editCurve);
  });
  document.querySelectorAll(".remove-curve").forEach((button) => {
    button.addEventListener("click", removeCurve);
  });
}

function validateForm() {
  let name = document.querySelector("#curve-name").value;
  let points = document.querySelectorAll(".curve-points .point");
  let valid = true;

  let nameWarning = document.querySelector(".warning-name");
  let pointsWarning = document.querySelector(".warning-points");
  let notEnoughPointsWarning = document.querySelector(
    ".warning-not-enough-points"
  );

  if (name === "") {
    nameWarning.style.display = "block";
    valid = false;
  } else {
    nameWarning.style.display = "none";
  }

  if (points.length < 2) {
    notEnoughPointsWarning.style.display = "block";
    valid = false;
  } else {
    notEnoughPointsWarning.style.display = "none";
  }

  for (let i = 0; i < points.length; i++) {
    //Coordinates must be not more than 10 and not less than -10
    let x = points[i].querySelector(".x").value;
    let y = points[i].querySelector(".y").value;
    if (x === "" || y === "" || x > 10 || x < -10 || y > 10 || y < -10) {
      pointsWarning.style.display = "block";
      valid = false;
      break;
    } else {
      pointsWarning.style.display = "none";
    }
  }

  return valid;
}

function editCurve() {
  let index = this.getAttribute("data-index");
  currentEditingIndex = index;
  console.log(index);
  let curve = curves[index];
  let dialog = document.getElementById("curve-dialog");
  document.querySelector("#curve-name").value = curve.name;
  document.querySelector("#curve-color").value = curve.color;
  let points = document.querySelector(".curve-points");
  points.innerHTML = "";
  curve.points.forEach((point) => {
    let p = document.createElement("div");
    p.classList.add("point");
    p.innerHTML = `
      <input type="number" class="x" value="${point.x}">
      <input type="number" class="y" value="${point.y}">
      <button class="remove-point">x</button>
    `;
    points.appendChild(p);
    p.querySelector(".remove-point").addEventListener("click", removePoint);
  });
  dialog.showModal();

  let pointss = document.querySelectorAll(".curve-points .point");
  pointss.forEach((point) => {
    point.setAttribute("draggable", "true");
    point.addEventListener("dragstart", handleDragStart, false);
    point.addEventListener("dragover", handleDragOver, false);
    point.addEventListener("drop", handleDrop, false);
  });

  isEditing = true;
}

function removeCurve() {
  let index = this.getAttribute("data-index");
  curves.splice(index, 1);
  drawCurves();
  updateList();
}

document.querySelector(".show-coordinates").addEventListener("click", () => {
  let warningSelectCurve = document.querySelector(".warning-select-curve");

  if (curves.length === 0) {
    warningSelectCurve.innerText = "Спочатку створіть криву";
  } else {
    warningSelectCurve.innerText = "Виберіть криву";
  }
  warningSelectCurve.style.display = "flex";

  let curvesList = document.querySelector(".curves-list");
  // Set event listener for each curve
  curvesList.childNodes.forEach((curve, index) => {
    curve.addEventListener("click", () => {
      if (event.target === curve || event.target === curve.childNodes[1]) {
        warningSelectCurve.style.display = "none";
        let selectedCurve = curves[index];
        openCoordinatesDialog(selectedCurve);
      }
    });
  });
});

function openCoordinatesDialog(curve) {

  clearEventListeners();

  let dialog = document.getElementById("coordinates-dialog");
  dialog.showModal();
  let list = document.querySelector(".coordinates-list");

  list.innerHTML = "";
  dialog
    .querySelector(".generate-coordinates")
    .addEventListener("click", () => {
      let countOfPoints = document.querySelector(
        "#number-of-coordinates"
      ).value;

      list.innerHTML = "";

      let coordinates = getCoordinates(curve, countOfPoints);

      for (let i = 0; i < coordinates.length; i++) {
        let item = document.createElement("li");
        //Round numbers to 3 digits after comma
        coordinates[i].x = Math.round(coordinates[i].x * 1000) / 1000;
        coordinates[i].y = Math.round(coordinates[i].y * 1000) / 1000;
        item.innerHTML = `x: ${coordinates[i].x}, y: ${coordinates[i].y}`;
        list.appendChild(item);
      }
    });
}

function getCoordinates(curve, count) {
  let coordinates = [];
  let step = 1.0 / parseFloat(count);
  for (let i = 0; i < 1; i += step) {
    let point = curve.getCoordinatesForT(i, curve.points);
    coordinates.push(new Point(point.x, point.y));
  }
  return coordinates;
}

function clearEventListeners() {
  console.log("clear");
  let curvesList = document.querySelector(".curves-list");
  for (let i = 0; i < curvesList.childNodes.length; i++) {
    let curve = curvesList.childNodes[i];
    curve.removeEventListener("click", () => {});
  }
  updateList();
}



document.querySelector(".show-bernstein").addEventListener("click", () => {
  let warningSelectCurve = document.querySelector(".warning-select-curve");

  if (curves.length === 0) {
    warningSelectCurve.innerText = "Спочатку створіть криву";
  } else {
    warningSelectCurve.innerText = "Виберіть криву";
  }
  warningSelectCurve.style.display = "flex";

  let curvesList = document.querySelector(".curves-list");
  // Set event listener for each curve
  curvesList.childNodes.forEach((curve, index) => {
    curve.addEventListener("click", () => {
      if (event.target === curve || event.target === curve.childNodes[1]) {
        warningSelectCurve.style.display = "none";
        let selectedCurve = curves[index];
        openBernsteinDialog(selectedCurve);
      }
    });
  });
});

function openBernsteinDialog(curve) {
  clearEventListeners();
  clearBernsteinDialog();
  const step = 0.01;

  let dialog = document.getElementById("bernstein-dialog");
  dialog.showModal();

  let list = document.querySelector(".bernstein-list");

  list.innerHTML = "";
  dialog.querySelector(".generate-bernstein").addEventListener("click", () => {
    if (validateBernstein(curve)) {
      let minT = document.querySelector("#bernstein-min-t").value;
      let maxT = document.querySelector("#bernstein-max-t").value;
      let i = document.querySelector("#bernstein-i").value;

      list.innerHTML = "";

      for (
        let t = parseFloat(minT);
        t < parseFloat(maxT);
        t += parseFloat(step)
      ) {
        let item = document.createElement("li");

        let polynome = curve.getBernsteinPolynome(
          i,
          curve.points.length - 1,
          t
        );
        //Round numbers to 3 digits after comma
        polynome = Math.round(polynome * 1000) / 1000;
        let roundedT = Math.round(t * 1000) / 1000;
        item.innerHTML = `t: ${roundedT}, B: ${polynome}`;
        list.appendChild(item);
      }
    }
  });
}

function validateBernstein(curve) {
  let minT = document.querySelector("#bernstein-min-t").value;
  let maxT = document.querySelector("#bernstein-max-t").value;
  let i = document.querySelector("#bernstein-i").value;
  let valid = true;

  let minTWarning = document.querySelector(".warning-min-t");
  let maxTWarning = document.querySelector(".warning-max-t");
  let iWarning = document.querySelector(".warning-i");

  if (minT === "" || minT < 0 || minT > 1) {
    minTWarning.style.display = "block";
    valid = false;
  } else {
    minTWarning.style.display = "none";
  }

  if (maxT === "" || maxT < minT || maxT > 1) {
    maxTWarning.style.display = "block";
    valid = false;
  } else {
    maxTWarning.style.display = "none";
  }

  //Check if i is integer and in range

  if (i === "" || i < 0 || i > curve.points.length - 1 || !Number.isInteger(parseFloat(i))) {
    iWarning.style.display = "block";
    valid = false;
  } else {
    iWarning.style.display = "none";
  }

  return valid;
}

function clearBernsteinDialog() {
  document.querySelector("#bernstein-min-t").value = "";
  document.querySelector("#bernstein-max-t").value = "";
  document.querySelector("#bernstein-i").value = "";
  let minTWarning = document.querySelector(".warning-min-t");
  let maxTWarning = document.querySelector(".warning-max-t");
  let iWarning = document.querySelector(".warning-i");
  minTWarning.style.display = "none";
  maxTWarning.style.display = "none";
  iWarning.style.display = "none";
}

/* Drag and drop */

let dragSrcEl = null;

function handleDragStart(e) {
  dragSrcEl = this;

  // Save input values
  let inputs = this.querySelectorAll("input");
  this.savedInputValues = Array.from(inputs).map((input) => input.value);

  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/html", this.outerHTML);
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }
  this.classList.add("over");
  e.dataTransfer.dropEffect = "move";
  return false;
}

function handleDrop(e) {
  if (e.stopPropagation) {
    e.stopPropagation();
  }
  if (dragSrcEl !== this) {
    this.parentNode.removeChild(dragSrcEl);
    let dropHTML = e.dataTransfer.getData("text/html");
    this.insertAdjacentHTML("beforebegin", dropHTML);
    let dropElem = this.previousSibling;
    dropElem.addEventListener("dragstart", handleDragStart, false);
    dropElem.addEventListener("dragover", handleDragOver, false);
    dropElem.addEventListener("drop", handleDrop, false);

    // Restore input values
    let inputs = dropElem.querySelectorAll("input");
    inputs.forEach((input, index) => {
      input.value = dragSrcEl.savedInputValues[index];
    });
  }
  this.classList.remove("over");
  return false;
}
