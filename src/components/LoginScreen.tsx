import React, { useState, useEffect } from 'react';
import { CRTEffects } from './effects/CRTEffects';
import { useAudio } from '../hooks/useAudio';

interface LoginScreenProps {
  onLogin: (username: string, password: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [glitchText, setGlitchText] = useState('');
  const { playSound } = useAudio();

  useEffect(() => {
    const interval = setInterval(() => {
      const chars = "!@#$%^&*()_+-=[]{}|;:,.<>?";
      setGlitchText(Array.from({length: 15}, () => 
        chars[Math.floor(Math.random() * chars.length)]
      ).join(''));
    }, 150);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      playSound('select');
      onLogin(username, password);
    } else {
      playSound('error');
      setAttempts(prev => prev + 1);
    }
  };

  const handleKeyPress = () => {
    playSound('key');
  };

  return (
    <div className="login-screen">
      <CRTEffects />
      
      <div className="login-container">
        <div className="login-header">
          <div className="system-logo">
{`
███╗   ██╗ █████╗ ██╗   ██╗██╗
████╗  ██║██╔══██╗██║   ██║██║
██╔██╗ ██║███████║██║   ██║██║
██║╚██╗██║██╔══██║╚██╗ ██╔╝██║
██║ ╚████║██║  ██║ ╚████╔╝ ██║
╚═╝  ╚═══╝╚═╝  ╚═╝  ╚═══╝  ╚═╝
`}
          </div>
          <h1>COPLAND OPERATING SYSTEM</h1>
          <p className="version">Version 2.025 - Neural Interface Protocol</p>
          <div className="glitch-line">SYSTEM_STATUS: J946@5488AA97464</div>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">USERNAME:</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter username..."
              autoFocus
              autoComplete="off"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">PASSWORD:</label>
            <div className="password-container">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter password..."
                autoComplete="off"
              />
              <button
                type="button"
                className="show-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <button type="submit" className="login-btn">
            INITIALIZE CONNECTION
          </button>

          {attempts > 0 && (
            <div className="login-error">
              ACCESS DENIED - INVALID CREDENTIALS
              <div className="error-details">
                FAILED ATTEMPTS: {attempts}
                {attempts > 2 && <div className="warning">SECURITY PROTOCOL ACTIVATED</div>}
              </div>
            </div>
          )}
        </form>

        <div className="login-hints">
          <div className="hint-section">
            <h3>SYSTEM INFORMATION</h3>
            <p>• Any valid credentials will grant access</p>
            <p>• Special authentication available for authorized users</p>
            <p>• Neural interface compatibility required</p>
          </div>
          
          <div className="connection-status">
            <div className="status-indicator active">●</div>
            <span>WIRED CONNECTION: ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
};