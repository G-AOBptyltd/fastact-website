// ============================================
// FACT V2 — Main JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', function () {
  // Initialize mobile nav toggle
  initMobileNavToggle();
  // Initialize scroll navigation highlight
  initScrollNavigation();
  // Initialize card row scroll arrows
  initCardRowArrows();
  // Initialize Netlify Forms
  initNetlifyForms();
  // Initialize smooth scroll for anchor links
  initSmoothScroll();
});

// ========== MOBILE NAV TOGGLE ==========
function initMobileNavToggle() {
  const hamburger = document.querySelector('.hamburger-toggle');
  const sidebar = document.querySelector('.sidebar');

  if (!hamburger) return;

  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('active');
    sidebar.classList.toggle('active');
  });

  // Close sidebar when clicking a link
  const sidebarLinks = document.querySelectorAll('.sidebar-nav .nav-link, .sidebar-login');
  sidebarLinks.forEach(link => {
    link.addEventListener('click', function () {
      hamburger.classList.remove('active');
      sidebar.classList.remove('active');
    });
  });
}

// ========== SCROLL NAVIGATION HIGHLIGHT ==========
function initScrollNavigation() {
  const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
  const sections = document.querySelectorAll('[id]');

  function updateActiveLink() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(current)) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink);
  updateActiveLink();
}

// ========== CARD ROW SCROLL ARROWS ==========
function initCardRowArrows() {
  const cardRows = document.querySelectorAll('.card-row');

  cardRows.forEach((row) => {
    // Find the nearest parent section
    const section = row.closest('.content-section');
    if (!section) return;

    // Find the arrow buttons in the same section
    const arrows = section.querySelectorAll('.nav-arrow');
    const prevBtn = section.querySelector('.nav-prev');
    const nextBtn = section.querySelector('.nav-next');

    if (!prevBtn || !nextBtn) return;

    const scrollAmount = 360; // pixels to scroll

    prevBtn.addEventListener('click', () => {
      row.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    });

    nextBtn.addEventListener('click', () => {
      row.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    });

    // Update arrow visibility based on scroll position
    function updateArrowState() {
      prevBtn.disabled = row.scrollLeft <= 0;
      nextBtn.disabled = row.scrollLeft >= row.scrollWidth - row.clientWidth - 20;

      if (row.scrollLeft <= 0) {
        prevBtn.style.opacity = '0.5';
        prevBtn.style.cursor = 'not-allowed';
      } else {
        prevBtn.style.opacity = '1';
        prevBtn.style.cursor = 'pointer';
      }

      if (row.scrollLeft >= row.scrollWidth - row.clientWidth - 20) {
        nextBtn.style.opacity = '0.5';
        nextBtn.style.cursor = 'not-allowed';
      } else {
        nextBtn.style.opacity = '1';
        nextBtn.style.cursor = 'pointer';
      }
    }

    row.addEventListener('scroll', updateArrowState);
    window.addEventListener('resize', updateArrowState);
    updateArrowState();
  });
}

// ========== NETLIFY FORMS ==========
function initNetlifyForms() {
  const form = document.querySelector('form[name="fact-waitlist"]');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const button = form.querySelector('button[type="submit"]');
    const originalText = button.innerText;
    const successDiv = document.querySelector('.form-success');
    const errorDiv = document.querySelector('.form-error');

    // Hide previous messages
    if (successDiv) successDiv.style.display = 'none';
    if (errorDiv) errorDiv.style.display = 'none';

    // Show loading state
    button.disabled = true;
    button.innerText = 'Registering...';

    try {
      const formData = new FormData(form);
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      });

      if (response.ok) {
        // Show success message
        if (successDiv) {
          successDiv.style.display = 'block';
        }

        // Reset form
        form.reset();

        // Reset button
        button.disabled = false;
        button.innerText = originalText;
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);

      // Show error message
      if (errorDiv) {
        errorDiv.style.display = 'block';
      }

      // Reset button
      button.disabled = false;
      button.innerText = originalText;
    }
  });
}

// ========== SMOOTH SCROLL FOR ANCHOR LINKS ==========
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// ========== SCROLL REVEAL ANIMATION (Optional) ==========
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');

  if (!window.IntersectionObserver) {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => observer.observe(el));
}

// Initialize on load
initScrollReveal();
