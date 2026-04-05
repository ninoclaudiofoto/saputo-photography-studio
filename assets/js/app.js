document.addEventListener('DOMContentLoaded', () => {
  const currentYearEl = document.getElementById('current-year');
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  initMobileNav();

  const pageContext = document.body?.dataset?.page || 'home';

  if (typeof siteData !== 'undefined') {
    populateUI(siteData, pageContext);
    initScrollReveal();
    initLightboxEvents();
  } else {
    console.error('Errore: dati non trovati');
    const galleryRoot = document.getElementById('gallery-grid') || document.getElementById('portfolio-categories');
    if (galleryRoot) {
      galleryRoot.innerHTML = '<p>Si è verificato un errore nel caricamento del portfolio.</p>';
    }
  }
});

function populateUI(data, pageContext) {
  setBaseSiteInfo(data, pageContext);

  if (pageContext === 'my-works') {
    updateWorksHero(data);
    renderPortfolioCategories(data.portfolio_categories || []);
    return;
  }

  const recentWorkPhotos = data.home_recent_works || data.home_photos || [];

  const heroPhoto = data.bio_photo || recentWorkPhotos[0] || '';
  renderBioHero(heroPhoto);
  renderGallerySection(recentWorkPhotos, 'Recent Works');
}

function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  const overlay = document.querySelector('.nav-overlay');
  if (!toggle || !nav) return;

  const closeNav = () => {
    document.body.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.querySelectorAll('.nav-dropdown').forEach((item) => {
      item.classList.remove('open');
      item.querySelector('.nav-dropdown-menu')?.style.setProperty('--submenu-height', '0px');
      item.querySelector('.nav-dropdown-toggle')?.setAttribute('aria-expanded', 'false');
    });
  };

  toggle.addEventListener('click', () => {
    const isOpen = document.body.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  overlay?.addEventListener('click', closeNav);

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.matchMedia('(max-width: 900px)').matches) {
        closeNav();
      }
    });
  });

  document.addEventListener('click', (event) => {
    if (!document.body.classList.contains('nav-open')) return;
    if (nav.contains(event.target) || toggle.contains(event.target)) return;
    closeNav();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      closeNav();
      document.querySelectorAll('.nav-dropdown').forEach((item) => item.classList.remove('open'));
    }
  });
}

function setBaseSiteInfo(data, pageContext) {
  document.title = pageContext === 'my-works' ? `${data.tab_title} | My Works` : data.tab_title;

  const uiName = document.getElementById('ui-name');
  if (uiName) uiName.textContent = data.main_title;

  const textEmail = document.getElementById('text-email');
  if (textEmail) {
    textEmail.textContent = data.email;
    textEmail.href = `mailto:${data.email}`;
  }

  const textPhone = document.getElementById('text-phone');
  if (textPhone) {
    textPhone.textContent = data.phone;
    textPhone.href = `tel:${data.phone.replace(/\s+/g, '')}`;
  }

  const btnMail = document.getElementById('btn-mail');
  if (btnMail) btnMail.href = `mailto:${data.email}`;

  const btnWhatsapp = document.getElementById('btn-whatsapp');
  if (btnWhatsapp) btnWhatsapp.href = `https://wa.me/${data.whatsapp}`;

  const linkInsta = document.getElementById('link-instagram');
  if (linkInsta) linkInsta.href = data.instagram;
}

function renderBioHero(photoPath) {
  const heroImg = document.getElementById('bio-hero-photo');
  if (!heroImg) return;

  if (photoPath) {
    heroImg.src = photoPath;
  } else {
    heroImg.style.display = 'none';
  }
}

function renderGallerySection(photos, label) {
  const galleryGrid = document.getElementById('gallery-grid');
  if (!galleryGrid) return;

  if (!photos.length) {
    galleryGrid.innerHTML = '<p>Nuove foto in arrivo.</p>';
    return;
  }

  photos.forEach((photoPath, index) => {
    const alt = label ? `${label} ${index + 1}` : `Fotografia portfolio ${index + 1}`;
    const item = createGalleryItem(photoPath, alt, photos, index);
    galleryGrid.appendChild(item);
  });
}

