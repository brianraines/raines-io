$(document) .ready(function() {
   /*Sidebar Menu*/
   "use strict";

   var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /*Swiper*/
   var swiper = new Swiper('.swiper', {
     spaceBetween: 30,
     autoplay: {
      enabled: !reducedMotion.matches,
      delay: 4000,
     },
     breakpoints: {
       640: {
         slidesPerView: 1,
       },
       768: {
         slidesPerView: 1,
       },
       1024: {
         slidesPerView: 2,
       },
     },
   });

  // Pause while a recommendation is hovered or focused; resume after both end.
   var hoveredCard = null;
   var hasCardFocus = false;
   var interactionPaused = false;
   function updateAutoplay() {
     if (hoveredCard || hasCardFocus) {
       interactionPaused = true;
       swiper.autoplay.stop();
     } else if (reducedMotion.matches) {
       swiper.autoplay.stop();
     } else if (interactionPaused) {
       interactionPaused = false;
       if (swiper.isEnd) {
         swiper.slideTo(0);
       } else {
         swiper.slideNext();
       }
       swiper.autoplay.start();
     }
   }
   swiper.el.querySelectorAll('.review-wrap').forEach(function(card) {
     card.addEventListener('mouseenter', function() {
       hoveredCard = card;
       updateAutoplay();
     });
     card.addEventListener('mouseleave', function(event) {
       // Moving to another part of the carousel, such as the next card, is not leaving it.
       if (event.relatedTarget && swiper.el.contains(event.relatedTarget)) return;
       if (hoveredCard === card) hoveredCard = null;
       updateAutoplay();
     });
   });
   swiper.el.addEventListener('mouseleave', function() {
     hoveredCard = null;
     updateAutoplay();
   });
   swiper.el.addEventListener('focusin', function(event) {
     var slide = event.target.closest('.swiper-slide');
     if (slide) {
       hasCardFocus = true;
       updateAutoplay();
       swiper.slideTo(Array.prototype.indexOf.call(swiper.slides, slide), 0);
     }
   });
   swiper.el.addEventListener('focusout', function(event) {
     if (!swiper.el.contains(event.relatedTarget)) {
       hasCardFocus = false;
       updateAutoplay();
     }
   });

  // The initial hero comes from CSS; only fetch another image while it is visible.
   var hero = document.querySelector('.hero-rotating');
   var heroImageBase = new URL('img/hero/', document.baseURI).href;
   var heroVisible = false;
   var heroRotation = null;
   function rotateHero() {
     var number = Math.floor(Math.random() * 9) + 1;
     hero.style.setProperty('--hero-image', 'url("' + heroImageBase + 'hero-0' + number + '.webp")');
     hero.style.setProperty('--hero-small-image', 'url("' + heroImageBase + 'hero-0' + number + '-960.webp")');
   }
   function updateHeroRotation() {
     if (heroRotation !== null) {
       clearInterval(heroRotation);
       heroRotation = null;
     }
     if (heroVisible && !document.hidden && !reducedMotion.matches) {
       heroRotation = setInterval(rotateHero, 5000);
     }
   }
   var heroObserver = new IntersectionObserver(function(entries) {
     heroVisible = entries[0].isIntersecting;
     updateHeroRotation();
   });
   heroObserver.observe(hero);
   document.addEventListener('visibilitychange', updateHeroRotation);
   reducedMotion.addEventListener('change', function() {
     updateHeroRotation();
     updateAutoplay();
     if (!reducedMotion.matches && !hoveredCard && !hasCardFocus) {
       swiper.autoplay.start();
     }
   });

});
