/**
 * ALIF SHE CAMPUS - Interactive Web Application Logic
 * Council of Samastha Women's Colleges (CSWC) & BTIC
 * Enhanced Mobile & Tablet Support
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileMenu();
  initCourseTabs();
  initFeeCalculator();
  initAdmissionModal();
  initFaqAccordion();
  initContactForm();
});

/* -------------------------------------------------------------------------- */
/* Theme Switcher                                                             */
/* -------------------------------------------------------------------------- */
function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggleBtn');
  const icon = toggleBtn ? toggleBtn.querySelector('i') : null;

  const savedTheme = localStorage.getItem('alifTheme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('alifTheme', newTheme);
      updateThemeIcon(newTheme);
    });
  }

  function updateThemeIcon(theme) {
    if (!icon) return;
    if (theme === 'dark') {
      icon.className = 'fas fa-sun';
    } else {
      icon.className = 'fas fa-moon';
    }
  }
}

/* -------------------------------------------------------------------------- */
/* Mobile & Tablet Drawer Menu                                                */
/* -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const overlay = document.getElementById('navBackdropOverlay');

  function openMenu() {
    if (navMenu) navMenu.classList.add('active');
    if (overlay) overlay.classList.add('active');
    if (toggle && toggle.querySelector('i')) {
      toggle.querySelector('i').className = 'fas fa-times';
    }
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    if (navMenu) navMenu.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    if (toggle && toggle.querySelector('i')) {
      toggle.querySelector('i').className = 'fas fa-bars';
    }
    document.body.style.overflow = '';
  }

  if (toggle && navMenu) {
    toggle.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    if (overlay) {
      overlay.addEventListener('click', closeMenu);
    }

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }
}

/* -------------------------------------------------------------------------- */
/* Course Filter Tabs                                                         */
/* -------------------------------------------------------------------------- */
function initCourseTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const courseCards = document.querySelectorAll('.course-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-category');

      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      courseCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (category === 'all' || cardCat === category) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* -------------------------------------------------------------------------- */
/* Fee & Scholarship Estimator                                                */
/* -------------------------------------------------------------------------- */
function initFeeCalculator() {
  const streamSelect = document.getElementById('calcStream');
  const hostelSelect = document.getElementById('calcHostel');
  const scoreInput = document.getElementById('calcScore');
  const scoreValDisplay = document.getElementById('scoreValDisplay');
  const feeDisplay = document.getElementById('calcResultFee');
  const scholarshipDisplay = document.getElementById('calcResultScholarship');

  if (!streamSelect || !hostelSelect || !scoreInput) return;

  function calculate() {
    const stream = streamSelect.value;
    const hostel = hostelSelect.value;
    const score = parseInt(scoreInput.value, 10);

    if (scoreValDisplay) {
      scoreValDisplay.textContent = score + '%';
    }

    let baseTuition = 18000;
    if (stream === 'commerce') baseTuition = 18000;
    if (stream === 'fadheela') baseTuition = 18000;

    let hostelFee = hostel === 'yes' ? 0 : 0;
    let totalBase = baseTuition + hostelFee;

    let scholarshipDiscount = 0;
    if (score >= 95) {
      scholarshipDiscount = 40; // 40% waiver
    } else if (score >= 90) {
      scholarshipDiscount = 25; // 25% waiver
    } else if (score >= 85) {
      scholarshipDiscount = 15; // 15% waiver
    }

    const discountAmount = Math.round((baseTuition * scholarshipDiscount) / 100);
    const finalEstimate = totalBase - discountAmount;

    if (feeDisplay) {
      feeDisplay.textContent = '₹' + finalEstimate.toLocaleString('en-IN') + ' / year';
    }
    if (scholarshipDisplay) {
      scholarshipDisplay.textContent = scholarshipDiscount > 0 ? `${scholarshipDiscount}% Scholarship Granted (Save ₹${discountAmount.toLocaleString('en-IN')})` : 'Merit scholarship available above 70%';
    }
  }

  streamSelect.addEventListener('change', calculate);
  hostelSelect.addEventListener('change', calculate);
  scoreInput.addEventListener('input', calculate);

  calculate();
}

