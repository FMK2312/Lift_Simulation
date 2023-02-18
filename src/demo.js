const elId = e.target.id;
const num = elId.split("_")[1];

const element = document.getElementById("liftContainer1");
const curr_floor = element.getAttribute("currentFloor");
console.log(curr_floor);
console.log(num);

const dist = Math.abs(num - curr_floor);
console.log(dist);
if (transition > 0 && num > curr_floor) {
  element.style.transform = `translateY(${transition * 105 * -1}px)`;
  element.style.transition = `${transition * 2}s`;
} else if (transition > 0 && num < curr_floor) {
  element.style.transform = `translateY(${transition * 105}px)`;
  element.style.transition = `${transition * 2}s`;
}

const el = document.getElementById("lift1");
setTimeout(() => {
  el.classList.add("open");
}, transition * 2000 + 2000);

setTimeout(() => {
  el.classList.remove("open");
}, transition * 2000 + 4000);

setTimeout(() => {
  element.setAttribute("currentFloor", num.toString());
}, 6000);
