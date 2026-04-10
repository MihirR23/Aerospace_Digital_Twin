(function() {
  if (typeof confetti === 'undefined') {
    console.error('canvas-confetti failed to load');
    return;
  }

  var medal = confetti.shapeFromText({ text: '\uD83C\uDFC5', scalar: 4 });
  var trophy = confetti.shapeFromText({ text: '\uD83C\uDFC6', scalar: 4 });
  var firework = confetti.shapeFromText({ text: '\uD83C\uDF86', scalar: 4 });
  var sparkle = confetti.shapeFromText({ text: '\u2728', scalar: 3 });

  var goldColors = ['#ffd700', '#ffb700', '#ff8c00', '#fca311', '#ffc300'];

  function fireBurst() {
    var duration = 5000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 45, spread: 360, ticks: 120, zIndex: 9999 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    var interval = setInterval(function() {
      var timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      var particleCount = 35 * (timeLeft / duration);

      confetti(Object.assign({}, defaults, {
        particleCount: particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: goldColors,
        scalar: 2
      }));
      confetti(Object.assign({}, defaults, {
        particleCount: particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: goldColors,
        scalar: 2
      }));

      confetti(Object.assign({}, defaults, {
        particleCount: Math.floor(particleCount / 2),
        origin: { x: randomInRange(0.2, 0.4), y: Math.random() - 0.1 },
        shapes: [medal],
        scalar: 4,
        gravity: 0.6
      }));
      confetti(Object.assign({}, defaults, {
        particleCount: Math.floor(particleCount / 2),
        origin: { x: randomInRange(0.6, 0.8), y: Math.random() - 0.1 },
        shapes: [trophy],
        scalar: 4,
        gravity: 0.6
      }));

      confetti(Object.assign({}, defaults, {
        particleCount: Math.floor(particleCount / 2),
        origin: { x: randomInRange(0.3, 0.5), y: Math.random() - 0.15 },
        shapes: [firework],
        scalar: 4,
        gravity: 0.55
      }));
      confetti(Object.assign({}, defaults, {
        particleCount: Math.floor(particleCount / 2),
        origin: { x: randomInRange(0.5, 0.7), y: Math.random() - 0.15 },
        shapes: [sparkle],
        scalar: 3,
        gravity: 0.5
      }));
    }, 250);
  }

  function animateCounter(el) {
    var target = parseFloat(el.getAttribute('data-target'));
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 2000;
    var startTime = null;
    var isDecimal = target % 1 !== 0;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = target * eased;
      el.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = (isDecimal ? target.toFixed(1) : target) + suffix;
      }
    }
    requestAnimationFrame(step);
  }

  function setupCounters() {
    var counters = document.querySelectorAll('.stat-number');
    if (!counters.length) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    counters.forEach(function(c) { observer.observe(c); });
  }

  function setupReadingProgress() {
    var fill = document.querySelector('.reading-progress-fill');
    if (!fill) return;

    function update() {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      fill.style.width = progress + '%';
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  function init() {
    fireBurst();
    setupCounters();
    setupReadingProgress();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
