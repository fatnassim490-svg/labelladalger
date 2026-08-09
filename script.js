/* ==========================================================================
   LA BELLA D'ALGER — SCRIPT.JS
   JavaScript Vanilla : menu mobile, scroll doux, header transparent,
   carrousel de témoignages, animations au scroll (Intersection Observer).
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------
     1. MENU BURGER MOBILE
     Ouvre/ferme le menu de navigation sur petit écran et gère
     l'accessibilité (aria-expanded).
  ------------------------------------------------------------------ */
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('nav-links');

  function toggleMenu() {
    const isOpen = navLinks.classList.toggle('active');
    burger.classList.toggle('active');
    burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  burger.addEventListener('click', toggleMenu);

  // Ferme le menu mobile automatiquement après un clic sur un lien
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('active')) {
        toggleMenu();
      }
    });
  });

  /* ------------------------------------------------------------------
     2. SCROLL DOUX (SMOOTH SCROLLING)
     Intercepte les clics sur les liens d'ancre pour un défilement fluide,
     en tenant compte de la hauteur du header fixe.
  ------------------------------------------------------------------ */
  const header = document.getElementById('header');

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const headerHeight = header.offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight + 1;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });

  /* ------------------------------------------------------------------
     3. EFFET DE TRANSPARENCE DU HEADER AU SCROLL
     Ajoute une classe "scrolled" (fond + glassmorphism) dès que
     l'utilisateur défile au-delà de 60px.
  ------------------------------------------------------------------ */
  function handleHeaderScroll() {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleHeaderScroll);
  handleHeaderScroll(); // état initial

  /* ------------------------------------------------------------------
     4. BOUTON RETOUR EN HAUT
     Apparaît après un certain scroll, ramène en haut de page au clic.
  ------------------------------------------------------------------ */
  const backToTop = document.getElementById('back-to-top');

  function handleBackToTopVisibility() {
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', handleBackToTopVisibility);

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ------------------------------------------------------------------
     5. ANIMATION D'APPARITION AU SCROLL (INTERSECTION OBSERVER)
     Ajoute la classe "in-view" aux éléments [data-animate] lorsqu'ils
     entrent dans le viewport, déclenchant la transition CSS définie.
  ------------------------------------------------------------------ */
  const animatedElements = document.querySelectorAll('[data-animate]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target); // animation jouée une seule fois
      }
    });
  }, {
    threshold: 0.15
  });

  animatedElements.forEach(el => observer.observe(el));

  /* ------------------------------------------------------------------
     6. ONGLETS DE LA SECTION MENU
     Affiche un seul panneau de catégorie à la fois (Pizza, Entrées, Plats,
     Pâtes & Risotto, Sandwichs & Panini, Burgers/Tacos/Fajitas, Snacks,
     Desserts & Crêpes, Boissons, Cocktails & Milkshakes, Smoothies & Softs)
     selon l'onglet cliqué, et met à jour les styles + attributs d'accessibilité.
  ------------------------------------------------------------------ */
  const menuTabs = document.querySelectorAll('.menu-tab');
  const menuPanels = document.querySelectorAll('.menu-panel');

  menuTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-target');

      // Réinitialise tous les onglets et panneaux
      menuTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      menuPanels.forEach(panel => panel.classList.remove('active'));

      // Active l'onglet cliqué et son panneau correspondant
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      document.getElementById(targetId).classList.add('active');

      // Ramène la vue en haut de la section menu pour éviter de rester
      // scrollé au milieu d'une longue liste de l'onglet précédent
      // (le calcul tient compte de la hauteur du header fixe, comme pour le scroll doux)
      const menuTabsBar = document.getElementById('menu-tabs');
      const headerHeight = document.getElementById('header').offsetHeight;
      const tabsPosition = menuTabsBar.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;
      window.scrollTo({ top: tabsPosition, behavior: 'smooth' });
    });
  });

  /* ------------------------------------------------------------------
     7. CARROUSEL D'AVIS CLIENTS
     Carrousel JS simple : boutons précédent/suivant + pastilles (dots)
     + défilement automatique toutes les 6 secondes.
  ------------------------------------------------------------------ */
  const track = document.getElementById('testimonial-track');
  const slides = track ? Array.from(track.children) : [];
  const prevBtn = document.getElementById('testimonial-prev');
  const nextBtn = document.getElementById('testimonial-next');
  const dotsContainer = document.getElementById('testimonial-dots');

  let currentSlide = 0;
  let autoplayTimer = null;

  // Génère dynamiquement les pastilles (dots) selon le nombre d'avis
  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.classList.add('testimonial-dot');
    dot.setAttribute('aria-label', `Voir l'avis ${index + 1}`);
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });

  const dots = Array.from(dotsContainer.children);

  // Déplace le carrousel vers l'index demandé et met à jour les pastilles
  function goToSlide(index) {
    currentSlide = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach(dot => dot.classList.remove('active'));
    dots[currentSlide].classList.add('active');
    resetAutoplay();
  }

  function nextSlide() { goToSlide(currentSlide + 1); }
  function prevSlide() { goToSlide(currentSlide - 1); }

  if (nextBtn && prevBtn && slides.length > 1) {
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
  }

  // Défilement automatique du carrousel toutes les 6 secondes
  function startAutoplay() {
    if (slides.length > 1) {
      autoplayTimer = setInterval(nextSlide, 6000);
    }
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }

  startAutoplay();

  /* ------------------------------------------------------------------
     8. ANNÉE COURANTE DANS LE FOOTER
  ------------------------------------------------------------------ */
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

});
