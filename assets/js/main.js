// --- CENTRALIZED MOTION SYSTEM & CORE INTERACTIVITY (CLAUDE.md) ---

document.addEventListener('DOMContentLoaded', () => {
  // Register GSAP ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // --- MOBILE NAVIGATION BAR ---
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinksWrap = document.getElementById('navLinksWrap');
  
  if (mobileMenuBtn && navLinksWrap) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenuBtn.classList.toggle('active');
      navLinksWrap.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });

    // Close menu when link clicked
    navLinksWrap.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        navLinksWrap.classList.remove('active');
        document.body.classList.remove('menu-open');
      });
    });
  }

  // --- PORTFOLIO DYNAMIC FILTERING (SECTION 2) ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item-card');
  
  if (filterButtons.length > 0 && portfolioItems.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Active states toggling
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        
        // Filter elements with smooth GSAP animations
        portfolioItems.forEach(item => {
          if (filter === 'all') {
            gsap.to(item, {
              display: 'block',
              opacity: 1,
              scale: 1,
              duration: 0.4,
              ease: 'power3.out'
            });
          } else {
            const categories = item.getAttribute('data-categories').split(' ');
            if (categories.includes(filter)) {
              gsap.to(item, {
                display: 'block',
                opacity: 1,
                scale: 1,
                duration: 0.4,
                ease: 'power3.out'
              });
            } else {
              gsap.to(item, {
                opacity: 0,
                scale: 0.95,
                duration: 0.3,
                ease: 'power3.in',
                onComplete: () => {
                  item.style.display = 'none';
                }
              });
            }
          }
        });
      });
    });
  }

  // --- FORM ASYNCHRONOUS HANDLER & FEEDBACK ---
  const quoteForm = document.getElementById('quoteForm');
  const formBox = document.getElementById('formBox');
  const formSuccessState = document.getElementById('formSuccessState');
  const btnBackToForm = document.getElementById('btnBackToForm');
  
  if (quoteForm && formBox && formSuccessState) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let hasError = false;
      
      // Basic input validation
      const requiredInputs = quoteForm.querySelectorAll('[required]');
      requiredInputs.forEach(input => {
        const formGroup = input.closest('.form-group') || input.closest('.form-checkbox-group');
        if (!input.value.trim() || (input.type === 'checkbox' && !input.checked)) {
          formGroup.classList.add('error');
          hasError = true;
        } else {
          formGroup.classList.remove('error');
        }
      });
      
      if (hasError) {
        showNotification('Veuillez renseigner correctement les champs requis.', 'error');
        return;
      }
      
      // Submit Visual State
      const submitBtn = quoteForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Transmission en cours...';
      
      // Simulate secure api submission (ready to connect to Formspree, Netlify Forms, etc.)
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
        // Animate out Form and animate in Success panel (centralized motion)
        gsap.to(formBox, {
          opacity: 0,
          y: -24,
          duration: 0.5,
          ease: 'power3.in',
          onComplete: () => {
            formBox.style.display = 'none';
            formSuccessState.style.display = 'block';
            
            gsap.fromTo(formSuccessState, 
              { opacity: 0, y: 24 },
              { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
            );
          }
        });
      }, 1200);
    });
    
    if (btnBackToForm) {
      btnBackToForm.addEventListener('click', () => {
        gsap.to(formSuccessState, {
          opacity: 0,
          y: 24,
          duration: 0.4,
          ease: 'power3.in',
          onComplete: () => {
            formSuccessState.style.display = 'none';
            formBox.style.display = 'block';
            quoteForm.reset();
            
            gsap.fromTo(formBox,
              { opacity: 0, y: -24 },
              { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
            );
          }
        });
      });
    }
  }

  // Helper notification alert
  function showNotification(message, type) {
    const existing = document.querySelector('.form-notification');
    if (existing) existing.remove();
    
    const banner = document.createElement('div');
    banner.className = `form-notification ${type}`;
    banner.textContent = message;
    
    const form = document.getElementById('quoteForm');
    if (form) {
      form.insertBefore(banner, form.firstChild);
      setTimeout(() => {
        banner.style.opacity = '1';
      }, 10);
      
      setTimeout(() => {
        banner.style.opacity = '0';
        setTimeout(() => banner.remove(), 300);
      }, 4000);
    }
  }

  // --- COUCHE MOTION CENTRALISÉE (ÉTAPE 6) ---
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  
  // Setup matchMedia for GSAP
  let mm = gsap.matchMedia();
  
  mm.add({
    // Standard motion setup
    hasMotion: '(prefers-reduced-motion: no-preference)',
    // Reduced motion setup
    reducedMotion: '(prefers-reduced-motion: reduce)'
  }, (context) => {
    let { hasMotion } = context.conditions;
    
    if (!hasMotion) {
      // IF USER PREFERS REDUCED MOTION: render final states instantly (Règles de travail)
      gsap.set('[data-anim="reveal"], [data-anim="fade"], .site-header, .apropos-portrait-w', {
        opacity: 1,
        y: 0,
        scale: 1,
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
      });
      return;
    }
    
    // --- STANDARD PREMIUM MOTION SYSTEMS ---
    
    // 1. Sticky Navigation reveal on start
    gsap.fromTo('.site-header', 
      { opacity: 0, y: -16 },
      { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.1 }
    );
    
    // 2. Scan DOM and animate Elements with [data-anim="reveal"]
    // Used for headers, taglines and intros
    const revealElements = document.querySelectorAll('[data-anim="reveal"]');
    revealElements.forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // 3. Scan DOM and animate Elements with [data-anim="fade"]
    // Used for pricing cards and portfolio items
    const fadeElements = document.querySelectorAll('[data-anim="fade"]');
    if (fadeElements.length > 0) {
      // We group them if they are in the same section to stagger them elegantly
      const sectionsWithFade = new Set();
      fadeElements.forEach(el => {
        const sec = el.closest('section');
        if (sec) sectionsWithFade.add(sec);
      });
      
      sectionsWithFade.forEach(sec => {
        const items = sec.querySelectorAll('[data-anim="fade"]');
        gsap.fromTo(items,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.08, // Stagger d'élite
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sec,
              start: 'top 80%',
              toggleActions: 'play none none none'
            }
          }
        );
      });
    }

    // 4. MOMENT SIGNATURE (ÉTAPE 6)
    // Dynamic Clip-path revealing for Baya's Portrait
    const portraitContainer = document.querySelector('.apropos-portrait-w');
    if (portraitContainer) {
      gsap.fromTo(portraitContainer,
        { clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)', scale: 1.05 },
        {
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          scale: 1,
          duration: 1.6,
          ease: 'power4.inOut',
          scrollTrigger: {
            trigger: portraitContainer,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    }
  });
});
