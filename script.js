document.addEventListener('DOMContentLoaded', function() {
  console.log("Script loaded");


  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const body = document.body;
  
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', function() {
      body.classList.toggle('mobile-menu-open');
    });
  }

  
  function getScrollContainer() {
    return window.innerWidth < 768 ? window : document.querySelector('.main-content');
  }


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


  function setupScrollListener() {
    const scrollContainer = getScrollContainer();
    scrollContainer.addEventListener('scroll', updateActiveSection);
    return scrollContainer;
  }

  let currentScrollContainer = setupScrollListener();


  window.addEventListener('resize', function() {
    const newScrollContainer = getScrollContainer();
    if (newScrollContainer !== currentScrollContainer) {
      currentScrollContainer.removeEventListener('scroll', updateActiveSection);
      currentScrollContainer = setupScrollListener();
      updateActiveSection(); // Update on resize
    }
  });


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


  updateActiveSection();


  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', function () {
      const modal = document.getElementById('project-modal');
      const modalBody = modal.querySelector('.modal-body');
      const title = card.getAttribute('data-title');
      const desc = card.getAttribute('data-description');
      const video = card.getAttribute('data-video');

      
      let media = '';
      if (video && video.endsWith('.mp4')) {
        media = `<video src="${video}" controls style="width:100%;border-radius:12px;margin-bottom:1rem;"></video>`;
      } else if (video) {
        media = `<img src="${video}" alt="${title} demo" style="width:100%;border-radius:12px;margin-bottom:1rem;">`;
      }

      modalBody.innerHTML = `
        <h2 style="margin-bottom:1rem;">${title}</h2>
        ${media}
        <p>${desc}</p>
      `;
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden'; 
    });
  });


  document.querySelector('.close-modal').addEventListener('click', function () {
    document.getElementById('project-modal').style.display = 'none';
    document.body.style.overflow = '';
  });


  document.getElementById('project-modal').addEventListener('click', function (e) {
    if (e.target === this) {
      this.style.display = 'none';
      document.body.style.overflow = '';
    }
  });
});