// ── Hero Gallery Component ───────────────────────────────────────────

export function initGallery() {
  const container = document.getElementById('hero-gallery');
  if (!container) return;

  // 1. Swap these with your actual image paths from the /assets folder
  const images = [
    { src: '/assets/images/gallery-1.jpeg', 
        alt: 'The Couple',
        position: 'center'
    },
    { src: '/assets/images/gallery-3.jpeg', 
        alt: 'The Ring',
        position: 'center'
    },
    { src: '/assets/images/gallery-2.png', 
        alt: 'Engagement shoot',
        position: '60% 80%'
     },
  ];
  
  const focusIndex = 1; // The middle image starts expanded

  // 2. Build the strip
  const strip = document.createElement('div');
  strip.className = 'gallery-strip';

  images.forEach((img, ii) => {
    const thumb = document.createElement('div');
    thumb.className = 'gallery-thumb loading' + (ii === focusIndex ? ' expanded' : '');

    const el = document.createElement('img');
    el.alt = img.alt;
    el.loading = 'lazy';
    el.onload = () => thumb.classList.remove('loading');
    el.onerror = () => thumb.classList.remove('loading');
    el.src = img.src;

    el.style.objectPosition = img.position || 'center center';

    thumb.appendChild(el);

    // Hover logic
    thumb.addEventListener('mouseenter', () => {
      strip.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('expanded'));
      thumb.classList.add('expanded');
    });

    // Lightbox click
    thumb.addEventListener('click', () => openLightbox(img.src, img.alt));

    strip.appendChild(thumb);
  });

  // Reset to default on mouse leave
  strip.addEventListener('mouseleave', () => {
    strip.querySelectorAll('.gallery-thumb').forEach((t, ii) => {
      t.classList.toggle('expanded', ii === focusIndex);
    });
  });

  container.appendChild(strip);

  // 3. Lightbox Logic
  const lightbox = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lightbox-img');
  const lbCap    = document.getElementById('lightbox-caption');
  const lbClose  = document.getElementById('lightbox-close');

  function openLightbox(src, alt) {
    lbImg.src = src;
    lbImg.alt = alt;
    lbCap.textContent = alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lightbox) lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
}