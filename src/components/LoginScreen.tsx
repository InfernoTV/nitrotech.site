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
  const [isConnecting, setIsConnecting] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
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
      setIsConnecting(true);
      playSound('select');
      // Add a small delay to show the loading animation
      setTimeout(() => {
        onLogin(username, password);
      }, 1500);
    } else {
      playSound('error');
      setAttempts(prev => prev + 1);
    }
  };


  const handleKeyPress = () => {
    playSound('key');
  };

  const handleProducerClick = () => {
    window.open('https://guns.lol/infernoytv', '_blank', 'noopener,noreferrer');
  };

  const handleBannerClick = () => {
    window.open('https://copland-os.store', '_blank', 'noopener,noreferrer');
  };

  const handleCloseBanner = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowBanner(false);
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
      {showBanner && (
        <div 
          className="version-banner"
          onClick={handleBannerClick}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            background: `linear-gradient(135deg, ${theme.primary}20, ${theme.secondary}20)`,
            borderBottom: `1px solid ${theme.primary}`,
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)',
            boxShadow: `0 2px 10px ${theme.primary}40`
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = `linear-gradient(135deg, ${theme.primary}30, ${theme.secondary}30)`;
            e.currentTarget.style.boxShadow = `0 4px 15px ${theme.primary}60`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = `linear-gradient(135deg, ${theme.primary}20, ${theme.secondary}20)`;
            e.currentTarget.style.boxShadow = `0 2px 10px ${theme.primary}40`;
          }}
        >
          <span style={{
            color: theme.primary,
            fontSize: '0.9rem',
            textShadow: `0 0 10px ${theme.primary}`,
            fontWeight: 600,
            textDecoration: 'underline',
            textDecorationColor: theme.secondary
          }}>
            ⚠️ This is the old version. Try out the new updated version at{' '}
            <strong style={{ color: theme.secondary }}>copland-os.store</strong>
          </span>
          <button
            onClick={handleCloseBanner}
            style={{
              position: 'absolute',
              right: '1rem',
              background: 'transparent',
              border: `1px solid ${theme.primary}`,
              color: theme.primary,
              borderRadius: '4px',
              padding: '0.25rem 0.5rem',
              cursor: 'pointer',
              fontSize: '0.8rem',
              transition: 'all 0.2s ease',
              textShadow: `0 0 5px ${theme.primary}`
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = theme.primary;
              e.currentTarget.style.color = '#000';
              e.currentTarget.style.boxShadow = `0 0 10px ${theme.primary}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = theme.primary;
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            ✕
          </button>
        </div>
      )}
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
          backdropFilter: 'blur(2px)',
          zIndex: 1
        }}
      />
      
      <CRTEffects />
      
      <div 
        className="login-container" 
        style={{ 
          position: 'relative', 
          zIndex: 2,
          marginTop: showBanner ? '3.5rem' : '0',
          transition: 'margin-top 0.3s ease'
        }}
      >
        <div className="login-header" style={{ 
          marginBottom: '1rem'
        }}>
          <div className="logo-container">
            <img 
              src="/new logo.png" 
              alt="Copland OS Enterprise" 
              className="login-logo"
              style={{
                width: '80px',
                height: '80px',
                filter: `brightness(0) invert(1) drop-shadow(0 0 20px ${theme.primary})`,
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
          <p 
            className="version producer-link" 
            onClick={handleProducerClick}
            style={{
              cursor: 'pointer',
              color: theme.secondary,
              transition: 'all 0.3s ease',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = theme.primary;
              e.currentTarget.style.textShadow = `0 0 10px ${theme.primary}`;
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = theme.secondary;
              e.currentTarget.style.textShadow = 'none';
              e.currentTarget.style.textDecoration = 'none';
            }}
          >
            Produced By Inferno
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
              disabled={isConnecting}
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
                disabled={isConnecting}
              />
              <button
                type="button"
                className="show-password"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isConnecting}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={isConnecting}>
            {isConnecting ? (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '10px',
                position: 'relative'
              }}>
                <div 
                  style={{
                    width: '20px',
                    height: '20px',
                    border: `3px solid transparent`,
                    borderTop: `3px solid ${theme.primary}`,
                    borderRight: `3px solid ${theme.primary}`,
                    borderRadius: '50%',
                    animation: 'spin 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite',
                    boxShadow: `0 0 10px ${theme.primary}40`
                  }}
                />
                CONNECTING...
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
