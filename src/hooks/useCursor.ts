import { useState, useEffect } from 'react';

type CursorType = 'default' | 'pointer' | 'crosshair' | 'text';

export const useCursor = () => {
  const [cursorType, setCursorType] = useState<CursorType>('default');

  useEffect(() => {
    document.body.style.cursor = cursorType;
    return () => {
      document.body.style.cursor = 'default';
    };
  }, [cursorType]);

  return { setCursorType };
};