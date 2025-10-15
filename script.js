// Background music autoplay handling (resilient + continuous)
const audio = document.getElementById('bgAudio') || document.querySelector("audio");
if (audio) {
  // prefer loop attribute but enforce via JS as well
  audio.loop = true;
  audio.preload = 'auto';

  // Try to start immediately and retry if blocked
  audio.play().then(() => {
    console.log("Background music started automatically");
  }).catch(() => {
    console.log("Autoplay blocked, will retry on user interaction and visibility changes");
  });

  // On first user gesture, try to play
  const tryPlayOnGesture = async () => {
    try {
      await audio.play();
      console.log('Playback started after user gesture');
    } catch (e) {
      console.warn('Unable to play after gesture', e);
    }
    window.removeEventListener('click', tryPlayOnGesture);
    window.removeEventListener('touchstart', tryPlayOnGesture);
    window.removeEventListener('keydown', tryPlayOnGesture);
  };
  window.addEventListener('click', tryPlayOnGesture, { passive: true });
  window.addEventListener('touchstart', tryPlayOnGesture, { passive: true });
  window.addEventListener('keydown', tryPlayOnGesture, { passive: true });

  // If audio ever ends (safety) restart it
  audio.addEventListener('ended', () => {
    try { audio.play(); } catch (e) { /* ignore */ }
  });

  // When the document becomes visible again, try to resume audio
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      audio.play().catch(() => {});
    }
  });

  // Also try on focus (some browsers) and user interactions (mobile)
  window.addEventListener('focus', () => {
    audio.play().catch(() => {});
  });

  // Touch / click to resume (one-time attempt)
  const resumeAudio = () => {
    audio.play().catch(() => {});
  };
  // keep trying on user gestures but do not remove the control
  window.addEventListener('click', resumeAudio, { passive: true });
  window.addEventListener('touchstart', resumeAudio, { passive: true });
}

// Utility functions
function getUrlParameter(name) {
  const regex = new RegExp("[?&]" + name + "=([^&#]*)");
  const results = regex.exec(window.location.search);
  return results ? decodeURIComponent(results[1].replace(/\+/g, " ")) : "";
}

function generateWish() {
  const name = document.getElementById("nameInput").value.trim();
  if (name) {
    // Reload the page with the user's name AND an 'action' parameter
    // This tells the page that this user is the one creating the wish
    const url =
      window.location.origin +
      window.location.pathname +
      "?n=" +
      encodeURIComponent(name) +
      "&action=share";
    window.location.href = url;
  } else {
    // In a real app, you'd use a custom modal here instead of alert.
    alert("कृपया तुमचे नाव टाका");
  }
}

function shareOnWhatsApp() {
  const name = getUrlParameter("n") || "";
  // Manually build the URL to share, ensuring the '&action=share' part is REMOVED.
  // This way, the receiver gets a clean link.
  const urlToShare = window.location.origin + window.location.pathname + "?n=" + encodeURIComponent(name);

  const senderPart = name ? `${name} ✨🎆 यांच्या कडून ` : '';
  const msg = `${senderPart}तुम्हाला दिवाळीच्या शुभेच्छा एका नव्या अंदाजामध्ये ✨🎇\n\nबघा 👉 ${urlToShare}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
}

function createCrackers() {
  for (let i = 0; i < 10; i++) {
    const cracker = document.createElement("div");
    cracker.className = "cracker";
    cracker.style.left = Math.random() * 100 + "%";
    cracker.style.top = Math.random() * 100 + "%";
    cracker.style.animationDelay = Math.random() * 5 + "s";
    document.body.appendChild(cracker);

    // Create particles for burst effect
    for (let j = 0; j < 8; j++) {
      const particle = document.createElement("div");
      particle.className = "particle";
      particle.style.setProperty('--angle', (j * 45) + 'deg');
      cracker.appendChild(particle);
    }
  }
}

function createFireworks() {
  for (let i = 0; i < 20; i++) {
    const firework = document.createElement("div");
    firework.className = "firework";
    firework.style.left = Math.random() * 100 + "%";
    firework.style.top = Math.random() * 50 + "%";
    firework.style.background = [
      "#ff6b6b",
      "#ffeb99",
      "#ff9c00",
      "#25d366",
    ][Math.floor(Math.random() * 4)];
    firework.style.animationDelay = Math.random() * 2 + "s";
    document.body.appendChild(firework);
  }
}

// Initialize on page load
window.addEventListener("load", () => {
  const name = getUrlParameter("n");
  const action = getUrlParameter("action");

  if (name) {
    // If a name is in the URL, always show the personalized greeting
    document.getElementById("greeting").innerHTML = `
        <h1>${name} यांच्या कडून तुम्हाला व तुमच्या परिवाराला दिवाळीच्या हार्दिक शुभेच्छा!</h1>
        <div class="poem-container">
          <img src="/images/diya.png" alt="Diya" class="poem-image" onerror="this.style.display='none'">
          <div class="poem">
            ही दिवाळी तुम्हाला आणि तुमच्या<br>
            कुटुंबासाठी उज्वल जावो.<br>
            या दिवाळीत देव तुम्हाला<br>
            प्रत्येक गोष्टीत यश देवो.<br>
            💫दिवाळीच्या शुभेच्छा!💫
          </div>
          <img src="/images/diya.png" alt="Diya" class="poem-image" onerror="this.style.display='none'">
        </div>`;

    // Check if this person is the SENDER (action=share)
    if (action === 'share') {
      // If it's the sender, hide the input form and show the share buttons
      document.getElementById("inputForm").style.display = "none";
      document.getElementById("shareButtons").style.display = "flex";
    }
    // If it's the RECEIVER (no action parameter), do nothing else.
    // They will see the personalized greeting and the default input form.
  }

  // Create animations
  createCrackers();
  createFireworks();
});

// Allow Enter key to submit the name
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("nameInput");
  if (input) {
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        generateWish();
      }
    });
  }
});


// Fireworks Canvas Animation
const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');
let fireworks = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Firework {
  constructor(x, y, colors) {
    this.x = x;
    this.y = y;
    this.colors = colors;
    this.particles = [];
    for (let i = 0; i < 80; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const speed = Math.random() * 5 + 1;
      this.particles.push({
        x: this.x,
        y: this.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        color: this.colors[Math.floor(Math.random() * this.colors.length)]
      });
    }
  }

  update() {
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.05; // gravity
      p.alpha -= 0.015;
    });
    this.particles = this.particles.filter(p => p.alpha > 0);
  }

  draw() {
    this.particles.forEach(p => {
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, 2 * Math.PI);
      ctx.fill();
    });
  }
}

function loop() {
  // Use a semi-transparent clear to create a trail effect for the fireworks
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = 'lighter';

  fireworks.forEach(fw => {
    fw.update();
    fw.draw();
  });
  fireworks = fireworks.filter(fw => fw.particles.length > 0);
  requestAnimationFrame(loop);
}

setInterval(() => {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height * 0.5; // Launch from the upper half of the screen
  const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#1dd1a1', '#f368e0'];
  fireworks.push(new Firework(x, y, colors));
}, 800);

loop();

