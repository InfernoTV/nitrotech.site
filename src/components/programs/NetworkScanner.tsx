import React, { useState, useEffect } from 'react';
import { useAudio } from '../../hooks/useAudio';

interface NetworkScannerProps {
  onSwitchProgram: (program: string) => void;
}

interface NetworkNode {
  id: string;
  ip: string;
  hostname: string;
  status: 'active' | 'scanning' | 'unknown' | 'suspicious';
  ports: number[];
}

export const NetworkScanner: React.FC<NetworkScannerProps> = ({ onSwitchProgram }) => {
  const [nodes, setNodes] = useState<NetworkNode[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const { playSound } = useAudio();

  const generateNodes = (): NetworkNode[] => {
    const hostnames = [
      'LAIN.local', 'alice.wired', 'chisa.node', 'deus.sys', 'protocol7.net',
      'knights.temp', 'arisu.dev', 'masami.ghost', 'taro.wire', 'tachibana.log'
    ];
    
    return hostnames.map((hostname, index) => ({
      id: `node_${index + 1}`,
      ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      hostname,
      status: ['active', 'unknown', 'suspicious'][Math.floor(Math.random() * 3)] as any,
      ports: Array.from({length: Math.floor(Math.random() * 5) + 1}, () => 
        Math.floor(Math.random() * 65535))
    }));
  };

  useEffect(() => {
    setNodes(generateNodes());
  }, []);

  const startScan = () => {
    if (isScanning) return;
    
    setIsScanning(true);
    setScanProgress(0);
    playSound('scan');
    
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setNodes(generateNodes());
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
  };

  const handleNodeClick = (nodeId: string) => {
    playSound('select');
    setSelectedNode(nodeId === selectedNode ? null : nodeId);
  };

  const selectedNodeData = nodes.find(node => node.id === selectedNode);

  return (
    <div className="network-scanner">
      <div className="program-header">
        <h2>NETWORK_SCANNER.EXE</h2>
        <button 
          className="back-btn"
          onClick={() => onSwitchProgram('terminal')}
        >
          [ESC] RETURN
        </button>
      </div>

      <div className="scanner-interface">
        <div className="scan-controls">
          <button 
            className={`scan-btn ${isScanning ? 'scanning' : ''}`}
            onClick={startScan}
            disabled={isScanning}
          >
            {isScanning ? 'SCANNING...' : 'START SCAN'}
          </button>
          
          {isScanning && (
            <div className="scan-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${scanProgress}%` }}
                ></div>
              </div>
              <span>{Math.floor(scanProgress)}%</span>
            </div>
          )}
        </div>

        <div className="network-display">
          <div className="node-list">
            <div className="list-header">
              DISCOVERED NODES: {nodes.length}
            </div>
            
            {nodes.map(node => (
              <div
                key={node.id}
                className={`node-entry ${node.status} ${
                  selectedNode === node.id ? 'selected' : ''
                }`}
                onClick={() => handleNodeClick(node.id)}
              >
                <div className="node-status">
                  <span className={`status-indicator ${node.status}`}>●</span>
                </div>
                <div className="node-info">
                  <div className="hostname">{node.hostname}</div>
                  <div className="ip-address">{node.ip}</div>
                </div>
                <div className="node-ports">
                  {node.ports.length} ports
                </div>
              </div>
            ))}
          </div>

          <div className="node-details">
            {selectedNodeData ? (
              <div className="details-content">
                <div className="details-header">
                  NODE ANALYSIS: {selectedNodeData.hostname}
                </div>
                
                <div className="node-stats">
                  <div className="stat-row">
                    <span>IP ADDRESS:</span>
                    <span>{selectedNodeData.ip}</span>
                  </div>
                  <div className="stat-row">
                    <span>STATUS:</span>
                    <span className={`status-text ${selectedNodeData.status}`}>
                      {selectedNodeData.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="stat-row">
                    <span>OPEN PORTS:</span>
                    <span>{selectedNodeData.ports.join(', ')}</span>
                  </div>
                </div>

                {selectedNodeData.status === 'suspicious' && (
                  <div className="warning-panel">
                    <div className="warning-title">⚠ ANOMALY DETECTED</div>
                    <div className="warning-text">
                      Unusual network activity detected on this node.
                      Connection patterns suggest non-human behavior.
                      Recommend caution when establishing contact.
                    </div>
                  </div>
                )}

                <div className="network-viz">
{`
    ┌─────────────────────────────────────┐
    │ NETWORK TOPOLOGY VISUALIZATION     │
    └─────────────────────────────────────┘
    
         [YOU] ──────── [ROUTER] ──────── [WIRED]
           │                │                │
           └── ${selectedNodeData.hostname} ──┘
                      │
                   [UNKNOWN]
`}
                </div>
              </div>
            ) : (
              <div className="no-selection">
                SELECT A NODE TO VIEW DETAILS
                <div className="scan-hint">
                  Initiate a network scan to discover connected devices.
                  Click on any discovered node for detailed analysis.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};