// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
  initParticles();
  initTypedEffect();
  initGlitchCanvas();
  initMouseInteractions();
});

// ===== PARTICLES.JS CONFIGURATION =====
function initParticles() {
  if (typeof particlesJS === 'undefined') {
    console.error('Particles.js not loaded');
    return;
  }

  particlesJS('particles-js', {
    particles: {
      number: {
        value: 80,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: ['#7c5cff', '#4cc9f0', '#00ff41']
      },
      shape: {
        type: 'circle',
        stroke: {
          width: 0,
          color: '#000000'
        }
      },
      opacity: {
        value: 0.5,
        random: true,
        anim: {
          enable: true,
          speed: 1,
          opacity_min: 0.1,
          sync: false
        }
      },
      size: {
        value: 3,
        random: true,
        anim: {
          enable: true,
          speed: 2,
          size_min: 0.1,
          sync: false
        }
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: '#4cc9f0',
        opacity: 0.4,
        width: 1
      },
      move: {
        enable: true,
        speed: 2,
        direction: 'none',
        random: true,
        straight: false,
        out_mode: 'out',
        bounce: false,
        attract: {
          enable: true,
          rotateX: 600,
          rotateY: 1200
        }
      }
    },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onhover: {
          enable: true,
          mode: 'grab'
        },
        onclick: {
          enable: true,
          mode: 'push'
        },
        resize: true
      },
      modes: {
        grab: {
          distance: 200,
          line_linked: {
            opacity: 1
          }
        },
        push: {
          particles_nb: 4
        }
      }
    },
    retina_detect: true
  });
}

// ===== TYPED.JS EFFECT =====
function initTypedEffect() {
  if (typeof Typed === 'undefined') {
    console.error('Typed.js not loaded');
    // Fallback: afficher le texte directement
    const output = document.getElementById('typed-output');
    if (output) {
      output.textContent = 'HACKER NEWS';
    }
    return;
  }

  const typedElement = document.getElementById('typed-output');
  if (!typedElement) return;

  new Typed('#typed-output', {
    strings: [
      'HACKER NEWS',
      'TECH STORIES',
      'HACKER NEWS',
      'CODE & INNOVATION',
      'HACKER NEWS'
    ],
    typeSpeed: 100,
    backSpeed: 50,
    backDelay: 2000,
    startDelay: 500,
    loop: true,
    showCursor: true,
    cursorChar: '|',
    autoInsertCss: true,
  });
}

// ===== GLITCH CANVAS EFFECT =====
function initGlitchCanvas() {
  const canvas = document.getElementById('glitch-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const container = canvas.parentElement;

  // Responsive canvas
  function resizeCanvas() {
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Variables pour l'effet
  let glitchIntensity = 0;
  let time = 0;

  // Animation loop
  function animate() {
    time++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Effet de glitch aléatoire
    if (Math.random() > 0.95) {
      glitchIntensity = Math.random() * 10;
    } else {
      glitchIntensity *= 0.9;
    }

    // Dessiner des lignes de glitch
    if (glitchIntensity > 0.5) {
      const numLines = Math.floor(Math.random() * 5) + 1;

      for (let i = 0; i < numLines; i++) {
        const y = Math.random() * canvas.height;
        const height = Math.random() * 50 + 10;
        const offset = (Math.random() - 0.5) * glitchIntensity * 10;

        // RGB shift effect
        ctx.globalCompositeOperation = 'screen';

        // Red channel
        ctx.fillStyle = 'rgba(255, 0, 110, 0.5)';
        ctx.fillRect(offset - 2, y, canvas.width, height);

        // Green channel
        ctx.fillStyle = 'rgba(0, 255, 65, 0.5)';
        ctx.fillRect(offset, y, canvas.width, height);

        // Blue channel
        ctx.fillStyle = 'rgba(0, 245, 255, 0.5)';
        ctx.fillRect(offset + 2, y, canvas.width, height);
      }
    }

    // Scanlines effect
    if (time % 2 === 0) {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(0, 255, 65, 0.03)';
      for (let y = 0; y < canvas.height; y += 4) {
        ctx.fillRect(0, y, canvas.width, 2);
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

// ===== MOUSE INTERACTIONS =====
function initMouseInteractions() {
  const heroWrapper = document.querySelector('.hero-wrapper');
  const heroTitle = document.querySelector('.hero-title');

  if (!heroWrapper || !heroTitle) return;

  // Parallax effect au mouvement de la souris
  heroWrapper.addEventListener('mousemove', function(e) {
    const rect = heroWrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const percentX = (x - centerX) / centerX;
    const percentY = (y - centerY) / centerY;

    // Appliquer la transformation 3D
    heroTitle.style.transform = `
      perspective(1000px)
      rotateY(${percentX * 5}deg)
      rotateX(${-percentY * 5}deg)
      translateZ(20px)
    `;
  });

  // Reset au mouseout
  heroWrapper.addEventListener('mouseleave', function() {
    heroTitle.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) translateZ(0)';
  });

  // Effet de pulse au clic
  heroTitle.addEventListener('click', function() {
    heroTitle.style.animation = 'none';
    setTimeout(() => {
      heroTitle.style.animation = 'glitchShake 0.3s, flicker 3s infinite alternate';
    }, 10);
  });
}

// ===== UTILITAIRES =====

// Fonction pour créer des étoiles aléatoires dans le background
function createStarfield() {
  const canvas = document.getElementById('glitch-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  for (let i = 0; i < 100; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = Math.random() * 1.5;

    ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.8})`;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Console easter egg pour les développeurs
console.log('%c🚀 HACKER NEWS - ULTRA MODE', 'color: #00ff41; font-size: 20px; font-weight: bold; text-shadow: 0 0 10px #00ff41;');
console.log('%cTechnologies utilisées:', 'color: #4cc9f0; font-size: 14px;');
console.log('%c- Particles.js pour les particules connectées', 'color: #aaa;');
console.log('%c- Typed.js pour l\'effet machine à écrire', 'color: #aaa;');
console.log('%c- Canvas API pour les effets glitch', 'color: #aaa;');
console.log('%c- CSS animations avancées', 'color: #aaa;');
console.log('%c- JavaScript vanilla pour les interactions', 'color: #aaa;');
