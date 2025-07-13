import React, { useState, useEffect, useCallback } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { Terminal } from './components/Terminal';
import { MemoryBank } from './components/programs/MemoryBank';
import { NetworkScanner } from './components/programs/NetworkScanner';
import { SystemMonitor } from './components/programs/SystemMonitor';
import { AudioConsole } from './components/programs/AudioConsole';
import { CRTEffects } from './components/effects/CRTEffects';
import { MouseTrail } from './components/effects/MouseTrail';
import { GlitchOverlay } from './components/effects/GlitchOverlay';
import { ParticleSystem } from './components/effects/ParticleSystem';
import { useAudio } from './hooks/useAudio';
import { useCursor } from './hooks/useCursor';
import { useTheme } from './hooks/useTheme';

type Program = 'terminal' | 'memory' | 'network' | 'system' | 'audio';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSpecialLogin, setIsSpecialLogin] = useState(false);
  const [currentProgram, setCurrentProgram] = useState<Program>('terminal');
  const [isBooting, setIsBooting] = useState(false);
  const [glitchIntensity, setGlitchIntensity] = useState(0);
  const { playSound } = useAudio();
  const { setCursorType } = useCursor();
  const { theme } = useTheme();

  const handleLogin = (username: string, password: string) => {
    setIsBooting(true);
    const isSpecial = username.toLowerCase() === 'lain' && password === 'root';
    setIsSpecialLogin(isSpecial);
    
    playSound('boot');
    
    setTimeout(() => {
      setIsBooting(false);
      setIsLoggedIn(true);
    }, 3000);
  };

  const switchProgram = useCallback((program: Program) => {
    if (program !== currentProgram) {
      setGlitchIntensity(0.3);
      playSound('switch');
      setTimeout(() => {
        setCurrentProgram(program);
        setGlitchIntensity(0);
      }, 200);
    }
  }, [currentProgram, playSound]);

  const triggerGlitch = useCallback(() => {
    setGlitchIntensity(0.8);
    setTimeout(() => setGlitchIntensity(0), 500);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey) {
        switch (e.key) {
          case 'T':
            e.preventDefault();
            switchProgram('terminal');
            break;
          case 'M':
            e.preventDefault();
            switchProgram('memory');
            break;
          case 'N':
            e.preventDefault();
            switchProgram('network');
            break;
          case 'S':
            e.preventDefault();
            switchProgram('system');
            break;
          case 'A':
            e.preventDefault();
            switchProgram('audio');
            break;
          case 'G':
            e.preventDefault();
            triggerGlitch();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [switchProgram, triggerGlitch]);

  const renderProgram = () => {
    switch (currentProgram) {
      case 'memory':
        return <MemoryBank onSwitchProgram={switchProgram} />;
      case 'network':
        return <NetworkScanner onSwitchProgram={switchProgram} />;
      case 'system':
        return <SystemMonitor onSwitchProgram={switchProgram} />;
      case 'audio':
        return <AudioConsole onSwitchProgram={switchProgram} />;
      default:
        return <Terminal onSwitchProgram={switchProgram} />;
    }
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (isBooting) {
    return (
      <div className="boot-screen" style={{ color: theme.primary }}>
        <CRTEffects />
        <div className="boot-content">
          <div className="boot-text">
            <div className="ascii-art">
{`
███╗   ██╗ █████╗ ██╗   ██╗██╗    ██████╗ ██████╗ ██████╗ ██╗      █████╗ ███╗   ██╗██████╗ 
████╗  ██║██╔══██╗██║   ██║██║   ██╔════╝██╔═══██╗██╔══██╗██║     ██╔══██╗████╗  ██║██╔══██╗
██╔██╗ ██║███████║██║   ██║██║   ██║     ██║   ██║██████╔╝██║     ███████║██╔██╗ ██║██║  ██║
██║╚██╗██║██╔══██║╚██╗ ██╔╝██║   ██║     ██║   ██║██╔═══╝ ██║     ██╔══██║██║╚██╗██║██║  ██║
██║ ╚████║██║  ██║ ╚████╔╝ ██║   ╚██████╗╚██████╔╝██║     ███████╗██║  ██║██║ ╚████║██████╔╝
╚═╝  ╚═══╝╚═╝  ╚═╝  ╚═══╝  ╚═╝    ╚═════╝ ╚═════╝ ╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝ 
                                                                                              
                                    ██████╗ ███████╗                                         
                                   ██╔═══██╗██╔════╝                                         
                                   ██║   ██║███████╗                                         
                                   ██║   ██║╚════██║                                         
                                   ╚██████╔╝███████║                                         
                                    ╚═════╝ ╚══════╝                                         
`}
            </div>
            <div className="boot-status">
              <div className="loading-bar">
                <div className="loading-progress" style={{ boxShadow: `0 0 10px ${theme.primary}` }}></div>
              </div>
              <p>INITIALIZING NAVI PROTOCOLS...</p>
              <p>LOADING NEURAL INTERFACE...</p>
              <p>CONNECTING TO THE WIRED...</p>
              {isSpecialLogin && <p style={{ color: theme.accent }}>WELCOME BACK, LAIN...</p>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lain-os" style={{ 
      '--primary-color': theme.primary,
      '--secondary-color': theme.secondary,
      '--accent-color': theme.accent,
      '--background-color': theme.background,
      '--text-color': theme.text
    } as React.CSSProperties}>
      <CRTEffects />
      <GlitchOverlay intensity={glitchIntensity} />
      <MouseTrail />
      {isSpecialLogin && <ParticleSystem />}
      
      <div className="os-interface">
        <div className="program-container">
          {renderProgram()}
        </div>
        
        <div className="status-bar" style={{ 
          background: `rgba(${theme.primaryRgb}, 0.1)`,
          borderColor: theme.primary 
        }}>
          <div className="status-left">
            <span className="status-item">NAVI COPLAND OS v2.025</span>
            <span className="status-item">WIRED: CONNECTED</span>
          </div>
          <div className="status-right">
            <span className="status-item">{new Date().toLocaleTimeString()}</span>
            <span className="status-item">CTRL+SHIFT+[T/M/N/S/A]</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;