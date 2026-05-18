/* ============================================
   IRONFIT GYM — SCRIPT.JS
============================================ */

// ---- LOADER ----
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 1900);
});

// ---- CURRENT YEAR ----
document.getElementById('year').textContent = new Date().getFullYear();

// ---- NAVBAR SCROLL ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 400);
});

// ---- MOBILE NAV TOGGLE ----
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ---- SMOOTH SCROLL ----
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ---- SCROLL REVEAL ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ---- ANIMATED COUNTERS ----
let countersStarted = false;
const statsSection = document.querySelector('.stats-section');
const counterObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !countersStarted) {
    countersStarted = true;
    document.querySelectorAll('.stat-item').forEach(item => {
      const target = parseInt(item.dataset.target);
      const numEl = item.querySelector('.stat-number');
      let current = 0;
      const increment = target / (2000 / 16);
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          numEl.textContent = target.toLocaleString();
          clearInterval(timer);
        } else {
          numEl.textContent = Math.floor(current).toLocaleString();
        }
      }, 16);
    });
  }
}, { threshold: 0.4 });
if (statsSection) counterObserver.observe(statsSection);

// ---- MOTIVATIONAL QUOTES ----
const QUOTES = [
  "The only bad workout is the one that didn't happen.",
  "Push yourself because no one else is going to do it for you.",
  "Your body can stand almost anything. It's your mind you have to convince.",
  "The pain you feel today will be the strength you feel tomorrow.",
  "Don't limit your challenges — challenge your limits.",
  "Success starts with self-discipline.",
  "Every rep counts. Every set matters. Every session shapes you.",
];
let quoteIdx = 0;
const quoteEl = document.getElementById('motivationalQuote');
setInterval(() => {
  quoteIdx = (quoteIdx + 1) % QUOTES.length;
  quoteEl.style.opacity = '0';
  setTimeout(() => {
    quoteEl.textContent = `"${QUOTES[quoteIdx]}"`;
    quoteEl.style.opacity = '1';
    quoteEl.style.transition = 'opacity 0.6s ease';
  }, 400);
}, 5000);

// ---- WORKOUT FILTER ----
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.workout-card').forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ---- WORKOUT PLANNER ----
const PLAN_WORKOUTS = {
  strength: ['Bench Press 4x8', 'Deadlifts 3x5', 'Squats 4x6', 'Overhead Press 3x8', 'Barbell Rows 4x8', 'Pull-ups 3xMax'],
  cardio:   ['30 min Treadmill Run', 'Cycling Intervals 25 min', 'Rowing Machine 20 min', 'Jump Rope 15 min', 'Stair Climber 20 min'],
  yoga:     ['Sun Salutation Flow', 'Warrior Sequence', 'Balance & Core Holds', 'Deep Stretch Session', 'Meditation & Breathwork'],
  hiit:     ['Tabata 4-min Rounds', 'EMOM Circuit', 'AMRAP Challenge', 'Sprint Intervals', 'Burpee Complex'],
  weight_loss: ['Full-Body Circuit', 'Metabolic Conditioning', 'Cardio + Core Burn', 'Resistance Band HIIT', 'Bodyweight Blitz'],
};
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function generatePlan() {
  const type = document.getElementById('planType').value;
  const days = parseInt(document.getElementById('planDays').value);
  const duration = document.getElementById('planDuration').value;
  if (!type || !duration) {
    alert('Please select workout type and enter duration.');
    return;
  }
  const exercises = PLAN_WORKOUTS[type] || [];
  const output = document.getElementById('planOutput');
  output.innerHTML = '';
  for (let i = 0; i < days; i++) {
    const exList = [exercises[i % exercises.length], exercises[(i + 1) % exercises.length], exercises[(i + 2) % exercises.length]];
    const div = document.createElement('div');
    div.className = 'plan-day';
    div.innerHTML = `
      <h4>${DAYS[i]}</h4>
      <p class="plan-dur">${duration} min</p>
      <ul>${exList.map(ex => `<li>${ex}</li>`).join('')}</ul>
    `;
    output.appendChild(div);
  }
}

