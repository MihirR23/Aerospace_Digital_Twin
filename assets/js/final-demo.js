(function() {
  if (typeof confetti === 'undefined') {
    console.error('canvas-confetti failed to load');
    return;
  }

  var medal = confetti.shapeFromText({ text: '\uD83C\uDFC5', scalar: 5 });
  var trophy = confetti.shapeFromText({ text: '\uD83C\uDFC6', scalar: 5 });

  var goldColors = ['#ffd700', '#ffb700', '#ff8c00', '#fca311', '#ffc300'];
  var fireworkColors = ['#ff0844', '#ffd700', '#00d2ff', '#3a47d5', '#ff8c00', '#ffffff'];

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  function fireworkBurst(originX, originY) {
    var defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 9999,
      shapes: ['circle'],
      colors: fireworkColors
    };

    confetti(Object.assign({}, defaults, {
      particleCount: 80,
      origin: { x: originX, y: originY },
      scalar: 1.5
    }));
    confetti(Object.assign({}, defaults, {
      particleCount: 50,
      origin: { x: originX, y: originY },
      scalar: 2,
      gravity: 0.5
    }));
  }

  function fireFireworks() {
    var bursts = [
      { x: 0.2, y: 0.3, delay: 0 },
      { x: 0.8, y: 0.3, delay: 300 },
      { x: 0.5, y: 0.2, delay: 600 },
      { x: 0.3, y: 0.4, delay: 900 },
      { x: 0.7, y: 0.4, delay: 1200 },
      { x: 0.5, y: 0.3, delay: 1500 }
    ];

    bursts.forEach(function(b) {
      setTimeout(function() { fireworkBurst(b.x, b.y); }, b.delay);
    });
  }

  function fireTrophiesAndMedals() {
    var duration = 4000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 40, spread: 360, ticks: 150, zIndex: 9999 };

    var interval = setInterval(function() {
      var timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      var particleCount = 30 * (timeLeft / duration);

      confetti(Object.assign({}, defaults, {
        particleCount: particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: goldColors,
        scalar: 2,
        gravity: 0.7
      }));
      confetti(Object.assign({}, defaults, {
        particleCount: particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: goldColors,
        scalar: 2,
        gravity: 0.7
      }));

      confetti(Object.assign({}, defaults, {
        particleCount: Math.floor(particleCount / 1.5),
        origin: { x: randomInRange(0.2, 0.5), y: Math.random() - 0.1 },
        shapes: [trophy],
        scalar: 5,
        gravity: 0.5
      }));
      confetti(Object.assign({}, defaults, {
        particleCount: Math.floor(particleCount / 1.5),
        origin: { x: randomInRange(0.5, 0.8), y: Math.random() - 0.1 },
        shapes: [medal],
        scalar: 5,
        gravity: 0.5
      }));
    }, 250);
  }

  function startCelebration() {
    fireFireworks();
    setTimeout(fireTrophiesAndMedals, 1800);
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
    startCelebration();
    setupCounters();
    setupReadingProgress();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
