// Performance fix: the homepage has two <video> elements (one inside
// .desktop-only, one inside .mobile-only) so each layout gets its own
// swatch, but CSS display:none does NOT stop a browser from fetching
// video data for a hidden element — so both were downloading the same
// ~11MB file at once, especially painful on mobile. Fix: videos ship
// with no <source> and preload="none"; this picks whichever one
// actually matches the current layout and is the only one that loads.
function loadResponsiveVideo() {
  const isMobile = window.matchMedia('(max-width: 700px)').matches;
  document.querySelectorAll('video[data-video-src]').forEach((video) => {
    if (video.querySelector('source')) return; // already loaded

    // Only pages with BOTH a .desktop-only and .mobile-only version of
    // this same video need the dedup check (that's what caused the
    // double-download bug). A page with just one <video> — like the
    // bento layout's single Job Stories swatch — has nothing to dedupe
    // against, so it should just always load.
    const inMobileBlock = video.closest('.mobile-only');
    const inDesktopBlock = video.closest('.desktop-only');
    if (inMobileBlock || inDesktopBlock) {
      const shouldLoad = inMobileBlock ? isMobile : !isMobile;
      if (!shouldLoad) return;
    }

    const source = document.createElement('source');
    source.src = video.dataset.videoSrc;
    source.type = 'video/mp4';
    video.appendChild(source);
    video.load();
  });
}

// Google review slideshow mockup (v2 homepage): rotates a few fake
// reviews inside any [data-review-rotator] card. Purely a mockup —
// the card still links to reviews.html for the real thing later.
function buildReviewRotator() {
  const cards = document.querySelectorAll('[data-review-rotator]');
  if (!cards.length) return;

  const reviews = [
    { name: 'Jamie R.', quote: 'On time, careful with our floors, and the paint job looks incredible.' },
    { name: 'Marcus T.', quote: "Best contractor experience we've had — clear communication start to finish." },
    { name: 'Elena P.', quote: 'They scraped our old popcorn ceilings and everything looks brand new.' },
    { name: 'Dana K.', quote: 'Showed up exactly when promised. Would hire again in a heartbeat.' }
  ];

  cards.forEach((body) => {
    // only the quote+author fade — the card itself (bg, title, stars,
    // border) stays put and never flickers
    let i = 0;
    const fadeEl = body.querySelector('.review-fade');
    const quoteEl = body.querySelector('.review-quote');
    const authorEl = body.querySelector('.review-author');
    if (!fadeEl || !quoteEl || !authorEl) return;

    setInterval(() => {
      i = (i + 1) % reviews.length;
      fadeEl.style.opacity = '0';
      setTimeout(() => {
        quoteEl.textContent = '“' + reviews[i].quote + '”';
        authorEl.textContent = '— ' + reviews[i].name;
        fadeEl.style.opacity = '1';
      }, 300);
    }, 4000);
  });
}

// Real fan deck (v2 homepage): generates ~30 thin single-color strips
// swept through a real color-family progression (blue -> teal -> green
// -> olive -> gold -> brown -> mauve -> gray), with uneven lengths for
// the stepped-band look real decks have where shorter strips end and
// reveal the one behind. Purely decorative — no links, no interaction.
function buildRealFanDeck() {
  const strips = document.querySelector('[data-real-fan-strips]');
  if (!strips) return;

  const count = 32;
  const hueStops = [222, 205, 190, 168, 140, 105, 78, 52, 34, 18, 355, 325, 262];
  const nameBank = [
    ['6014', 'Lull'], ['6156', 'Sensible'], ['6157', 'Favorite'], ['6136', 'Harmony'],
    ['6143', 'Basket Beige'], ['9116', 'Serengeti'], ['6162', 'Ancient Marble'], ['7008', 'Alabaster']
  ];
  let nameI = 0;

  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const pos = t * (hueStops.length - 1);
    const idx = Math.min(Math.floor(pos), hueStops.length - 2);
    const frac = pos - idx;
    const hue = hueStops[idx] + (hueStops[idx + 1] - hueStops[idx]) * frac;
    const sat = 22 + Math.sin(t * Math.PI) * 22;
    const light = 62 - Math.sin(t * Math.PI) * 16;
    const angle = -78 + t * 84;
    const shorter = i % 5 === 3;
    const height = shorter ? 430 : 490;

    const strip = document.createElement('div');
    strip.className = 'real-fan-strip';
    strip.style.setProperty('--r', angle.toFixed(1) + 'deg');
    strip.style.height = height + 'px';
    strip.style.background = 'hsl(' + hue.toFixed(0) + ', ' + sat.toFixed(0) + '%, ' + light.toFixed(0) + '%)';
    strip.style.zIndex = String(i);

    if (i % 3 === 1) {
      const pair = nameBank[nameI % nameBank.length];
      nameI++;
      const label = document.createElement('div');
      label.className = 'real-fan-label';
      label.innerHTML = '<span class="rf-code">SW ' + pair[0] + '</span><span class="rf-name">' + pair[1] + '</span>';
      strip.appendChild(label);
    }

    strips.appendChild(strip);
  }
}

