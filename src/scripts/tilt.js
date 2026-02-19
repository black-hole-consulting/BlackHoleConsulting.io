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

// Configuration
const CONFIG = {
  maxRotation: 10,
  perspective: 1000,
  scale: 1.02,
  transitionDuration: 150,
  easing: 'ease-out',
  shineOpacity: 0.15,
};

/**
 * Calculate rotation values based on cursor position relative to element
 */
function calculateRotation(element, clientX, clientY) {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const relativeX = (clientX - centerX) / (rect.width / 2);
  const relativeY = (clientY - centerY) / (rect.height / 2);

  const rotateY = relativeX * CONFIG.maxRotation;
  const rotateX = -relativeY * CONFIG.maxRotation;

  const shineX = ((clientX - rect.left) / rect.width) * 100;
  const shineY = ((clientY - rect.top) / rect.height) * 100;

  return { rotateX, rotateY, shineX, shineY };
}

/**
 * Apply tilt effect to an element
 */
function applyTilt(element, rotateX, rotateY, shineX, shineY) {
  element.style.transform = `
    perspective(${CONFIG.perspective}px)
    rotateX(${rotateX}deg)
    rotateY(${rotateY}deg)
    scale3d(${CONFIG.scale}, ${CONFIG.scale}, ${CONFIG.scale})
  `;

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
 */
function resetTilt(element) {
  element.style.transform = `
    perspective(${CONFIG.perspective}px)
    rotateX(0deg)
    rotateY(0deg)
    scale3d(1, 1, 1)
  `;

  const shine = element.querySelector('.card-tilt-shine');
  if (shine) {
    shine.style.background = 'transparent';
  }
}

/**
 * Initialize tilt effect for a single card
 */
function initializeCard(card) {
  card.style.transformStyle = 'preserve-3d';
  card.style.transition = `transform ${CONFIG.transitionDuration}ms ${CONFIG.easing}`;
  card.style.willChange = 'transform';

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

  let animationFrameId = null;

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

  function handleMouseEnter() {
    card.style.transition = `transform ${CONFIG.transitionDuration}ms ${CONFIG.easing}`;
  }

  function handleMouseLeave() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    resetTilt(card);
  }

  card.addEventListener('mousemove', handleMouseMove, { passive: true });
  card.addEventListener('mouseenter', handleMouseEnter, { passive: true });
  card.addEventListener('mouseleave', handleMouseLeave, { passive: true });

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
export function initTilt() {
  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Check if device is touch-only (no fine pointer)
  const isTouchDevice = window.matchMedia('(hover: none)').matches;

  if (prefersReducedMotion || isTouchDevice) {
    return;
  }

  const cards = document.querySelectorAll('.card-tilt');
  cards.forEach(initializeCard);
}

/**
 * Cleanup all tilt effects
 */
export function cleanupTilt() {
  const cards = document.querySelectorAll('.card-tilt');
  cards.forEach((card) => {
    if (card._tiltCleanup) {
      card._tiltCleanup();
      delete card._tiltCleanup;
    }
  });
}
