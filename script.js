/* ============================================================
   ADRIÁN CONTRERAS — PORTFOLIO
   ============================================================ */

/* ---------------- Timeline scrubber (barra de progreso) ---------------- */
const scrubFill = document.getElementById('scrubFill');
function updateScrub() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrubFill.style.width = `${pct}%`;
}
window.addEventListener('scroll', updateScrub, { passive: true });
updateScrub();

/* ---------------- Nav con efecto vidrio (iOS) al hacer scroll ---------------- */
const topnav = document.getElementById('topnav');
function updateNav() {
  if (window.scrollY > 40) {
    topnav.classList.add('scrolled');
  } else {
    topnav.classList.remove('scrolled');
  }
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

/* ---------------- Hero: la foto "baja" y se difumina al hacer scroll ---------------- */
const heroPortrait = document.getElementById('heroPortrait');
const heroSection = document.getElementById('hero');

function updateHeroParallax() {
  if (!heroPortrait || !heroSection) return;
  const heroHeight = heroSection.offsetHeight;
  const progress = Math.min(Math.max(window.scrollY / heroHeight, 0), 1);

  const translateY = progress * 220;
  const opacity = Math.max(1 - progress * 1.5, 0);
  const blur = progress * 18;

  heroPortrait.style.transform = `translate(-50%, ${translateY}px)`;
  heroPortrait.style.opacity = opacity;
  heroPortrait.style.filter = `blur(${blur}px)`;
}
window.addEventListener('scroll', updateHeroParallax, { passive: true });
updateHeroParallax();

/* ---------------- Scroll reveal ("efecto Apple") ----------------
   Se usa un chequeo manual de posición (en vez de IntersectionObserver)
   porque IntersectionObserver puede fallar en detectar elementos dentro
   de ancestros con position:sticky (como los paneles de galería). */
const revealEls = Array.from(document.querySelectorAll('.reveal'));

function checkReveal() {
  const triggerLine = window.innerHeight * 0.92;
  revealEls.forEach((el) => {
    if (el.classList.contains('is-visible')) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < triggerLine && rect.bottom > 0) {
      el.classList.add('is-visible');
    }
  });
}
window.addEventListener('scroll', checkReveal, { passive: true });
window.addEventListener('resize', checkReveal);
checkReveal();

/* ---------------- Reveal del carrusel horizontal: del centro hacia afuera ---------------- */
const horizontalGallery = document.querySelector('.horizontal-swiper');
if (horizontalGallery) {
  function checkGalleryReveal() {
    if (horizontalGallery.classList.contains('gallery-revealed')) return;
    const rect = horizontalGallery.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85 && rect.bottom > 0) {
      horizontalGallery.classList.add('gallery-revealed');
    }
  }
  window.addEventListener('scroll', checkGalleryReveal, { passive: true });
  window.addEventListener('resize', checkGalleryReveal);
  checkGalleryReveal();
}


/* ============================================================
   GALERÍAS DE VIDEO (YouTube)
   Cada galería se inicializa de forma INDEPENDIENTE (try/catch propio)
   para que un problema en una (p. ej. pocos slides para el modo loop)
   nunca bloquee la reproducción de la otra.
   ============================================================ */

const SOCIAL_VIDEOS = [
  { id: 'L57F5wnJDDg', title: 'Academia de Baile',       desc: 'Edición sencilla con algunos cortes dinámicos.' },
  { id: 'N66wfO7IeEE', title: 'Veterinaria Citológica',  desc: 'Edición dinámica, elementos visuales, imágenes y subtítulos de apoyo.' },
  { id: 'rsDo3o_ATu8', title: 'Creación de Contenido',   desc: 'Edición con cortes y texto dinámicos.' },
  { id: 'K5wx1jOQfig', title: 'Vlogs Temáticos',         desc: 'Texto y cortes dinámicos, inserts, storytelling.' },
  { id: 'uQwH2773EG0', title: 'Postres de Pastelería',   desc: 'Montaje sincronizado exactamente al ritmo de la música.' },
  { id: 'LpH9Fh-CmB4', title: 'Publicidad de Bebida',    desc: 'Animación de imágenes, textos dinámicos y keyframes.' },
  { id: 'OmDUC_KMycw', title: 'Clase de Baile',          desc: 'Video orgánico educativo. Animación de texto y ritmo de narrativa.' },
  { id: 't8yYE-fkDWs', title: 'Video Temático',          desc: 'Cortes al compás de la música. Máscara de recorte.' },
];

