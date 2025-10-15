// ===============================
// 🎧 Background Music Autoplay Handling
// ===============================
const audio = document.getElementById('bgAudio') || document.querySelector("audio");
if (audio) {
  audio.loop = true;
  audio.preload = 'auto';

  // Try autoplay immediately
  audio.play().then(() => {
    console.log("Background music started automatically");
  }).catch(() => {
    console.log("Autoplay blocked, will retry on user interaction");
  });

  const resumePlayback = () => audio.play().catch(() => {});
  ['click', 'touchstart', 'keydown', 'focus'].forEach(evt => {
    window.addEventListener(evt, resumePlayback, { passive: true });
  });

  // Resume on visibility change
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) audio.play().catch(() => {});
  });

  // Safety: restart on end
  audio.addEventListener('ended', () => {
    audio.play().catch(() => {});
  });
}

// ===============================
// 🧰 Utility Functions
// ===============================
function getUrlParameter(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name) || "";
}

function generateWish() {
  const name = document.getElementById("nameInput").value.trim();
  if (name) {
    const url = window.location.origin + window.location.pathname + "?n=" + encodeURIComponent(name);
    window.location.href = url;
  } else {
    alert("कृपया तुमचे नाव टाका");
  }
}

// ===============================
// 📲 WhatsApp Share
// ===============================
function shareOnWhatsApp() {
  const name = getUrlParameter("n") || "";
  const baseUrl = window.location.origin + window.location.pathname;
  const shareUrl = name ? `${baseUrl}?n=${encodeURIComponent(name)}` : baseUrl;
  const senderPart = name ? `${name} ✨🎆 यांच्या कडून ` : '';
  const msg = `${senderPart}तुम्हाला दिवाळीच्या शुभेच्छा एका नव्या अंदाजामध्ये ✨🎇\n\nबघा 👉 ${shareUrl}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
}

// ===============================
// 🎆 Crackers & Fireworks DOM Effects
// ===============================
function createCrackers() {
  for (let i = 0; i < 10; i++) {
    const cracker = document.createElement("div");
    cracker.className = "cracker";
    cracker.style.left = Math.random() * 100 + "%";
    cracker.style.top = Math.random() * 100 + "%";
    cracker.style.animationDelay = Math.random() * 5 + "s";
    document.body.appendChild(cracker);

    // Add particles
    for (let j = 0; j < 8; j++) {
      const particle = document.createElement("div");
      particle.className = "particle";
      particle.style.setProperty('--angle', (j * 45) + 'deg');
      cracker.appendChild(particle);
    }

    // Optional: cleanup after animation
    setTimeout(() => cracker.remove(), 12000);
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

    // cleanup
    setTimeout(() => firework.remove(), 8000);
  }
}

// ===============================
// 💥 Canvas Fireworks Animation
// ===============================
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
  // Slight fade to create trail effect
  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  fireworks.forEach(fw => {
    fw.update();
    fw.draw();
  });
  fireworks = fireworks.filter(fw => fw.particles.length > 0);
  requestAnimationFrame(loop);
}

setInterval(() => {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height * 0.5;
  const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#1dd1a1', '#f368e0'];
  fireworks.push(new Firework(x, y, colors));
}, 800);

loop();

// ===============================
// 🚀 Init on Page Load
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const name = getUrlParameter("n");
  if (name) {
    document.getElementById("greeting").innerHTML = `
      <h1>${name} यांच्या कडून तुम्हाला व तुमच्या परिवाराला दिवाळीच्या हार्दिक शुभेच्छा!</h1>
      <div class="poem-container">
        <img src="/images/diya.png" alt="Diya" class="poem-image">
        <div class="poem">
          ही दिवाळी तुम्हाला आणि तुमच्या<br>
          कुटुंबासाठी उज्वल जावो.<br>
          या दिवाळीत देव तुम्हाला<br>
          प्रत्येक गोष्टीत यश देवो.<br>
          💫दिवाळीच्या शुभेच्छा!💫
        </div>
        <img src="/images/diya.png" alt="Diya" class="poem-image">
      </div>`;
    document.getElementById("inputForm").style.display = "none";
    document.getElementById("shareButtons").style.display = "flex";
  }

  createCrackers();
  createFireworks();

  // Allow Enter key to submit name
  const input = document.getElementById("nameInput");
  if (input) {
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        generateWish();
      }
    });
  }
});
