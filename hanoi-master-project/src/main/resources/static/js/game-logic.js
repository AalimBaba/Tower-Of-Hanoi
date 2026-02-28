/**
 * Hanoi Master Engine - Core Logic
 */
let towers = [[], [], []];
let selectedDisc = null;
let moveCount = 0;
let dragState = {
    isDragging: false,
    discSize: null,
    fromPeg: null,
    discElement: null
};
let currentLevel = 1;
let discCount = 3;

// Neon Palette for Discs
const colors = ['#00f3ff', '#ff00ff', '#bc00ff', '#00ff8c', '#ffcf00'];

/**
 * Initializes the game state based on the discCount provided by Thymeleaf
 * @param {number} level - Optional level parameter for game.html
 */
function initGame(level) {
    towers = [[], [], []];
    moveCount = 0;
    selectedDisc = null;
    dragState = {
        isDragging: false,
        discSize: null,
        fromPeg: null,
        discElement: null
    };
    
    // Handle level parameter from game.html
    if (level !== undefined && !isNaN(level)) {
        currentLevel = level;
        discCount = level + 2;
    } else if (typeof currentLevel !== 'undefined') {
        // Use existing currentLevel from Thymeleaf (play.html)
        discCount = parseInt(currentLevel) + 2;
    }
    
    const moveDisplay = document.getElementById('move-count');
    if(moveDisplay) moveDisplay.innerText = '0';

    // Check which template is being used
    const playPegs = [
        document.getElementById('peg-0'),
        document.getElementById('peg-1'),
        document.getElementById('peg-2')
    ];
    
    const gamePegs = [
        document.getElementById('tower-1'),
        document.getElementById('tower-2'),
        document.getElementById('tower-3')
    ];
    
    // Use play.html structure if available, otherwise use game.html
    const usingPlayTemplate = playPegs[0] !== null;
    const usingGameTemplate = gamePegs[0] !== null;

    // Clear existing discs from visual pegs
    if (usingPlayTemplate) {
        playPegs.forEach(p => { if(p) p.innerHTML = ''; });
    }
    if (usingGameTemplate) {
        const stacks = [
            document.getElementById('stack-1'),
            document.getElementById('stack-2'),
            document.getElementById('stack-3')
        ];
        stacks.forEach(s => { if(s) s.innerHTML = ''; });
    }

    // Build the stack on the first peg
    for (let i = discCount; i > 0; i--) {
        const disc = createDisc(i);
        towers[0].push(i);
        
        if (usingPlayTemplate && playPegs[0]) {
            playPegs[0].appendChild(disc);
        }
        if (usingGameTemplate) {
            const stack1 = document.getElementById('stack-1');
            if (stack1) stack1.appendChild(disc);
        }
    }
    
    // Add drag and drop event listeners to pegs
    setupDragAndDrop();
    
    console.log(`Game Started: Level ${currentLevel} with ${discCount} discs.`);
}

/**
 * Creates a disc element with proper attributes
 */
function createDisc(size) {
    const disc = document.createElement('div');
    disc.className = 'disc';
    // Dynamic width based on size
    const baseWidth = 40;
    const widthIncrement = 25;
    disc.style.width = `${baseWidth + (size * widthIncrement)}px`;
    disc.style.backgroundColor = colors[(size - 1) % colors.length];
    disc.dataset.size = size;
    disc.draggable = true;
    
    // Add drag event listeners to the disc
    disc.addEventListener('dragstart', handleDragStart);
    disc.addEventListener('dragend', handleDragEnd);
    
    return disc;
}

/**
 * Sets up drag and drop event listeners for all pegs
 */
function setupDragAndDrop() {
    // Check which template is being used
    const playPegs = [
        document.getElementById('peg-0'),
        document.getElementById('peg-1'),
        document.getElementById('peg-2')
    ];
    
    const gamePegs = [
        document.getElementById('tower-1'),
        document.getElementById('tower-2'),
        document.getElementById('tower-3')
    ];
    
    const usingPlayTemplate = playPegs[0] !== null;
    const usingGameTemplate = gamePegs[0] !== null;
    
    if (usingPlayTemplate) {
        playPegs.forEach((peg, index) => {
            if (peg) {
                peg.addEventListener('dragover', handleDragOver);
                peg.addEventListener('dragenter', handleDragEnter);
                peg.addEventListener('dragleave', handleDragLeave);
                peg.addEventListener('drop', handleDrop);
            }
        });
    }
    
    if (usingGameTemplate) {
        gamePegs.forEach((peg, index) => {
            if (peg) {
                peg.addEventListener('dragover', allowDrop);
                peg.addEventListener('drop', handleGameDrop);
            }
        });
    }
}