const HORIZONTAL_VIDEOS = [
  { id: 'jlDMTkhvpNU', title: 'Videoclip',    desc: 'Dance cover.' },
  { id: '3mqT58R6yyc', title: 'Educativo',    desc: 'Contenido educativo.' },
  { id: 'I10CYuVDzMI', title: 'Vlog',         desc: 'Un día de rodaje.' },
  { id: 'GLdKuse231c', title: 'Cortometraje', desc: 'Alanna — short film.' },
];

function renderSlides(containerSelector, dataArray) {
  const wrapper = document.querySelector(`${containerSelector} .swiper-wrapper`);
  if (!wrapper) return;

  dataArray.forEach((item, i) => {
    const slide = document.createElement('div');
    slide.className = 'swiper-slide';
    slide.dataset.youtubeId = item.id;
    slide.dataset.title = item.title;
    slide.dataset.desc = item.desc;
    slide.dataset.index = String(i + 1).padStart(2, '0');

    slide.innerHTML = `
      <div class="slide-media">
        <img class="poster"
             src="https://img.youtube.com/vi/${item.id}/hqdefault.jpg"
             alt="${item.title}"
             loading="lazy"
             onerror="this.style.opacity='0'">
      </div>
      <div class="slide-play" aria-hidden="true">
        <svg viewBox="0 0 60 60" fill="none">
          <circle cx="30" cy="30" r="29" stroke="white" stroke-width="1.5" opacity="0.6"/>
          <path d="M24 19L42 30L24 41V19Z" fill="white"/>
        </svg>
      </div>
    `;
    wrapper.appendChild(slide);
  });
}

/* ---------------- Caption externa (con blur) debajo de la paginación ---------------- */
function updateCaption(captionEl, slide) {
  if (!captionEl || !slide) return;
  const idxEl = captionEl.querySelector('.slide-index');
  const titleEl = captionEl.querySelector('.slide-title');
  const descEl = captionEl.querySelector('.slide-desc');
  if (idxEl) idxEl.textContent = slide.dataset.index || '';
  if (titleEl) titleEl.textContent = slide.dataset.title || '';
  if (descEl) descEl.textContent = slide.dataset.desc || '';
  captionEl.classList.add('is-visible');
}

function setupCaption(swiperInstance, captionId) {
  const captionEl = document.getElementById(captionId);
  const update = () => {
    const slide = swiperInstance.slides && swiperInstance.slides[swiperInstance.activeIndex];
    if (slide) updateCaption(captionEl, slide);
  };
  swiperInstance.on('slideChange', update);
  swiperInstance.on('transitionEnd', update);
  update();
  // Llamada extra diferida por si el índice aún no está asentado
  // justo después de construir el swiper en modo loop.
  setTimeout(update, 60);
}

/* playSlide: crea el iframe de YouTube.
   mode "hover"  -> preview silenciosa (sin controles) al pasar el cursor.
   mode "click"  -> reproducción real con sonido (al hacer click/tap). */
