import React, { useState } from 'react';
import { Palette, Home, Wifi, Volume2, Settings, Sparkles } from 'lucide-react';
import { ColorPicker } from './ColorPicker';
import { TrailSettings } from './TrailSettings';
import { useAudio } from '../hooks/useAudio';

interface TaskbarProps {
  onOpenProgram: (program: string) => void;
  windows: Array<{
    id: string;
    program: string;
    title: string;
    isMinimized: boolean;
    zIndex: number;
  }>;
  onWindowAction: (windowId: string) => void;
}

export const Taskbar: React.FC<TaskbarProps> = ({ 
  onOpenProgram, 
  windows, 
  onWindowAction 
}) => {
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showTrailSettings, setShowTrailSettings] = useState(false);
  const { playSound } = useAudio();

  // Calculate the maximum z-index from all windows
  const maxWindowZIndex = windows.reduce((max, window) => Math.max(max, window.zIndex), 0);
  const taskbarZIndex = maxWindowZIndex + 1000;

  // Apply dynamic z-index to taskbar
  React.useEffect(() => {
    document.documentElement.style.setProperty('--taskbar-z-index', taskbarZIndex.toString());
  }, [taskbarZIndex]);
  const handleStartClick = () => {
    setShowStartMenu(!showStartMenu);
    playSound('select');
  };

  const handleProgramClick = (program: string) => {
    onOpenProgram(program);
    setShowStartMenu(false);
    playSound('switch');
  };

  const handleThemeClick = () => {
    setShowColorPicker(true);
    setShowStartMenu(false);
    playSound('select');
  };

  const handleTrailClick = () => {
    setShowTrailSettings(true);
    setShowStartMenu(false);
    playSound('select');
  };
  return (
    <>
      <div className="taskbar">
        <div className="taskbar-left">
          <button className="start-button" onClick={handleStartClick}>
            <img 
              src="/new logo.png" 
              alt="Copland OS" 
              className="start-logo"
            />
            <span>START</span>
          </button>
          
          {showStartMenu && (
            <div className="start-menu">
              <div className="start-menu-header">
                <img 
                  src="/new logo.png" 
                  alt="Copland OS" 
                  className="menu-logo"
                />
                <div className="menu-title">
                  <div>Copland OS Enterprise</div>
                  <div className="menu-subtitle">Produced By Tachibana Lab</div>
                </div>
              </div>
              
              <div className="start-menu-items">
                <button onClick={() => handleProgramClick('terminal')}>
                  <span>💻</span> Terminal
                </button>
                <button onClick={() => handleProgramClick('wired')}>
                  <span>🌐</span> Browse the Wired
                </button>
                <button onClick={() => handleProgramClick('memory')}>
                  <span>💾</span> Memory Bank
                </button>
                <button onClick={() => handleProgramClick('network')}>
                  <span>📡</span> Network Scanner
                </button>
                <button onClick={() => handleProgramClick('system')}>
                  <span>🖥️</span> System Monitor
                </button>
                <button onClick={() => handleProgramClick('audio')}>
                  <span>🎧</span> Audio Console
                </button>
                <div className="menu-separator"></div>
                <button onClick={handleThemeClick}>
                  <Palette size={16} /> Theme Settings
                </button>
                <button onClick={handleTrailClick}>
                  <Sparkles size={16} /> Trail Effects
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="taskbar-center">
          {windows.map(window => (
            <button
              key={window.id}
              className={`taskbar-window ${window.isMinimized ? 'minimized' : ''}`}
              onClick={() => onWindowAction(window.id)}
            >
              {window.title}
            </button>
          ))}
        </div>

        <div className="taskbar-right">
          <div className="system-tray">
            <Wifi size={16} />
            <Volume2 size={16} />
            <Settings size={16} />
          </div>
          <div className="taskbar-clock">
            {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {showColorPicker && (
        <ColorPicker onClose={() => setShowColorPicker(false)} />
      )}
      
      {showTrailSettings && (
        <TrailSettings onClose={() => setShowTrailSettings(false)} />
      )}
    </>
  );
};