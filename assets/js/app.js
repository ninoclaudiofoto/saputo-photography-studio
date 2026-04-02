document.addEventListener('DOMContentLoaded', () => {
    // Imposta l'anno corrente nel footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Utilizza la variabile globale siteData dal file data.js
    if (typeof siteData !== 'undefined') {
        populateUI(siteData);
    } else {
        console.error('Errore: dati non trovati');
        document.getElementById('gallery-grid').innerHTML = '<p>Si è verificato un errore nel caricamento del portfolio.</p>';
    }
});

function populateUI(data) {
    // Popola informazioni generali
    document.getElementById('ui-name').textContent = data.name;
    document.title = `${data.name} | Photography`;
    
    // Popola Navbar e Contatti Testuali
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
    
    // Popola Bottoni Contatti
    const btnMail = document.getElementById('btn-mail');
    btnMail.href = `mailto:${data.email}`;
    
    const btnWhatsapp = document.getElementById('btn-whatsapp');
    btnWhatsapp.href = `https://wa.me/${data.whatsapp}`;
    
    const linkInstagram = document.getElementById('link-instagram');
    linkInstagram.href = data.instagram;

    // Popola Foto in Evidenza (Hero)
    const featuredGrid = document.getElementById('featured-grid');
    if (data.featured_photos && data.featured_photos.length > 0) {
        data.featured_photos.forEach(photoPath => {
            const item = document.createElement('div');
            item.className = 'hero-item';
            
            const img = document.createElement('img');
            img.src = photoPath;
            img.alt = 'Foto in evidenza';
            // Eager per la l'hero, lazy per tutto il resto tranne la primissima (gestito nei CSS o HTML)
            img.loading = 'eager'; 
            
            item.appendChild(img);
            featuredGrid.appendChild(item);
        });
    }

    // Popola Galleria (Masonry)
    const galleryGrid = document.getElementById('gallery-grid');
    if (data.gallery_photos && data.gallery_photos.length > 0) {
        data.gallery_photos.forEach(photoPath => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            
            const img = document.createElement('img');
            img.src = photoPath;
            img.alt = 'Foto galleria';
            img.loading = 'lazy'; // Ottimizzazione SEO e Performance
            
            item.appendChild(img);
            galleryGrid.appendChild(item);
        });
    } else {
        galleryGrid.innerHTML = '<p>Nessuna foto trovata nella galleria.</p>';
    }
}
