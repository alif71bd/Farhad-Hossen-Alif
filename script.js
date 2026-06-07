(function () {
  var root = document.documentElement;
  var header = document.querySelector('[data-header]');
  var navToggle = document.querySelector('[data-nav-toggle]');
  var navPanel = document.querySelector('[data-nav-panel]');
  var themeToggle = document.querySelector('[data-theme-toggle]');
  var yearNodes = document.querySelectorAll('[data-year]');
  var contactForm = document.querySelector('[data-contact-form]');
  var formStatus = document.querySelector('[data-form-status]');
  var testimonialTrack = document.querySelector('[data-testimonial-track]');
  var prevTestimonial = document.querySelector('[data-testimonial-prev]');
  var nextTestimonial = document.querySelector('[data-testimonial-next]');

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('alif-theme', theme);
    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
    }
  }

  setTheme(localStorage.getItem('alif-theme') || 'dark');

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var nextTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme);
    });
  }

  if (navToggle && navPanel) {
    navToggle.addEventListener('click', function () {
      var isOpen = navPanel.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.querySelector('i').className = isOpen ? 'ri-close-line' : 'ri-menu-line';
    });

    navPanel.addEventListener('click', function (event) {
      if (event.target.closest('a')) {
        navPanel.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.querySelector('i').className = 'ri-menu-line';
      }
    });
  }

  function updateHeader() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 8);
  }

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  yearNodes.forEach(function (node) {
    node.textContent = new Date().getFullYear();
  });

  var dynamicTextNodes = document.querySelectorAll('.dynamic-text');
  if (dynamicTextNodes.length) {
    var expertiseRoles = [
      'CPU Reballing Expert',
      'EMMC / UFS Specialist',
      'Motherboard Repair Expert',
      'Software + Unlock Solution'
    ];
    var roleIndex = 0;

    window.setInterval(function () {
      dynamicTextNodes.forEach(function (node) {
        node.style.opacity = '0';
      });

      window.setTimeout(function () {
        roleIndex = (roleIndex + 1) % expertiseRoles.length;
        dynamicTextNodes.forEach(function (node) {
          node.textContent = expertiseRoles[roleIndex];
          node.style.opacity = '1';
        });
      }, 500);
    }, 3000);
  }

  var revealNodes = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealNodes.forEach(function (node) {
      observer.observe(node);
    });
  } else {
    revealNodes.forEach(function (node) {
      node.classList.add('is-visible');
    });
  }

  function scrollTestimonials(direction) {
    if (!testimonialTrack) return;
    var distance = testimonialTrack.clientWidth * direction;
    testimonialTrack.scrollBy({ left: distance, behavior: 'smooth' });
  }

  if (prevTestimonial) {
    prevTestimonial.addEventListener('click', function () {
      scrollTestimonials(-1);
    });
  }

  if (nextTestimonial) {
    nextTestimonial.addEventListener('click', function () {
      scrollTestimonials(1);
    });
  }

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var data = new FormData(contactForm);
      var name = String(data.get('name') || '').trim();
      var email = String(data.get('email') || '').trim();
      var device = String(data.get('device') || '').trim();
      var issue = String(data.get('issue') || '').trim();

      if (!name || !email || !device || !issue) {
        formStatus.textContent = 'Please complete all fields before submitting.';
        return;
      }

      formStatus.textContent = 'Thanks, ' + name + '. Your request is ready to send.';
      contactForm.reset();
    });
  }
})();
