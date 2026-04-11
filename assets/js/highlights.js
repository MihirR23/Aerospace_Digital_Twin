(function() {
  function reveal() {
    var targets = document.querySelectorAll('.hl-card, .hl-closing-heading');
    if (!targets.length) return;

    if (!('IntersectionObserver' in window)) {
      targets.forEach(function(el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    targets.forEach(function(el) { observer.observe(el); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', reveal);
  } else {
    reveal();
  }
})();
