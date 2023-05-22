const carousels = document.querySelector(".testimonial-wrapper .carousels"),
  firstCard = carousels.querySelectorAll("img")[0],
  arrowIcon = document.querySelectorAll(".testimonial-wrapper i");

let DragStart = false,
  isDragging1 = false,
  prevpagex1,
  prevscrollleft1,
  positiondiff1;

const showhideicons1 = () => {
  // showing and hiding prev/next icon according to carousel scroll left value
  let scrollWidth = carousels.scrollWidth - carousels.clientWidth; // getting max scrollable width
  arrowIcon[0].style.display = carousels.scrollLeft == 0 ? "none" : "block";
  arrowIcon[1].style.display = carousels.scrollLeft == scrollWidth ? "none" : "block";
};

arrowIcon.forEach((icon) => {
  icon.addEventListener("click", () => {
    let firstCardWidth = firstCard.clientWidth + 14; // getting first img width & adding 14 margin value
    // if clicked icon is left, reduce width value from the carousel scroll left else add to it
    carousels.scrollLeft += icon.id == "left" ? -firstCardWidth : firstCardWidth;
    setTimeout(() => showhideicons1(), 60); // calling showhideicons1 after 60ms
  });
});

const autoslide1 = () => {
  // if there is no image left to scroll then return from here
  if (
    carousels.scrollLeft - (carousels.scrollWidth - carousels.clientWidth) >
      -1 ||
    carousels.scrollLeft <= 0
  )
    return;

  positiondiff1 = Math.abs(positiondiff1); // making positiondiff1 value to positive
  let firstCardWidth = firstCard.clientWidth + 14;
  // getting difference value that needs to add or reduce from carousel left to take middle img center
  let valDifference = firstCardWidth - positiondiff1;

  if (carousels.scrollLeft > prevscrollleft1) {
    // if user is scrolling to the right
    return (
      (carousels.scrollLeft +=
        positiondiff1 > firstCardWidth / 3 ? valDifference : -positiondiff1),
      undefined
    );
  }
  // if user is scrolling to the left
  (carousels.scrollLeft -=
    positiondiff1 > firstCardWidth / 3 ? valDifference : -positiondiff1),
    undefined;
};

const dragStart1 = (e) => {
  // updatating global variables value on mouse down event
  DragStart = true;
  prevpagex1 = e.pageX || e.touches[0].pageX;
  prevscrollleft1 = carousels.scrollLeft;
};

const dragging1 = (e) => {
  // scrolling images/carousel to left according to mouse pointer
  if (!DragStart) return;
  e.preventDefault();
  isDragging1 = true;
  carousels.classList.add("dragging");
  positiondiff1 = (e.pageX || e.touches[0].pageX) - prevpagex1;
  carousels.scrollLeft = prevscrollleft1 - positiondiff1;
  showhideicons1();
};

const dragstop1 = () => {
  DragStart = false;
  carousels.classList.remove("dragging");

  if (!isDragging1) return;
  isDragging1 = false;
  autoslide1();
};

carousels.addEventListener("mousedown", dragStart);
carousels.addEventListener("touchstart", dragStart);

document.addEventListener("mousemove", dragging);
carousels.addEventListener("touchmove", dragging);

document.addEventListener("mouseup", dragstop1);
carousels.addEventListener("touchend", dragstop1);