function renderPortfolioCategories(categories) {
  const container = document.getElementById('portfolio-categories');
  if (!container) return;
  container.innerHTML = '';

  if (!categories.length) {
    container.innerHTML = '<p>Non sono state trovate categorie. Aggiungi nuove cartelle in assets/img/categories e rilancia lo script di ottimizzazione.</p>';
    return;
  }

  categories.forEach((category) => {
    const section = document.createElement('section');
    section.className = 'gallery-section reveal';
    section.id = `category-${category.slug}`;

    const inner = document.createElement('div');
    inner.className = 'container';

    const header = document.createElement('div');
    header.className = 'portfolio-category-header';

    const title = document.createElement('h2');
    title.className = 'section-title';
    title.textContent = category.title;

    header.appendChild(title);

    const grid = document.createElement('div');
    grid.className = 'masonry-grid';

    category.photos.forEach((photoPath, index) => {
      const item = createGalleryItem(photoPath, `${category.title} ${index + 1}`, category.photos, index);
      grid.appendChild(item);
    });

    inner.appendChild(header);
    inner.appendChild(grid);
    section.appendChild(inner);
    container.appendChild(section);
  });
}

function updateWorksHero(data) {
  const heroTitle = document.getElementById('portfolio-hero-tagline');
  const heroDescription = document.getElementById('portfolio-hero-description');
  const intro = data.portfolio_intro || {};

  if (heroTitle && intro.tagline) {
    heroTitle.textContent = intro.tagline;
  }

  if (heroDescription && intro.description) {
    heroDescription.textContent = intro.description;
  }
}

function createGalleryItem(photoPath, altText, photoCollection, index) {
  const item = document.createElement('div');
  item.className = 'gallery-item reveal';

  const img = document.createElement('img');
  img.src = photoPath;
  img.alt = altText;
  img.loading = 'lazy';

  item.appendChild(img);
  item.addEventListener('click', () => openLightbox(index, photoCollection));

  return item;
}

function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          obs.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    }
  );

  reveals.forEach((reveal) => observer.observe(reveal));
}

let currentPhotoIndex = 0;
let galleryData = [];

function openLightbox(index, photos) {
  galleryData = photos;
  currentPhotoIndex = index;
  const lightbox = document.getElementById('lightbox');

  if (!lightbox) return;

  document.body.style.overflow = 'hidden';
  lightbox.style.display = 'flex';
  setTimeout(() => {
    lightbox.classList.add('active');
  }, 10);

  updateLightboxImage();
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  lightbox.classList.remove('active');
  document.body.style.overflow = '';

  setTimeout(() => {
    lightbox.style.display = 'none';
    const img = document.getElementById('lightbox-img');
    if (img) img.src = '';
  }, 400);
}

function updateLightboxImage() {
  const lightboxImg = document.getElementById('lightbox-img');
  if (!lightboxImg || !galleryData.length) return;
  lightboxImg.src = galleryData[currentPhotoIndex];
}

function changeLightboxImage(direction) {
  if (!galleryData.length) return;

  currentPhotoIndex += direction;
  if (currentPhotoIndex < 0) {
    currentPhotoIndex = galleryData.length - 1;
  } else if (currentPhotoIndex >= galleryData.length) {
    currentPhotoIndex = 0;
  }
  updateLightboxImage();
}

function initLightboxEvents() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => changeLightboxImage(-1));
  if (lightboxNext) lightboxNext.addEventListener('click', () => changeLightboxImage(1));

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (!lightbox.classList.contains('active')) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') changeLightboxImage(-1);
    if (event.key === 'ArrowRight') changeLightboxImage(1);
  });
}
