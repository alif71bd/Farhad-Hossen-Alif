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

  var scrollHint = document.querySelector('.scroll-hint');

  function hideScrollHint() {
    if (!scrollHint) return;
    if (window.scrollY > 8) {
      scrollHint.classList.add('scroll-hint-hidden');
    }
  }

  updateHeader();
  hideScrollHint();
  window.addEventListener('scroll', function () {
    updateHeader();
    hideScrollHint();
  }, { passive: true });

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

  var revealObserver = null;
  var revealNodes = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealNodes.forEach(function (node) {
      revealObserver.observe(node);
    });
  } else {
    revealNodes.forEach(function (node) {
      node.classList.add('is-visible');
    });
  }

  function observeRevealNode(node) {
    if (!node) return;
    if (revealObserver) {
      revealObserver.observe(node);
    } else {
      node.classList.add('is-visible');
    }
  }

  initGallery();

  function initGallery() {
    var galleryGrid = document.getElementById('galleryGrid');
    var galleryOverlay = document.getElementById('galleryLightbox');
    var galleryImage = galleryOverlay ? galleryOverlay.querySelector('.lightbox-content img') : null;
    var galleryClose = galleryOverlay ? galleryOverlay.querySelector('.lightbox-close') : null;

    if (!galleryGrid) return;

    galleryGrid.innerHTML = '<p class="gallery-loading">Loading gallery...</p>';

    function checkImageExists(src) {
      return new Promise(function (resolve) {
        var img = new Image();
        img.onload = function () { resolve(src); };
        img.onerror = function () { resolve(null); };
        img.src = src;
      });
    }

    function loadGalleryManifest() {
      return fetch('img/gallery.json').then(function (response) {
        if (!response.ok) {
          throw new Error('Gallery manifest not found');
        }
        return response.json();
      });
    }

    function scanGalleryImages() {
      var checks = [];
      var extensions = ['jpg', 'jpeg', 'png'];
      var maxImages = 12;

      for (var i = 1; i <= maxImages; i += 1) {
        extensions.forEach(function (ext) {
          checks.push(checkImageExists('img/repair-work-' + i + '.' + ext));
        });
      }

      Promise.all(checks).then(function (results) {
        var images = results.filter(function (src) { return src; });
        renderGallery(images);
      });
    }

    function renderGallery(images) {
      galleryGrid.innerHTML = '';
      if (!images.length) {
        galleryGrid.innerHTML = '<p class="gallery-empty">No images found. Upload images to the <code>img/</code> folder named like <code>repair-work-1.jpg</code>.</p>';
        return;
      }

      images.forEach(function (src, index) {
        var figure = document.createElement('figure');
        figure.className = 'gallery-item reveal';

        var img = document.createElement('img');
        img.src = src;
        img.alt = 'Repair gallery image ' + (index + 1);

        figure.appendChild(img);
        figure.addEventListener('click', function () {
          if (!galleryOverlay || !galleryImage) return;
          galleryImage.src = src;
          galleryImage.alt = img.alt;
          galleryOverlay.classList.remove('hidden');
          galleryOverlay.setAttribute('aria-hidden', 'false');
        });

        galleryGrid.appendChild(figure);
        observeRevealNode(figure);
      });
    }

    if (galleryClose) {
      galleryClose.addEventListener('click', function () {
        if (!galleryOverlay || !galleryImage) return;
        galleryOverlay.classList.add('hidden');
        galleryOverlay.setAttribute('aria-hidden', 'true');
        galleryImage.src = '';
        galleryImage.alt = '';
      });
    }

    if (galleryOverlay) {
      galleryOverlay.addEventListener('click', function (event) {
        if (event.target === galleryOverlay) {
          galleryClose && galleryClose.click();
        }
      });
    }

    loadGalleryManifest()
      .then(function (images) {
        if (Array.isArray(images) && images.length) {
          renderGallery(images);
        } else {
          scanGalleryImages();
        }
      })
      .catch(scanGalleryImages);
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
