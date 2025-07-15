import React, { useState, useEffect, useCallback } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { Terminal } from './components/Terminal';
import { WiredBrowser } from './components/programs/WiredBrowser';
import { MemoryBank } from './components/programs/MemoryBank';
import { NetworkScanner } from './components/programs/NetworkScanner';
import { SystemMonitor } from './components/programs/SystemMonitor';
import { AudioConsole } from './components/programs/AudioConsole';
import { Taskbar } from './components/Taskbar';
import { WindowManager } from './components/WindowManager';
import { CRTEffects } from './components/effects/CRTEffects';
import { MouseTrail } from './components/effects/MouseTrail';
import { GlitchOverlay } from './components/effects/GlitchOverlay';
import { ParticleSystem } from './components/effects/ParticleSystem';
import { useAudio } from './hooks/useAudio';
import { useCursor } from './hooks/useCursor';
import { useTheme } from './hooks/useTheme';

type Program = 'terminal' | 'memory' | 'network' | 'system' | 'audio' | 'wired';

interface WindowState {
  id: string;
  program: Program;
  title: string;
  isMinimized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
}
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSpecialLogin, setIsSpecialLogin] = useState(false);
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [nextZIndex, setNextZIndex] = useState(1000);
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
      // Open terminal by default
      openProgram('terminal');
    }, 3000);
  };

  const openProgram = useCallback((program: Program) => {
    const programTitles = {
      terminal: 'Terminal',
      memory: 'Memory Bank',
      network: 'Network Scanner',
      system: 'System Monitor',
      audio: 'Audio Console',
      wired: 'Browse the Wired'
    };

    const newWindow: WindowState = {
      id: `${program}-${Date.now()}`,
      program,
      title: programTitles[program],
      isMinimized: false,
      position: { 
        x: 50 + (windows.length * 30), 
        y: 50 + (windows.length * 30) 
      },
      size: { width: 800, height: 600 },
      zIndex: nextZIndex
    };

    setWindows(prev => [...prev, newWindow]);
    setNextZIndex(prev => prev + 1);
    playSound('switch');
  }, [windows.length, nextZIndex, playSound]);

  const closeWindow = useCallback((windowId: string) => {
    setWindows(prev => prev.filter(w => w.id !== windowId));
    playSound('error');
  }, [playSound]);

  const minimizeWindow = useCallback((windowId: string) => {
    setWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, isMinimized: !w.isMinimized } : w
    ));
    playSound('key');
  }, [playSound]);

  const focusWindow = useCallback((windowId: string) => {
    setWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, zIndex: nextZIndex } : w
    ));
    setNextZIndex(prev => prev + 1);
  }, [nextZIndex]);

  const updateWindowPosition = useCallback((windowId: string, position: { x: number; y: number }) => {
    setWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, position } : w
    ));
  }, []);

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
            openProgram('terminal');
            break;
          case 'M':
            e.preventDefault();
            openProgram('memory');
            break;
          case 'N':
            e.preventDefault();
            openProgram('network');
            break;
          case 'S':
            e.preventDefault();
            openProgram('system');
            break;
          case 'A':
            e.preventDefault();
            openProgram('audio');
            break;
          case 'W':
            e.preventDefault();
            openProgram('wired');
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
  }, [openProgram, triggerGlitch]);

  const renderProgram = () => {
    switch (program) {
      case 'memory':
        return <MemoryBank onSwitchProgram={openProgram} />;
      case 'network':
        return <NetworkScanner onSwitchProgram={openProgram} />;
      case 'system':
        return <SystemMonitor onSwitchProgram={openProgram} />;
      case 'audio':
        return <AudioConsole onSwitchProgram={openProgram} />;
      case 'wired':
        return <WiredBrowser onSwitchProgram={openProgram} />;
      default:
        return <Terminal onSwitchProgram={openProgram} />;
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
        <div className="desktop">
          {windows.map(window => (
            <WindowManager
              key={window.id}
              window={window}
              onClose={() => closeWindow(window.id)}
              onMinimize={() => minimizeWindow(window.id)}
              onFocus={() => focusWindow(window.id)}
              onMove={(position) => updateWindowPosition(window.id, position)}
            >
              {(() => {
                switch (window.program) {
                  case 'memory':
                    return <MemoryBank onSwitchProgram={openProgram} />;
                  case 'network':
                    return <NetworkScanner onSwitchProgram={openProgram} />;
                  case 'system':
                    return <SystemMonitor onSwitchProgram={openProgram} />;
                  case 'audio':
                    return <AudioConsole onSwitchProgram={openProgram} />;
                  case 'wired':
                    return <WiredBrowser onSwitchProgram={openProgram} />;
                  default:
                    return <Terminal onSwitchProgram={openProgram} />;
                }
              })()}
            </WindowManager>
          ))}
        </div>
        
        <Taskbar 
          onOpenProgram={openProgram}
          windows={windows}
          onWindowAction={minimizeWindow}
        />
      </div>
    </div>
  );
}

export default App;