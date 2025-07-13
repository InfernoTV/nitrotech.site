import React, { useState, useEffect } from 'react';
import { useAudio } from '../../hooks/useAudio';

interface SystemMonitorProps {
  onSwitchProgram: (program: string) => void;
}

interface SystemProcess {
  pid: number;
  name: string;
  cpu: number;
  memory: number;
  status: 'running' | 'sleeping' | 'zombie' | 'unknown';
}

export const SystemMonitor: React.FC<SystemMonitorProps> = ({ onSwitchProgram }) => {
  const [processes, setProcesses] = useState<SystemProcess[]>([]);
  const [cpuUsage, setCpuUsage] = useState(0);
  const [memoryUsage, setMemoryUsage] = useState(0);
  const [networkActivity, setNetworkActivity] = useState(0);
  const [selectedProcess, setSelectedProcess] = useState<number | null>(null);
  const { playSound } = useAudio();

  const processNames = [
    'lain.exe', 'wired_client.dll', 'neural_interface.sys', 'memory_core.bin',
    'protocol7.daemon', 'reality_check.exe', 'ego_boundary.dll', 'connection_mgr.sys',
    'identity_parser.exe', 'consciousness.bin', 'collective_unconscious.dll',
    'deus_interface.sys', 'knights_protocol.exe', 'alice_mirror.dll'
  ];

  const generateProcesses = (): SystemProcess[] => {
    return Array.from({ length: 12 }, (_, index) => ({
      pid: 1000 + index,
      name: processNames[index % processNames.length],
      cpu: Math.random() * 100,
      memory: Math.random() * 512,
      status: ['running', 'sleeping', 'zombie', 'unknown'][Math.floor(Math.random() * 4)] as any
    }));
  };

  useEffect(() => {
    setProcesses(generateProcesses());

    const interval = setInterval(() => {
      setCpuUsage(Math.random() * 100);
      setMemoryUsage(Math.random() * 100);
      setNetworkActivity(Math.random() * 100);
      
      setProcesses(prev => prev.map(process => ({
        ...process,
        cpu: Math.max(0, process.cpu + (Math.random() - 0.5) * 20),
        memory: Math.max(0, process.memory + (Math.random() - 0.5) * 50)
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleProcessClick = (pid: number) => {
    playSound('select');
    setSelectedProcess(pid === selectedProcess ? null : pid);
  };

  const killProcess = (pid: number) => {
    playSound('error');
    setProcesses(prev => prev.filter(p => p.pid !== pid));
    setSelectedProcess(null);
  };

  const selectedProcessData = processes.find(p => p.pid === selectedProcess);

  return (
    <div className="system-monitor">
      <div className="program-header">
        <h2>SYSTEM_MONITOR.EXE</h2>
        <button 
          className="back-btn"
          onClick={() => onSwitchProgram('terminal')}
        >
          [ESC] RETURN
        </button>
      </div>

      <div className="monitor-layout">
        <div className="system-stats">
          <div className="stat-panel">
            <div className="stat-title">CPU USAGE</div>
            <div className="stat-bar">
              <div 
                className="stat-fill cpu"
                style={{ width: `${cpuUsage}%` }}
              ></div>
            </div>
            <div className="stat-value">{Math.floor(cpuUsage)}%</div>
          </div>

          <div className="stat-panel">
            <div className="stat-title">MEMORY</div>
            <div className="stat-bar">
              <div 
                className="stat-fill memory"
                style={{ width: `${memoryUsage}%` }}
              ></div>
            </div>
            <div className="stat-value">{Math.floor(memoryUsage)}%</div>
          </div>

          <div className="stat-panel">
            <div className="stat-title">NETWORK</div>
            <div className="stat-bar">
              <div 
                className="stat-fill network"
                style={{ width: `${networkActivity}%` }}
              ></div>
            </div>
            <div className="stat-value">{Math.floor(networkActivity)}%</div>
          </div>

          <div className="system-info">
            <div>UPTIME: {Math.floor(Math.random() * 999)}:42:17</div>
            <div>PROCESSES: {processes.length}</div>
            <div>THREADS: {processes.length * 3}</div>
            <div>WIRED STATUS: CONNECTED</div>
          </div>
        </div>

        <div className="process-list">
          <div className="process-header">
            <span>PID</span>
            <span>PROCESS NAME</span>
            <span>CPU%</span>
            <span>MEM(MB)</span>
            <span>STATUS</span>
          </div>
          
          {processes.map(process => (
            <div
              key={process.pid}
              className={`process-row ${process.status} ${
                selectedProcess === process.pid ? 'selected' : ''
              }`}
              onClick={() => handleProcessClick(process.pid)}
            >
              <span className="process-pid">{process.pid}</span>
              <span className="process-name">{process.name}</span>
              <span className="process-cpu">{Math.floor(process.cpu)}%</span>
              <span className="process-memory">{Math.floor(process.memory)}MB</span>
              <span className={`process-status ${process.status}`}>
                {process.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>

        <div className="process-details">
          {selectedProcessData ? (
            <div className="details-content">
              <div className="details-header">
                PROCESS DETAILS: {selectedProcessData.name}
              </div>
              
              <div className="process-stats">
                <div className="detail-row">
                  <span>PROCESS ID:</span>
                  <span>{selectedProcessData.pid}</span>
                </div>
                <div className="detail-row">
                  <span>CPU USAGE:</span>
                  <span>{Math.floor(selectedProcessData.cpu)}%</span>
                </div>
                <div className="detail-row">
                  <span>MEMORY:</span>
                  <span>{Math.floor(selectedProcessData.memory)}MB</span>
                </div>
                <div className="detail-row">
                  <span>STATUS:</span>
                  <span className={selectedProcessData.status}>
                    {selectedProcessData.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="process-actions">
                <button 
                  className="kill-btn"
                  onClick={() => killProcess(selectedProcessData.pid)}
                >
                  TERMINATE PROCESS
                </button>
              </div>

              {selectedProcessData.name.includes('lain') && (
                <div className="mystery-panel">
                  <div className="mystery-title">∿ ANOMALY DETECTED ∿</div>
                  <div className="mystery-text">
                    This process exhibits non-standard behavior patterns.
                    Termination may result in unexpected system responses.
                    Are you sure you want to end this process?
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="no-selection">
              SELECT A PROCESS FOR DETAILS
              <div className="selection-hint">
                Click on any process to view detailed information
                and perform actions on it.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};