/**
 * Legacy function for game.html compatibility
 */
function allowDrop(ev) {
    ev.preventDefault();
}

/**
 * Handles the start of a drag event
 */
function handleDragStart(e) {
    const discElement = e.target;
    const stackElement = discElement.parentElement;
    
    // Determine which peg/tower the disc is on
    let pegIndex = -1;
    
    // Check play.html structure
    const playPegs = [
        document.getElementById('peg-0'),
        document.getElementById('peg-1'),
        document.getElementById('peg-2')
    ];
    
    // Check game.html structure
    const gamePegs = [
        document.getElementById('tower-1'),
        document.getElementById('tower-2'),
        document.getElementById('tower-3')
    ];
    
    for (let i = 0; i < playPegs.length; i++) {
        if (playPegs[i] && playPegs[i].contains(discElement)) {
            pegIndex = i;
            break;
        }
    }
    
    if (pegIndex === -1) {
        for (let i = 0; i < gamePegs.length; i++) {
            const stack = gamePegs[i].querySelector('.disc-stack');
            if (stack && stack.contains(discElement)) {
                pegIndex = i;
                break;
            }
        }
    }
    
    // Check if there's a disc to drag
    if (pegIndex === -1 || towers[pegIndex].length === 0) {
        e.preventDefault();
        return;
    }
    
    const topDisc = towers[pegIndex][towers[pegIndex].length - 1];
    
    dragState.isDragging = true;
    dragState.discSize = topDisc;
    dragState.fromPeg = pegIndex;
    dragState.discElement = discElement;
    
    // Set data for drag operation
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', dragState.discSize);
    
    // Add visual feedback
    setTimeout(() => {
        discElement.style.opacity = '0.5';
    }, 0);
    
    console.log(`Started dragging disc size ${dragState.discSize} from peg ${pegIndex}`);
}

/**
 * Handles the end of a drag event
 */
function handleDragEnd(e) {
    e.target.style.opacity = '1';
    dragState.isDragging = false;
    dragState.discSize = null;
    dragState.fromPeg = null;
    dragState.discElement = null;
}

/**
 * Handles dragover event to allow dropping
 */
function handleDragOver(e) {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = 'move';
}

/**
 * Handles dragenter event for visual feedback
 */
function handleDragEnter(e) {
    e.preventDefault();
    const pegElement = e.target.closest('.peg') || e.target.closest('.tower-container');
    if (pegElement) {
        pegElement.classList.add('drag-over');
    }
}

/**
 * Handles dragleave event to remove visual feedback
 */
function handleDragLeave(e) {
    const pegElement = e.target.closest('.peg') || e.target.closest('.tower-container');
    if (pegElement) {
        pegElement.classList.remove('drag-over');
    }
}

/**
 * Handles the drop event for play.html
 */
function handleDrop(e) {
    e.preventDefault();
    
    const pegElement = e.target.closest('.peg');
    if (!pegElement) return;
    
    pegElement.classList.remove('drag-over');
    
    const targetPegIndex = parseInt(pegElement.id.split('-')[1]);
    const sourcePegIndex = dragState.fromPeg;
    
    // Can't drop on the same peg
    if (sourcePegIndex === targetPegIndex || sourcePegIndex === null) {
        return;
    }
    
    const targetTower = towers[targetPegIndex];
    const topDiscSize = targetTower.length > 0 ? targetTower[targetTower.length - 1] : 999;
    
    // Valid move check: Smaller disc must go on larger disc
    if (dragState.discSize < topDiscSize) {
        // Remove from source
        towers[sourcePegIndex].pop();
        
        // Add to target
        towers[targetPegIndex].push(dragState.discSize);
        
        // Move the visual element
        pegElement.appendChild(dragState.discElement);
        
        moveCount++;
        const moveDisplay = document.getElementById('move-count');
        if(moveDisplay) moveDisplay.innerText = moveCount;
        
        // Optional Sound Effect
        if (window.playTap) window.playTap();
        
        checkVictory();
    } else {
        // Invalid move: Shake animation or sound
        console.warn("Invalid Move: Cannot place larger disc on smaller one.");
        if (window.playError) window.playError(targetPegIndex);
        else {
            pegElement.classList.add('shake-error');
            setTimeout(() => pegElement.classList.remove('shake-error'), 400);
        }
    }
    
    // Reset drag state
    dragState.isDragging = false;
    dragState.discSize = null;
    dragState.fromPeg = null;
    dragState.discElement = null;
}

