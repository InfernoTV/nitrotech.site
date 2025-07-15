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
  onResize?: (size: { width: number; height: number }) => void;
}

export const WindowManager: React.FC<WindowManagerProps> = ({
  window,
  children,
  onClose,
  onMinimize,
  onFocus,
  onMove,
  onResize
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('window-header')) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - window.position.x,
        y: e.clientY - window.position.y
      });
      onFocus();
      e.preventDefault();
    }
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: window.size.width,
      height: window.size.height
    });
    onFocus();
    e.preventDefault();
    e.stopPropagation();
  };
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = Math.max(0, Math.min(e.clientX - dragOffset.x, window.innerWidth - 200));
        const newY = Math.max(0, Math.min(e.clientY - dragOffset.y, window.innerHeight - 100));
        onMove({ x: newX, y: newY });
      } else if (isResizing && onResize) {
        const newWidth = Math.max(400, resizeStart.width + (e.clientX - resizeStart.x));
        const newHeight = Math.max(300, resizeStart.height + (e.clientY - resizeStart.y));
        onResize({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, resizeStart, onMove, onResize]);

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
      
      <div 
        className="window-resize-handle"
        onMouseDown={handleResizeMouseDown}
      />
    </div>
  );
};