document.addEventListener("DOMContentLoaded", () => {
  // ====== DARK MODE TOGGLE & PERSISTENCE ======
  const darkModeToggle = document.getElementById("darkModeToggle");

  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.body.classList.add('dark-mode');
    darkModeToggle.checked = true;
  } else {
    document.body.classList.remove('dark-mode');
    darkModeToggle.checked = false;
  }

  darkModeToggle.addEventListener("change", function () {
    if (this.checked) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  });

  // ====== VISIBILITY ANIMATION ======
  function checkVisibility() {
    const sections = document.querySelectorAll('.fade-in, .slide-up, .slide-in, .about-image');
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight - 50 && rect.bottom >= 0;
      if (isVisible) {
        section.classList.add('visible');
      }
    });
  }

  window.addEventListener('load', checkVisibility);
  window.addEventListener('scroll', checkVisibility);

  // ====== COMMENT FORM TOGGLE ======
  const toggleFormBtn = document.getElementById('toggleFormBtn');
  if (toggleFormBtn) {
    toggleFormBtn.addEventListener('click', () => {
      const form = document.getElementById('inputForm');
      if (form) {
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
      }
    });
  }

  // ====== MOBILE MENU TOGGLE ======
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.getElementById('navLinks');

  if (mobileMenu && navLinks) {
    mobileMenu.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  // ====== DYNAMIC IMAGE LOADER WITH FALLBACK ======
  const imageElement = document.getElementById("dynamicImage");
  const images = [
    "https://via.placeholder.com/300x200?text=Team+1",
    "https://via.placeholder.com/300x200?text=Team+2",
    "https://via.placeholder.com/300x200?text=Team+3"
  ];

  function setImageSafely(url) {
    const img = new Image();
    img.onload = () => {
      if (imageElement) imageElement.src = url;
    };
    img.onerror = () => {
      if (imageElement) imageElement.src = "static/mypic.jpg"; // fallback image
    };
    img.src = url;
  }

  if (imageElement) {
    setImageSafely(images[Math.floor(Math.random() * images.length)]);
    setInterval(() => {
      setImageSafely(images[Math.floor(Math.random() * images.length)]);
    }, 5000);
  }




  
  const form = document.getElementById("commentForm");

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const channelId = document.getElementById("channelId").value.trim();
    const loadingMsg = document.getElementById("loadingMessage");

    if (!channelId) {
      alert("Please enter a channel ID.");
      return;
    }

    // Show the loading message
    if (loadingMsg) loadingMsg.style.display = "block";

    fetch("/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channelId }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          // Redirect to analysis page
          window.location.href = "/about.html";
        } else {
          alert("Error: " + (data.error || "Unknown error"));
          if (loadingMsg) loadingMsg.style.display = "none";
        }
      })
      .catch(err => {
        console.error("❌ Error:", err);
        alert("Server error occurred.");
        if (loadingMsg) loadingMsg.style.display = "none";
      });
  });
}


  // ====== FEEDBACK COMMENT FORM ======
  const feedbackForm = document.getElementById("feedbackForm");

  if (feedbackForm) {
    feedbackForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const feedbackInput = document.getElementById("userFeedback");
      const feedback = feedbackInput.value.trim();

      if (!feedback) {
        alert("Please enter your comment.");
        return;
      }

      fetch("/submit_feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: feedback }),
      })
        .then(res => res.json())
        .then(data => {
          alert(data.message || "Comment posted!");

          const container = document.getElementById("blogPostContainer");
          if (container) {
            const card = document.createElement("div");
            card.className = "blog-card";
            card.innerHTML = `
              <h3>Visitor Comment</h3>
              <p>${feedback}</p>
              <button class="read-more">Reply</button>
            `;
            container.appendChild(card); // newest comment at the end
          }

          feedbackInput.value = "";
        })
        .catch(err => {
          console.error("❌ Error:", err);
          alert("Failed to post your comment.");
        });
    });
  }
});
