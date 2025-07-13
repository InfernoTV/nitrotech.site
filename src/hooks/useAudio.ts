import { useCallback, useRef } from 'react';

type SoundType = 'boot' | 'key' | 'select' | 'switch' | 'error' | 'scan';

export const useAudio = () => {
  const lastVolumeSound = useRef<number>(0);

  const playVolumeSound = useCallback((volume: number) => {
    const now = Date.now();
    if (now - lastVolumeSound.current < 100) return; // Throttle to prevent spam
    lastVolumeSound.current = now;

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create a whoosh sound with exponential frequency sweep
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Exponential frequency sweep based on volume
    const startFreq = 200 + (volume / 100) * 800;
    const endFreq = startFreq * 1.5;
    
    oscillator.frequency.setValueAtTime(startFreq, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(endFreq, audioContext.currentTime + 0.2);
    
    oscillator.type = 'sine';
    
    // Volume envelope
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  }, []);
  const playSound = useCallback((soundType: SoundType) => {
    // Create audio context for synthetic sounds
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    const createBeep = (frequency: number, duration: number, type: OscillatorType = 'sine') => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    };

    switch (soundType) {
      case 'boot':
        createBeep(800, 0.1);
        setTimeout(() => createBeep(1000, 0.1), 100);
        setTimeout(() => createBeep(1200, 0.2), 200);
        break;
      case 'key':
        createBeep(1000, 0.05, 'square');
        break;
      case 'select':
        createBeep(1500, 0.1);
        break;
      case 'switch':
        createBeep(600, 0.1);
        setTimeout(() => createBeep(800, 0.1), 50);
        break;
      case 'error':
        createBeep(300, 0.3, 'sawtooth');
        break;
      case 'scan':
        for (let i = 0; i < 5; i++) {
          setTimeout(() => createBeep(800 + i * 100, 0.1), i * 100);
        }
        break;
    }
  }, []);

  return { playSound, playVolumeSound };
};