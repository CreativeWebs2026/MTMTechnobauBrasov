(function(){
  "use strict";
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* true only when scroll-driven motion should actually run: not reduced-motion,
     and not a phone-width viewport. Phones skip the reveal/gallery/proces scroll
     observers entirely (matches .js-reveal's CSS gate), so there's no per-scroll
     work happening at all, not just no visible animation. */
  var desktopMotion = !reduceMotion && window.matchMedia('(min-width: 768px)').matches;
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---- WhatsApp link: phones deep-link straight into the app via wa.me;
     desktop skips wa.me's "open app or web" chooser and goes straight to WhatsApp Web ---- */
  var isMobileDevice = /Android|iPhone|iPad|iPod|IEMobile|BlackBerry|Opera Mini/i.test(navigator.userAgent);
  function waLinkFor(text){
    var encoded = encodeURIComponent(text);
    return isMobileDevice
      ? 'https://wa.me/40747383692?text=' + encoded
      : 'https://web.whatsapp.com/send?phone=40747383692&text=' + encoded;
  }
  var fabWhatsapp = document.getElementById('fabWhatsapp');
  if(fabWhatsapp){
    fabWhatsapp.href = waLinkFor('Bună, aș dori o ofertă pentru un proiect de construcții.');
  }

  /* ---- cookie consent: banner + granular settings modal.
     Stores the visitor's choice so nothing real needs to be gated today
     (no analytics/marketing scripts are wired in yet), but the mechanism
     is ready for whenever those get added. ---- */
  var COOKIE_KEY = 'mtm-cookie-prefs';
  var cookieBanner = document.getElementById('cookieBanner');
  var cookieModalBackdrop = document.getElementById('cookieModalBackdrop');
  var toggleAnalytics = document.getElementById('toggleAnalytics');
  var toggleMarketing = document.getElementById('toggleMarketing');
  var togglePreferences = document.getElementById('togglePreferences');
  var mapFrame = document.getElementById('mapFrame');
  var mapLoadBtn = document.getElementById('mapLoadBtn');

  function getSavedPrefs(){
    try {
      var raw = localStorage.getItem(COOKIE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch(e){ return null; }
  }
  function savePrefs(prefs){
    try { localStorage.setItem(COOKIE_KEY, JSON.stringify(prefs)); } catch(e){}
  }
  function showBanner(){ if(cookieBanner) cookieBanner.classList.add('is-visible'); }
  function hideBanner(){ if(cookieBanner) cookieBanner.classList.remove('is-visible'); }

  /* the Maps embed is the one real thing on this page that can set a
     cookie (from Google), so it only loads once "marketing" is allowed,
     either via a full accept or by asking for it directly. */
  function loadMap(){
    if(!mapFrame || mapFrame.querySelector('iframe')) return;
    var iframe = document.createElement('iframe');
    iframe.src = 'https://www.google.com/maps?q=Europe+Residence+Strada+Avram+Iancu+48A+500086+Brasov&output=embed';
    iframe.title = 'Locația MTM Technobau pe hartă';
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    mapFrame.classList.remove('map-placeholder');
    mapFrame.innerHTML = '';
    mapFrame.appendChild(iframe);
  }
  if(mapLoadBtn) mapLoadBtn.addEventListener('click', function(){
    var prefs = getSavedPrefs() || { analytics:false, marketing:false, preferences:false };
    prefs.marketing = true;
    savePrefs(prefs);
    loadMap();
  });
  var initialPrefs = getSavedPrefs();
  if(initialPrefs && initialPrefs.marketing) loadMap();
  function openCookieModal(){
    var prefs = getSavedPrefs() || { analytics:false, marketing:false, preferences:false };
    if(toggleAnalytics) toggleAnalytics.checked = !!prefs.analytics;
    if(toggleMarketing) toggleMarketing.checked = !!prefs.marketing;
    if(togglePreferences) togglePreferences.checked = !!prefs.preferences;
    if(cookieModalBackdrop){ cookieModalBackdrop.classList.add('is-open'); document.body.style.overflow = 'hidden'; }
  }
  function closeCookieModal(){
    if(cookieModalBackdrop){ cookieModalBackdrop.classList.remove('is-open'); document.body.style.overflow = ''; }
    if(!getSavedPrefs()) showBanner();
  }

  if(!getSavedPrefs()){
    setTimeout(showBanner, 1200);
  }

  var cookieAcceptAll = document.getElementById('cookieAcceptAll');
  var cookieRejectAll = document.getElementById('cookieRejectAll');
  var cookieCustomize = document.getElementById('cookieCustomize');
  if(cookieAcceptAll) cookieAcceptAll.addEventListener('click', function(){
    savePrefs({ analytics:true, marketing:true, preferences:true }); hideBanner(); loadMap();
  });
  if(cookieRejectAll) cookieRejectAll.addEventListener('click', function(){
    savePrefs({ analytics:false, marketing:false, preferences:false }); hideBanner();
  });
  if(cookieCustomize) cookieCustomize.addEventListener('click', openCookieModal);

  var cookieModalClose = document.getElementById('cookieModalClose');
  var cookieSavePrefs = document.getElementById('cookieSavePrefs');
  var cookieAcceptAllModal = document.getElementById('cookieAcceptAllModal');
  var cookieRejectOptional = document.getElementById('cookieRejectOptional');
  if(cookieModalClose) cookieModalClose.addEventListener('click', closeCookieModal);
  if(cookieModalBackdrop) cookieModalBackdrop.addEventListener('click', function(e){
    if(e.target === cookieModalBackdrop) closeCookieModal();
  });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && cookieModalBackdrop && cookieModalBackdrop.classList.contains('is-open')) closeCookieModal();
  });
  if(cookieSavePrefs) cookieSavePrefs.addEventListener('click', function(){
    var marketingOn = !!(toggleMarketing && toggleMarketing.checked);
    savePrefs({
      analytics: !!(toggleAnalytics && toggleAnalytics.checked),
      marketing: marketingOn,
      preferences: !!(togglePreferences && togglePreferences.checked)
    });
    closeCookieModal(); hideBanner();
    if(marketingOn) loadMap();
  });
  if(cookieAcceptAllModal) cookieAcceptAllModal.addEventListener('click', function(){
    savePrefs({ analytics:true, marketing:true, preferences:true }); closeCookieModal(); hideBanner(); loadMap();
  });
  if(cookieRejectOptional) cookieRejectOptional.addEventListener('click', function(){
    savePrefs({ analytics:false, marketing:false, preferences:false }); closeCookieModal(); hideBanner();
  });

  /* ---- scroll progress + nav state ---- */
  var progress = document.getElementById('scrollProgress');
  var nav = document.getElementById('siteNav');
  function onScroll(){
    var doc = document.documentElement;
    var scrolled = doc.scrollTop || document.body.scrollTop;
    var height = doc.scrollHeight - doc.clientHeight;
    progress.style.width = (height > 0 ? (scrolled / height) * 100 : 0) + '%';
    nav.classList.toggle('scrolled', scrolled > 40);
  }
  document.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  /* ---- mobile menu ---- */
  var burger = document.getElementById('navBurger');
  var mobileMenu = document.getElementById('mobileMenu');
  function closeMenu(){
    burger.classList.remove('is-open'); burger.setAttribute('aria-expanded','false'); mobileMenu.classList.remove('is-open');
  }
  burger.addEventListener('click', function(){
    var open = mobileMenu.classList.toggle('is-open');
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open ? 'true':'false');
  });
  mobileMenu.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeMenu(); });


  /* ---- reveal on scroll ---- */
  var revealEls = document.querySelectorAll('.reveal, .why-card');
  if('IntersectionObserver' in window && desktopMotion){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold:0.05, rootMargin:'0px 0px 10% 0px' });
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('is-visible'); });
  }

  /* ---- gallery: images appear one by one on scroll down; once visible, they
     stay visible (no animation when scrolling back up past them) ---- */
  var galleryRevealItems = Array.prototype.slice.call(document.querySelectorAll('.gallery-reveal'));
  galleryRevealItems.forEach(function(el, i){ el.style.transitionDelay = (i * 80) + 'ms'; });
  if('IntersectionObserver' in window && desktopMotion){
    var ioGallery = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          ioGallery.unobserve(entry.target);
        }
      });
    }, { threshold:0.2 });
    galleryRevealItems.forEach(function(el){ ioGallery.observe(el); });
  } else {
    galleryRevealItems.forEach(function(el){ el.classList.add('is-visible'); });
  }

  /* ---- reviews: on mobile, prev/next arrows swap a single active card.
     Desktop keeps the floating marquee and simply ignores these classes/clicks
     since the arrows are hidden there and .is-active has no effect above 640px. ---- */
  var reviewCards = Array.prototype.slice.call(document.querySelectorAll('.review-card:not([aria-hidden="true"])'));
  var reviewIndex = 0;
  function showReview(i){
    reviewIndex = (i + reviewCards.length) % reviewCards.length;
    reviewCards.forEach(function(card, idx){ card.classList.toggle('is-active', idx === reviewIndex); });
  }
  var reviewsPrev = document.getElementById('reviewsPrev');
  var reviewsNext = document.getElementById('reviewsNext');
  if(reviewsPrev) reviewsPrev.addEventListener('click', function(){ showReview(reviewIndex - 1); });
  if(reviewsNext) reviewsNext.addEventListener('click', function(){ showReview(reviewIndex + 1); });



  /* ---- gallery lightbox ---- */
  var galleryItems = Array.prototype.slice.call(document.querySelectorAll('.gallery-item'));
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxCap = document.getElementById('lightboxCap');
  var lbIndex = 0;
  function openLightbox(i){
    lbIndex = i;
    var item = galleryItems[i];
    var img = item.querySelector('img');
    lightboxImg.src = img.src; lightboxImg.alt = img.alt;
    lightboxCap.textContent = item.getAttribute('data-caption') || '';
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox(){
    lightbox.classList.remove('is-open'); document.body.style.overflow = '';
  }
  function stepLightbox(dir){ openLightbox((lbIndex + dir + galleryItems.length) % galleryItems.length); }
  galleryItems.forEach(function(item, i){ item.addEventListener('click', function(){ openLightbox(i); }); });
  document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
  document.getElementById('lightboxPrev').addEventListener('click', function(){ stepLightbox(-1); });
  document.getElementById('lightboxNext').addEventListener('click', function(){ stepLightbox(1); });
  lightbox.addEventListener('click', function(e){ if(e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', function(e){
    if(!lightbox.classList.contains('is-open')) return;
    if(e.key === 'Escape') closeLightbox();
    if(e.key === 'ArrowRight') stepLightbox(1);
    if(e.key === 'ArrowLeft') stepLightbox(-1);
  });

  /* ---- opening hours: highlight today ---- */
  var todayIdx = new Date().getDay();
  var todayRow = document.querySelector('#hoursTable tr[data-day="' + todayIdx + '"]');
  if(todayRow) todayRow.classList.add('today');

  /* ---- contact form: validate, then hand off to WhatsApp or email with a ready-made message ---- */
  var form = document.getElementById('contactForm');
  var formSuccess = document.getElementById('formSuccess');
  var formSuccessText = document.getElementById('formSuccessText');
  var CONTACT_EMAIL = 'mtm.technobau@yahoo.com';
  var validators = {
    nume: function(v){ return v.trim().length >= 2; },
    telefon: function(v){ return /^[0-9+\s().-]{7,}$/.test(v.trim()); },
    serviciu: function(v){ return v.trim().length > 0; },
    mesaj: function(v){ return v.trim().length >= 30; }
  };
  function validateForm(){
    var valid = true;
    Object.keys(validators).forEach(function(name){
      var input = form.elements[name];
      var field = input.closest('.field');
      var ok = validators[name](input.value);
      field.classList.toggle('has-error', !ok);
      if(!ok) valid = false;
    });
    return valid;
  }
  function readFormValues(){
    return {
      nume: form.elements.nume.value.trim(),
      telefon: form.elements.telefon.value.trim(),
      serviciu: form.elements.serviciu.value,
      mesaj: form.elements.mesaj.value.trim()
    };
  }
  function showSuccessAndReset(channelText){
    if(formSuccessText) formSuccessText.textContent = 'Îți pregătim mesajul. ' + channelText;
    formSuccess.classList.add('is-visible');
    formSuccess.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block:'center' });
    form.reset();
    form.querySelectorAll('.field').forEach(function(f){ f.classList.remove('has-error'); });
  }
  form.addEventListener('submit', function(e){
    e.preventDefault();
    if(validateForm()){
      var v = readFormValues();
      var text = 'Bună, mă numesc ' + v.nume + ' (' + v.telefon + ').\n' +
        'Sunt interesat/ă de: ' + v.serviciu + '.\n' +
        'Detalii: ' + v.mesaj;
      var waLink = waLinkFor(text);
      showSuccessAndReset('Te trimitem spre WhatsApp.');
      setTimeout(function(){ window.location.href = waLink; }, 400);
    }
  });
  var emailSubmitBtn = document.getElementById('emailSubmitBtn');
  if(emailSubmitBtn) emailSubmitBtn.addEventListener('click', function(){
    if(validateForm()){
      var v = readFormValues();
      var subject = 'Cerere ofertă: ' + v.serviciu;
      var body = 'Nume: ' + v.nume + '\n' +
        'Telefon: ' + v.telefon + '\n' +
        'Serviciu: ' + v.serviciu + '\n\n' +
        'Mesaj:\n' + v.mesaj;
      var mailLink = 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      showSuccessAndReset('Îți deschidem aplicația de email.');
      setTimeout(function(){ window.location.href = mailLink; }, 400);
    }
  });
  Object.keys(validators).forEach(function(name){
    var el = form.elements[name];
    el.addEventListener('input', function(){ this.closest('.field').classList.remove('has-error'); });
    el.addEventListener('change', function(){ this.closest('.field').classList.remove('has-error'); });
  });
})();