function playSlide(slide, { muted = true, mode = 'hover' } = {}) {
  if (!slide) return;
  const media = slide.querySelector('.slide-media');
  if (!media) return;
  const id = slide.dataset.youtubeId;
  if (!id || id.startsWith('YOUTUBE_ID')) return; // placeholder aún no reemplazado

  const existing = media.querySelector('iframe');
  if (existing && existing.dataset.mode === mode) return; // ya está en ese modo
  if (existing) existing.remove();

  const iframe = document.createElement('iframe');
  const muteParam = muted ? 1 : 0;
  iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1&mute=${muteParam}&loop=1&playlist=${id}&controls=${muted ? 0 : 1}&modestbranding=1&rel=0&playsinline=1`;
  iframe.allow = 'autoplay; encrypted-media; picture-in-picture';
  iframe.setAttribute('frameborder', '0');
  iframe.dataset.mode = mode;
  media.appendChild(iframe);
}

function stopSlide(slide, onlyMode = null) {
  if (!slide) return;
  const iframe = slide.querySelector('iframe');
  if (!iframe) return;
  if (onlyMode && iframe.dataset.mode !== onlyMode) return;
  iframe.remove();
}

function setupPlayback(swiperInstance) {
  const el = swiperInstance.el;
  let lastRealIndex = swiperInstance.realIndex;

  // Hover (escritorio): preview silenciosa de la tarjeta central
  el.addEventListener('mouseenter', () => {
    playSlide(el.querySelector('.swiper-slide-active'), { muted: true, mode: 'hover' });
  });
  el.addEventListener('mouseleave', () => {
    el.querySelectorAll('.swiper-slide').forEach((s) => stopSlide(s, 'hover'));
  });

  // Click / tap (escritorio y móvil), delegado a nivel de contenedor:
  // más fiable que depender del evento sintético "click" de Swiper.
  el.addEventListener('click', (e) => {
    const slide = e.target.closest('.swiper-slide');
    if (!slide || !el.contains(slide)) return;

    if (!slide.classList.contains('swiper-slide-active')) return;

    const media = slide.querySelector('.slide-media');
    const playing = media && media.querySelector('iframe[data-mode="click"]');
    if (playing) {
      stopSlide(slide);
    } else {
      playSlide(slide, { muted: false, mode: 'click' });
    }
  });

  // IMPORTANTE: en modo loop, Swiper puede disparar "slideChange" de forma
  // interna (al re-normalizar slides duplicados) SIN que el usuario haya
  // cambiado realmente de tarjeta — por ejemplo justo después de un click,
  // lo que borraba el video recién creado (pantalla negra y vuelta al
  // póster). Por eso solo detenemos la reproducción si el índice REAL
  // cambió de verdad.
  swiperInstance.on('slideChange', () => {
    if (swiperInstance.realIndex === lastRealIndex) return;
    lastRealIndex = swiperInstance.realIndex;
    el.querySelectorAll('.swiper-slide').forEach((s) => stopSlide(s));
  });
}

const swiperConfig = {
  effect: 'coverflow',
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: 'auto',
  loop: true,
  loopAdditionalSlides: 4,
  slideToClickedSlide: true,
  coverflowEffect: {
    rotate: 0,
    stretch: 0,
    depth: 260,
    modifier: 1.4,
    slideShadows: false,
  },
};

/* Inicializa una galería completa de forma aislada: si algo falla aquí
   (p. ej. Swiper no cargó, o hay muy pocos slides para el loop), sólo
   afecta a ESTA galería — la otra sigue funcionando con normalidad. */
function initGallery({ selector, data, captionId }) {
  try {
    renderSlides(selector, data);
    const swiper = new Swiper(selector, {
      ...swiperConfig,
      pagination: { el: `${selector} .swiper-pagination`, clickable: true },
    });
    setupCaption(swiper, captionId);
    setupPlayback(swiper);
    return swiper;
  } catch (err) {
    console.warn(`No se pudo inicializar la galería "${selector}":`, err);
    return null;
  }
}

initGallery({ selector: '.social-swiper', data: SOCIAL_VIDEOS, captionId: 'captionSocial' });
initGallery({ selector: '.horizontal-swiper', data: HORIZONTAL_VIDEOS, captionId: 'captionHorizontal' });
