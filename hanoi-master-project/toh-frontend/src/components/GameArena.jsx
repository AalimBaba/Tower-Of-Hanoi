import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import { useWebSocket } from '../hooks/useWebSocket';
import axios from 'axios';
import '../App.css';

/**
 * =========================================================================================
 * GAME ARENA COMPONENT (The Frontend Core)
 * =========================================================================================
 * 
 * ARCHITECTURE OVERVIEW:
 * This is the main "Container" component for the application. It orchestrates:
 * 1. STATE MANAGEMENT: Uses React Hooks (useState, useEffect, useRef) to track the game state.
 * 2. REAL-TIME COMMUNICATION: Integrates with 'useWebSocket' to sync state with the Java Backend.
 * 3. INTERACTION: Uses 'react-draggable' for the physics-based drag-and-drop interface.
 * 4. ALGORITHM VISUALIZATION: Fetches moves from the backend and animates them.
 * 
 * EDUCATIONAL VALUE:
 * - Demonstrates "Lifted State" where the UI reflects the single source of truth (towers array).
 * - Shows how to bridge an imperative animation loop (runSimulation) with React's declarative rendering.
 */
const GameArena = () => {
  // ================= STATE MANAGEMENT =================
  // React Hooks allow functional components to "remember" things.
  const [discs, setDiscs] = useState(3);
  const [towerCount, setTowerCount] = useState(3); // Toggle between 3 and 4 towers
  const [moves, setMoves] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [time, setTime] = useState(0); // Timer in seconds
  const [isActive, setIsActive] = useState(false); // Timer active state
  const [showWinModal, setShowWinModal] = useState(false);
  const [isWon, setIsWon] = useState(false); // Tracks if the game has been won to prevent re-triggering modal
  const [showCrossCheckModal, setShowCrossCheckModal] = useState(false);
  const [crossCheckData, setCrossCheckData] = useState(null);
  
  // Login State
  // Removed

  const simulationRef = useRef(false); // Ref to break the loop instantly on Reset

  /**
   * CUSTOM HOOK: useWebSocket
   * Handles the STOMP protocol connection to Spring Boot.
   * Exposes 'towers' (current state) and 'sendMove' (function to push updates).
   * 
   * WHY WEBSOCKETS?
   * Instead of polling the server every second ("Are we there yet?"), WebSockets open
   * a two-way persistent connection. The server "pushes" updates instantly.
   */
  const { towers, sendMove, sendInit } = useWebSocket(discs, towerCount);

  // ================= DRAG AND DROP LOGIC =================
  // Logic moved inline to Draggable onStop for cleaner closure access to 'towers' state
  // This section is intentionally left blank as the handler is now defined in the render loop.


  // ================= TIMER LOGIC =================
  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTime(time => time + 1);
      }, 1000);
    } else if (!isActive && time !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, time]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // ================= EVENT HANDLERS =================

  // handleLogin removed

  /**
   * Resets the game board.
   * Sends an initialization signal to the backend to clear the room state.
   */
  const handleReset = () => {
    setIsSimulating(false);
    simulationRef.current = false; // Kill any running loops
    setMoves(0);
    setTime(0);
    setIsActive(true); // Restart timer
    setShowWinModal(false);
    setIsWon(false);
    setShowCrossCheckModal(false);
    setCrossCheckData(null);
    if (sendInit) {
      sendInit(discs, towerCount);
    }
  };

  /**
   * WIN CONDITION CHECK
   * Monitors the state of towers to detect if the puzzle is solved.
   * 
   * REACTIVITY:
   * This useEffect runs every time 'towers', 'discs', or 'towerCount' changes.
   * It's a "Reactive" way to enforce rules without explicit checks in every handler.
   */
  useEffect(() => {
    // Target is always the last tower (index 2 for 3-tower, index 3 for 4-tower)
    const targetIndex = towerCount - 1;
    const targetTower = towers[targetIndex];

    // Check if target tower has all disks
    // Also ensure moves > 0 so it doesn't trigger on initial load if something is weird (though initial is tower 0)
    // And ensure we haven't already won (to prevent loop)
    if (targetTower && targetTower.length === discs && discs > 0 && !isWon) {
        // Stop timer
        setIsActive(false);
        // Show success modal
        setShowWinModal(true);
        setIsWon(true);
    }
  }, [towers, discs, towerCount, isWon]);

  /**
   * THE AUTO-SOLVE SIMULATION
   * 1. Fetches the optimal move list from the Java Backend.
   * 2. Iterates through moves and updates the state with a delay.
   * 
   * ASYNC/AWAIT:
   * Allows us to write asynchronous code (waiting for server, waiting for animation delay)
   * in a linear, readable style.
   */
  const runSimulation = async () => {
    if (isSimulating) return;
    
    // Reset first to ensure clean state
    handleReset();
    await new Promise(r => setTimeout(r, 500)); // Wait for reset to sync

    setIsSimulating(true);
    simulationRef.current = true;
    setIsActive(true); // Ensure timer is running

    try {
      // DYNAMIC ENDPOINT SELECTION
      // If 4-Tower Mode -> Call Frame-Stewart Solver
      // If 3-Tower Mode -> Call Recursive Solver
      const endpoint = towerCount === 4 
        ? `http://localhost:8080/api/dsa/solve4/${discs}`
        : `http://localhost:8080/api/dsa/solve/${discs}`;

      const response = await axios.get(endpoint);
      const solutionMoves = response.data; // List of [from, to]

      // Animation Loop
      for (const move of solutionMoves) {
        if (!simulationRef.current) break; // Stop if Reset was pressed
        const [from, to] = move;
        
        // Send move to WebSocket (updates UI for all players)
        sendMove(from, to);
        setMoves(m => m + 1);

        // Delay for visual effect
        // Reduce delay for large number of moves to ensure completion
        // Slowed down by 45% (50 -> 73, 500 -> 725)
        const delay = solutionMoves.length > 100 ? 73 : 725;
        await new Promise(res => setTimeout(res, delay));
      }
    } catch (error) {
      console.error("Simulation failed:", error);
    } finally {
      setIsSimulating(false);
      simulationRef.current = false;
      setIsActive(false); // Stop timer when done
    }
  };

  /**
   * CROSS-CHECK CODES (Complexity Validation)
   * Fetches performance metrics from the backend and alerts the user.
   * Compares current moves against the theoretical minimum (Frame-Stewart or Recursive).
   */
  const handleCrossCheck = async () => {
    try {
        const response = await axios.get(`http://localhost:8080/api/dsa/compare/${discs}`);
        const data = response.data;
        
        // Determine optimal moves based on current mode
        const optimalMoves = towerCount === 4 ? data.moves4Tower : data.moves3Tower;
        
        // Comparison Logic
        const isOptimal = moves <= optimalMoves;
        let statusMsg = "";
        
        if (moves === 0) {
            statusMsg = "Start Position";
        } else if (moves < optimalMoves) {
            statusMsg = "In Progress";
        } else if (moves === optimalMoves) {
            statusMsg = "Optimal Count Reached";
        } else {
            statusMsg = "SUB-OPTIMAL PATH DETECTED";
        }

        setCrossCheckData({
            currentMoves: moves,
            optimalMoves: optimalMoves,
            status: statusMsg,
            isOptimal: isOptimal,
            benchmarks: {
                threeTower: data.moves3Tower,
                fourTower: data.moves4Tower,
                time3: data.time3TowerRecursive,
                time4: data.time4TowerFrameStewart
            }
        });
        setShowCrossCheckModal(true);

    } catch (e) {
      console.error(e);
      alert("Failed to fetch analysis. Ensure Backend is running.");
    }
  };

  // ================= RENDER =================
  return (
    <div className="zen-view">
      
      {/* HEADER DESCRIPTION */}
      <div className="header-desc">
        <h1 className="main-title">TOWER OF HANOI</h1>
        <p className="sub-desc">
            Move all disks to the last rod. Never place a larger disk on a smaller one.
        </p>
      </div>

      {/* WIN MODAL */}
      {showWinModal && (
        <div className="modal-overlay">
          <div className="login-box">
            <h2 className="login-title">PUZZLE SOLVED!</h2>
            <div style={{ color: 'white', marginBottom: '20px', fontSize: '1.2rem', fontFamily: 'Shojumaru, cursive' }}>
              <p>Congratulations!</p>
              <p>You completed the puzzle in:</p>
              <p style={{ color: '#f1c40f', fontSize: '1.5rem' }}>{moves} Moves</p>
              <p style={{ color: '#2ecc71', fontSize: '1.5rem' }}>{formatTime(time)}</p>
            </div>
            <button 
                className="btn btn-primary" 
                onClick={() => { setShowWinModal(false); }}
                style={{ fontSize: '1.2rem', padding: '10px 30px' }}
            >
              CLOSE
            </button>
            <button 
                className="btn btn-primary" 
                onClick={() => {
                  setShowWinModal(false);
                  handleCrossCheck();
                }}
                style={{ fontSize: '1.2rem', padding: '10px 30px', marginLeft: '20px' }}
            >
              CROSS CHECK
            </button>
            <button 
                className="btn btn-warning" 
                onClick={handleReset}
                style={{ fontSize: '1.2rem', padding: '10px 30px', marginLeft: '20px' }}
            >
              RESTART
            </button>
          </div>
        </div>
      )}

      {/* CROSS CHECK MODAL */}
      {showCrossCheckModal && crossCheckData && (
        <div className="modal-overlay">
          <div className="login-box" style={{ maxWidth: '600px', width: '90%' }}>
            <h2 className="login-title">CROSS-CHECK REPORT</h2>
            <div style={{ color: 'white', marginBottom: '20px', fontSize: '1rem', fontFamily: 'Orbitron, sans-serif', textAlign: 'left', padding: '0 20px' }}>
              
              <div style={{ marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: '10px' }}>
                <h3 style={{ color: '#f1c40f', marginTop: 0 }}>CURRENT STATUS</h3>
                <p><strong>Your Moves:</strong> {crossCheckData.currentMoves}</p>
                <p><strong>Optimal Moves:</strong> {crossCheckData.optimalMoves}</p>
                <p><strong>Status:</strong> <span style={{ color: crossCheckData.currentMoves > crossCheckData.optimalMoves ? '#e74c3c' : '#2ecc71' }}>{crossCheckData.status}</span></p>
              </div>

              <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '5px' }}>
                {crossCheckData.currentMoves > crossCheckData.optimalMoves ? (
                    <div style={{ color: '#e74c3c', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '1.5rem' }}>⚠️</span>
                        <span>WARNING: You have exceeded the theoretical minimum moves!</span>
                    </div>
                ) : (
                    <div style={{ color: '#2ecc71', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '1.5rem' }}>✅</span>
                        <span>You are within the optimal move count.</span>
                    </div>
                )}
              </div>

              <div>
                <h3 style={{ color: '#3498db', marginTop: 0 }}>ALGORITHM BENCHMARKS ({discs} Disks)</h3>
                <p><strong>3-Tower (Recursive):</strong> {crossCheckData.benchmarks.threeTower} moves ({crossCheckData.benchmarks.time3} ns)</p>
                <p><strong>4-Tower (Frame-Stewart):</strong> {crossCheckData.benchmarks.fourTower} moves ({crossCheckData.benchmarks.time4} ns)</p>
              </div>

            </div>
            <button 
                className="btn btn-primary" 
                onClick={() => setShowCrossCheckModal(false)}
                style={{ fontSize: '1.2rem', padding: '10px 30px' }}
            >
              CLOSE
            </button>
          </div>
        </div>
      )}

      {/* HUD: Heads Up Display */}
      <div className="hud">
        <div className="hud-left">
            <div className="hud-item">
                <div className="hud-label">TOWERS</div>
                <div className="hud-value">{towerCount}</div>
            </div>
            <div className="hud-item">
                <div className="hud-label">DISKS</div>
                <div className="hud-value">{discs}</div>
            </div>
        </div>
        
        <div className="hud-right">
            <div className="hud-item">
                <div className="hud-label">TIME</div>
                <div className="hud-value">{formatTime(time)}</div>
            </div>
            <div className="hud-item">
                <div className="hud-label">MOVES</div>
                <div className="hud-value">{moves}</div>
            </div>
        </div>
      </div>

      {/* GAME BOARD */}
      <div className="towers-container">
        {towers.map((towerDisks, towerIndex) => (
          <div key={towerIndex} className="tower-area">
            {/* The Vertical Pole */}
            <div className="pole"></div>
            
            {/* The Base */}
            <div className="base"></div>

            {/* The Disks */}
            <div className="disk-stack">
              {towerDisks.map((diskSize, index) => {
                // Style calculation for width and color
                const width = 40 + diskSize * 22; // Adjusted for up to 15 disks
                // Vivid, flat colors matching screenshot
                const colors = [
                  '#2ecc71', // Green
                  '#e67e22', // Orange
                  '#3498db', // Blue
                  '#9b59b6', // Purple
                  '#f1c40f', // Yellow
                  '#e74c3c', // Red
                  '#1abc9c'  // Teal
                ];
                
                const isTopDisk = index === towerDisks.length - 1;
                
                return (
                  <Draggable 
                    key={`${diskSize}-${towerIndex}`} // Key ensures re-render on move
                    disabled={!isTopDisk || isSimulating} // ONLY TOP DISK DRAGGABLE
                    onStop={(e, data) => {
                        // Calculate nearest tower
                        const towerElements = document.querySelectorAll('.tower-area');
                        let nearestIndex = -1;
                        let minDistance = Infinity;
                        
                        // Get absolute center of the dropped disk
                        const diskRect = e.target.getBoundingClientRect();
                        const diskCenter = diskRect.left + diskRect.width / 2;

                        towerElements.forEach((el, idx) => {
                            const rect = el.getBoundingClientRect();
                            const towerCenter = rect.left + rect.width / 2;
                            const distance = Math.abs(diskCenter - towerCenter);
                            
                            // Snap threshold (must be reasonably close to a tower)
                            if (distance < 100) {
                                if (distance < minDistance) {
                                    minDistance = distance;
                                    nearestIndex = idx;
                                }
                            }
                        });

                        if (nearestIndex !== -1 && nearestIndex !== towerIndex) {
                             // Validate Move: Target must be empty OR top disk > current disk
                             const targetTower = towers[nearestIndex];
                             const targetTopDisk = targetTower.length > 0 ? targetTower[targetTower.length - 1] : Infinity;
                             
                             if (diskSize < targetTopDisk) {
                                 sendMove(towerIndex, nearestIndex);
                                 setMoves(m => m + 1);
                             } else {
                                 // Invalid move visual feedback could go here
                             }
                        }
                    }}
                    position={{x: 0, y: 0}} // Always snap back if not moved via state
                  >
                    <div 
                      className="disk"
                      style={{ 
                        width: `${width}px`,
                        backgroundColor: colors[diskSize % colors.length],
                        cursor: (!isTopDisk || isSimulating) ? 'not-allowed' : 'grab'
                      }}
                    >
                      {/* No numbers in screenshot, keeping clean */}
                    </div>
                  </Draggable>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* SIMULATION PANEL (Control Center) */}
      <div className="simulation-panel">
        <div className="sim-header">SIMULATION CONTROL</div>
        
        <div className="sim-controls">
            {/* Mode Toggles */}
            <div className="control-group">
                <button 
                    className={`btn ${towerCount === 3 ? 'btn-active' : 'btn-primary'}`}
                    onClick={() => { setTowerCount(3); handleReset(); }}
                >
                    3 Towers
                </button>
                <button 
                    className={`btn ${towerCount === 4 ? 'btn-active' : 'btn-primary'}`}
                    onClick={() => { setTowerCount(4); handleReset(); }}
                >
                    4 Towers
                </button>
            </div>

            {/* Disk Selector */}
            <div className="disk-control-group">
                <span className="control-label">DISKS: {discs}</span>
                <input 
                    type="range" 
                    min="1" 
                    max="15" 
                    value={discs} 
                    onChange={(e) => {
                        const newDiscs = parseInt(e.target.value);
                        setDiscs(newDiscs);
                        setMoves(0);
                        setTime(0);
                        setIsSimulating(false);
                        simulationRef.current = false;
                        if (sendInit) sendInit(newDiscs, towerCount);
                    }}
                    className="disk-slider"
                />
            </div>

            {/* Action Buttons */}
            <button className="btn btn-warning" onClick={runSimulation} disabled={isSimulating}>
                {isSimulating ? 'SOLVING...' : 'AUTO SOLVE'}
            </button>
            
            <button className="btn btn-primary" onClick={handleCrossCheck} disabled={isSimulating}>
                CROSS CHECK
            </button>
            
            <button className="btn btn-danger" onClick={handleReset}>
                RESET
            </button>
        </div>
      </div>
    </div>
  );
};

export default GameArena;
