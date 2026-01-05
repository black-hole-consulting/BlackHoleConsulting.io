/**
 * 3D Tilt Effect for Cards
 *
 * Features:
 * - Cards with .card-tilt class follow cursor position with subtle rotation
 * - Max rotation: 10 degrees
 * - Perspective: 1000px
 * - Smooth transition on enter/exit (150ms ease-out)
 * - Scale on hover: 1.02
 * - Optional highlight/shine effect that follows cursor position
 * - Disabled on touch devices
 * - Disabled if prefers-reduced-motion is set
 */

(function () {
  'use strict';

  // Configuration
  const CONFIG = {
    maxRotation: 10, // Maximum rotation in degrees
    perspective: 1000, // Perspective value in pixels
    scale: 1.02, // Scale factor on hover
    transitionDuration: 150, // Transition duration in ms
    easing: 'ease-out', // Transition easing function
    shineOpacity: 0.15, // Opacity of the shine effect
  };

  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Check if device is touch-only (no fine pointer)
  const isTouchDevice = window.matchMedia('(hover: none)').matches;

  // Skip initialization if reduced motion is preferred or touch device
  if (prefersReducedMotion || isTouchDevice) {
    return;
  }

  /**
   * Calculate rotation values based on cursor position relative to element
   * @param {HTMLElement} element - The card element
   * @param {number} clientX - Cursor X position
   * @param {number} clientY - Cursor Y position
   * @returns {Object} - Rotation X and Y values, and relative position for shine
   */
  function calculateRotation(element, clientX, clientY) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate relative position from center (-1 to 1)
    const relativeX = (clientX - centerX) / (rect.width / 2);
    const relativeY = (clientY - centerY) / (rect.height / 2);

    // Calculate rotation (inverted Y for natural feel)
    const rotateY = relativeX * CONFIG.maxRotation;
    const rotateX = -relativeY * CONFIG.maxRotation;

    // Calculate shine position (0 to 100 percentage)
    const shineX = ((clientX - rect.left) / rect.width) * 100;
    const shineY = ((clientY - rect.top) / rect.height) * 100;

    return { rotateX, rotateY, shineX, shineY };
  }

  /**
   * Apply tilt effect to an element
   * @param {HTMLElement} element - The card element
   * @param {number} rotateX - X rotation in degrees
   * @param {number} rotateY - Y rotation in degrees
   * @param {number} shineX - Shine X position percentage
   * @param {number} shineY - Shine Y position percentage
   */
  function applyTilt(element, rotateX, rotateY, shineX, shineY) {
    element.style.transform = `
      perspective(${CONFIG.perspective}px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale3d(${CONFIG.scale}, ${CONFIG.scale}, ${CONFIG.scale})
    `;

    // Update shine effect if element has shine overlay
    const shine = element.querySelector('.card-tilt-shine');
    if (shine) {
      shine.style.background = `
        radial-gradient(
          circle at ${shineX}% ${shineY}%,
          rgba(255, 255, 255, ${CONFIG.shineOpacity}) 0%,
          rgba(255, 255, 255, 0) 60%
        )
      `;
    }
  }

  /**
   * Reset tilt effect on an element
   * @param {HTMLElement} element - The card element
   */
  function resetTilt(element) {
    element.style.transform = `
      perspective(${CONFIG.perspective}px)
      rotateX(0deg)
      rotateY(0deg)
      scale3d(1, 1, 1)
    `;

    // Reset shine effect
    const shine = element.querySelector('.card-tilt-shine');
    if (shine) {
      shine.style.background = 'transparent';
    }
  }

  /**
   * Initialize tilt effect for a single card
   * @param {HTMLElement} card - The card element
   */
  function initializeCard(card) {
    // Set initial styles
    card.style.transformStyle = 'preserve-3d';
    card.style.transition = `transform ${CONFIG.transitionDuration}ms ${CONFIG.easing}`;
    card.style.willChange = 'transform';

    // Create shine overlay if not exists and card has data-tilt-shine attribute
    if (card.hasAttribute('data-tilt-shine') && !card.querySelector('.card-tilt-shine')) {
      const shine = document.createElement('div');
      shine.className = 'card-tilt-shine';
      shine.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        border-radius: inherit;
        transition: background ${CONFIG.transitionDuration}ms ${CONFIG.easing};
      `;
      card.style.position = 'relative';
      card.appendChild(shine);
    }

    // Animation frame ID for throttling
    let animationFrameId = null;

    // Mouse move handler with requestAnimationFrame
    function handleMouseMove(event) {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      animationFrameId = requestAnimationFrame(() => {
        const { rotateX, rotateY, shineX, shineY } = calculateRotation(
          card,
          event.clientX,
          event.clientY
        );
        applyTilt(card, rotateX, rotateY, shineX, shineY);
        animationFrameId = null;
      });
    }

    // Mouse enter handler
    function handleMouseEnter() {
      card.style.transition = `transform ${CONFIG.transitionDuration}ms ${CONFIG.easing}`;
    }

    // Mouse leave handler
    function handleMouseLeave() {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      resetTilt(card);
    }

    // Attach event listeners
    card.addEventListener('mousemove', handleMouseMove, { passive: true });
    card.addEventListener('mouseenter', handleMouseEnter, { passive: true });
    card.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    // Store cleanup function on element for potential removal
    card._tiltCleanup = function () {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
      card.style.transform = '';
      card.style.transition = '';
      card.style.willChange = '';
      const shine = card.querySelector('.card-tilt-shine');
      if (shine) {
        shine.remove();
      }
    };
  }

  /**
   * Initialize all tilt cards
   */
  function initializeTilt() {
    const cards = document.querySelectorAll('.card-tilt');
    cards.forEach(initializeCard);
  }

  /**
   * Cleanup all tilt effects
   */
  function cleanupTilt() {
    const cards = document.querySelectorAll('.card-tilt');
    cards.forEach((card) => {
      if (card._tiltCleanup) {
        card._tiltCleanup();
        delete card._tiltCleanup;
      }
    });
  }

  // Initialize on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTilt);
  } else {
    initializeTilt();
  }

  // Re-initialize on Astro page transitions (View Transitions API)
  document.addEventListener('astro:page-load', initializeTilt);
  document.addEventListener('astro:before-swap', cleanupTilt);

  // Export for module usage
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initializeTilt, cleanupTilt, initializeCard };
  }

  // Also expose globally for non-module usage
  window.CardTilt = {
    init: initializeTilt,
    cleanup: cleanupTilt,
    initCard: initializeCard,
  };
})();

// ES Module export for Astro
export function initTilt() {
  if (window.CardTilt) {
    window.CardTilt.init();
  }
}

export function cleanupTilt() {
  if (window.CardTilt) {
    window.CardTilt.cleanup();
  }
}
