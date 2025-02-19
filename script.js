// Define audio objects (update the paths or URLs to your sound files)
const correctSound = new Audio("mixkit-correct-positive-notification-957.wav");    // Sound to play for a correct code
const incorrectSound = new Audio("mixkit-system-beep-buzzer-fail-2964.wav"); // Sound to play for an incorrect code

function checkViewCode() {
  const input = document.getElementById("viewCodeInput").value;
  const messageEl = document.getElementById("viewCodeMessage");
  
  if (input === "VCMT") {
    correctSound.play();  // Play correct sound
    document.getElementById("view-code-modal").style.display = "none";
  } else {
    incorrectSound.play(); // Play incorrect sound
    messageEl.innerText = "🔺 Incorrect code! Access denied.";
    messageEl.style.color = "red";
  }
}

function switchTab(app) {
  window.selectedApp = app;
  
  // Remove active class from all tabs
  document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
  // Add active class to the selected tab
  document.getElementById("tab-" + app).classList.add("active");
  
  // Show activation form if hidden
  const form = document.getElementById("activation-form");
  if (form.classList.contains("hidden")) {
    form.classList.remove("hidden");
    form.classList.add("slideUp");
  }
}

async function submitCode() {
  // Check if a tab has been selected
  if (!window.selectedApp) {
    incorrectSound.play(); // Play incorrect sound
    const msgEl = document.getElementById("message");
    msgEl.innerText = "Choose tab!";
    msgEl.style.color = "red";
    return; // Exit the function if no tab is selected
  }
  
  const code = document.getElementById("code").value;
  
  const response = await fetch("http://127.0.0.1:5000/validate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code: code, app: window.selectedApp })
  });
  
  const data = await response.json();
  
  if (data.success) {
    correctSound.play(); // Play correct sound
    window.location.href = data.download_link;
  } else {
    incorrectSound.play(); // Play incorrect sound
    const msgEl = document.getElementById("message");
    msgEl.innerText = data.message || "Invalid or used code!";
    msgEl.style.color = "red";
  }
}
