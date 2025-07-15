import React, { useState, useEffect, useRef } from 'react';
import { ColorPicker } from './ColorPicker';
import { useTypingEffect } from '../hooks/useTypingEffect';
import { useAudio } from '../hooks/useAudio';
import { useTheme } from '../hooks/useTheme';

interface TerminalProps {
  onSwitchProgram: (program: string) => void;
}

export const Terminal: React.FC<TerminalProps> = ({ onSwitchProgram }) => {
  const [history, setHistory] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { playSound } = useAudio();
  const { theme } = useTheme();

  const welcomeText = useTypingEffect(
    "Welcome to NAVI COPLAND OS v2.025\nNEURAL INTERFACE ONLINE\nType 'help' for available commands...",
    50
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (inputRef.current && !showColorPicker) {
      inputRef.current.focus();
    }
  }, [history, showColorPicker]);

  // Keep input focused when clicking anywhere in terminal
  const handleTerminalClick = () => {
    if (inputRef.current && !showColorPicker) {
      inputRef.current.focus();
    }
  };

  const commands = {
    help: () => [
      `<div class="help-container">
        <div class="help-header">
          <h2>NAVI COPLAND OS v2.025 - Available System Commands</h2>
        </div>
        <table class="help-table">
          <thead>
            <tr>
              <th>Command/Example Usage</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr><td><span class="command">💾 memory</span></td><td>Access neural memory bank system</td></tr>
            <tr><td><span class="command">🌐 network</span></td><td>Launch network scanner and node analyzer</td></tr>
            <tr><td><span class="command">🖥️ system</span></td><td>View real-time system monitor</td></tr>
            <tr><td><span class="command">🎧 audio</span></td><td>Open audio console and waveform analyzer</td></tr>
            <tr><td><span class="command">🎨 theme</span></td><td>Open color theme configuration panel</td></tr>
            <tr><td><span class="command">📊 status</span></td><td>Display comprehensive system status</td></tr>
            <tr><td><span class="command">⏰ time</span></td><td>Show current system time and date</td></tr>
            <tr><td><span class="command">🕐 uptime</span></td><td>Display system uptime statistics</td></tr>
            <tr><td><span class="command">👤 whoami</span></td><td>Reveal current user authentication details</td></tr>
            <tr><td><span class="command">💬 echo [text]</span></td><td>Echo input text back to terminal</td></tr>
            <tr><td><span class="command">🕳️ matrix</span></td><td>Enter the matrix simulation</td></tr>
            <tr><td><span class="command">❓ reality</span></td><td>Question the nature of reality</td></tr>
            <tr><td><span class="command">🧹 clear</span></td><td>Clear terminal screen buffer</td></tr>
            <tr><td><span class="command">👁️ who</span></td><td>Mysterious identity query</td></tr>
            <tr><td><span class="command">🔌 connect</span></td><td>Establish connection to the Wired</td></tr>
            <tr><td><span class="command">🔮 lain</span></td><td>Special user authentication protocol</td></tr>
            <tr><td><span class="command">🌐 wired</span></td><td>Browse the Wired - Access the global network</td></tr>
          </tbody>
        </table>
        <div class="help-footer">
          <p>Type any command to execute. Use CTRL+SHIFT+[T/M/N/S/A/W] for quick navigation.</p>
        </div>
      </div>`
    ],
    clear: () => {
      setHistory([]);
      return [];
    },
    theme: () => {
      setShowColorPicker(true);
      return ["Opening theme configuration..."];
    },
    status: () => [
      "SYSTEM STATUS:",
      `  CPU: ${Math.floor(Math.random() * 100)}%`,
      `  MEMORY: ${Math.floor(Math.random() * 100)}%`,
      `  NETWORK: CONNECTED`,
      `  WIRED STATUS: ACTIVE`,
      `  NEURAL SYNC: ${Math.floor(Math.random() * 100)}%`,
    ],
    time: () => [
      `Current time: ${new Date().toLocaleString()}`,
      `Unix timestamp: ${Math.floor(Date.now() / 1000)}`,
    ],
    uptime: () => [
      `System uptime: ${Math.floor(Math.random() * 999)}:${Math.floor(Math.random() * 60)}:${Math.floor(Math.random() * 60)}`,
      "Last boot: Neural interface initialization",
    ],
    whoami: () => [
      "Current user: AUTHENTICATED",
      "Access level: NEURAL_INTERFACE",
      "Connection: WIRED_PROTOCOL_7",
    ],
    matrix: () => [
      "There is no spoon.",
      "The Matrix has you...",
      "Follow the white rabbit.",
      "Wake up, Neo...",
    ],
    reality: () => [
      "What is real?",
      "How do you define 'real'?",
      "If you're talking about what you can feel...",
      "...what you can smell, taste and see...",
      "...then 'real' is simply electrical signals interpreted by your brain.",
    ],
    memory: () => {
      onSwitchProgram('memory');
      return ["Accessing memory bank..."];
    },
    network: () => {
      onSwitchProgram('network');
      return ["Launching network scanner..."];
    },
    system: () => {
      onSwitchProgram('system');
      return ["Opening system monitor..."];
    },
    audio: () => {
      onSwitchProgram('audio');
      return ["Initializing audio console..."];
    },
    wired: () => {
      onSwitchProgram('wired');
      return ["Connecting to the Wired..."];
    },
    who: () => [
      "You are...",
      "Are you connected?",
      "Everyone is connected.",
      "No one exists alone.",
    ],
    connect: () => [
      "Establishing connection to the Wired...",
      "Connection successful.",
      "You are now part of something larger.",
    ],
    lain: () => [
      "I am here.",
      "I have always been here.",
      "Present day, present time.",
    ],
  };

  const handleEcho = (args: string[]) => {
    return args.length > 0 ? [args.join(' ')] : [''];
  };

  const handleCommand = (cmd: string) => {
    const parts = cmd.trim().split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);
    
    playSound('key');
    
    if (command === 'echo') {
      const output = handleEcho(args);
      setHistory(prev => [...prev, `> ${cmd}`, ...output]);
    } else if (commands[command as keyof typeof commands]) {
      const output = commands[command as keyof typeof commands]();
      setHistory(prev => [...prev, `> ${cmd}`, ...output]);
    } else if (cmd.trim() === '') {
      setHistory(prev => [...prev, '> ']);
    } else {
      setHistory(prev => [...prev, `> ${cmd}`, `Command not found: ${cmd}`]);
    }
    setCurrentInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(currentInput);
    }
  };

  return (
    <>
      <div className="terminal-content" onClick={handleTerminalClick}>
          <div className="terminal-output">
            <pre className="welcome-text">{welcomeText}</pre>
            {history.map((line, index) => (
              <div key={index} className="terminal-line" dangerouslySetInnerHTML={{ __html: line }}>
              </div>
            ))}
          </div>
        
          <div className="terminal-input-line">
            <span className="prompt">navi@copland:~$ </span>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="terminal-input"
              spellCheck="false"
            />
            <span className={`cursor ${showCursor ? 'visible' : ''}`}>█</span>
          </div>
      </div>
      
      {showColorPicker && (
        <ColorPicker onClose={() => setShowColorPicker(false)} />
      )}
    </>
  );
};