// ---- BMI CALCULATOR ----
function calculateBMI() {
  const h = parseFloat(document.getElementById('bmiHeight').value) / 100;
  const w = parseFloat(document.getElementById('bmiWeight').value);
  const resultEl = document.getElementById('bmiResult');
  if (!h || !w || h <= 0 || w <= 0) {
    resultEl.innerHTML = '<p style="color:#ef4444">Please enter valid height and weight.</p>';
    return;
  }
  const bmi = (w / (h * h)).toFixed(1);
  let label, color, borderColor, bg;
  if (bmi < 18.5) { label = 'Underweight'; color = '#60a5fa'; borderColor = 'rgba(96,165,250,0.3)'; bg = 'rgba(96,165,250,0.08)'; }
  else if (bmi < 25) { label = 'Normal Weight'; color = '#4ade80'; borderColor = 'rgba(74,222,128,0.3)'; bg = 'rgba(74,222,128,0.08)'; }
  else if (bmi < 30) { label = 'Overweight'; color = '#facc15'; borderColor = 'rgba(250,204,21,0.3)'; bg = 'rgba(250,204,21,0.08)'; }
  else { label = 'Obese'; color = '#f87171'; borderColor = 'rgba(248,113,113,0.3)'; bg = 'rgba(248,113,113,0.08)'; }

  resultEl.innerHTML = `
    <div class="bmi-result-inner" style="background:${bg};border-color:${borderColor}">
      <p>Your BMI</p>
      <div class="bmi-value" style="color:${color}">${bmi}</div>
      <div class="bmi-label" style="color:${color}">${label}</div>
    </div>
  `;
}

// ---- TESTIMONIALS SLIDER ----
let currentSlide = 0;
const slides = document.querySelectorAll('.testimonial-slide');
const dots = document.querySelectorAll('.dot');

function goToSlide(n) {
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = (n + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}
function changeSlide(dir) { goToSlide(currentSlide + dir); }

setInterval(() => changeSlide(1), 6000);

// ---- GALLERY LIGHTBOX ----
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const imgSrc = item.dataset.img;
    document.getElementById('lightboxImg').src = imgSrc;
    document.getElementById('lightbox').classList.add('open');
  });
});
document.getElementById('lightbox').addEventListener('click', (e) => {
  if (e.target.id === 'lightbox') closeLightbox();
});
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

// ---- FAQ ACCORDION ----
function toggleFAQ(btn) {
  const item = btn.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(f => f.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

// ---- COUNTDOWN TIMER ----
function getOrSetTarget() {
  const KEY = 'ironfit_challenge_end';
  let stored = localStorage.getItem(KEY);
  if (!stored) {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    d.setHours(0, 0, 0, 0);
    stored = d.toISOString();
    localStorage.setItem(KEY, stored);
  }
  return new Date(stored);
}
const challengeEnd = getOrSetTarget();
function updateCountdown() {
  const diff = challengeEnd - new Date();
  if (diff <= 0) {
    ['cDays','cHours','cMins','cSecs'].forEach(id => document.getElementById(id).textContent = '00');
    return;
  }
  const pad = n => String(n).padStart(2, '0');
  document.getElementById('cDays').textContent  = pad(Math.floor(diff / 86400000));
  document.getElementById('cHours').textContent = pad(Math.floor((diff / 3600000) % 24));
  document.getElementById('cMins').textContent  = pad(Math.floor((diff / 60000) % 60));
  document.getElementById('cSecs').textContent  = pad(Math.floor((diff / 1000) % 60));
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ---- CONTACT FORM VALIDATION ----
function submitForm(e) {
  e.preventDefault();
  const name    = document.getElementById('cName').value.trim();
  const email   = document.getElementById('cEmail').value.trim();
  const message = document.getElementById('cMessage').value.trim();
  let valid = true;

  document.getElementById('errName').textContent    = '';
  document.getElementById('errEmail').textContent   = '';
  document.getElementById('errMessage').textContent = '';

  if (!name)    { document.getElementById('errName').textContent = 'Name is required.'; valid = false; }
  if (!email)   { document.getElementById('errEmail').textContent = 'Email is required.'; valid = false; }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    document.getElementById('errEmail').textContent = 'Please enter a valid email.'; valid = false;
  }
  if (!message) { document.getElementById('errMessage').textContent = 'Message is required.'; valid = false; }

  if (valid) {
    document.getElementById('formSuccess').classList.add('show');
    document.getElementById('contactForm').reset();
    setTimeout(() => document.getElementById('formSuccess').classList.remove('show'), 5000);
  }
}