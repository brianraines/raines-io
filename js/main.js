$(document) .ready(function() {
   /*Sidebar Menu*/
   "use strict";

   /*Preloader*/
   $(".preloader-wrap").delay(1500).fadeOut('slow');


  /*Swiper*/
   var swiper = new Swiper('.swiper', {
     spaceBetween: 30,
     autoplay: {
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
     card.addEventListener('mouseleave', function() {
       if (hoveredCard === card) hoveredCard = null;
       updateAutoplay();
     });
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

  /*Magnific Popup*/
   $(function() {
    if ($('div.work').length) {
      $('div.work').magnificPopup({delegate: 'a',
        type: 'image',
        gallery: {
          enabled: false
        },
        removalDelay: 300,
        mainClass: 'mfp-fade'
      });
    }
   });

   $(document).ready(function() {
    if ($('.popup-youtube, .popup-vimeo, .popup-gmaps').length) {
      $('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
          type: 'iframe',
          mainClass: 'mfp-fade',
          removalDelay: 160,
          preloader: false,
          fixedContentPos: true
      });
    }
   });

  var filterContainer = $('.filtr-container');
  if (filterContainer.length) {
    filterContainer.filterizr({
       layout: 'sameSize',
       gridItemsSelector: '.filtr-item',
       gutterPixels: 20,
       selector: '.filtr-container',
       setupControls: true
    });
  }

  function rotateHero() {
    // get a number between 1 and 9
    var number = Math.floor(Math.random() * 9) + 1;
    // set the background image to the new image with an ease in and out effect
    document.querySelector('.hero-rotating').style.transition = 'background-image 0.5s ease-in-out';
    document.querySelector('.hero-rotating').style.backgroundImage = 'url(img/hero/hero-0' + number + '.webp)';
  }

  rotateHero();

  /*Hero Rotation*/
  var heroRotation = setInterval(function() {
    rotateHero();
  }, 5000);

  /* About Photo */
  // get a number between 1 and 10
  var aboutPhotoNumber = Math.floor(Math.random() * 11) + 1;
  // set the background image to the new image with an ease in and out effect

  document.querySelector('.about-photo img').src = 'img/bulldog/' + aboutPhotoNumber + '.png';

});
