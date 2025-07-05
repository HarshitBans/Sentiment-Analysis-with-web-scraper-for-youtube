// ====== DARK MODE TOGGLE & PERSISTENCE ======
const darkModeToggle = document.getElementById("darkModeToggle");

// Check saved preference or system theme
const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('theme');

// Apply theme on load
if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
  document.body.classList.add('dark-mode');
  darkModeToggle.checked = true;
} else {
  document.body.classList.remove('dark-mode');
  darkModeToggle.checked = false;
}

// Toggle dark mode on checkbox change
darkModeToggle.addEventListener("change", function () {
  if (this.checked) {
    document.body.classList.add("dark-mode");
    localStorage.setItem("theme", "dark");
  } else {
    document.body.classList.remove("dark-mode");
    localStorage.setItem("theme", "light");
  }
});
// ====== END DARK MODE LOGIC ======


// Improved Scroll Detection
function checkVisibility() {
  const sections = document.querySelectorAll('.fade-in, .slide-up, .slide-in', '.about-image');
  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight - 50 && rect.bottom >= 0;

    if (isVisible) {
      section.classList.add('visible');
    }
  });
}

// Run on load and scroll
window.addEventListener('load', checkVisibility);
window.addEventListener('scroll', checkVisibility);

// ====== COMMENT FORM TOGGLE ======
document.getElementById('toggleFormBtn').addEventListener('click', () => {
  const form = document.getElementById('inputForm');
  form.style.display = form.style.display === 'none' ? 'block' : 'none';
});
// ====== END COMMENT FORM ======


// ====== MOBILE MENU TOGGLE ======
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.getElementById('navLinks');

mobileMenu.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
// ====== END MOBILE MENU ======


// ====== DYNAMIC IMAGE LOADER ======
const images = [
  "https://via.placeholder.com/300x200?text=Team+1",
  "https://via.placeholder.com/300x200?text=Team+2",
  "https://via.placeholder.com/300x200?text=Team+3"
];

const imageElement = document.getElementById("dynamicImage");

// Set random image on load
imageElement.src = images[Math.floor(Math.random() * images.length)];

// Change image every 5 seconds
setInterval(() => {
  imageElement.src = images[Math.floor(Math.random() * images.length)];
}, 5000);
// ====== END DYNAMIC IMAGE ======