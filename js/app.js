const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

mainNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const audienceOptions = document.querySelectorAll('.audience-tags span');
audienceOptions.forEach((option) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'audience-choice';
  button.setAttribute('aria-pressed', 'false');
  button.textContent = option.textContent.trim();
  option.replaceWith(button);
});

const audienceButtons = document.querySelectorAll('.audience-choice');
audienceButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const wasSelected = button.getAttribute('aria-pressed') === 'true';
    audienceButtons.forEach((option) => option.setAttribute('aria-pressed', 'false'));
    if (!wasSelected) button.setAttribute('aria-pressed', 'true');
  });
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js')
    .catch((error) => console.error('No se pudo registrar el service worker:', error));
}
