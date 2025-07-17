import React, { useEffect, useState, useCallback } from 'react';

interface TrailPoint {
  x: number;
  y: number;
  id: number;
  timestamp: number;
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

export const AdvancedTrail: React.FC = () => {
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const [config, setConfig] = useState<TrailConfig>(defaultConfig);

  // Load config from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('trail-config');
    if (saved) {
      setConfig(JSON.parse(saved));
    }
  }, []);

  // Listen for config updates
  useEffect(() => {
    const handleConfigUpdate = (event: CustomEvent<TrailConfig>) => {
      setConfig(event.detail);
    };

    window.addEventListener('trailConfigUpdate', handleConfigUpdate as EventListener);
    return () => window.removeEventListener('trailConfigUpdate', handleConfigUpdate as EventListener);
  }, []);

  const addTrailPoint = useCallback((x: number, y: number) => {
    if (!config.enabled) return;

    const now = Date.now();
    const newPoints: TrailPoint[] = [];
    
    for (let i = 0; i < config.particleCount; i++) {
      const offsetX = i > 0 ? (Math.random() - 0.5) * 10 : 0;
      const offsetY = i > 0 ? (Math.random() - 0.5) * 10 : 0;
      
      newPoints.push({
        x: x + offsetX,
        y: y + offsetY,
        id: now + i,
        timestamp: now
      });
    }

    setTrail(prev => {
      const updated = [...newPoints, ...prev];
      return updated.slice(0, config.length);
    });
  }, [config.enabled, config.particleCount, config.length]);

  useEffect(() => {
    if (!config.enabled) {
      setTrail([]);
      return;
    }

    let trailId = 0;

    const handleMouseMove = (e: MouseEvent) => {
      addTrailPoint(e.clientX, e.clientY);
    };

    document.addEventListener('mousemove', handleMouseMove);

    const cleanup = setInterval(() => {
      const now = Date.now();
      setTrail(prev => prev.filter(point => now - point.timestamp < config.fadeSpeed * config.length));
    }, config.speed);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      clearInterval(cleanup);
    };
  }, [config, addTrailPoint]);

  const getTrailColor = (index: number, totalPoints: number) => {
    if (config.type === 'rainbow') {
      const hue = (index / totalPoints) * 360;
      return `hsl(${hue}, 100%, 50%)`;
    }
    return config.color;
  };

  const getTrailStyle = (point: TrailPoint, index: number, totalPoints: number) => {
    const age = Date.now() - point.timestamp;
    const maxAge = config.fadeSpeed * config.length;
    const opacity = Math.max(0, (1 - age / maxAge) * config.opacity);
    const scale = Math.max(0.1, 1 - age / maxAge);
    
    const baseStyle = {
      left: point.x,
      top: point.y,
      width: config.size * scale,
      height: config.size * scale,
      backgroundColor: getTrailColor(index, totalPoints),
      color: getTrailColor(index, totalPoints),
      opacity,
      transform: `translate(-50%, -50%) scale(${scale})`,
      zIndex: 1000 - index
    };

    // Special effects for different trail types
    switch (config.type) {
      case 'fire':
        return {
          ...baseStyle,
          background: `radial-gradient(circle, ${getTrailColor(index, totalPoints)}, transparent)`,
          filter: `blur(${Math.max(0, (age / maxAge) * 2)}px)`,
          animation: `flicker ${Math.random() * 0.5 + 0.5}s infinite alternate`
        };
      
      case 'electric':
        return {
          ...baseStyle,
          background: getTrailColor(index, totalPoints),
          boxShadow: `0 0 ${config.size * 2}px ${getTrailColor(index, totalPoints)}, inset 0 0 ${config.size}px ${getTrailColor(index, totalPoints)}`,
          filter: `brightness(${1 + Math.random() * 0.5})`
        };
      
      case 'particles':
        return {
          ...baseStyle,
          borderRadius: '50%',
          boxShadow: `0 0 ${config.size * 3}px ${getTrailColor(index, totalPoints)}`
        };
      
      default:
        return baseStyle;
    }
  };

  if (!config.enabled || trail.length === 0) {
    return null;
  }

  return (
    <div className={`trail-system trail-${config.type}`}>
      {trail.map((point, index) => (
        <div
          key={point.id}
          className="trail-point"
          style={getTrailStyle(point, index, trail.length)}
        />
      ))}
    </div>
  );
};