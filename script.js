document.addEventListener('DOMContentLoaded', function() {
  console.log("Script loaded");

  // Mobile menu functionality
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const body = document.body;
  
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', function() {
      body.classList.toggle('mobile-menu-open');
    });
  }

  // Get the correct scrollable element (different for mobile/desktop)
  function getScrollContainer() {
    return window.innerWidth < 768 ? window : document.querySelector('.main-content');
  }

  // Active section detection on scroll
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.navigation a');

  function updateActiveSection() {
    let current = '';
    const scrollContainer = getScrollContainer();
    const scrollY = scrollContainer === window ? window.scrollY : scrollContainer.scrollTop;

    sections.forEach(section => {
      const sectionTop = scrollContainer === window ? 
        section.offsetTop : 
        section.offsetTop - document.querySelector('.main-content').offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollY >= sectionTop - sectionHeight / 3) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  // Set up scroll listener for current device type
  function setupScrollListener() {
    const scrollContainer = getScrollContainer();
    scrollContainer.addEventListener('scroll', updateActiveSection);
    return scrollContainer;
  }

  let currentScrollContainer = setupScrollListener();

  // Handle window resize
  window.addEventListener('resize', function() {
    const newScrollContainer = getScrollContainer();
    if (newScrollContainer !== currentScrollContainer) {
      currentScrollContainer.removeEventListener('scroll', updateActiveSection);
      currentScrollContainer = setupScrollListener();
      updateActiveSection(); // Update on resize
    }
  });

  // Close mobile menu when clicking on a link and handle smooth scroll
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      
      if (targetId.startsWith('#')) {
        e.preventDefault();
        
        if (body.classList.contains('mobile-menu-open')) {
          body.classList.remove('mobile-menu-open');
        }

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          const scrollContainer = getScrollContainer();
          const offset = 20;
          const targetPosition = scrollContainer === window ?
            targetElement.offsetTop - offset :
            targetElement.offsetTop - document.querySelector('.main-content').offsetTop - offset;

          scrollContainer.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Animate skill bars on scroll
  const skillBars = document.querySelectorAll('.skill-bar .fill');
  
  function animateSkillBars() {
    skillBars.forEach(bar => {
      const width = bar.style.width;
      bar.style.width = '0';
      setTimeout(() => {
        bar.style.width = width;
      }, 100);
    });
  }
  
  // Intersection Observer for skill bars animation
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateSkillBars();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  const skillsSection = document.querySelector('.skills-container');
  if (skillsSection) {
    observer.observe(skillsSection);
  }

  // Trigger initial active state
  updateActiveSection();
});