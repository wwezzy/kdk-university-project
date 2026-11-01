
'use strict';

$(document).ready(function () {
  console.log('jQuery is ready!');

  // Task 4: Scroll Progress Bar.
  const $progressBar = $('#yerkhan-a6-scroll-progress');

  function updateScrollProgress() {
    const pageHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    );
    const scrollableHeight = pageHeight - window.innerHeight;
    const scrollPosition = window.scrollY || document.documentElement.scrollTop || 0;
    const percentage = scrollableHeight > 0
      ? Math.min(100, Math.max(0, (scrollPosition / scrollableHeight) * 100))
      : 100;

    $progressBar.find('.yerkhan-a6-scroll-fill').css('width', percentage + '%');
    $progressBar.attr('aria-valuenow', String(Math.round(percentage)));
  }

  if ($progressBar.length) {
    $(window).on('scroll.yerkhanA6 resize.yerkhanA6 load.yerkhanA6', updateScrollProgress);
    updateScrollProgress();
  }

  // Task 5: Animated Number Counter.
  const $statistics = $('.yerkhan-a6-stat-section');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  $statistics.each(function () {
    const section = this;
    let hasAnimated = false;

    function animateCounters() {
      if (hasAnimated) return;
      hasAnimated = true;

      $(section).find('[data-yerkhan-a6-count]').each(function () {
        const $number = $(this);
        const target = Number($number.attr('data-yerkhan-a6-count'));
        if (!Number.isFinite(target) || target < 0) return;

        if (reduceMotion) {
          $number.text(target.toLocaleString('en-US'));
          return;
        }

        $({ value: 0 }).animate({ value: target }, {
          duration: 1400,
          easing: 'swing',
          step: function (value) {
            $number.text(Math.floor(value).toLocaleString('en-US'));
          },
          complete: function () {
            $number.text(target.toLocaleString('en-US'));
          }
        });
      });
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(function (entries) {
        if (entries.some(entry => entry.isIntersecting)) {
          animateCounters();
          observer.disconnect();
        }
      }, { threshold: 0.15 });
      observer.observe(section);
    } else {
      function checkVisibility() {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          animateCounters();
          $(window).off('scroll.yerkhanA6Counters resize.yerkhanA6Counters', checkVisibility);
        }
      }
      $(window).on('scroll.yerkhanA6Counters resize.yerkhanA6Counters', checkVisibility);
      checkVisibility();
    }
  });

  // Task 6: Loading Spinner on Submit.
  const $contactForm = $('#a4-contact-form');

  if ($contactForm.length) {
    const form = $contactForm[0];
    const $submitButton = $contactForm.find('button[type="submit"]').first();
    const $formStatus = $('#a4-popup-status');
    let isLoading = false;

    form.addEventListener('submit', function (event) {
      if (isLoading) {
        event.preventDefault();
        event.stopImmediatePropagation();
      } else {
        $formStatus.removeClass('text-success').empty();
      }
    }, true);

    $contactForm.on('submit.yerkhanA6', function () {
      window.setTimeout(function () {
        if (isLoading || !$formStatus.hasClass('text-success')) return;

        isLoading = true;
        const originalContent = $submitButton.html();
        $submitButton.prop('disabled', true).attr('aria-busy', 'true');
        $submitButton.html(
          '<span class="yerkhan-a6-spinner" aria-hidden="true"></span>' +
          '<span>Please wait...</span>'
        );

        window.setTimeout(function () {
          $submitButton.html(originalContent);
          $submitButton.prop('disabled', false).removeAttr('aria-busy');
          isLoading = false;
        }, 1500);
      }, 0);
    });
  }
});