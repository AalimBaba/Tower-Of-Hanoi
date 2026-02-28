/**
 * Hanoi Master - Level Selector Logic
 * Handles level unlocking, neon hover effects, and navigation
 */

// Initialize global progress variable
const unlockedLevel = parseInt(localStorage.getItem('hanoi_unlocked')) || 1;

document.addEventListener('DOMContentLoaded', () => {
    console.log("Hanoi Engine: Level Selector Initialized");
    initializeLevelGrid();
    applyHoverEffects();
});

/**
 * Syncs the UI cards with the player's progress
 */
function initializeLevelGrid() {
    const cards = document.querySelectorAll('.level-card');
    
    cards.forEach(card => {
        const levelId = parseInt(card.getAttribute('data-level'));
        
        if (levelId <= unlockedLevel) {
            card.classList.remove('locked');
            card.classList.add('unlocked');
        } else {
            card.classList.add('locked');
            // Disable the button visually for locked levels
            const btn = card.querySelector('button');
            if (btn) {
                btn.innerText = "LOCKED";
                btn.style.borderColor = "#444";
                btn.style.color = "#444";
            }
        }
    });
}

/**
 * Handles navigation to the specific game level
 * This is outside DOMContentLoaded so the HTML 'onclick' can find it
 */
function selectLevel(levelId) {
    if (levelId > unlockedLevel) {
        const card = document.querySelector(`[data-level="${levelId}"]`);
        // Trigger the CSS shake animation defined in your style.css
        card.classList.add('shake-error');
        setTimeout(() => card.classList.remove('shake-error'), 500);
        return;
    }

    // Neon "Hyperspace" transition effect
    document.body.style.opacity = "0";
    document.body.style.filter = "blur(15px) brightness(2)";
    document.body.style.transition = "0.6s all cubic-bezier(0.4, 0, 0.2, 1)";

    setTimeout(() => {
        window.location.href = `/game/${levelId}`;
    }, 500);
}

/**
 * Adds the interactive neon glow that follows the mouse
 */
function applyHoverEffects() {
    const unlockedCards = document.querySelectorAll('.level-card.unlocked');
    
    unlockedCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // These variables are used in your CSS for the glow positioning
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

/**
 * Utility: Can be called from the console to reset progress for testing
 */
function resetProgress() {
    localStorage.setItem('hanoi_unlocked', 1);
    location.reload();
}