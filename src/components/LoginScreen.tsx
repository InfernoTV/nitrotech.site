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
      playSound('select');
      onLogin(username, password);
    } else {
      playSound('error');
      setAttempts(prev => prev + 1);
    }
  };

  // Calculate hue rotation based on theme primary color
  const getHueRotation = () => {
    // Extract hue from HSL or convert RGB to HSL
    const primaryColor = theme.primary;
    
    // If it's already an HSL color, extract the hue
    if (primaryColor.startsWith('hsl')) {
      const hueMatch = primaryColor.match(/hsl\((\d+)/);
      return hueMatch ? parseInt(hueMatch[1]) : 120;
    }
    
    // For hex colors, convert to HSL
    const hex = primaryColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    
    if (max !== min) {
      const d = max - min;
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    
    return Math.round(h * 360);
  };

  const hueRotation = getHueRotation();

  // Convert theme color to filter values for better logo color matching
  const getLogoFilter = () => {
    // This creates a filter that makes the logo match the theme color more precisely
    return `brightness(0) saturate(100%) invert(100%) sepia(100%) saturate(10000%) hue-rotate(${hueRotation}deg) brightness(1) contrast(1) drop-shadow(0 0 20px ${theme.primary})`;
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
        filter: `hue-rotate(${hueRotation}deg) brightness(0.6) contrast(1.1)`,
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
            rgba(0, 0, 0, 0.4) 0%,
            rgba(var(--primary-rgb), 0.2) 50%,
            rgba(0, 0, 0, 0.4) 100%
          )`,
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
                filter: getLogoFilter()
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