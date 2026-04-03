document.addEventListener('DOMContentLoaded', () => {
    // Anno Corrente Footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Effetto Scroll Header (Glassmorphism dinamico)
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    if (typeof siteData !== 'undefined') {
        populateUI(siteData);
        initScrollReveal();
        initLightboxEvents();
    } else {
        console.error('Errore: dati non trovati');
        const grid = document.getElementById('gallery-grid');
        if(grid) grid.innerHTML = '<p>Si è verificato un errore nel caricamento del portfolio.</p>';
    }
});

function populateUI(data) {
    // Info di base
    const uiName = document.getElementById('ui-name');
    if(uiName) uiName.textContent = data.main_title;
    document.title = data.tab_title;

    // Contatti
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
    if(btnMail) btnMail.href = `mailto:${data.email}`;

    const btnWhatsapp = document.getElementById('btn-whatsapp');
    if(btnWhatsapp) btnWhatsapp.href = `https://wa.me/${data.whatsapp}`;

    const linkInsta = document.getElementById('link-instagram');
    if(linkInsta) linkInsta.href = data.instagram;

    // Foto In Evidenza (Hero Section)
    const featuredGrid = document.getElementById('featured-grid');
    if (featuredGrid && data.featured_photos && data.featured_photos.length > 0) {
        // Mostriamo al massimo le prime 3 per le griglia di design
        data.featured_photos.slice(0, 3).forEach(photoPath => {
            const item = document.createElement('div');
            item.className = 'hero-item reveal'; // Classe reveal per l'animazione scroll

            const img = document.createElement('img');
            img.src = photoPath;
            img.alt = 'Foto in evidenza';
            img.loading = 'eager'; // Importante per l'above-the-fold

            item.appendChild(img);
            featuredGrid.appendChild(item);
        });
    }

    // Galleria Fotografica
    const galleryGrid = document.getElementById('gallery-grid');
    if (galleryGrid && data.gallery_photos && data.gallery_photos.length > 0) {
        data.gallery_photos.forEach((photoPath, index) => {
            const item = document.createElement('div');
            item.className = 'gallery-item reveal'; // Classe reveal
            
            const img = document.createElement('img');
            img.src = photoPath;
            img.alt = `Fotografia portfolio ${index + 1}`;
            img.loading = 'lazy'; // Lazy load per performance

            // Apertura Lightbox al click
            item.addEventListener('click', () => {
                openLightbox(index, data.gallery_photos);
            });

            item.appendChild(img);
            galleryGrid.appendChild(item);
        });
    } else if (galleryGrid) {
        galleryGrid.innerHTML = '<p>Nuove foto in arrivo.</p>';
    }
}

// ==========================================
// SCROLL REVEAL ANIMATION
// ==========================================
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Anima solo alla prima visualizzazione
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    });

    reveals.forEach(reveal => {
        observer.observe(reveal);
    });
}

// ==========================================
// LIGHTBOX LOGIC
// ==========================================
let currentPhotoIndex = 0;
let galleryData = [];

function openLightbox(index, photos) {
    galleryData = photos;
    currentPhotoIndex = index;
    const lightbox = document.getElementById('lightbox');
    
    // Disabilita lo scroll del background
    document.body.style.overflow = 'hidden';
    
    lightbox.style.display = 'flex';
    // Timeout breve per far sì che il display:flex venga applicato prima di cambiare opacity
    setTimeout(() => {
        lightbox.classList.add('active');
    }, 10);
    
    updateLightboxImage();
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    
    // Ripristina lo scroll
    document.body.style.overflow = '';

    setTimeout(() => {
        lightbox.style.display = 'none';
        document.getElementById('lightbox-img').src = ''; // Pulisce il src
    }, 400); // Attende la fine della transizione CSS
}

function updateLightboxImage() {
    const lightboxImg = document.getElementById('lightbox-img');
    lightboxImg.src = galleryData[currentPhotoIndex];
}

function changeLightboxImage(direction) {
    currentPhotoIndex += direction;
    // Cicla se superati i limiti
    if (currentPhotoIndex < 0) {
        currentPhotoIndex = galleryData.length - 1;
    } else if (currentPhotoIndex >= galleryData.length) {
        currentPhotoIndex = 0;
    }
    updateLightboxImage();
}

function initLightboxEvents() {
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const lightbox = document.getElementById('lightbox');
    
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', () => changeLightboxImage(-1));
    if (lightboxNext) lightboxNext.addEventListener('click', () => changeLightboxImage(1));
    
    // Chiudi cliccando fuori dall'immagine
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // Controlli da tastiera
    document.addEventListener('keydown', (e) => {
        if (!lightbox || !lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') changeLightboxImage(-1);
        if (e.key === 'ArrowRight') changeLightboxImage(1);
    });
}
