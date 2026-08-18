// --- ELITE STUDIO MOTION & 3D INTERACTIVITY (LENIS, THREE.JS, MAGNETIC CURSOR) ---

document.addEventListener('DOMContentLoaded', () => {
  
  // --- SEGREGATED TRY-CATCH MODULE RUNNING (CLAUDE.md) ---
  // Any module error will not prevent others from running successfully.

  // ─── 1. LENIS SMOOTH SCROLLING (BUTTERY SMOOTH EFFECT) ───
  let lenis;
  try {
    if (typeof Lenis !== 'undefined') {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo out
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        smoothTouch: false,
        infinite: false,
      });

      // Connect Lenis to ScrollTrigger
      if (typeof ScrollTrigger !== 'undefined') {
        lenis.on('scroll', ScrollTrigger.update);
      }
      
      if (typeof gsap !== 'undefined') {
        gsap.ticker.add((time) => {
          lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
      }

      // Smooth scroll to anchors
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
          e.preventDefault();
          const targetId = this.getAttribute('href');
          if (targetId === '#') return;
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            lenis.scrollTo(targetEl, {
              offset: -72,
              duration: 1.5,
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
          }
        });
      });
    }
  } catch (error) {
    console.error('Lenis initialization failed:', error);
  }

  // ─── 2. SPECTACULAR 3D WEBGL PARTICLE CONSTELLATION BACKGROUND (THREE.JS) ───
  try {
    const initWebGLBackground = () => {
      const canvas = document.createElement('canvas');
      canvas.id = 'webgl-canvas';
      canvas.style.position = 'fixed';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100%';
      canvas.style.height = '100vh';
      canvas.style.zIndex = '-1';
      canvas.style.pointerEvents = 'none';
      document.body.appendChild(canvas);

      // Three.js Scene Setup
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 5;

      const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Particle Geometry
      const particlesCount = window.innerWidth < 768 ? 300 : 700;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particlesCount * 3);
      const colors = new Float32Array(particlesCount * 3);

      for (let i = 0; i < particlesCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 12;     // X
        positions[i + 1] = (Math.random() - 0.5) * 12; // Y
        positions[i + 2] = (Math.random() - 0.5) * 10; // Z

        // Muted luxury gold tones
        colors[i] = 0.85 + Math.random() * 0.15;     // R
        colors[i + 1] = 0.64 + Math.random() * 0.15; // G
        colors[i + 2] = 0.25 + Math.random() * 0.25; // B
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 0.035,
        vertexColors: true,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const particleSystem = new THREE.Points(geometry, material);
      scene.add(particleSystem);

      // Mouse Parallax movement
      let mouseX = 0;
      let mouseY = 0;
      
      window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 0.3;
        mouseY = (e.clientY / window.innerHeight - 0.5) * -0.3;
      });

      const clock = new THREE.Clock();
      const animate = () => {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        particleSystem.rotation.y = elapsedTime * 0.015;
        particleSystem.rotation.x = elapsedTime * 0.008;

        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (mouseY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
      };

      animate();

      window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });
    };

    if (typeof THREE !== 'undefined' && document.getElementById('portfolio') !== null) {
      initWebGLBackground();
    }
  } catch (error) {
    console.error('WebGL particle system loading failed:', error);
  }

  // ─── 3. MAGNETIC FLUID CURSOR (TACTILE HIGH-END FEEL) ───
  try {
    const initCustomCursor = () => {
      const cursor = document.createElement('div');
      cursor.className = 'custom-cursor';
      cursor.style.position = 'fixed';
      cursor.style.top = '0';
      cursor.style.left = '0';
      cursor.style.width = '14px';
      cursor.style.height = '14px';
      cursor.style.backgroundColor = 'var(--accent)';
      cursor.style.borderRadius = '50%';
      cursor.style.pointerEvents = 'none';
      cursor.style.zIndex = '9999';
      cursor.style.mixBlendMode = 'difference';
      cursor.style.transform = 'translate(-50%, -50%)';
      cursor.style.transition = 'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1), width 0.3s, height 0.3s, background-color 0.3s';
      
      // FIXED BUG: document.body.appendChild instead of passing callback function
      document.body.appendChild(cursor);
      document.body.style.cursor = 'none';

      let posX = 0, posY = 0;
      let mouseX = 0, mouseY = 0;

      if (typeof gsap !== 'undefined') {
        gsap.to({}, {
          duration: 0.012,
          repeat: -1,
          onRepeat: () => {
            posX += (mouseX - posX) * 0.15;
            posY += (mouseY - posY) * 0.15;
            gsap.set(cursor, { css: { left: posX, top: posY } });
          }
        });
      }

      window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      });

      // Hover triggers
      const hoverables = document.querySelectorAll('a, button, .btn-premium, .portfolio-item-card, .filter-btn');
      hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => {
          cursor.style.width = '48px';
          cursor.style.height = '48px';
          cursor.style.backgroundColor = 'var(--text)';
          cursor.style.transform = 'translate(-50%, -50%) scale(1.2)';
        });
        el.addEventListener('mouseleave', () => {
          cursor.style.width = '14px';
          cursor.style.height = '14px';
          cursor.style.backgroundColor = 'var(--accent)';
          cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        });
      });

      // Portfolio card overlay VOIR trigger
      const portfolioCards = document.querySelectorAll('.portfolio-item-card');
      portfolioCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          cursor.innerHTML = '<span style="font-size: 8px; font-weight: 700; color: var(--bg); letter-spacing: 1px;">VOIR</span>';
          cursor.style.display = 'flex';
          cursor.style.alignItems = 'center';
          cursor.style.justifyContent = 'center';
        });
        card.addEventListener('mouseleave', () => {
          cursor.innerHTML = '';
        });
      });
    };

    if (window.innerWidth > 768) {
      initCustomCursor();
    }
  } catch (error) {
    console.error('Magnetic custom cursor failed:', error);
  }

  // ─── 4. MOBILE NAVIGATION BAR (ACCESSIBILITY EXPANDED STATES) ───
  try {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinksWrap = document.getElementById('navLinksWrap');
    
    if (mobileMenuBtn && navLinksWrap) {
      mobileMenuBtn.addEventListener('click', () => {
        const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
        mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
        mobileMenuBtn.classList.toggle('active');
        navLinksWrap.classList.toggle('active');
        document.body.classList.toggle('menu-open');
      });

      navLinksWrap.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          mobileMenuBtn.setAttribute('aria-expanded', 'false');
          mobileMenuBtn.classList.remove('active');
          navLinksWrap.classList.remove('active');
          document.body.classList.remove('menu-open');
        });
      });
    }
  } catch (error) {
    console.error('Mobile menu toggles failed:', error);
  }

  // ─── 5. PORTFOLIO DYNAMIC FILTERING ───
  try {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item-card');
    const gridContainer = document.querySelector('.portfolio-grid');
    
    if (filterButtons.length > 0 && portfolioItems.length > 0) {
      filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          filterButtons.forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
          });
          btn.classList.add('active');
          btn.setAttribute('aria-selected', 'true');
          
          const filter = btn.getAttribute('data-filter');
          let matchCount = 0;
          
          portfolioItems.forEach(item => {
            if (filter === 'all') {
              matchCount++;
              if (typeof gsap !== 'undefined') {
                gsap.to(item, {
                  display: 'block',
                  opacity: 1,
                  scale: 1,
                  duration: 0.5,
                  ease: 'power3.out'
                });
              } else {
                item.style.display = 'block';
                item.style.opacity = '1';
              }
            } else {
              const categories = item.getAttribute('data-categories').split(' ');
              if (categories.includes(filter)) {
                matchCount++;
                if (typeof gsap !== 'undefined') {
                  gsap.to(item, {
                    display: 'block',
                    opacity: 1,
                    scale: 1,
                    duration: 0.5,
                    ease: 'power3.out'
                  });
                } else {
                  item.style.display = 'block';
                  item.style.opacity = '1';
                }
              } else {
                if (typeof gsap !== 'undefined') {
                  gsap.to(item, {
                    opacity: 0,
                    scale: 0.92,
                    duration: 0.4,
                    ease: 'power3.inOut',
                    onComplete: () => {
                      item.style.display = 'none';
                    }
                  });
                } else {
                  item.style.display = 'none';
                  item.style.opacity = '0';
                }
              }
            }
          });
          
          // Announce result counts dynamically for screen readers (aria-live)
          if (gridContainer) {
            const activeCategoryLabel = btn.textContent;
            gridContainer.setAttribute('aria-label', `Galerie : ${matchCount} clichés affichés pour la catégorie ${activeCategoryLabel}`);
          }
        });
      });
    }
  } catch (error) {
    console.error('Portfolio filtering module failed:', error);
  }

  // ─── 6. FORM VALIDATION & FORMSPREE INTEGRATION ───
  try {
    const quoteForm = document.getElementById('quoteForm');
    const formBox = document.getElementById('formBox');
    const formSuccessState = document.getElementById('formSuccessState');
    const btnBackToForm = document.getElementById('btnBackToForm');
    
    // Formspree Endpoint (TODO: Baya, configurez votre propre ID à la place de "xbjnygzo")
    const formspreeEndpoint = 'https://formspree.io/f/xbjnygzo';

    if (quoteForm && formBox && formSuccessState) {
      quoteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let hasError = false;
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
          showNotification('Veuillez remplir tous les champs obligatoires.', 'error');
          return;
        }

        const submitBtn = quoteForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Anti-spam Honeypot Check
        const gotchaValue = quoteForm.querySelector('[name="_gotcha"]')?.value;
        if (gotchaValue) {
          // Block bot silently and act as successful submission
          formBox.style.display = 'none';
          formSuccessState.style.display = 'block';
          formSuccessState.setAttribute('aria-hidden', 'false');
          return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Envoi en cours...';

        // Prepare data payload for Formspree API (JSON POST)
        const formData = new FormData(quoteForm);
        const dataPayload = {};
        formData.forEach((value, key) => {
          dataPayload[key] = value;
        });

        fetch(formspreeEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(dataPayload)
        })
        .then(response => {
          if (response.ok) {
            // SUCCESS: Animate GSAP transition
            if (typeof gsap !== 'undefined') {
              gsap.to(formBox, {
                opacity: 0,
                y: -30,
                duration: 0.6,
                ease: 'power4.in',
                onComplete: () => {
                  formBox.style.display = 'none';
                  formSuccessState.style.display = 'block';
                  formSuccessState.setAttribute('aria-hidden', 'false');
                  
                  gsap.fromTo(formSuccessState, 
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 0.8, ease: 'power4.out' }
                  );
                }
              });
            } else {
              formBox.style.display = 'none';
              formSuccessState.style.display = 'block';
              formSuccessState.setAttribute('aria-hidden', 'false');
            }
          } else {
            // Error returned from Formspree
            response.json().then(data => {
              if (data.errors) {
                const errMsg = data.errors.map(err => err.message).join(', ');
                showNotification(`Erreur d'envoi : ${errMsg}`, 'error');
              } else {
                showNotification('Une erreur est survenue lors de l\'envoi du formulaire. Veuillez réessayer.', 'error');
              }
            }).catch(() => {
              showNotification('Erreur inattendue du serveur de soumission. Veuillez réessayer.', 'error');
            });
          }
        })
        .catch(error => {
          console.error('Network submit error:', error);
          showNotification('Erreur réseau. Veuillez vérifier votre connexion internet et réessayer.', 'error');
        })
        .finally(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        });
      });
      
      if (btnBackToForm) {
        btnBackToForm.addEventListener('click', () => {
          if (typeof gsap !== 'undefined') {
            gsap.to(formSuccessState, {
              opacity: 0,
              y: 30,
              duration: 0.5,
              ease: 'power4.in',
              onComplete: () => {
                formSuccessState.style.display = 'none';
                formSuccessState.setAttribute('aria-hidden', 'true');
                formBox.style.display = 'block';
                quoteForm.reset();
                
                gsap.fromTo(formBox,
                  { opacity: 0, y: -30 },
                  { opacity: 1, y: 0, duration: 0.6, ease: 'power4.out' }
                );
              }
            });
          } else {
            formSuccessState.style.display = 'none';
            formSuccessState.setAttribute('aria-hidden', 'true');
            formBox.style.display = 'block';
            quoteForm.reset();
          }
        });
      }
    }
  } catch (error) {
    console.error('Form validation and fetch module failed:', error);
  }

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

  // ─── 7. THE CENTRALIZED MOTION SYSTEM (GSAP & SCROLLTRIGGER) ───
  try {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      let mm = gsap.matchMedia();
      
      mm.add({
        hasMotion: '(prefers-reduced-motion: no-preference)',
        reducedMotion: '(prefers-reduced-motion: reduce)'
      }, (context) => {
        let { hasMotion } = context.conditions;
        
        if (!hasMotion) {
          gsap.set('[data-anim="reveal"], [data-anim="fade"], .site-header, .apropos-portrait-w', {
            opacity: 1,
            y: 0,
            scale: 1,
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
          });
          return;
        }
        
        // --- STICKY NAV REVEAL ---
        gsap.fromTo('.site-header', 
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 1.2, ease: 'power4.out' }
        );
        
        // --- SPLIT TEXT-LIKE WORD REVEAL ---
        const revealElements = document.querySelectorAll('[data-anim="reveal"]');
        revealElements.forEach(el => {
          gsap.fromTo(el,
            { opacity: 0, y: 36 },
            {
              opacity: 1,
              y: 0,
              duration: 1.0,
              ease: 'power4.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none'
              }
            }
          );
        });

        // --- STAGGERED FADE CARDS & ITEMS ---
        const fadeElements = document.querySelectorAll('[data-anim="fade"]');
        if (fadeElements.length > 0) {
          const sectionsWithFade = new Set();
          fadeElements.forEach(el => {
            const sec = el.closest('section');
            if (sec) sectionsWithFade.add(sec);
          });
          
          sectionsWithFade.forEach(sec => {
            const items = sec.querySelectorAll('[data-anim="fade"]');
            gsap.fromTo(items,
              { opacity: 0, y: 24, scale: 0.98 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1.0,
                stagger: 0.08,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: sec,
                  start: 'top 75%',
                  toggleActions: 'play none none none'
                }
              }
            );
          });
        }

        // --- SPECTACULAR MOMENT SIGNATURE ---
        const portraitContainer = document.querySelector('.apropos-portrait-w');
        if (portraitContainer) {
          gsap.fromTo(portraitContainer,
            { clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)', scale: 1.08 },
            {
              clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
              scale: 1,
              duration: 1.8,
              ease: 'power4.inOut',
              scrollTrigger: {
                trigger: portraitContainer,
                start: 'top 78%',
                toggleActions: 'play none none none'
              }
            }
          );
        }
      });
    }
  } catch (error) {
    console.error('GSAP Motion system failed:', error);
  }
});
