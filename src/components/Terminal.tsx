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
      `
╭─────────────────────────────────────────────────────────────────────────────╮
│                           NAVI COPLAND OS v2.025                           │
│                         AVAILABLE SYSTEM COMMANDS                          │
╰─────────────────────────────────────────────────────────────────────────────╯

┌─────────────┬───────────────────────────────────────────────────────────────┐
│   COMMAND   │                           ACTION                              │
├─────────────┼───────────────────────────────────────────────────────────────┤
│ 💾 memory   │ Access neural memory bank system                              │
│ 🌐 network  │ Launch network scanner and node analyzer                      │
│ 🖥️  system   │ View real-time system monitor                                 │
│ 🎧 audio    │ Open audio console and waveform analyzer                      │
│ 🎨 theme    │ Open color theme configuration panel                          │
│ 📊 status   │ Display comprehensive system status                           │
│ ⏰ time     │ Show current system time and date                             │
│ 🕐 uptime   │ Display system uptime statistics                              │
│ 👤 whoami   │ Reveal current user authentication details                    │
│ 💬 echo     │ Echo input text back to terminal                              │
│ 🕳️  matrix   │ Enter the matrix simulation                                   │
│ ❓ reality  │ Question the nature of reality                                │
│ 🧹 clear    │ Clear terminal screen buffer                                  │
│ 👁️  who      │ Mysterious identity query                                     │
│ 🔌 connect  │ Establish connection to the Wired                             │
│ 🔮 lain     │ Special user authentication protocol                          │
└─────────────┴───────────────────────────────────────────────────────────────┘

Type any command to execute. Use CTRL+SHIFT+[T/M/N/S/A] for quick navigation.
      "NAVI COPLAND OS v2.025 - AVAILABLE SYSTEM COMMANDS",
      "",
      "COMMAND      ACTION",
      "─────────────────────────────────────────────────────────────────────",
      "💾 memory    Access neural memory bank system",
      "🌐 network   Launch network scanner and node analyzer", 
      "🖥️  system    View real-time system monitor",
      "🎧 audio     Open audio console and waveform analyzer",
      "🎨 theme     Open color theme configuration panel",
      "📊 status    Display comprehensive system status",
      "⏰ time      Show current system time and date",
      "🕐 uptime    Display system uptime statistics", 
      "👤 whoami    Reveal current user authentication details",
      "💬 echo      Echo input text back to terminal",
      "🕳️  matrix    Enter the matrix simulation",
      "❓ reality   Question the nature of reality",
      "🧹 clear     Clear terminal screen buffer",
      "👁️  who       Mysterious identity query",
      "🔌 connect   Establish connection to the Wired",
      "🔮 lain      Special user authentication protocol",
      "",
      "Type any command to execute. Use CTRL+SHIFT+[T/M/N/S/A] for quick navigation.",
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
      \`  CPU: ${Math.floor(Math.random() * 100)}%`,
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
      <div className="terminal" onClick={handleTerminalClick}>
      <div className="terminal-header">
        <div className="terminal-title">TERMINAL_001.EXE</div>
        <div className="terminal-controls">
          <span className="control minimize">_</span>
          <span className="control maximize">□</span>
          <span className="control close">×</span>
        </div>
      </div>
      
      <div className="terminal-content">
        <div className="terminal-output">
          <pre className="welcome-text">{welcomeText}</pre>
          {history.map((line, index) => (
            <div key={index} className="terminal-line">
              {line}
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
            autoComplete="off"
            spellCheck="false"
          />
          <span className={`cursor ${showCursor ? 'visible' : ''}`}>█</span>
        </div>
      </div>
    </div>
      
      {showColorPicker && (
        <ColorPicker onClose={() => setShowColorPicker(false)} />
      )}
    </>
  );
};
    ]
  }
}