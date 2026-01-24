document.addEventListener('DOMContentLoaded', function() {
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
  
  // Find the main content area and insert greeting at the top
  const mainContent = document.getElementById('main-wrapper');
  if (mainContent) {
    const greetingDiv = document.createElement('div');
    greetingDiv.id = 'greeting-message';
    greetingDiv.style.cssText = 'text-align: center; padding: 15px; margin-bottom: 20px; font-size: 1.2rem; color: #a8a8a8;';
    greetingDiv.textContent = greeting + "! Thanks for visiting my project blog.";
    mainContent.insertBefore(greetingDiv, mainContent.firstChild);
  }
});
