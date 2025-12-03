// main.js — optimized, refactored, ES-ES text

// Tailwind custom config must be set before the CDN loads (do not duplicate tailwind.config.js!)
window.tailwind = window.tailwind || {};
window.tailwind.config = {
  theme: {
    extend: {
      colors: {
        dark: '#1a1a22',
        card: '#181A20',
        primary: '#5C4DFF',
        accent: '#18FFFF',
        surface: '#23262F',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      boxShadow: {
        neon: '0 0 32px 0 rgba(92,77,255,0.19), 0 0 16px 0 rgba(24,255,255,0.11)',
        glow: '0 0 16px 0 rgba(24,255,255,0.18)',
      }
    }
  }
};

// -- Helpers
function qs(sel, base=document) { return base.querySelector(sel); }
function qsa(sel, base=document) { return Array.from(base.querySelectorAll(sel)); }

// -- Counter animation for trust metrics (español, limpio)
document.addEventListener('DOMContentLoaded', () => {
  const counters = qsa('[data-counter]');
  counters.forEach(ctr => animateCounter(ctr, Number(ctr.getAttribute('data-target'))));
});

function animateCounter(el, target) {
  let current = 0;
  const speed = 13;
  function update() {
    current += Math.ceil((target-current)/speed);
    el.textContent = current >= target ? target : current;
    if (current < target) requestAnimationFrame(update);
  }
  update();
}

// -- Navbar shadow on scroll
window.addEventListener('scroll', () => {
  const nav = qs('header, .glass') || qs('.glass');
  if (!nav) return;
  nav.classList.toggle('shadow-neon', window.scrollY > 12);
});

// -- Smooth scroll for anchor buttons
qsa('[href^="#"], [data-scroll-target]').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    const targId = el.getAttribute('href')?.replace(/^#/, '') || el.dataset.scrollTarget?.replace(/^#/, '');
    const target = document.getElementById(targId);
    if (target) target.scrollIntoView({behavior:"smooth", block:"start"});
  });
});

// -- Plan toggling and yearly savings logics for pricing (español)
qsa('.plan-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    alert('¡Tu suscripción está a punto de activarse! Finaliza tu compra en tu panel personal.');
  });
});

// -- Demo savings: update dynamically based on plan selection
const savingsBox = qs('#savings');
if (savingsBox) {
  // (Ejemplo: fake logic, mejora según tu backend real)
  let lastPlan = 'Netflix';
  qsa('.plan').forEach(card => {
    card.addEventListener('mouseenter', () => {
      let plan = card.getAttribute('data-plan'), ahorro = '0';
      if (plan === "Netflix") ahorro = '168';
      if (plan === "Spotify") ahorro = '96';
      if (plan === "YouTube") ahorro = '90';
      savingsBox.innerHTML = `Ahorro anual estimado: <span class="font-semibold text-white">≈ ${ahorro} €</span>`;
      lastPlan = plan;
    });
    card.addEventListener('mouseleave', ()=>{
      savingsBox.innerHTML = `<span class="font-semibold text-white">≈ 0 €</span>`;
      lastPlan = '';
    });
  });
}

// -- StickyFocus & Accessibility
qsa('a, button').forEach(el => {
  el.addEventListener('keyup', e => {
    if (e.key === 'Tab' || e.key === 'Enter') el.classList.add('ring-accent', 'ring-2');
    if (e.key === 'Escape') el.classList.remove('ring-accent', 'ring-2');
  });
  el.addEventListener('blur', ()=>el.classList.remove('ring-accent', 'ring-2'));
});