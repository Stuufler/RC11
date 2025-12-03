// Tailwind config должен быть определён до загрузки CDN
// (index.html подключает main.js раньше, чем https://cdn.tailwindcss.com)
window.tailwind = window.tailwind || {};
window.tailwind.config = {
  theme: {
    extend: {
      colors: {
        dark: '#0F0F12',
        card: '#181A20',
        primary: '#5C4DFF',
        accent: '#18FFFF',
        surface: '#23262F'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif']
      },
      boxShadow: {
        neon: '0 0 20px rgba(92, 77, 255, 0.3)',
        glow: '0 0 15px rgba(24, 255, 255, 0.4)'
      }
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('main-nav');
  const scrollLinks = document.querySelectorAll('[data-scroll-target]');
  const plans = document.querySelectorAll('.plan');
  const savingsEl = document.getElementById('savings');
  const counters = document.querySelectorAll('[data-counter]');

  /* NAVBAR SHADOW ON SCROLL */
  const handleNavScroll = () => {
    if (window.scrollY > 40) {
      nav.classList.add('nav-scrolled');
    } else {
      nav.classList.remove('nav-scrolled');
    }
  };
  handleNavScroll();
  window.addEventListener('scroll', handleNavScroll);

  /* SMOOTH SCROLL TO SECTIONS (CTA кнопки) */
  scrollLinks.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetSelector = btn.getAttribute('data-scroll-target');
      const target = document.querySelector(targetSelector);
      if (!target) return;

      const offsetTop = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    });
  });

  /* COUNTERS IN HERO */
  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10) || 0;
    let current = 0;
    const duration = 1200;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      current = Math.floor(target * progress);
      el.textContent = current.toLocaleString('ru-RU') + '+';
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const countersObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  counters.forEach(counter => countersObserver.observe(counter));

  /* PLAN SELECTION + SAVINGS CALC */
  const officialPrices = {
    Netflix: 17.99,
    Spotify: 9.99,
    YouTube: 11.99
  };

  const updateSavings = () => {
    let officialTotal = 0;
    let ourTotal = 0;

    plans.forEach(plan => {
      if (plan.classList.contains('active-plan')) {
        const name = plan.getAttribute('data-plan');
        const priceEl = plan.querySelector('.plan-price');
        const ourPrice = parseFloat(priceEl.getAttribute('data-price'));
        const offPrice = officialPrices[name] || ourPrice;

        officialTotal += offPrice;
        ourTotal += ourPrice;
      }
    });

    const yearlyDiff = (officialTotal - ourTotal) * 12;
    const span = savingsEl.querySelector('span');
    span.textContent = `≈ ${Math.max(0, yearlyDiff).toFixed(0)} €`;
  };

  plans.forEach(plan => {
    const btn = plan.querySelector('.plan-btn');

    btn.addEventListener('click', () => {
      plan.classList.toggle('active-plan');

      if (plan.classList.contains('active-plan')) {
        plan.classList.add('ring-2', 'ring-primary', 'ring-offset-2', 'ring-offset-dark');
      } else {
        plan.classList.remove('ring-2', 'ring-primary', 'ring-offset-2', 'ring-offset-dark');
      }

      updateSavings();
    });
  });

  // Инициализация без выбранных планов
  updateSavings();
});