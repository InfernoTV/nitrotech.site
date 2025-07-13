import React, { useEffect, useState } from 'react';

interface TrailPoint {
  x: number;
  y: number;
  id: number;
}

export const MouseTrail: React.FC = () => {
  const [trail, setTrail] = useState<TrailPoint[]>([]);

  useEffect(() => {
    let trailId = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const newPoint: TrailPoint = {
        x: e.clientX,
        y: e.clientY,
        id: trailId++
      };

      setTrail(prev => {
        const newTrail = [newPoint, ...prev.slice(0, 19)];
        return newTrail;
      });
    };

    document.addEventListener('mousemove', handleMouseMove);

    const cleanup = setInterval(() => {
      setTrail(prev => prev.slice(0, -1));
    }, 50);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      clearInterval(cleanup);
    };
  }, []);

  return (
    <div className="mouse-trail">
      {trail.map((point, index) => (
        <div
          key={point.id}
          className="trail-point"
          style={{
            left: point.x,
            top: point.y,
            opacity: (trail.length - index) / trail.length,
            transform: `scale(${(trail.length - index) / trail.length})`
          }}
        />
      ))}
    </div>
  );
};