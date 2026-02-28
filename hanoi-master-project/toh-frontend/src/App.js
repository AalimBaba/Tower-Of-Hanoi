import React, { useState, useEffect } from 'react';
import GameArena from './components/GameArena';
import AuthModal from './components/AuthModal';
import BeachBackground from './components/BeachBackground';
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    } else {
      // Show auth modal if not logged in
      setShowAuthModal(true);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    setShowAuthModal(true);
  };

  return (
    <div className="app">
      {/* Beach Background */}
      <BeachBackground />
      
      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleLogin}
        />
      )}
      
      {/* Main Game */}
      {isAuthenticated ? (
        <GameArena 
          roomId="Room-101" 
          initialDisks={3}
          user={user}
          onLogout={handleLogout}
        />
      ) : (
        <div className="welcome-screen">
          <div className="welcome-content">
            <h1>Welcome to Tower of Hanoi</h1>
            <p>Please login or register to play the game</p>
            <button 
              className="beach-btn"
              onClick={() => setShowAuthModal(true)}
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
