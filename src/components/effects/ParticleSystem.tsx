import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

export const ParticleSystem: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let particleId = 0;
    const colors = ['#00ff41', '#00d4ff', '#ff0040', '#ffaa00', '#ff41ff'];

    // Stop particles after 10 seconds
    const stopTimer = setTimeout(() => {
      setIsActive(false);
    }, 10000);

    const createParticle = (): Particle => ({
      id: particleId++,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      life: 0,
      maxLife: 60 + Math.random() * 120,
      size: 2 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)]
    });

    const updateParticles = () => {
      setParticles(prev => {
        if (!isActive && prev.length === 0) return [];
        
        const updated = prev
          .map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            life: particle.life + 1,
            vy: particle.vy + 0.1 // gravity
          }))
          .filter(particle => 
            particle.life < particle.maxLife &&
            particle.x > -50 && particle.x < window.innerWidth + 50 &&
            particle.y > -50 && particle.y < window.innerHeight + 50
          );

        // Add new particles
        while (updated.length < 50 && isActive) {
          updated.push(createParticle());
        }

        return updated;
      });
    };

    const interval = setInterval(updateParticles, 16); // ~60fps

    return () => {
      clearInterval(interval);
      clearTimeout(stopTimer);
    };
  }, []);

  useEffect(() => {
    if (!isActive) {
      // Gradually remove remaining particles
      const fadeInterval = setInterval(() => {
        setParticles(prev => {
          if (prev.length === 0) {
            clearInterval(fadeInterval);
            return [];
          }
          return prev.slice(0, -2); // Remove 2 particles per frame
        });
      }, 100);
      
      return () => clearInterval(fadeInterval);
    }
  }, [isActive]);
  return (
    <div className="particle-system">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            opacity: 1 - (particle.life / particle.maxLife),
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            transform: `scale(${1 - (particle.life / particle.maxLife) * 0.5})`
          }}
        />
      ))}
    </div>
  );
};