document.addEventListener('DOMContentLoaded', () => {
  // --- MOBILE MENU TOGGLE ---
  const mobileMenuBtn = document.createElement('button');
  mobileMenuBtn.className = 'mobile-menu-btn';
  mobileMenuBtn.innerHTML = `
    <span class="bar"></span>
    <span class="bar"></span>
    <span class="bar"></span>
  `;
  
  const navIn = document.querySelector('.nav-in');
  const navLinks = document.querySelector('.nav-links');
  
  if (navIn && navLinks) {
    navIn.appendChild(mobileMenuBtn);
    
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenuBtn.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });
    
    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.classList.remove('menu-open');
      });
    });
  }

  // --- SMOOTH SCROLL ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  // --- INTERACTIVE PORTFOLIO FILTER ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioGrids = document.querySelectorAll('.portfolio-grid-group');
  
  if (filterButtons.length > 0 && portfolioGrids.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle active button
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filterValue = btn.getAttribute('data-filter');
        
        // Filter elements
        const items = document.querySelectorAll('.portfolio-item-card');
        items.forEach(item => {
          if (filterValue === 'all') {
            item.style.display = 'block';
            item.style.opacity = '0';
            setTimeout(() => { item.style.opacity = '1'; }, 50);
          } else {
            const categories = item.getAttribute('data-categories').split(' ');
            if (categories.includes(filterValue)) {
              item.style.display = 'block';
              item.style.opacity = '0';
              setTimeout(() => { item.style.opacity = '1'; }, 50);
            } else {
              item.style.display = 'none';
            }
          }
        });
      });
    });
  }

  // --- CONTACT / QUOTE FORM HANDLER ---
  const quoteForm = document.getElementById('quoteForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const submitBtn = quoteForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      
      // Basic validation
      let hasError = false;
      const inputs = quoteForm.querySelectorAll('[required]');
      
      inputs.forEach(input => {
        const formGroup = input.closest('.form-group');
        if (!input.value.trim()) {
          formGroup.classList.add('error');
          hasError = true;
        } else {
          formGroup.classList.remove('error');
        }
      });
      
      // Email validation
      const emailInput = quoteForm.querySelector('input[type="email"]');
      if (emailInput && emailInput.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const formGroup = emailInput.closest('.form-group');
        if (!emailRegex.test(emailInput.value)) {
          formGroup.classList.add('error');
          hasError = true;
        } else {
          formGroup.classList.remove('error');
        }
      }
      
      // GDPR Consent validation
      const gdprInput = quoteForm.querySelector('#gdpr');
      if (gdprInput && !gdprInput.checked) {
        const formGroup = gdprInput.closest('.form-checkbox-group');
        if (formGroup) {
          formGroup.classList.add('error');
        }
        hasError = true;
      } else if (gdprInput) {
        const formGroup = gdprInput.closest('.form-checkbox-group');
        if (formGroup) {
          formGroup.classList.remove('error');
        }
      }
      
      if (hasError) {
        // Show an error message banner
        showNotification('Veuillez remplir correctement tous les champs obligatoires.', 'error');
        return;
      }
      
      // Visual feedback loading state
      submitBtn.innerHTML = '<span class="spinner"></span> Envoi en cours...';
      submitBtn.disabled = true;
      
      // Simulate form submission (architecture ready for connection)
      setTimeout(() => {
        // Hide the form, show success state
        const formContainer = document.querySelector('.form-container');
        const successContainer = document.querySelector('.form-success-state');
        
        if (formContainer && successContainer) {
          formContainer.style.display = 'none';
          successContainer.style.display = 'block';
          successContainer.scrollIntoView({ behavior: 'smooth' });
        } else {
          // If no special container exists, alert and reset form
          showNotification('Votre demande de devis a été envoyée avec succès ! Je vous répondrai sous 24 h.', 'success');
          quoteForm.reset();
          submitBtn.innerHTML = originalBtnText;
          submitBtn.disabled = false;
        }
      }, 1500);
    });
  }
  
  // Custom interactive form validation states on change
  const formControls = document.querySelectorAll('.form-control');
  formControls.forEach(control => {
    control.addEventListener('input', function() {
      const formGroup = this.closest('.form-group');
      if (formGroup && this.value.trim()) {
        formGroup.classList.remove('error');
      }
    });
  });
});

// Helper function to show alerts
function showNotification(message, type = 'success') {
  const existingAlert = document.querySelector('.form-notification');
  if (existingAlert) existingAlert.remove();
  
  const alert = document.createElement('div');
  alert.className = `form-notification ${type}`;
  alert.textContent = message;
  
  const form = document.getElementById('quoteForm');
  if (form) {
    form.parentNode.insertBefore(alert, form);
    setTimeout(() => {
      alert.style.opacity = '1';
    }, 10);
    
    // Auto-dismiss after 5s
    setTimeout(() => {
      alert.style.opacity = '0';
      setTimeout(() => alert.remove(), 400);
    }, 5000);
  }
}
