// About page interactions

document.addEventListener('DOMContentLoaded', function() {

  // Smooth scroll functionality for scroll indicator
  const scrollIndicator = document.getElementById('scroll-indicator');
  const aboutSection = document.getElementById('aboutme');

  if (scrollIndicator && aboutSection) {
    scrollIndicator.addEventListener('click', function() {
      const offsetTop = aboutSection.offsetTop - 60; // Account for navbar height
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    });

    // Add cursor pointer style
    scrollIndicator.style.cursor = 'pointer';
  }

  // Optional: Hide scroll indicator when user starts scrolling
  let hasScrolled = false;
  window.addEventListener('scroll', function() {
    if (!hasScrolled && window.scrollY > 50) {
      hasScrolled = true;
      if (scrollIndicator) {
        scrollIndicator.style.opacity = '0.5';
        scrollIndicator.style.transition = 'opacity 0.3s ease';
      }
    }
  });

});