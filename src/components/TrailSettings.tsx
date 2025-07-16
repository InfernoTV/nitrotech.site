import React, { useState, useEffect } from 'react';
import { useAudio } from '../hooks/useAudio';

interface TrailSettingsProps {
  onClose: () => void;
}

interface TrailConfig {
  enabled: boolean;
  type: 'dots' | 'lines' | 'particles' | 'stars' | 'fire' | 'electric' | 'rainbow';
  length: number;
  size: number;
  opacity: number;
  speed: number;
  color: string;
  fadeSpeed: number;
  particleCount: number;
}

export const TrailSettings: React.FC<TrailSettingsProps> = ({ onClose }) => {
  const { playSound } = useAudio();
  
  const [config, setConfig] = useState<TrailConfig>(() => {
    const saved = localStorage.getItem('trail-config');
    return saved ? JSON.parse(saved) : {
      enabled: true,
      type: 'dots',
      length: 20,
      size: 4,
      opacity: 0.8,
      speed: 50,
      color: '#00ff41',
      fadeSpeed: 50,
      particleCount: 15
    };
  });

  useEffect(() => {
    localStorage.setItem('trail-config', JSON.stringify(config));
    // Dispatch custom event to update trail system
    window.dispatchEvent(new CustomEvent('trailConfigChanged', { detail: config }));
  }, [config]);

  const handleConfigChange = (key: keyof TrailConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
    playSound('key');
  };

  const presetConfigs = {
    'Classic Dots': {
      type: 'dots', length: 20, size: 4, opacity: 0.8, speed: 50, color: '#00ff41', fadeSpeed: 50, particleCount: 15
    },
    'Neon Lines': {
      type: 'lines', length: 15, size: 2, opacity: 0.9, speed: 30, color: '#00d4ff', fadeSpeed: 40, particleCount: 10
    },
    'Particle Storm': {
      type: 'particles', length: 30, size: 3, opacity: 0.7, speed: 70, color: '#ff0040', fadeSpeed: 60, particleCount: 25
    },
    'Starfield': {
      type: 'stars', length: 25, size: 6, opacity: 0.6, speed: 40, color: '#ffaa00', fadeSpeed: 30, particleCount: 20
    },
    'Fire Trail': {
      type: 'fire', length: 18, size: 5, opacity: 0.8, speed: 80, color: '#ff4400', fadeSpeed: 70, particleCount: 12
    },
    'Electric': {
      type: 'electric', length: 12, size: 3, opacity: 0.9, speed: 90, color: '#44ff00', fadeSpeed: 80, particleCount: 8
    },
    'Rainbow': {
      type: 'rainbow', length: 22, size: 4, opacity: 0.7, speed: 60, color: '#ff00ff', fadeSpeed: 50, particleCount: 18
    }
  };

  const applyPreset = (presetName: string) => {
    const preset = presetConfigs[presetName as keyof typeof presetConfigs];
    setConfig(prev => ({ ...prev, ...preset }));
    playSound('select');
  };

  return (
    <div className="trail-settings-overlay">
      <div className="trail-settings">
        <div className="settings-header">
          <h3>TRAIL EFFECTS CONFIGURATION</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="settings-content">
          <div className="settings-section">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={config.enabled}
                onChange={(e) => handleConfigChange('enabled', e.target.checked)}
              />
              <span>Enable Trail Effects</span>
            </label>
          </div>

          {config.enabled && (
            <>
              <div className="settings-section">
                <label>Trail Type:</label>
                <select
                  value={config.type}
                  onChange={(e) => handleConfigChange('type', e.target.value)}
                  className="trail-select"
                >
                  <option value="dots">Classic Dots</option>
                  <option value="lines">Neon Lines</option>
                  <option value="particles">Particles</option>
                  <option value="stars">Stars</option>
                  <option value="fire">Fire Trail</option>
                  <option value="electric">Electric</option>
                  <option value="rainbow">Rainbow</option>
                </select>
              </div>

              <div className="settings-grid">
                <div className="setting-item">
                  <label>Trail Length: {config.length}</label>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={config.length}
                    onChange={(e) => handleConfigChange('length', parseInt(e.target.value))}
                    className="trail-slider"
                  />
                </div>

                <div className="setting-item">
                  <label>Particle Size: {config.size}px</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={config.size}
                    onChange={(e) => handleConfigChange('size', parseInt(e.target.value))}
                    className="trail-slider"
                  />
                </div>

                <div className="setting-item">
                  <label>Opacity: {Math.round(config.opacity * 100)}%</label>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={config.opacity}
                    onChange={(e) => handleConfigChange('opacity', parseFloat(e.target.value))}
                    className="trail-slider"
                  />
                </div>

                <div className="setting-item">
                  <label>Animation Speed: {config.speed}ms</label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={config.speed}
                    onChange={(e) => handleConfigChange('speed', parseInt(e.target.value))}
                    className="trail-slider"
                  />
                </div>

                <div className="setting-item">
                  <label>Fade Speed: {config.fadeSpeed}ms</label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={config.fadeSpeed}
                    onChange={(e) => handleConfigChange('fadeSpeed', parseInt(e.target.value))}
                    className="trail-slider"
                  />
                </div>

                <div className="setting-item">
                  <label>Particle Count: {config.particleCount}</label>
                  <input
                    type="range"
                    min="5"
                    max="40"
                    value={config.particleCount}
                    onChange={(e) => handleConfigChange('particleCount', parseInt(e.target.value))}
                    className="trail-slider"
                  />
                </div>
              </div>

              <div className="settings-section">
                <label>Trail Color:</label>
                <input
                  type="color"
                  value={config.color}
                  onChange={(e) => handleConfigChange('color', e.target.value)}
                  className="color-input"
                />
              </div>

              <div className="presets-section">
                <h4>Quick Presets:</h4>
                <div className="presets-grid">
                  {Object.keys(presetConfigs).map(presetName => (
                    <button
                      key={presetName}
                      className="preset-btn"
                      onClick={() => applyPreset(presetName)}
                    >
                      {presetName}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};