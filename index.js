class Queue {
  constructor() {
    this.items = {};
    this.frontIndex = 0;
    this.backIndex = 0;
  }
  enqueue(item) {
    this.items[this.backIndex] = item;
    this.backIndex++;
    return item + " inserted";
  }
  dequeue() {
    const item = this.items[this.frontIndex];
    delete this.items[this.frontIndex];
    this.frontIndex++;
    return item;
  }
  peek() {
    return this.items[this.frontIndex];
  }

  size() {
    return this.backIndex - this.frontIndex;
  }

  isEmpty() {
    if (this.frontIndex === this.backIndex) return true;
    return false;
  }
}

const requestQueue = new Queue();

let floors = prompt("Enter number of Floors");

let lifts = prompt("Enter number of Lifts");
let curr_floor = 1;
let last_clicked = -1;

const windowWidth = window.innerWidth;

const createRoot = () => {
  const rootDiv = document.createElement("div");
  rootDiv.id = "root";

  document.body.appendChild(rootDiv);
};

const message = () => {
  if (floors == 0) {
    const msg = document.createElement("p");
    msg.innerHTML = "No Floors? Are you kidding me?";
    document.getElementById("root").appendChild(msg);
  }
  if (lifts == 0) {
    const msg = document.createElement("p");
    msg.innerHTML = "No Lifts? Are you kidding me?";
    document.getElementById("root").appendChild(msg);
  }
};

const createFloors = () => {
  const rootElement = document.getElementById("root");
  for (let i = floors; i >= 1; i--) {
    const floorDiv = document.createElement("div");
    floorDiv.className = "floor";
    if (i === 1) floorDiv.id = "floor-" + i.toString();

    const buttonDiv = document.createElement("div");
    buttonDiv.className = "buttons";
    buttonDiv.id = "buttons" + i.toString();

    const buttonUp = document.createElement("button");
    if (windowWidth > 768) {
      buttonUp.innerHTML = "Up";
      buttonUp.id = "Up" + "_" + i.toString();
      buttonUp.addEventListener("click", upButton);
    } else {
      const img = document.createElement("img");
      img.src = "./images/up-chevron.png";
      img.style.width = "100%";
      img.style.height = "100%";
      img.id = "UpImg" + "_" + i.toString();
      img.addEventListener("click", upButton);
      buttonUp.appendChild(img);
    }

    const buttonDown = document.createElement("button");
    if (windowWidth > 768) {
      buttonDown.innerHTML = "Down";
      buttonDown.id = "Down" + "_" + i.toString();
      buttonDown.addEventListener("click", downButton);
    } else {
      const img = document.createElement("img");
      img.src = "./images/down-chevron.png";
      img.style.width = "100%";
      img.style.height = "100%";
      img.id = "DownImg" + "_" + i.toString();
      img.addEventListener("click", downButton);
      buttonDown.appendChild(img);
    }

    const heading = document.createElement("h3");
    if (windowWidth > 768) heading.innerHTML = "Floor" + i.toString();
    else {
      heading.innerHTML = i.toString();
    }

    buttonDiv.appendChild(buttonUp);

    buttonDiv.appendChild(buttonDown);

    buttonDiv.appendChild(heading);

    floorDiv.appendChild(buttonDiv);

    rootElement.appendChild(floorDiv);
  }
};

const createLifts = () => {
  const groundFloor = document.getElementById("floor-1");
  const liftsDiv = document.createElement("div");
  liftsDiv.className = "lifts";
  liftsDiv.id = "lifts";

  for (let i = 1; i <= lifts; i++) {
    const liftDiv = document.createElement("div");
    liftDiv.className = "door";

    const liftContainer = document.createElement("div");
    liftContainer.classList.add("lift");
    liftContainer.id = "lift" + i.toString();
    liftContainer.setAttribute("status", "free");
    liftContainer.setAttribute("currentFloor", "1");

    liftContainer.appendChild(liftDiv);

    liftsDiv.appendChild(liftContainer);
  }

  groundFloor.appendChild(liftsDiv);
};

const upButton = (e) => {
  //get the floor number embedded into each button id
  const elId = e.target.id;
  const num = elId.split("_")[1];

  const currFloorLift = liftArray().filter((lift) => {
    return lift.getAttribute("currentFloor") == num;
  });

  if (currFloorLift.length != 0) {
    if (currFloorLift[0].attributes.status.value === "busy") return;
    currFloorLift[0].attributes.status.value = "busy";
    const elId = currFloorLift[0].attributes.id.value;
    const el = document.getElementById(elId);
    openDoor(el, 0, 0);
    return;
  }

  // const el = document.getElementById("lifts");
  // for (let i = 1; i <= lifts; i++) {
  //   if (
  //     el.childNodes[i - 1].getAttribute("currentFloor") == num &&
  //     el.childNodes[i - 1].getAttribute("status") === "free"
  //   ) {
  //     el.childNodes[i - 1].setAttribute("status", "busy");
  //     console.log(el.childNodes[i - 1]);
  //     openDoor(el.childNodes[i - 1], 0, num);
  //     return;
  //   }
  // }

  const element = liftToMove(parseInt(num));
  if (element === null) {
    requestQueue.enqueue(num);
    return;
  }

  moveLift(element, num);
};

