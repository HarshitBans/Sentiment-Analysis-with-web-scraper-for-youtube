console.log("✅ scriptabout.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOM fully loaded");

  // Toggle category visibility
  window.toggleCategory = function(id) {
    const content = document.getElementById(id);
    const icon = document.getElementById(`icon-${id}`);
    const header = content.parentElement.querySelector('.category-header');

    if (content.style.display === 'block') {
      content.style.display = 'none';
      header.classList.remove('expanded');
    } else {
      content.style.display = 'block';
      header.classList.add('expanded');
    }
  };

  // Draw chart using Chart.js
  function drawChart(data) {
    const ctx = document.getElementById('distributionChart').getContext('2d');

    const total = Object.values(data).filter(arr => Array.isArray(arr)).reduce((sum, arr) => sum + arr.length, 0);

    const percentages = {
      Positive: ((data.positive.length / total) * 100).toFixed(1),
      Neutral: ((data.neutral.length / total) * 100).toFixed(1),
      Question: ((data.question.length / total) * 100).toFixed(1),
      Negative: ((data.negative.length / total) * 100).toFixed(1)
    };

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Positive', 'Neutral', 'Question', 'Negative'],
        datasets: [{
          label: 'Comment Distribution',
          data: [percentages.Positive, percentages.Neutral, percentages.Question, percentages.Negative],
          backgroundColor: [
            '#66bb6a',
            '#42a5f5',
            '#ffa726',
            '#ef5350'
          ],
          hoverOffset: 20
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: document.body.classList.contains('dark-mode') ? '#fff' : '#000'
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.label}: ${context.raw}%`;
              }
            }
          }
        }
      }
    });
  }

  // Load data from backend instead of mock
  function loadAnalysisData() {
    fetch("/results")
      .then(res => res.json())
      .then(data => {
        console.log("✅ Received data from backend:", data);
        document.getElementById("channelTitle").textContent = data.channel || "Unknown";

        ["positive", "neutral", "question", "negative"].forEach(category => {
          const container = document.getElementById(category);
          if (container && data[category] && data[category].length > 0) {
            container.innerHTML = "<ul>" + data[category].map(c => `<li>${c}</li>`).join("") + "</ul>";
          } else {
            container.textContent = "No comments found.";
          }
        });

        drawChart(data);
      })
      .catch(err => {
        console.error("❌ Failed to load data:", err);
        alert("Something went wrong while loading analysis results.");
      });
  }

  // Enable dark mode toggle
  const darkModeToggle = document.getElementById("darkModeToggle");
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.body.classList.add('dark-mode');
    darkModeToggle.checked = true;
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

  // 🔥 Call the loader here
  loadAnalysisData();
});
