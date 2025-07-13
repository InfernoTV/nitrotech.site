import React, { useState, useEffect } from 'react';
import { useAudio } from '../../hooks/useAudio';

interface MemoryBankProps {
  onSwitchProgram: (program: string) => void;
}

export const MemoryBank: React.FC<MemoryBankProps> = ({ onSwitchProgram }) => {
  const [selectedMemory, setSelectedMemory] = useState<number | null>(null);
  const [glitchText, setGlitchText] = useState('');
  const { playSound } = useAudio();

  const memories = [
    {
      id: 1,
      title: "PROTOCOL_07.DAT",
      content: "Everyone is connected. Everyone is alone. The boundary between self and other becomes meaningless in the Wired.",
      corrupted: false,
    },
    {
      id: 2,
      title: "FRAGMENT_12.MEM",
      content: "I am not the Lain of the real world. I am the Lain of the Wired. We are all connected.",
      corrupted: true,
    },
    {
      id: 3,
      title: "ECHO_999.LOG",
      content: "Present day, present time. The distinction between reality and virtuality fades. What is real?",
      corrupted: false,
    },
    {
      id: 4,
      title: "DELETED_FILE.ERR",
      content: "████ ████ ████ MEMORY CORRUPTION DETECTED ████ ████ ████",
      corrupted: true,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const chars = "!@#$%^&*()_+-=[]{}|;:,.<>?";
      setGlitchText(Array.from({length: 20}, () => 
        chars[Math.floor(Math.random() * chars.length)]
      ).join(''));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleMemoryClick = (memoryId: number) => {
    playSound('select');
    setSelectedMemory(memoryId === selectedMemory ? null : memoryId);
  };

  return (
    <div className="memory-bank">
      <div className="program-header">
        <h2>MEMORY BANK_SYSTEM</h2>
        <button 
          className="back-btn"
          onClick={() => onSwitchProgram('terminal')}
        >
          [ESC] RETURN
        </button>
      </div>

      <div className="memory-grid">
        <div className="memory-list">
          <div className="ascii-banner">
{`
███╗   ███╗███████╗███╗   ███╗ ██████╗ ██████╗ ██╗   ██╗
████╗ ████║██╔════╝████╗ ████║██╔═══██╗██╔══██╗╚██╗ ██╔╝
██╔████╔██║█████╗  ██╔████╔██║██║   ██║██████╔╝ ╚████╔╝ 
██║╚██╔╝██║██╔══╝  ██║╚██╔╝██║██║   ██║██╔══██╗  ╚██╔╝  
██║ ╚═╝ ██║███████╗██║ ╚═╝ ██║╚██████╔╝██║  ██║   ██║   
╚═╝     ╚═╝╚══════╝╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝   
`}
          </div>
          
          {memories.map((memory) => (
            <div
              key={memory.id}
              className={`memory-entry ${memory.corrupted ? 'corrupted' : ''} ${
                selectedMemory === memory.id ? 'selected' : ''
              }`}
              onClick={() => handleMemoryClick(memory.id)}
            >
              <div className="memory-title">
                {memory.corrupted && <span className="glitch-indicator">[!] </span>}
                {memory.title}
              </div>
              <div className="memory-size">
                {Math.floor(Math.random() * 999)}KB
              </div>
            </div>
          ))}

          <div className="memory-status">
            <div>ACTIVE MEMORIES: {memories.length}</div>
            <div>CORRUPTION LEVEL: {Math.floor(Math.random() * 47)}%</div>
            <div className="glitch-line">GLITCH: {glitchText}</div>
          </div>
        </div>

        <div className="memory-viewer">
          {selectedMemory ? (
            <div className="memory-content">
              <div className="content-header">
                VIEWING: {memories.find(m => m.id === selectedMemory)?.title}
              </div>
              <div className="content-body">
                {memories.find(m => m.id === selectedMemory)?.content}
              </div>
              {memories.find(m => m.id === selectedMemory)?.corrupted && (
                <div className="corruption-warning">
                  WARNING: MEMORY INTEGRITY COMPROMISED
                  <div className="corruption-artifacts">
                    {Array.from({length: 10}, (_, i) => (
                      <span key={i} className="artifact">
                        {String.fromCharCode(Math.floor(Math.random() * 94) + 33)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="no-selection">
              SELECT A MEMORY TO VIEW CONTENTS
              <div className="selection-hint">
                Click on any memory entry to access its contents.
                Corrupted files may contain unexpected data.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};