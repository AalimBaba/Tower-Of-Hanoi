/**
 * Hanoi Master - Visual & Audio Effects
 */

// 1. Sound Effects (Placeholders for future audio files)
window.playTap = () => {
    // console.log("🔈 Disc Picked Up");
    // If you have a sound file: new Audio('/audio/tap.mp3').play();
};

window.playError = (pegIndex) => {
    const peg = document.getElementById(`peg-${pegIndex}`);
    
    // Visual Feedback for Invalid Move
    peg.style.transition = "all 0.1s";
    peg.style.filter = "drop-shadow(0 0 15px #ff0055)";
    
    // Shake Animation
    peg.classList.add('shake-error');
    
    setTimeout(() => {
        peg.classList.remove('shake-error');
        peg.style.filter = "";
    }, 400);
};

// 2. Victory Sequence
window.triggerVictory = (moves) => {
    const container = document.getElementById('game-container');
    const layout = document.getElementById('game-layout');

    // Add a "Hyper-glow" to the winning peg
    const winningPeg = document.getElementById('peg-2');
    winningPeg.style.boxShadow = "0 0 50px #00f3ff, inset 0 0 20px #00f3ff";

    // Create a "Victory Overlay"
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 243, 255, 0.1)';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '1000';
    overlay.style.backdropFilter = 'blur(5px)';
    overlay.style.animation = 'fadeIn 0.5s ease-out';

    overlay.innerHTML = `
        <div style="text-align:center; padding: 40px; background: rgba(0,0,0,0.8); border: 2px solid #00f3ff; border-radius: 20px; box-shadow: 0 0 30px #00f3ff;">
            <h1 style="color: #00f3ff; font-family: 'Poppins', sans-serif; margin-bottom: 10px;">LEVEL CLEARED</h1>
            <p style="color: #fff; font-family: 'Poppins', sans-serif;">MOVES DETECTED: ${moves}</p>
            <button id="next-btn" class="btn-neon" style="margin-top:20px; padding: 10px 30px; cursor: pointer;">PROCEED TO NEXT LEVEL</button>
        </div>
    `;

    document.body.appendChild(overlay);

    // Handle Next Level Redirect
    document.getElementById('next-btn').onclick = () => {
        const nextLevel = parseInt(currentLevel) + 1;
        window.location.href = `/game/${nextLevel}`;
    };
};

// 3. CSS Animations Injection
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    .shake-error {
        animation: shake 0.3s cubic-bezier(.36,.07,.19,.97) both;
    }

    @keyframes shake {
        10%, 90% { transform: translate3d(-1px, 0, 0); }
        20%, 80% { transform: translate3d(2px, 0, 0); }
        30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
        40%, 60% { transform: translate3d(4px, 0, 0); }
    }

    .btn-neon {
        background: transparent;
        color: #00f3ff;
        border: 1px solid #00f3ff;
        border-radius: 5px;
        transition: 0.3s;
        text-transform: uppercase;
        letter-spacing: 2px;
    }

    .btn-neon:hover {
        background: #00f3ff;
        color: #000;
        box-shadow: 0 0 20px #00f3ff;
    }
`;
document.head.appendChild(style);