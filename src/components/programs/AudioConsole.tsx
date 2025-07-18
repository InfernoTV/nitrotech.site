import React, { useState, useEffect } from 'react';
import { useAudio } from '../../hooks/useAudio';

interface AudioConsoleProps {
  onSwitchProgram: (program: string) => void;
}

interface AudioTrack {
  id: number;
  title: string;
  artist: string;
  duration: string;
  waveform: number[];
  playing: boolean;
  audioUrl?: string;
}

export const AudioConsole: React.FC<AudioConsoleProps> = ({ onSwitchProgram }) => {
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<number | null>(null);
  const [volume, setVolume] = useState(75);
  const [visualizer, setVisualizer] = useState<number[]>([]);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const { playSound, playVolumeSound } = useAudio();

  const generateWaveform = () => Array.from({ length: 50 }, () => Math.random());

  const trackList = [
    { 
      title: "DUVET", 
      artist: "bôa", 
      duration: "3:24",
      audioUrl: "https://d33kc2wwsvguti.cloudfront.net/k1cvrj%2Ffile%2Fe97449f98c997cdd6b04c18d04f2973f_c54550f1beb32ed448ee9c1a67d92a88.mp3?response-content-disposition=inline%3Bfilename%3D%22e97449f98c997cdd6b04c18d04f2973f_c54550f1beb32ed448ee9c1a67d92a88.mp3%22%3B&response-content-type=audio%2Fmpeg&Expires=1752783857&Signature=UaJ6EGfslHcjqtw3cqvTGI58kg3qXUXmtMTadvQ~Uaw3NM4p5ilCQ6B~ztsZcarw9W428kzL6edgYGEpkOsIqxW0zmirwhnxmB1l0E~bdHOK7gQVziuq-pxpqzHV1eirEV~Er0EIAnn0aObuMceQtoz1TKwWAD4WNiSRv1eHrqyuZwbpwOMrS5p276FGar3N-58GZN7CRN6DxlXjxQn2siWDX2sR72ur8h7fOhRIMVlPpk1DJ9WLyb8Ia8dNJIBUuBIFIB3tSkyejPs1P~zgzf4jFiU8c~txuw-XgHddeV0BI0oymBP9eewWxOtUFtf1q0A5D7O2MscyDY7qJFgtAQ__&Key-Pair-Id=APKAJT5WQLLEOADKLHBQ"
    },
    { 
      title: "Present Day", 
      artist: "Serial Experiments Lain OST", 
      duration: "2:17",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
    },
    { 
      title: "Cyberia Mix", 
      artist: "J.J.", 
      duration: "4:42",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
    },
    { 
      title: "Lain's Theme", 
      artist: "Reichi Nakaido", 
      duration: "3:56",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
    },
    { 
      title: "Close World", 
      artist: "Tokyopill", 
      duration: "5:13",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
    },
    { 
      title: "Knights of Eastern Calculus", 
      artist: "Unknown", 
      duration: "6:28",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
    },
  ];

  useEffect(() => {
    const generatedTracks = trackList.map((track, index) => ({
      id: index + 1,
      ...track,
      waveform: generateWaveform(),
      playing: false,
    }));
    setTracks(generatedTracks);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisualizer(Array.from({ length: 20 }, () => Math.random() * 100));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Update audio volume when volume state changes
    if (currentAudio) {
      currentAudio.volume = volume / 100;
    }
  }, [volume, currentAudio]);

  useEffect(() => {
    // Update current time
    const updateTime = () => {
      if (currentAudio) {
        setCurrentTime(currentAudio.currentTime);
        setDuration(currentAudio.duration || 0);
      }
    };

    if (currentAudio) {
      currentAudio.addEventListener('timeupdate', updateTime);
      currentAudio.addEventListener('loadedmetadata', updateTime);
      
      return () => {
        currentAudio.removeEventListener('timeupdate', updateTime);
        currentAudio.removeEventListener('loadedmetadata', updateTime);
      };
    }
  }, [currentAudio]);
  const handleTrackClick = (trackId: number) => {
    playSound('select');
    
    const track = tracks.find(t => t.id === trackId);
    if (!track) return;

    // Stop current audio if playing
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    const wasPlaying = track.playing;
    
    // Update track states
    setTracks(prev => prev.map(t => ({
      ...t,
      playing: t.id === trackId ? !wasPlaying : false
    })));

    if (!wasPlaying && track.audioUrl) {
      // Start playing new track
      const audio = new Audio(track.audioUrl);
      audio.volume = volume / 100;
      audio.play().catch(console.error);
      setCurrentAudio(audio);
      
      // Handle audio end
      audio.addEventListener('ended', () => {
        setTracks(prev => prev.map(t => ({
          ...t,
          playing: false
        })));
        setCurrentAudio(null);
      });
    } else {
      setCurrentAudio(null);
    }
    
    setSelectedTrack(trackId);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    playVolumeSound(newVolume);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!currentAudio) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    
    currentAudio.currentTime = newTime;
    setCurrentTime(newTime);
    playSound('key');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  const selectedTrackData = tracks.find(track => track.id === selectedTrack);

  return (
    <div className="audio-console">
      <div className="program-header">
        <h2>AUDIO_CONSOLE.EXE</h2>
        <button 
          className="back-btn"
          onClick={() => onSwitchProgram('terminal')}
        >
          [ESC] RETURN
        </button>
      </div>

      <div className="audio-interface">
        <div className="visualizer-panel">
          <div className="visualizer">
            {visualizer.map((value, index) => (
              <div
                key={index}
                className="visualizer-bar"
                style={{ height: `${value}%` }}
              />
            ))}
          </div>
          
          <div className="audio-controls">
            <div className="volume-control">
              <span>VOL:</span>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="volume-slider"
              />
              <span>{volume}%</span>
            </div>
            
            {currentAudio && (
              <div className="track-progress">
                <span className="time-display">{formatTime(currentTime)}</span>
                <div 
                  className="progress-track"
                  onClick={handleSeek}
                  style={{ cursor: 'pointer' }}
                >
                  <div 
                    className="progress-fill"
                    style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>
                <span className="time-display">{formatTime(duration)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="track-list">
          <div className="list-header">
            NEURAL AUDIO INTERFACE - {tracks.length} TRACKS
          </div>
          
          {tracks.map(track => (
            <div
              key={track.id}
              className={`track-entry ${track.playing ? 'playing' : ''} ${
                selectedTrack === track.id ? 'selected' : ''
              }`}
              onClick={() => handleTrackClick(track.id)}
            >
              <div className="track-status">
                {track.playing ? '▶' : '⏸'}
              </div>
              <div className="track-info">
                <div className="track-title">{track.title}</div>
                <div className="track-artist">{track.artist}</div>
              </div>
              <div className="track-duration">{track.duration}</div>
            </div>
          ))}
        </div>

        <div className="track-details">
          {selectedTrackData ? (
            <div className="details-content">
              <div className="details-header">
                NOW ANALYZING: {selectedTrackData.title}
              </div>
              
              <div className="waveform-display">
                {selectedTrackData.waveform.map((amplitude, index) => (
                  <div
                    key={index}
                    className="waveform-sample"
                    style={{ height: `${amplitude * 100}%` }}
                  />
                ))}
              </div>

              <div className="track-metadata">
                <div className="meta-row">
                  <span>TITLE:</span>
                  <span>{selectedTrackData.title}</span>
                </div>
                <div className="meta-row">
                  <span>ARTIST:</span>
                  <span>{selectedTrackData.artist}</span>
                </div>
                <div className="meta-row">
                  <span>DURATION:</span>
                  <span>{selectedTrackData.duration}</span>
                </div>
                <div className="meta-row">
                  <span>STATUS:</span>
                  <span className={selectedTrackData.playing ? 'playing' : 'stopped'}>
                    {selectedTrackData.playing ? 'PLAYING' : 'STOPPED'}
                  </span>
                </div>
                {currentAudio && (
                  <div className="meta-row">
                    <span>TIME:</span>
                    <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                  </div>
                )}
              </div>

              <div className="neural-analysis">
                <div className="analysis-title">NEURAL PATTERN ANALYSIS</div>
                <div className="analysis-data">
{`
Frequency Range: 20Hz - 20kHz
Neural Resonance: ${Math.floor(Math.random() * 100)}%
Consciousness Sync: ${Math.floor(Math.random() * 100)}%
Wired Compatibility: ${Math.floor(Math.random() * 100)}%

Pattern Recognition:
████████████████████ ${Math.floor(Math.random() * 100)}%
`}
                </div>
              </div>
            </div>
          ) : (
            <div className="no-selection">
              SELECT A TRACK FOR ANALYSIS
              <div className="selection-hint">
                Choose any audio file to view its neural pattern analysis
                and waveform visualization.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};