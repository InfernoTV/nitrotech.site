import React, { useState, useEffect } from 'react';
import { CRTEffects } from './effects/CRTEffects';
import { useAudio } from '../hooks/useAudio';
import { useTheme } from '../hooks/useTheme';

interface LoginScreenProps {
  onLogin: (username: string, password: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [glitchText, setGlitchText] = useState('');
  const { playSound } = useAudio();
  const { theme } = useTheme();

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
      setIsLoading(true);
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
    <div 
      className="login-screen"
      style={{
        backgroundImage: `url('/new logo.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative'
      }}
    >
      {/* Dark overlay for better text readability */}
      <div 
        className="login-overlay"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `linear-gradient(
            135deg,
            rgba(0, 0, 0, 0.2) 0%,
            ${theme.primary}60 30%,
            ${theme.secondary}50 70%,
            rgba(0, 0, 0, 0.2) 100%
          )`,
          backdropFilter: 'blur(1px)',
          zIndex: 1
        }}
      />
      
      <CRTEffects />
      
      <div className="login-container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="login-header">
          <div className="logo-container">
            <img 
              src="/new logo.png" 
              alt="Copland OS Enterprise" 
              className="login-logo"
              style={{
                filter: `brightness(0) invert(1)`,
                color: theme.primary,
                WebkitFilter: `brightness(0) invert(1)`,
                mixBlendMode: 'multiply'
              }}
            />
          </div>
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
          <p className="version">
            <a 
              href="https://guns.lol/infernoytv" 
              target="_blank" 
              rel="noopener noreferrer"
              className="producer-link"
            >
              Produced By Inferno
            </a>
          </p>
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
            {isLoading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <span>CONNECTING...</span>
              </div>
            ) : (
              'INITIALIZE CONNECTION'
            )}
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