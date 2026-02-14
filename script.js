(function () {
  'use strict';

  var header = document.querySelector('.header');
  var navToggle = document.querySelector('.nav-toggle');
  var navDrawer = document.getElementById('nav-drawer');

  function onScroll() {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  function onNavToggle() {
    var open = header.classList.toggle('menu-open');
    if (navDrawer) {
      navDrawer.setAttribute('aria-hidden', !open);
    }
    if (navToggle) {
      navToggle.setAttribute('aria-expanded', open);
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
  }

  if (header) {
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  if (navToggle) {
    navToggle.addEventListener('click', onNavToggle);
  }
})();
