/* ============================================
   FACT Website — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mobile Nav Toggle ---------- */
  const navToggle = document.querySelector('.nav-toggle');
  const navMobile = document.querySelector('.nav-mobile');

  if (navToggle && navMobile) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMobile.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navMobile.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMobile.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- Scroll Reveal ---------- */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => observer.observe(el));
  }

  /* ---------- Smooth Scroll for Anchor Links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navHeight = document.querySelector('.nav')?.offsetHeight || 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---------- Netlify Forms — Register Your Interest ---------- */
  const waitlistForm = document.querySelector('form[name="fact-waitlist"]');
  if (waitlistForm) {
    waitlistForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new URLSearchParams(new FormData(waitlistForm));
      const successEl = document.querySelector('.form-success');
      const errorEl = document.querySelector('.form-error');
      const submitBtn = waitlistForm.querySelector('button[type="submit"]');

      // Reset messages
      if (successEl) successEl.style.display = 'none';
      if (errorEl) errorEl.style.display = 'none';

      // Disable button
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Registering...';
      }

      try {
        const response = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData.toString()
        });

        if (response.ok) {
          waitlistForm.reset();
          if (successEl) {
            successEl.textContent = "You're registered! We'll be in touch as soon as bookings open. Keep an eye on your inbox.";
            successEl.style.display = 'block';
          }
        } else {
          throw new Error('Form submission failed');
        }
      } catch (err) {
        console.error('Form error:', err);
        if (errorEl) {
          errorEl.textContent = 'Something went wrong. Please try again or contact us directly.';
          errorEl.style.display = 'block';
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Register Your Interest';
        }
      }
    });
  }

  /* ---------- Netlify Forms — Contact ---------- */
  const contactForm = document.querySelector('form[name="fact-contact"]');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new URLSearchParams(new FormData(contactForm));
      const successEl = contactForm.querySelector('.form-success') || document.querySelector('.contact-success');
      const errorEl = contactForm.querySelector('.form-error') || document.querySelector('.contact-error');
      const submitBtn = contactForm.querySelector('button[type="submit"]');

      if (successEl) successEl.style.display = 'none';
      if (errorEl) errorEl.style.display = 'none';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      try {
        const response = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData.toString()
        });

        if (response.ok) {
          contactForm.reset();
          if (successEl) {
            successEl.textContent = "Thanks for reaching out! We'll get back to you within 1-2 business days.";
            successEl.style.display = 'block';
          }
        } else {
          throw new Error('Form submission failed');
        }
      } catch (err) {
        console.error('Form error:', err);
        if (errorEl) {
          errorEl.textContent = 'Something went wrong. Please try again or email us directly.';
          errorEl.style.display = 'block';
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
        }
      }
    });
  }

});
