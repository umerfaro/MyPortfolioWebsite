const hamburger = document.querySelector("#hamburger")
const menu = document.querySelector("#menu")
const moon = document.querySelector("#moon")
const body = document.querySelector("body")
const hLinks = document.querySelectorAll("#hLink")

hamburger.addEventListener("click", ()=>{
  menu.classList.toggle("hidden")
  hamburger.classList.toggle("bg-white")
})

hLinks.forEach(link=>{
  link.addEventListener("click", ()=>{
    menu.classList.toggle("hidden")
    hamburger.classList.toggle("bg-white")
  })
})

moon.addEventListener("click", ()=>{
  body.classList.toggle("dark")
})

const circle = document.querySelector("#circle");

document.addEventListener("mousemove", (event) => {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  const rotationX = ((event.clientY / windowHeight) - 0.5) * 30;
  const rotationY = ((event.clientX / windowWidth) - 0.5) * 30;

  circle.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
});



// Resize event to hide the menu on larger screens
window.addEventListener('resize', () => {
  // Check if the inner width of the window is larger than a mobile breakpoint, e.g., 768px
  if (window.innerWidth >= 768) {
    // If the menu is not already hidden, hide it
    if (!menu.classList.contains("hidden")) {
      menu.classList.add("hidden");
      hamburger.classList.remove("bg-white"); // Reset hamburger icon if needed
    }
  }
});