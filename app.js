
const menu = document.querySelector("#menu")
const body = document.querySelector("body")
const hLinks = document.querySelectorAll("#hLink")
const menuToggle = document.getElementById('menu-toggle');

const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');







// Add click event listeners to each link
mobileNavLinks.forEach(link => {
  link.addEventListener('click', () => {
    // Uncheck the checkbox to hide the mobile menu
    menuToggle.checked = false;
  });
});

const circle = document.querySelector("#circle");

document.addEventListener("mousemove", (event) => {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  const rotationX = ((event.clientY / windowHeight) - 0.5) * 30;
  const rotationY = ((event.clientX / windowWidth) - 0.5) * 30;

  circle.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
});