const downButton = (e) => {
  //get the floor number embedded into each button id
  const elId = e.target.id;
  const num = elId.split("_")[1];

  const currFloorLift = liftArray().filter((lift) => {
    return lift.getAttribute("currentFloor") === num;
  });

  if (currFloorLift.length != 0) {
    if (currFloorLift[0].attributes.status.value === "busy") return;
    currFloorLift[0].attributes.status.value = "busy";
    const elId = currFloorLift[0].attributes.id.value;
    const el = document.getElementById(elId);
    openDoor(el, 0, 0);
    return;
  }

  // const el = document.getElementById("lifts");
  // for (let i = 1; i <= lifts; i++) {
  //   if (
  //     el.childNodes[i - 1].getAttribute("currentFloor") == num &&
  //     el.childNodes[i - 1].getAttribute("status") === "free"
  //   ) {
  //     el.childNodes[i - 1].setAttribute("status", "busy");
  //     console.log(el.childNodes[i - 1]);
  //     openDoor(el.childNodes[i - 1], 0, num);
  //     return;
  //   }
  // }

  const element = liftToMove(parseInt(num));
  if (element === null) {
    requestQueue.enqueue(num);
    return;
  }

  moveLift(element, num);
};

const disableButtons = () => {
  if (windowWidth < 768) {
    const id2 = "DownImg_" + 1;
    const downImg = document.getElementById(id2).parentNode;
    downImg.style.visibility = "hidden";

    const id = "UpImg_" + floors;
    const upImg = document.getElementById(id).parentNode;
    upImg.style.visibility = "hidden";
  } else {
    const str = "Up" + "_" + floors;
    const upBt = document.getElementById(str);
    upBt.style.visibility = "hidden";

    const str2 = "Down" + "_" + 1;
    const downBt = document.getElementById(str2);
    downBt.style.visibility = "hidden";
  }
};

//generating UI functions
createRoot();
message();

if (floors != 0 && lifts != 0) {
  createFloors();
  createLifts();
}

disableButtons();

//Utility functions

function getTranslateValues(element) {
  const style = window.getComputedStyle(element);
  const matrix = style["transform"] || style.mozTransform;

  // No transform property. Simply return 0 values.
  if (matrix === "none" || typeof matrix === "undefined") {
    return {
      x: 0,
      y: 0,
      z: 0,
    };
  }

  // Can either be 2d or 3d transform
  const matrixType = matrix.includes("3d") ? "3d" : "2d";
  const matrixValues = matrix.match(/matrix.*\((.+)\)/)[1].split(", ");

  // 2d matrices have 6 values
  // Last 2 values are X and Y.
  // 2d matrices does not have Z value.
  if (matrixType === "2d") {
    return {
      x: matrixValues[4],
      y: matrixValues[5],
      z: 0,
    };
  }

  // 3d matrices have 16 values
  // The 13th, 14th, and 15th values are X, Y, and Z
  if (matrixType === "3d") {
    return {
      x: matrixValues[12],
      y: matrixValues[13],
      z: matrixValues[14],
    };
  }
}

const liftToMove = (num) => {
  const freeArray = liftArray().filter((lift) => {
    return lift.getAttribute("status") === "free";
  });

  if (freeArray.length === 0) return null;

  let liftID;
  let minDistance = 1000000;
  for (let i = 0; i < freeArray.length; i++) {
    let curr = parseInt(freeArray[i].attributes.currentFloor.value);

    let distance = Math.abs(num - curr);
    if (distance < minDistance) {
      minDistance = distance;
      liftID = freeArray[i].attributes.id.value;
    }
  }

  const element = document.getElementById(liftID);

  return element;
};

const moveLift = (element, num) => {
  if (element === null) return;
  //get the current floor of the lift selected
  const curr_floor = element.getAttribute("currentFloor");

  //get the previous translateY value of the lift
  const { x, y, z } = getTranslateValues(element);

  //get the height of the lift element
  const styles = window.getComputedStyle(element);
  const heightOfLift = parseInt(styles["height"]);

  //get the padding value of floor
  const stylePadding = window.getComputedStyle(
    document.getElementById("floor-1")
  );
  const paddingValue = parseInt(stylePadding["padding"]);

  console.log(heightOfLift);

  const offSet = heightOfLift + 2 * paddingValue;

  //calculate the distance by which we want the lift to move
  const distance = Math.abs(num - curr_floor);

  //get the status of the lift
  const status = element.getAttribute("status");

  //if the floor we need to go to is above the current floor our lift is at negate the floor height = 105px
  if (status === "free") {
    //set the status as busy
    element.setAttribute("status", "busy");
    element.setAttribute("currentFloor", num.toString());

    if (distance > 0 && parseInt(num) > parseInt(curr_floor)) {
      const travel = parseInt(y) + distance * offSet * -1;

      element.style.transform = `translateY(${travel}px)`;
      element.style.transition = `${distance * 2}s linear`;
    }
    //else if the floor we want to go is below, just add the floor height
    else if (distance > 0 && parseInt(num) < parseInt(curr_floor)) {
      const travel = parseInt(y) + distance * offSet;

      element.style.transform = `translateY(${travel}px)`;
      element.style.transition = `${distance * 2}s linear`;
    }

    openDoor(element, distance, num);
  }
};

const openDoor = (element, distance, num) => {
  const el = element.children[0];
  setTimeout(() => {
    el.classList.add("open");
  }, distance * 2000 + 1000);

  setTimeout(() => {
    el.classList.remove("open");
  }, distance * 2000 + 4000);

  //set the status again as free
  setTimeout(() => {
    element.setAttribute("status", "free");
  }, distance * 2000 + 6000);

  //setting the current floor to the new floor index
  // setTimeout(() => {
  //   element.setAttribute("currentFloor", num.toString());
  // }, 6000);
};

//this function returns the array of lifts
const liftArray = () => {
  const liftContainer = document.getElementById("lifts").children;
  const liftAr = [...liftContainer];

  return liftAr;
};

// setInterval(() => {
//   if (!requestQueue.isEmpty()) {
//     const num = requestQueue.peek();
//     console.log(num);
//     requestQueue.dequeue();
//     const element = liftToMove(parseInt(num));
//     moveLift(element, num);
//   }
// }, 2000);