/* -------------------------------------------------------------------------- */
/* Admission Wizard & Modal                                                   */
/* -------------------------------------------------------------------------- */
let currentWizardStep = 1;

function initAdmissionModal() {
  const modal = document.getElementById('admissionModal');
  const openBtns = document.querySelectorAll('.open-admission-modal');
  const closeBtn = document.getElementById('closeAdmissionModal');

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        resetWizard();
      }
    });
  });

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Wizard Buttons
  const nextBtn = document.getElementById('wizardNext');
  const prevBtn = document.getElementById('wizardPrev');

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (validateStep(currentWizardStep)) {
        if (currentWizardStep < 3) {
          currentWizardStep++;
          showStep(currentWizardStep);
        } else {
          submitApplication();
        }
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentWizardStep > 1) {
        currentWizardStep--;
        showStep(currentWizardStep);
      }
    });
  }
}

function resetWizard() {
  currentWizardStep = 1;
  showStep(1);
  const wizardForm = document.getElementById('admissionForm');
  const successCard = document.getElementById('admissionSuccess');
  if (wizardForm) wizardForm.style.display = 'block';
  if (successCard) successCard.style.display = 'none';
  const nextBtn = document.getElementById('wizardNext');
  if (nextBtn) nextBtn.textContent = 'Next Step';
}

function showStep(stepNum) {
  document.querySelectorAll('.wizard-step-content').forEach(step => {
    step.style.display = 'none';
  });

  const activeContent = document.getElementById(`wizardStep${stepNum}`);
  if (activeContent) activeContent.style.display = 'block';

  // Update Indicator Circles
  document.querySelectorAll('.step-item').forEach((item, index) => {
    item.classList.remove('active', 'completed');
    if (index + 1 === stepNum) {
      item.classList.add('active');
    } else if (index + 1 < stepNum) {
      item.classList.add('completed');
    }
  });

  const prevBtn = document.getElementById('wizardPrev');
  const nextBtn = document.getElementById('wizardNext');

  if (prevBtn) prevBtn.style.visibility = stepNum === 1 ? 'hidden' : 'visible';
  if (nextBtn) nextBtn.textContent = stepNum === 3 ? 'Submit Application' : 'Next Step';
}

function validateStep(step) {
  const currentContainer = document.getElementById(`wizardStep${step}`);
  if (!currentContainer) return true;

  const requiredInputs = currentContainer.querySelectorAll('[required]');
  let isValid = true;

  requiredInputs.forEach(input => {
    if (!input.value.trim()) {
      isValid = false;
      input.style.borderColor = '#ef4444';
    } else {
      input.style.borderColor = '';
    }
  });

  if (!isValid) {
    alert('Please complete all required fields before proceeding.');
  }

  return isValid;
}

function submitApplication() {
  const wizardForm = document.getElementById('admissionForm');
  const successCard = document.getElementById('admissionSuccess');
  const refDisplay = document.getElementById('appRefCode');

  // Generate random application code (ALIF-2026-XXXX)
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const refCode = `ALIF-2026-${randomNum}`;

  if (wizardForm) wizardForm.style.display = 'none';
  if (successCard) successCard.style.display = 'flex';
  if (refDisplay) refDisplay.textContent = refCode;
}

/* -------------------------------------------------------------------------- */
/* FAQ Accordion                                                              */
/* -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });
}

/* -------------------------------------------------------------------------- */
/* Contact Form Submission                                                    */
/* -------------------------------------------------------------------------- */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const statusMsg = document.getElementById('contactStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (statusMsg) {
        statusMsg.style.display = 'block';
        statusMsg.innerHTML = '<div style="background:var(--primary-100); color:var(--primary-800); padding:12px; border-radius:var(--radius-sm); font-weight:600;"><i class="fas fa-check-circle"></i> Thank you! Your message has been sent successfully. Our admission team will contact you shortly.</div>';
        contactForm.reset();
      }
    });
  }
}
