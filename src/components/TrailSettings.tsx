import React, { useState, useEffect } from 'react';
import { useAudio } from '../hooks/useAudio';
import { useTheme } from '../hooks/useTheme';

interface TrailSettingsProps {
  onClose: () => void;
}

interface TrailConfig {
  type: 'dots' | 'lines' | 'particles' | 'stars' | 'fire' | 'electric' | 'rainbow';
  length: number;
  size: number;
  opacity: number;
  speed: number;
  color: string;
  fadeSpeed: number;
  particleCount: number;
  enabled: boolean;
}

const defaultConfig: TrailConfig = {
  type: 'dots',
  length: 20,
  size: 4,
  opacity: 0.8,
  speed: 50,
  color: '#00ff41',
  fadeSpeed: 100,
  particleCount: 1,
  enabled: true
};

const presets = {
  classic: { ...defaultConfig, type: 'dots' as const, size: 4, length: 15 },
  neon: { ...defaultConfig, type: 'particles' as const, size: 6, length: 25, opacity: 0.9 },
  fire: { ...defaultConfig, type: 'fire' as const, size: 8, length: 30, color: '#ff4400', fadeSpeed: 80 },
  electric: { ...defaultConfig, type: 'electric' as const, size: 3, length: 40, color: '#00d4ff', fadeSpeed: 60 },
  rainbow: { ...defaultConfig, type: 'rainbow' as const, size: 5, length: 35, fadeSpeed: 90 },
  stars: { ...defaultConfig, type: 'stars' as const, size: 10, length: 20, opacity: 0.7 },
  minimal: { ...defaultConfig, type: 'lines' as const, size: 2, length: 10, opacity: 0.5 }
};

export const TrailSettings: React.FC<TrailSettingsProps> = ({ onClose }) => {
  const { theme } = useTheme();
  const { playSound } = useAudio();
  const [config, setConfig] = useState<TrailConfig>(() => {
    const saved = localStorage.getItem('trail-config');
    return saved ? JSON.parse(saved) : defaultConfig;
  });

  useEffect(() => {
    localStorage.setItem('trail-config', JSON.stringify(config));
    
    // Dispatch custom event to update trail system
    window.dispatchEvent(new CustomEvent('trailConfigUpdate', { detail: config }));
  }, [config]);

  const updateConfig = (updates: Partial<TrailConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
    playSound('key');
  };

  const applyPreset = (presetName: keyof typeof presets) => {
    setConfig({ ...presets[presetName], color: theme.primary });
    playSound('select');
  };

  const resetToDefault = () => {
    setConfig({ ...defaultConfig, color: theme.primary });
    playSound('error');
  };

  return (
    <div className="color-picker-overlay">
      <div className="color-picker" style={{ maxWidth: '500px' }}>
        <div className="picker-header">
          <h3>TRAIL EFFECTS CONFIGURATION</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="picker-content" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {/* Enable/Disable Toggle */}
          <div style={{ marginBottom: '1.5rem', padding: '1rem', border: `1px solid ${theme.primary}40`, borderRadius: '4px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: theme.primary, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={config.enabled}
                onChange={(e) => updateConfig({ enabled: e.target.checked })}
                style={{ accentColor: theme.primary }}
              />
              Enable Trail Effects
            </label>
          </div>

          {/* Quick Presets */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ color: theme.secondary, marginBottom: '0.5rem' }}>Quick Presets:</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '0.5rem' }}>
              {Object.keys(presets).map(presetName => (
                <button
                  key={presetName}
                  onClick={() => applyPreset(presetName as keyof typeof presets)}
                  style={{
                    background: 'transparent',
                    border: `1px solid ${theme.primary}`,
                    color: theme.primary,
                    padding: '0.5rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    textTransform: 'capitalize',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = theme.primary;
                    e.currentTarget.style.color = theme.background;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = theme.primary;
                  }}
                >
                  {presetName}
                </button>
              ))}
            </div>
          </div>

          {/* Trail Type */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', color: theme.primary, marginBottom: '0.5rem', fontWeight: '600' }}>
              Trail Type:
            </label>
            <select
              value={config.type}
              onChange={(e) => updateConfig({ type: e.target.value as TrailConfig['type'] })}
              style={{
                width: '100%',
                padding: '0.5rem',
                background: `${theme.primary}10`,
                border: `1px solid ${theme.primary}40`,
                borderRadius: '4px',
                color: theme.primary,
                fontSize: '0.9rem'
              }}
            >
              <option value="dots">Dots</option>
              <option value="lines">Lines</option>
              <option value="particles">Particles</option>
              <option value="stars">Stars</option>
              <option value="fire">Fire</option>
              <option value="electric">Electric</option>
              <option value="rainbow">Rainbow</option>
            </select>
          </div>

          {/* Sliders */}
          {[
            { key: 'length', label: 'Trail Length', min: 5, max: 50 },
            { key: 'size', label: 'Particle Size', min: 1, max: 20 },
            { key: 'opacity', label: 'Opacity', min: 0.1, max: 1, step: 0.1 },
            { key: 'speed', label: 'Update Speed (ms)', min: 10, max: 200 },
            { key: 'fadeSpeed', label: 'Fade Speed (ms)', min: 20, max: 500 },
            { key: 'particleCount', label: 'Particles per Frame', min: 1, max: 5 }
          ].map(({ key, label, min, max, step = 1 }) => (
            <div key={key} style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', color: theme.primary, marginBottom: '0.5rem', fontWeight: '600' }}>
                {label}: {config[key as keyof TrailConfig]}
              </label>
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={config[key as keyof TrailConfig] as number}
                onChange={(e) => updateConfig({ [key]: parseFloat(e.target.value) })}
                style={{
                  width: '100%',
                  height: '4px',
                  background: `${theme.primary}40`,
                  borderRadius: '2px',
                  outline: 'none',
                  accentColor: theme.primary
                }}
              />
            </div>
          ))}

          {/* Color Picker */}
          {config.type !== 'rainbow' && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', color: theme.primary, marginBottom: '0.5rem', fontWeight: '600' }}>
                Trail Color:
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="color"
                  value={config.color}
                  onChange={(e) => updateConfig({ color: e.target.value })}
                  style={{
                    width: '40px',
                    height: '40px',
                    border: `1px solid ${theme.primary}`,
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                />
                <input
                  type="text"
                  value={config.color}
                  onChange={(e) => updateConfig({ color: e.target.value })}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    background: `${theme.primary}10`,
                    border: `1px solid ${theme.primary}40`,
                    borderRadius: '4px',
                    color: theme.primary,
                    fontFamily: 'monospace'
                  }}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button
              onClick={resetToDefault}
              style={{
                flex: 1,
                padding: '0.8rem',
                background: 'transparent',
                border: `1px solid ${theme.accent}`,
                color: theme.accent,
                borderRadius: '4px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontWeight: '600',
                textTransform: 'uppercase',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = theme.accent;
                e.currentTarget.style.color = theme.background;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = theme.accent;
              }}
            >
              Reset to Default
            </button>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: '0.8rem',
                background: 'transparent',
                border: `1px solid ${theme.primary}`,
                color: theme.primary,
                borderRadius: '4px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontWeight: '600',
                textTransform: 'uppercase',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = theme.primary;
                e.currentTarget.style.color = theme.background;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = theme.primary;
              }}
            >
              Apply & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};