// Nav overlay toggle
document.addEventListener('DOMContentLoaded', () => {
  buildRealFanDeck();
  buildReviewRotator();
  loadResponsiveVideo();

  const toggle = document.querySelector('[data-nav-toggle]');
  const overlay = document.querySelector('[data-nav-overlay]');
  const close = document.querySelector('[data-nav-close]');

  if (toggle && overlay) {
    toggle.addEventListener('click', () => overlay.classList.add('open'));
  }
  if (close && overlay) {
    close.addEventListener('click', () => overlay.classList.remove('open'));
  }

  // scroll-triggered fade-up reveal — content is visible by default in CSS;
  // only arm the hidden/animate-in state once we know JS + IntersectionObserver work.
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = document.querySelectorAll('.reveal');
  if (!prefersReduced && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => {
      el.classList.add('armed');
      io.observe(el);
    });
  }

  // monogram pattern panel generator (Get Quote page)
  const pattern = document.querySelector('[data-pattern]');
  if (pattern) {
    const glyphs = ['S', 'P', 'P', '◇', 'S', '□', 'P', '◇'];
    const count = 90;
    let html = '';
    for (let i = 0; i < count; i++) {
      html += `<span>${glyphs[i % glyphs.length]}</span>`;
    }
    pattern.innerHTML = html;
  }

  // job stories search — client-side filter over data-search on each card.
  // Fine for a handful of stories; at real scale (100+) this is the spot
  // that gets swapped for an indexed search like Pagefind.
  const storySearch = document.querySelector('[data-story-search]');
  if (storySearch) {
    const cards = document.querySelectorAll('.story-card');
    const emptyMsg = document.querySelector('[data-story-empty]');
    storySearch.addEventListener('input', () => {
      const q = storySearch.value.trim().toLowerCase();
      let visible = 0;
      cards.forEach((card) => {
        const match = !q || (card.dataset.search || '').includes(q);
        card.classList.toggle('hidden', !match);
        if (match) visible++;
      });
      if (emptyMsg) emptyMsg.style.display = visible === 0 ? 'block' : 'none';
    });
  }

  // photo carousel: click a thumbnail to swap the main display's photo.
  // No-JS fallback: the first photo (already in the markup) just stays put.
  document.querySelectorAll('[data-carousel]').forEach((carousel) => {
    const main = carousel.querySelector('[data-carousel-main]');
    if (!main) return;
    const stageEl = main.querySelector('.stage');
    const captionEl = main.querySelector('.caption');

    carousel.querySelectorAll('.carousel-thumb').forEach((thumb) => {
      thumb.addEventListener('click', () => {
        stageEl.textContent = thumb.dataset.stage;
        captionEl.textContent = thumb.dataset.caption;
        if (thumb.dataset.img) main.style.backgroundImage = `url('${thumb.dataset.img}')`;

        carousel.querySelectorAll('.carousel-thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
      });
    });
  });

  // before/after drag-to-compare sliders. No-JS fallback: --pos stays at the
  // CSS default (50%), so the slider still shows a static half-and-half split.
  document.querySelectorAll('.ba-slider').forEach((slider) => {
    const setPos = (clientX) => {
      const rect = slider.getBoundingClientRect();
      const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
      slider.style.setProperty('--pos', pct + '%');
    };

    let dragging = false;

    slider.addEventListener('pointerdown', (e) => {
      dragging = true;
      slider.classList.add('dragging');
      if (slider.setPointerCapture) slider.setPointerCapture(e.pointerId);
      setPos(e.clientX);
    });
    slider.addEventListener('pointermove', (e) => {
      if (dragging) setPos(e.clientX);
    });
    slider.addEventListener('pointerup', () => {
      dragging = false;
      slider.classList.remove('dragging');
    });
    slider.addEventListener('pointercancel', () => {
      dragging = false;
      slider.classList.remove('dragging');
    });

    slider.setAttribute('tabindex', '0');
    slider.setAttribute('role', 'slider');
    slider.setAttribute('aria-label', 'Drag to compare before and after');
    slider.setAttribute('aria-valuemin', '0');
    slider.setAttribute('aria-valuemax', '100');
    slider.addEventListener('keydown', (e) => {
      const current = parseFloat(slider.style.getPropertyValue('--pos')) || 50;
      if (e.key === 'ArrowLeft') slider.style.setProperty('--pos', Math.max(0, current - 5) + '%');
      if (e.key === 'ArrowRight') slider.style.setProperty('--pos', Math.min(100, current + 5) + '%');
    });
  });
});
