let wrapper = document.querySelector("#wrapper");
let header = wrapper.querySelector("#header");
isMouseDown = false;

/// initialize the position variables
let offsetX = 0;
let offsetY = 0;

function toggleMaximize() {
  if (wrapper.classList.contains("w-full")) {
    wrapper.classList.remove("w-full");
    wrapper.classList.remove("h-full");
  } else {
    wrapper.classList.add("w-full");
    wrapper.classList.add("h-full");
  }

  wrapper.style.left = "";
  wrapper.style.top = "";
  wrapper.classList.add("left-0");
  wrapper.classList.add("top-0");
  wrapper.classList.add("right-0");
  wrapper.classList.add("bottom-0");
}

function toggleMinimize() {
  let headerStyles = window.getComputedStyle(header);
  let headerHeight = headerStyles.height;

  if (!wrapper.classList.contains(`h-[${headerHeight}]`)) {
    wrapper.classList.add(`h-[${headerHeight}]`);
    wrapper.classList.add(`overflow-hidden`);
  } else {
    wrapper.classList.remove(`h-[${headerHeight}]`);
    wrapper.classList.aremove(`overflow-hidden`);
  }
}

function closeWindow() {
  wrapper.classList.add("hidden");
}

function openWindow() {
  wrapper.classList.remove("hidden");
}

header.addEventListener("mousedown", (e) => {
  isMouseDown = true;
  offsetX = wrapper.offsetLeft - e.clientX;
  offsetY = wrapper.offsetTop - e.clientY;
  console.log(offsetX, offsetY);
});

document.addEventListener("mousemove", (e) => {
  if (!isMouseDown) return;
  e.preventDefault();
  let left = e.clientX + offsetX;
  let top = e.clientY + offsetY;
  wrapper.classList.remove("left-0");
  wrapper.classList.remove("top-0");
  wrapper.classList.remove("right-0");
  wrapper.classList.remove("bottom-0");
  wrapper.style.left = left + "px";
  wrapper.style.top = top + "px";
});

document.addEventListener("mouseup", () => {
  isMouseDown = false;
});
