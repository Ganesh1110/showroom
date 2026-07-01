const SVG_ICONS = {
  gown: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l-2 5h-8z"/><path d="M8 8l-4 13h16l-4-13z"/><path d="M12 3v5"/></svg>`,
  bonsai: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16v-4m-3 0h6m-7-3a4 4 0 0 1 8 0M7 16h10v3H7z"/></svg>`,
  light: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M9 6h6M9 12h6M9 18h6"/></svg>`,
  sofa: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11h18v5H3zm0 0V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3M6 16v2m12-2v2"/></svg>`,
  shirt: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4L3 7v3h3v10h12V10h3V7l-3-3H6z"/><path d="M9 4a3 3 0 0 0 6 0"/></svg>`,
  pack: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="6" width="14" height="14" rx="2"/><path d="M9 6V4a2 2 0 0 1 4 0v2M12 10v6M9 13h6"/></svg>`,
  hoodie: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9l2-5h12l2 5-3 11H7z"/><path d="M9 4c1 1.5 2 2.5 3 2.5s2-1 3-2.5M12 6.5V20"/></svg>`,
  cap: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6a6 6 0 0 0-6 6h12a6 6 0 0 0-6-6zM3 12h18v1H3z"/></svg>`
};

export function showToast(message) {
  // Remove existing toasts first
  const existing = document.querySelectorAll('.custom-toast');
  existing.forEach(t => t.remove());

  const toast = document.createElement('div');
  toast.className = 'custom-toast';
  toast.textContent = message;

  document.body.appendChild(toast);

  // Animate in via class addition (CSS transitions handled in style.css)
  setTimeout(() => {
    toast.classList.add('visible');
  }, 30);

  // Fade out
  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 400);
  }, 2200);
}

// Wishlist Counter state
let wishlistCount = 0;
export function initEcommerceBindings(onViewDetailsClick) {
  const primaryCTA = document.querySelector('.product-panel-btn.primary');
  const secondaryCTA = document.querySelector('.product-panel-btn.secondary');

  if (primaryCTA) {
    primaryCTA.addEventListener('click', (e) => {
      e.stopPropagation();
      wishlistCount++;
      const badge = document.getElementById('wishlist-badge');
      if (badge) {
        badge.textContent = wishlistCount;
        badge.style.display = 'flex';
      }
      
      const title = document.getElementById('prod-title').textContent;
      showToast(`${title} Added to Wishlist!`);
      
      primaryCTA.textContent = 'Added ❤️';
      primaryCTA.disabled = true;
      setTimeout(() => {
        primaryCTA.textContent = 'Add to Wishlist';
        primaryCTA.disabled = false;
      }, 2000);
    });
  }

  if (secondaryCTA) {
    secondaryCTA.addEventListener('click', (e) => {
      e.stopPropagation();
      const title = document.getElementById('prod-title').textContent;
      showToast(`Loading details for ${title}...`);
      if (onViewDetailsClick) onViewDetailsClick(title);
    });
  }
}

// Onboarding Tutorial steps
let currentStep = 1;
export function initTutorialBindings() {
  const tutorialOverlay = document.getElementById('tutorial-overlay');
  const nextBtn = document.getElementById('tutorial-next-btn');

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const activeStep = document.querySelector(`.tutorial-step[data-step="${currentStep}"]`);
      if (activeStep) activeStep.classList.remove('active');

      currentStep++;
      const nextStep = document.querySelector(`.tutorial-step[data-step="${currentStep}"]`);
      if (nextStep) {
        nextStep.classList.add('active');
        if (currentStep === 3) {
          nextBtn.textContent = 'Got It!';
        }
      } else {
        if (tutorialOverlay) tutorialOverlay.classList.add('tutorial-hidden');
        localStorage.setItem('visitedShowroom', 'true');
      }
    });
  }
}

// Accessibility Key event routing
export function initAccessibilityKeyboardRouter(onEscapeCallback) {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const panel = document.getElementById('product-panel');
      if (panel && !panel.classList.contains('product-panel-hidden')) {
        panel.classList.add('product-panel-hidden');
        document.querySelectorAll('.prop-hotspot-btn').forEach(b => b.classList.remove('active'));
      } else if (onEscapeCallback) {
        onEscapeCallback();
      }
    }
  });
}

export function updateProductPanelIcon(iconKey) {
  const container = document.getElementById('product-icon-container');
  if (container) {
    container.innerHTML = SVG_ICONS[iconKey] || '';
  }
}
