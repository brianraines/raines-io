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
    document.querySelector('.hero-rotating').style.backgroundImage = 'url(img/hero/hero-0' + number + '.png)';
  }

  rotateHero();

  /*Hero Rotation*/
  var heroRotation = setInterval(function() {
    rotateHero();
  }, 5000);

  /* About Photo */
  // get a number between 1 and 10
  var aboutPhotoNumber = Math.floor(Math.random() * 10) + 1;
  // set the background image to the new image with an ease in and out effect
  document.querySelector('.about-photo img').src = 'img/bulldog/' + aboutPhotoNumber + '.png';

});
