// Intersection observer for reveal animations
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

reveals.forEach(el => observer.observe(el));

// Nav background on scroll
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    nav.style.borderBottomColor = 'rgba(200, 154, 46, 0.35)';
  } else {
    nav.style.borderBottomColor = 'rgba(200, 154, 46, 0.2)';
  }
});
