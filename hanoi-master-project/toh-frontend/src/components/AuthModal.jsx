


import React, { useState } from 'react';
import axios from 'axios';
import './AuthModal.css'; // Optional: separate CSS for the modal

const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        const endpoint = isLogin ? 'login' : 'register';
        
        try {
            // Updated to match your Spring Boot AuthController endpoint
            const res = await axios.post(`http://localhost:8080/api/auth/${endpoint}`, formData);
            
            // Save user data to local storage for session persistence
            localStorage.setItem('user', JSON.stringify(res.data));
            
            alert(`${isLogin ? 'Welcome back' : 'Account created'}, ${res.data.username}!`);
            onAuthSuccess(res.data);
        } catch (err) {
            setError(err.response?.data || "Authentication failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="auth-card">
                <button className="close-x" onClick={onClose}>&times;</button>
                
                <h2 className="auth-title">{isLogin ? 'Login' : 'Create Journey'}</h2>
                <p className="auth-subtitle">
                    {isLogin ? 'Enter your credentials to continue' : 'Join the Hanoi Universal Platform'}
                </p>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group">
                        <label>Username</label>
                        <input 
                            type="text" 
                            placeholder="Enter username" 
                            required 
                            autoComplete="username"
                            value={formData.username}
                            onChange={(e) => setFormData({...formData, username: e.target.value})} 
                        />
                    </div>

                    {!isLogin && (
                        <div className="input-group">
                            <label>Email Address</label>
                            <input 
                                type="email" 
                                placeholder="name@example.com" 
                                required 
                                autoComplete="email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                            />
                        </div>
                    )}

                    <div className="input-group">
                        <label>Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            required 
                            autoComplete={isLogin ? "current-password" : "new-password"}
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})} 
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="auth-submit-btn" disabled={loading}>
                        {loading ? 'Processing...' : (isLogin ? 'Login' : 'Create account')}
                    </button>
                </form>

                <div className="auth-toggle">
                    <span>{isLogin ? "New here?" : "Already have an account?"}</span>
                    <button onClick={() => setIsLogin(!isLogin)} className="toggle-link">
                        {isLogin ? "Join the Game" : "Sign in instead"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;