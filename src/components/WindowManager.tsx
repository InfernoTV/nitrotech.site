import React, { useState, useRef, useEffect } from 'react';
import { Minus, Square, X } from 'lucide-react';

interface WindowManagerProps {
  window: {
    id: string;
    title: string;
    isMinimized: boolean;
    position: { x: number; y: number };
    size: { width: number; height: number };
    zIndex: number;
  };
  children: React.ReactNode;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
  onMove: (position: { x: number; y: number }) => void;
}

export const WindowManager: React.FC<WindowManagerProps> = ({
  window,
  children,
  onClose,
  onMinimize,
  onFocus,
  onMove
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - window.position.x,
        y: e.clientY - window.position.y
      });
      onFocus();
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = Math.max(0, Math.min(e.clientX - dragOffset.x, window.innerWidth - 200));
        const newY = Math.max(0, Math.min(e.clientY - dragOffset.y, window.innerHeight - 100));
        onMove({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, onMove]);

  if (window.isMinimized) {
    return null;
  }

  return (
    <div
      ref={windowRef}
      className="window"
      style={{
        left: window.position.x,
        top: window.position.y,
        width: window.size.width,
        height: window.size.height,
        zIndex: window.zIndex
      }}
      onClick={onFocus}
    >
      <div 
        className="window-header"
        onMouseDown={handleMouseDown}
      >
        <div className="window-title">{window.title}</div>
        <div className="window-controls">
          <button className="window-control minimize" onClick={onMinimize}>
            <Minus size={12} />
          </button>
          <button className="window-control maximize">
            <Square size={12} />
          </button>
          <button className="window-control close" onClick={onClose}>
            <X size={12} />
          </button>
        </div>
      </div>
      
      <div className="window-content">
        {children}
      </div>
    </div>
  );
};