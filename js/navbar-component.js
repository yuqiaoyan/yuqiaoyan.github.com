// Site Navbar Web Component
class SiteNavbar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header id="top-nav" class="navbar navbar-inverse navbar-fixed-top nav-general" role="banner">
        <div class="container">
          <a href="index.html" id="me">bonnieyu</a>
          <span id="main-nav" class="navbar-right">
            <ul class="nav navbar-nav">
              <li><a href="portfolio.html" data-page="portfolio">PORTFOLIO</a></li>
              <li><a href="https://www.tumblr.com/blog/sketchbonnieyu">SKETCHES</a></li>
              <li><a href="index.html" data-page="about">ABOUT</a></li>
              <li><a href="https://www.linkedin.com/pub/bonnie-yu/2/a18/8a5/">LINKEDIN</a></li>
            </ul>
          </span>
        </div>
      </header>
    `;

    // Highlight current page after component is rendered
    this.highlightCurrentPage();
  }

  highlightCurrentPage() {
    // Get current page filename
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Find all navigation links
    const navLinks = this.querySelectorAll('#main-nav a[data-page]');

    // Remove any existing highlighting
    navLinks.forEach(link => {
      link.style.color = '';
    });

    // Highlight current page
    navLinks.forEach(link => {
      const pageName = link.getAttribute('data-page');

      // Check if this link corresponds to current page
      if ((currentPage === 'index.html' && pageName === 'about') ||
          (currentPage === 'portfolio.html' && pageName === 'portfolio') ||
          (currentPage.includes('.html') && currentPage !== 'index.html' && currentPage !== 'portfolio.html' && pageName === 'portfolio')) {
        link.style.color = 'white';
      }
    });
  }
}

// Register the custom element
customElements.define('site-navbar', SiteNavbar);