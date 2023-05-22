const carouselsMember = document.querySelector(".carousels-member"),
firstCardMember = carouselsMember.querySelectorAll(".member-card")[0],
arrowIconMember = document.querySelectorAll(".member-wrapper i");

let DragStartMember = false,
isDraggingMember = false,
prevpagexMember,
prevscrollleftMember,
positiondiffMember;

const showhideiconsMember = () => {
// showing and hiding prev/next icon according to carousel scroll left value
let scrollWidthMember = carouselsMember.scrollWidth - carouselsMember.clientWidth; // getting max scrollable width
arrowIconMember[0].style.display = carouselsMember.scrollLeft == 0 ? "none" : "block";
arrowIconMember[1].style.display = carouselsMember.scrollLeft == scrollWidthMember ? "none" : "block";
};

arrowIconMember.forEach((icon) => {
icon.addEventListener("click", () => {
let firstCardWidthMember = firstCardMember.clientWidth + 14; // getting first img width & adding 14 margin value
// if clicked icon is left, reduce width value from the carousel scroll left else add to it
carouselsMember.scrollLeft += icon.id == "left" ? -firstCardWidthMember : firstCardWidthMember;
setTimeout(() => showhideiconsMember(), 60); // calling showhideiconsMember after 60ms
});
});

const autoslideMember = () => {
// if there is no image left to scroll then return from here
if (
carouselsMember.scrollLeft - (carouselsMember.scrollWidth - carouselsMember.clientWidth) >
-1 ||
carouselsMember.scrollLeft <= 0
)
return;

positiondiffMember = Math.abs(positiondiffMember); // making positiondiffMember value to positive
let firstCardWidthMember = firstCardMember.clientWidth + 14;
// getting difference value that needs to add or reduce from carousel left to take middle img center
let valDifferenceMember = firstCardWidthMember - positiondiffMember;

if (carouselsMember.scrollLeft > prevscrollleftMember) {
// if user is scrolling to the right
return (
(carouselsMember.scrollLeft +=
positiondiffMember > firstCardWidthMember / 3 ? valDifferenceMember : -positiondiffMember),
undefined
);
}
// if user is scrolling to the left
(carouselsMember.scrollLeft -=
positiondiffMember > firstCardWidthMember / 3 ? valDifferenceMember : -positiondiffMember),
undefined;
};

const dragStartMember = (e) => {
// updatating global variables value on mouse down event
DragStartMember = true;
prevpagexMember = e.pageX || e.touches[0].pageX;
prevscrollleftMember = carouselsMember.scrollLeft;
};

const draggingMember = (e) => {
// scrolling images/carousel to left according to mouse pointer
if (!DragStartMember) return;
e.preventDefault();
isDraggingMember = true;
carouselsMember.classList.add("dragging");
positiondiffMember = (e.pageX || e.touches[0].pageX) - prevpagexMember;
carouselsMember.scrollLeft = prevscrollleftMember - positiondiffMember;
showhideiconsMember();
};

const dragstopMember = () => {
DragStartMember = false;
carouselsMember.classList.remove("dragging");

if (!isDraggingMember) return;
isDraggingMember = false;
autoslideMember();
};

carouselsMember.addEventListener("mousedown", dragStartMember);
carouselsMember.addEventListener("touchstart", dragStartMember);

document.addEventListener("mousemove", draggingMember);
carouselsMember.addEventListener("touchmove", draggingMember);

document.addEventListener("mouseup", dragstopMember);
carouselsMember.addEventListener("touchend", dragstopMember);