import React, { useEffect, useState } from 'react';

interface TrailPoint {
  x: number;
  y: number;
  id: number;
  timestamp: number;
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

export const MouseTrail: React.FC = () => {
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const [config, setConfig] = useState<TrailConfig>({
    enabled: true,
    type: 'dots',
    length: 20,
    size: 4,
    opacity: 0.8,
    speed: 50,
    color: '#00ff41',
    fadeSpeed: 50,
    particleCount: 15
  });

  useEffect(() => {
    // Load saved config
    const saved = localStorage.getItem('trail-config');
    if (saved) {
      setConfig(JSON.parse(saved));
    }

    // Listen for config changes
    const handleConfigChange = (e: CustomEvent) => {
      setConfig(e.detail);
    };

    window.addEventListener('trailConfigChanged', handleConfigChange as EventListener);
    return () => window.removeEventListener('trailConfigChanged', handleConfigChange as EventListener);
  }, []);

  useEffect(() => {
    if (!config.enabled) {
      setTrail([]);
      return;
    }

    let trailId = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const newPoint: TrailPoint = {
        x: e.clientX,
        y: e.clientY,
        id: trailId++,
        timestamp: Date.now()
      };

      setTrail(prev => {
        const newTrail = [newPoint, ...prev.slice(0, config.length - 1)];
        return newTrail;
      });
    };

    document.addEventListener('mousemove', handleMouseMove);

    const cleanup = setInterval(() => {
      setTrail(prev => prev.filter(point => 
        Date.now() - point.timestamp < config.fadeSpeed * 10
      ));
    }, config.speed);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      clearInterval(cleanup);
    };
  }, [config]);

  const getTrailPointStyle = (point: TrailPoint, index: number) => {
    const age = (Date.now() - point.timestamp) / (config.fadeSpeed * 10);
    const opacity = Math.max(0, config.opacity * (1 - age) * ((trail.length - index) / trail.length));
    
    const baseStyle = {
      left: point.x,
      top: point.y,
      opacity,
      width: config.size,
      height: config.size,
    };

    switch (config.type) {
      case 'lines':
        return {
          ...baseStyle,
          background: `linear-gradient(45deg, ${config.color}, transparent)`,
          borderRadius: '2px',
          transform: `scale(${1 - age}) rotate(${index * 10}deg)`,
        };
      case 'particles':
        return {
          ...baseStyle,
          background: config.color,
          borderRadius: '50%',
          boxShadow: `0 0 ${config.size * 2}px ${config.color}`,
          transform: `scale(${1 - age * 0.5})`,
        };
      case 'stars':
        return {
          ...baseStyle,
          background: config.color,
          clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
          transform: `scale(${1 - age}) rotate(${index * 20}deg)`,
        };
      case 'fire':
        const fireColors = ['#ff4400', '#ff6600', '#ff8800', '#ffaa00'];
        return {
          ...baseStyle,
          background: fireColors[index % fireColors.length],
          borderRadius: '50% 50% 50% 0',
          transform: `scale(${1 - age}) rotate(${index * 15}deg)`,
          filter: 'blur(0.5px)',
        };
      case 'electric':
        return {
          ...baseStyle,
          background: config.color,
          borderRadius: '2px',
          boxShadow: `0 0 ${config.size * 3}px ${config.color}, inset 0 0 ${config.size}px rgba(255,255,255,0.5)`,
          transform: `scale(${1 - age}) skew(${Math.sin(index) * 10}deg)`,
        };
      case 'rainbow':
        const hue = (index * 20) % 360;
        return {
          ...baseStyle,
          background: `hsl(${hue}, 100%, 50%)`,
          borderRadius: '50%',
          boxShadow: `0 0 ${config.size * 2}px hsl(${hue}, 100%, 50%)`,
          transform: `scale(${1 - age})`,
        };
      default: // dots
        return {
          ...baseStyle,
          background: config.color,
          borderRadius: '50%',
          boxShadow: `0 0 ${config.size * 2}px ${config.color}`,
          transform: `scale(${1 - age})`,
        };
    }
  };

  if (!config.enabled) return null;

  return (
    <div className="mouse-trail">
      {trail.map((point, index) => (
        <div
          key={point.id}
          className="trail-point"
          style={getTrailPointStyle(point, index)}
        />
      ))}
    </div>
  );
};