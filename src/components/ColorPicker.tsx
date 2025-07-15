import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useAudio } from '../hooks/useAudio';

interface ColorPickerProps {
  onClose: () => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ onClose }) => {
  const { theme, setTheme } = useTheme();
  const { playSound } = useAudio();
  const [selectedColor, setSelectedColor] = useState(theme.primary);
  const [hue, setHue] = useState(120); // Default green hue
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    drawColorPicker();
  }, [hue]);

  const drawColorPicker = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Create gradient from white to black (top to bottom)
    for (let y = 0; y < height; y++) {
      const lightness = 100 - (y / height) * 100;
      
      // Create gradient from gray to pure color (left to right)
      for (let x = 0; x < width; x++) {
        const saturation = (x / width) * 100;
        const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newSaturation = (x / canvas.width) * 100;
    const newLightness = 100 - (y / canvas.height) * 100;

    setSaturation(newSaturation);
    setLightness(newLightness);

    const newColor = `hsl(${hue}, ${newSaturation}%, ${newLightness}%)`;
    setSelectedColor(newColor);
    playSound('select');
  };

  const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHue = parseInt(e.target.value);
    setHue(newHue);
    const newColor = `hsl(${newHue}, ${saturation}%, ${lightness}%)`;
    setSelectedColor(newColor);
    playSound('key');
  };

  const applyTheme = () => {
    const hslToRgb = (h: number, s: number, l: number) => {
      h /= 360;
      s /= 100;
      l /= 100;
      
      const a = s * Math.min(l, 1 - l);
      const f = (n: number) => {
        const k = (n + h * 12) % 12;
        return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      };
      
      return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
    };

    const [r, g, b] = hslToRgb(hue, saturation, lightness);
    const primaryRgb = `${r}, ${g}, ${b}`;
    
    // Generate complementary colors
    const secondaryHue = (hue + 60) % 360;
    const accentHue = (hue + 180) % 360;
    
    const [sr, sg, sb] = hslToRgb(secondaryHue, saturation * 0.8, lightness * 0.8);
    const [ar, ag, ab] = hslToRgb(accentHue, saturation, lightness * 1.2);

    setTheme({
      primary: selectedColor,
      secondary: `hsl(${secondaryHue}, ${saturation * 0.8}%, ${lightness * 0.8}%)`,
      accent: `hsl(${accentHue}, ${saturation}%, ${Math.min(lightness * 1.2, 90)}%)`,
      background: '#000000',
      text: selectedColor,
      primaryRgb,
      secondaryRgb: `${sr}, ${sg}, ${sb}`,
      accentRgb: `${ar}, ${ag}, ${ab}`
    });

    playSound('switch');
    onClose();
  };

  const resetTheme = () => {
    setTheme({
      primary: '#00ff41',
      secondary: '#00d4ff',
      accent: '#ff0040',
      background: '#000000',
      text: '#00ff41',
      primaryRgb: '0, 255, 65',
      secondaryRgb: '0, 212, 255',
      accentRgb: '255, 0, 64'
    });
    playSound('error');
    onClose();
  };

  const hexColor = (() => {
    const [r, g, b] = [hue, saturation, lightness];
    const hslToHex = (h: number, s: number, l: number) => {
      h /= 360;
      s /= 100;
      l /= 100;
      
      const a = s * Math.min(l, 1 - l);
      const f = (n: number) => {
        const k = (n + h * 12) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
      };
      
      return `#${f(0)}${f(8)}${f(4)}`;
    };
    
    return hslToHex(hue, saturation, lightness);
  })();

  return (
    <div className="color-picker-overlay">
      <div className="color-picker">
        <div className="picker-header">
          <h3>THEME CONFIGURATION</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="picker-content">
          <div className="color-canvas-container">
            <canvas
              ref={canvasRef}
              width={300}
              height={200}
              onClick={handleCanvasClick}
              className="color-canvas"
            />
            <div 
              className="color-cursor"
              style={{
                left: `${(saturation / 100) * 300}px`,
                top: `${((100 - lightness) / 100) * 200}px`
              }}
            />
          </div>

          <div className="hue-slider-container">
            <input
              type="range"
              min="0"
              max="360"
              value={hue}
              onChange={handleHueChange}
              className="hue-slider"
            />
          </div>

          <div className="color-info">
            <div className="color-preview" style={{ backgroundColor: selectedColor }} />
            <div className="color-values">
              <div className="hex-value">HEX: {hexColor}</div>
              <div className="hsl-value">
                HSL: {Math.round(hue)}, {Math.round(saturation)}%, {Math.round(lightness)}%
              </div>
            </div>
          </div>

          <div className="picker-actions">
            <button className="apply-btn" onClick={applyTheme}>
              APPLY THEME
            </button>
            <button className="reset-btn" onClick={resetTheme}>
              RESET TO DEFAULT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};