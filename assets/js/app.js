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
    initPortfolioDropdown(siteData, pageContext);
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

  if (pageContext === 'portfolio') {
    updatePortfolioHero(data);
    renderPortfolioCategories(data.portfolio_categories || []);
    return;
  }

  const highlightPhotos = data.home_highlights || data.featured_photos || [];
  const recentWorkPhotos = data.home_recent_works || data.home_photos || [];

  renderHeroSection(highlightPhotos);
  renderGallerySection(recentWorkPhotos, 'Recent Works');
}

function initPortfolioDropdown(data, pageContext) {
  const menu = document.getElementById('nav-portfolio-menu');
  const dropdown = menu?.closest('.nav-dropdown');
  const toggle = dropdown?.querySelector('.nav-dropdown-toggle');
  if (!menu || !dropdown || !toggle) return;

  menu.innerHTML = '';

  const baseItem = document.createElement('li');
  const baseLink = document.createElement('a');
  const isPortfolioPage = pageContext === 'portfolio';
  baseLink.href = isPortfolioPage ? '#top' : 'portfolio.html#top';
  baseLink.textContent = 'Tutte le categorie';
  baseItem.appendChild(baseLink);
  menu.appendChild(baseItem);

  (data.portfolio_categories || []).forEach((category) => {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = isPortfolioPage ? `#category-${category.slug}` : `portfolio.html#category-${category.slug}`;
    link.textContent = category.title;
    li.appendChild(link);
    menu.appendChild(li);

    if (isPortfolioPage) {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        scrollToSection(`category-${category.slug}`);
        closeDropdown();
      });
    }
  });

  const closeDropdown = () => {
    dropdown.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    menu.style.setProperty('--submenu-height', '0px');
  };

  if (isPortfolioPage) {
    baseLink.addEventListener('click', (event) => {
      event.preventDefault();
      scrollToTop();
      closeDropdown();
    });
  }

  toggle.addEventListener('click', (event) => {
    event.preventDefault();
    const isMobile = window.matchMedia('(max-width: 900px)').matches;
    const isOpen = dropdown.classList.contains('open');

    if (isMobile) {
      document.querySelectorAll('.nav-dropdown').forEach((item) => {
        if (item !== dropdown) {
          item.classList.remove('open');
          item.querySelector('.nav-dropdown-menu')?.style.setProperty('--submenu-height', '0px');
          item.querySelector('.nav-dropdown-toggle')?.setAttribute('aria-expanded', 'false');
        }
      });

      if (isOpen) {
        closeDropdown();
      } else {
        dropdown.classList.add('open');
        toggle.setAttribute('aria-expanded', 'true');
        menu.style.setProperty('--submenu-height', `${menu.scrollHeight}px`);
      }
      return;
    }

    if (isOpen) {
      closeDropdown();
    } else {
      dropdown.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
    }
  });

  document.addEventListener('click', (event) => {
    if (!dropdown.contains(event.target)) {
      closeDropdown();
    }
  });
}

function scrollToSection(id) {
  const target = document.getElementById(id) || document.getElementById('hero');
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
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
  document.title = pageContext === 'portfolio' ? `${data.tab_title} | Portfolio` : data.tab_title;

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

function renderHeroSection(photos) {
  const featuredGrid = document.getElementById('featured-grid');
  if (!featuredGrid) return;

  if (!photos.length) {
    featuredGrid.innerHTML = '<p>Nuove foto in arrivo.</p>';
    return;
  }

  photos.slice(0, 3).forEach((photoPath) => {
    const item = document.createElement('div');
    item.className = 'hero-item reveal';

    const img = document.createElement('img');
    img.src = photoPath;
    img.alt = 'Foto in evidenza';
    img.loading = 'eager';

    item.appendChild(img);
    featuredGrid.appendChild(item);
  });
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

    const subtitle = document.createElement('p');
    subtitle.className = 'section-subtitle';
    subtitle.textContent = `${category.photos.length} ${pluralize('fotografia', category.photos.length)} curate`;

    header.appendChild(title);
    header.appendChild(subtitle);

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

function updatePortfolioHero(data) {
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

function pluralize(word, count) {
  if (count === 1) return word;
  if (word.endsWith('a')) {
    return `${word.slice(0, -1)}e`;
  }
  return `${word}s`;
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
