import React from 'react';

interface GlitchOverlayProps {
  intensity: number;
}

export const GlitchOverlay: React.FC<GlitchOverlayProps> = ({ intensity }) => {
  if (intensity === 0) return null;

  return (
    <div 
      className="glitch-overlay"
      style={{ 
        opacity: intensity,
        mixBlendMode: 'multiply'
      }}
    >
      <div className="glitch-layer glitch-1"></div>
      <div className="glitch-layer glitch-2"></div>
      <div className="glitch-layer glitch-3"></div>
    </div>
  );
};