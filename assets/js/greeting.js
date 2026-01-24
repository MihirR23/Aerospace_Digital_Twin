document.addEventListener('DOMContentLoaded', function() {
  const greetingElement = document.getElementById('greeting-message');
  if (greetingElement) {
    const hour = new Date().getHours();
    let greeting;
    
    if (hour >= 5 && hour < 12) {
      greeting = "Good morning";
    } else if (hour >= 12 && hour < 17) {
      greeting = "Good afternoon";
    } else if (hour >= 17 && hour < 21) {
      greeting = "Good evening";
    } else {
      greeting = "Welcome";
    }
    
    greetingElement.textContent = greeting + "! Thanks for visiting my project blog.";
  }
});