/**
 * Handles the drop event for game.html
 */
function handleGameDrop(e) {
    e.preventDefault();
    
    const towerElement = e.target.closest('.tower-container');
    if (!towerElement) return;
    
    const targetPegIndex = parseInt(towerElement.id.split('-')[1]) - 1; // tower-1 -> index 0
    const sourcePegIndex = dragState.fromPeg;
    
    // Can't drop on the same peg
    if (sourcePegIndex === targetPegIndex || sourcePegIndex === null) {
        return;
    }
    
    const targetTower = towers[targetPegIndex];
    const topDiscSize = targetTower.length > 0 ? targetTower[targetTower.length - 1] : 999;
    
    // Valid move check: Smaller disc must go on larger disc
    if (dragState.discSize < topDiscSize) {
        // Remove from source
        towers[sourcePegIndex].pop();
        
        // Add to target
        towers[targetPegIndex].push(dragState.discSize);
        
        // Move the visual element to the stack
        const stackElement = towerElement.querySelector('.disc-stack');
        if (stackElement && dragState.discElement) {
            stackElement.appendChild(dragState.discElement);
        }
        
        moveCount++;
        const moveDisplay = document.getElementById('move-count');
        if(moveDisplay) moveDisplay.innerText = moveCount;
        
        // Optional Sound Effect
        if (window.playTap) window.playTap();
        
        checkVictory();
    } else {
        // Invalid move: Shake animation or sound
        console.warn("Invalid Move: Cannot place larger disc on smaller one.");
    }
    
    // Reset drag state
    dragState.isDragging = false;
    dragState.discSize = null;
    dragState.fromPeg = null;
    dragState.discElement = null;
}

/**
 * Legacy drop function for game.html
 */
function drop(e) {
    handleGameDrop(e);
}

/**
 * Handles the logic when a peg is clicked
 */
function handlePegClick(pegIndex) {
    const pegElement = document.getElementById(`peg-${pegIndex}`);

    // Picking up a disc
    if (selectedDisc === null) {
        if (towers[pegIndex].length === 0) return; // Empty peg

        selectedDisc = {
            size: towers[pegIndex][towers[pegIndex].length - 1],
            fromPeg: pegIndex,
            element: pegElement.lastElementChild
        };
        selectedDisc.element.classList.add('selected');
        
        // Optional Sound Effect
        if (window.playTap) window.playTap();
    } 
    // Dropping a disc
    else {
        const targetTower = towers[pegIndex];
        const topDiscSize = targetTower.length > 0 ? targetTower[targetTower.length - 1] : 999;

        // Valid move check: Smaller disc must go on larger disc
        if (selectedDisc.size < topDiscSize) {
            towers[selectedDisc.fromPeg].pop();
            towers[pegIndex].push(selectedDisc.size);
            pegElement.appendChild(selectedDisc.element);
            
            moveCount++;
            const moveDisplay = document.getElementById('move-count');
            if(moveDisplay) moveDisplay.innerText = moveCount;
            
            checkVictory();
        } else {
            // Invalid move: Shake animation or sound
            console.warn("Invalid Move: Cannot place larger disc on smaller one.");
            if (window.playError) window.playError(pegIndex);
            else {
                pegElement.classList.add('shake-error');
                setTimeout(() => pegElement.classList.remove('shake-error'), 400);
            }
        }
        
        selectedDisc.element.classList.remove('selected');
        selectedDisc = null;
    }
}

/**
 * Checks if all discs have reached the final peg
 */
function checkVictory() {
    // Check tower-2 (index 2) for play.html or tower-3 for game.html
    const targetTowerIndex = 2;
    
    if (towers[targetTowerIndex].length === discCount) {
        console.log("%c LEVEL COMPLETE! ", "background: #00f3ff; color: #000; font-weight: bold;");
        
        setTimeout(() => {
            // Trigger visual effects if they exist
            if (window.triggerVictory) {
                window.triggerVictory(moveCount);
            } else {
                alert(`CONGRATULATIONS!\nLevel ${currentLevel} cleared in ${moveCount} moves.`);
                
                // Advance to next level
                const nextLevel = parseInt(currentLevel) + 1;
                window.location.href = `/game/${nextLevel}`;
            }
        }, 500);
    }
}

function resetLevel() {
    initGame(currentLevel);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    // Check if there's a level parameter already set
    if (typeof currentLevel !== 'undefined') {
        initGame();
    }
});
