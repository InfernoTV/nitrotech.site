import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [windowStart, setWindowStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const windowRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Handle mouse down on window header
  const handleHeaderMouseDown = useCallback((e: React.MouseEvent) => {
    // Only start dragging if clicking directly on the header, not on buttons
    const target = e.target as HTMLElement;
    if (target.closest('.window-controls')) {
      return; // Don't drag if clicking on window controls
    }

    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setWindowStart({ x: window.position.x, y: window.position.y });
    onFocus();
    
    // Add cursor style to body
    document.body.style.cursor = 'move';
    document.body.style.userSelect = 'none';
  }, [window.position, onFocus]);

  // Handle resize mouse down
  const handleResizeMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: window.size.width,
      height: window.size.height
    });
    onFocus();
    
    // Add cursor style to body
    document.body.style.cursor = 'nw-resize';
    document.body.style.userSelect = 'none';
  }, [window.size, onFocus]);

  // Handle mouse move
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      const newX = Math.max(0, Math.min(windowStart.x + deltaX, window.innerWidth - 200));
      const newY = Math.max(0, Math.min(windowStart.y + deltaY, window.innerHeight - 100));
      
      onMove({ x: newX, y: newY });
    } else if (isResizing && onResize) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      
      const newWidth = Math.max(400, resizeStart.width + deltaX);
      const newHeight = Math.max(300, resizeStart.height + deltaY);
      
      onResize({ width: newWidth, height: newHeight });
    }
  }, [isDragging, isResizing, dragStart, windowStart, resizeStart, onMove, onResize]);

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    if (isDragging || isResizing) {
      setIsDragging(false);
      setIsResizing(false);
      
      // Reset cursor and selection
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  }, [isDragging, isResizing]);

  // Add global mouse event listeners
  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      // Prevent text selection during drag
      document.addEventListener('selectstart', preventDefault);
      document.addEventListener('dragstart', preventDefault);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('selectstart', preventDefault);
        document.removeEventListener('dragstart', preventDefault);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  // Prevent default for selection events
  const preventDefault = (e: Event) => {
    e.preventDefault();
  };

  // Handle window click for focus
  const handleWindowClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onFocus();
  }, [onFocus]);

  // Handle double click on header to maximize/restore (optional feature)
  const handleHeaderDoubleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    // Could implement maximize functionality here
  }, []);

  if (window.isMinimized) {
    return null;
  }

  return (
    <div
      ref={windowRef}
      className={`window ${isDragging ? 'dragging' : ''} ${isResizing ? 'resizing' : ''}`}
      style={{
        left: window.position.x,
        top: window.position.y,
        width: window.size.width,
        height: window.size.height,
        zIndex: window.zIndex,
        pointerEvents: 'auto'
      }}
      onClick={handleWindowClick}
    >
      <div 
        ref={headerRef}
        className="window-header"
        onMouseDown={handleHeaderMouseDown}
        onDoubleClick={handleHeaderDoubleClick}
        style={{ cursor: isDragging ? 'move' : 'default' }}
      >
        <div className="window-title">{window.title}</div>
        <div className="window-controls">
          <button 
            className="window-control minimize" 
            onClick={(e) => {
              e.stopPropagation();
              onMinimize();
            }}
          >
            <Minus size={12} />
          </button>
          <button 
            className="window-control maximize"
            onClick={(e) => {
              e.stopPropagation();
              // Could implement maximize functionality
            }}
          >
            <Square size={12} />
          </button>
          <button 
            className="window-control close" 
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <X size={12} />
          </button>
        </div>
      </div>
      
      <div className="window-content">
        {children}
      </div>
      
      {onResize && (
        <div 
          className="window-resize-handle"
          onMouseDown={handleResizeMouseDown}
          style={{ cursor: isResizing ? 'nw-resize' : 'nw-resize' }}
        />
      )}
    </div>
  );
};