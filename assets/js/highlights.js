(function() {
  if (typeof confetti === 'undefined') {
    console.error('canvas-confetti failed to load');
    return;
  }

  var heart = confetti.shapeFromPath({
    path: 'M167 72c19,-38 37,-56 75,-56 42,0 76,33 76,75 0,76 -76,151 -151,227 -76,-76 -151,-151 -151,-227 0,-42 33,-75 75,-75 38,0 57,18 76,56z',
    matrix: [0.03, 0, 0, 0.03, -5, -5]
  });

  var star = confetti.shapeFromText({ text: '\u2B50', scalar: 4 });

  var heartColors = ['#e63946', '#d00000', '#9d0208', '#dc2f02', '#e85d75'];
  var confettiColors = ['#2a9d8f', '#264653', '#4361ee', '#7209b7', '#06ffa5', '#f72585'];

  function fireBurst() {
    var duration = 5000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 40, spread: 360, ticks: 100, zIndex: 9999 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    var interval = setInterval(function() {
      var timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      var particleCount = 40 * (timeLeft / duration);

      confetti(Object.assign({}, defaults, {
        particleCount: particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: confettiColors,
        scalar: 1.8
      }));
      confetti(Object.assign({}, defaults, {
        particleCount: particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: confettiColors,
        scalar: 1.8
      }));

      confetti(Object.assign({}, defaults, {
        particleCount: Math.floor(particleCount / 2),
        origin: { x: randomInRange(0.2, 0.4), y: Math.random() - 0.1 },
        shapes: [heart],
        colors: heartColors,
        scalar: 3.5,
        gravity: 0.6
      }));
      confetti(Object.assign({}, defaults, {
        particleCount: Math.floor(particleCount / 2),
        origin: { x: randomInRange(0.6, 0.8), y: Math.random() - 0.1 },
        shapes: [heart],
        colors: heartColors,
        scalar: 3.5,
        gravity: 0.6
      }));

      confetti(Object.assign({}, defaults, {
        particleCount: Math.floor(particleCount / 2),
        origin: { x: randomInRange(0.3, 0.5), y: Math.random() - 0.15 },
        shapes: [star],
        scalar: 4,
        gravity: 0.6
      }));
      confetti(Object.assign({}, defaults, {
        particleCount: Math.floor(particleCount / 2),
        origin: { x: randomInRange(0.5, 0.7), y: Math.random() - 0.15 },
        shapes: [star],
        scalar: 4,
        gravity: 0.6
      }));
    }, 250);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fireBurst);
  } else {
    fireBurst();
  }
})();
