import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';

interface AudioControlsProps {
  className?: string;
}

export default function AudioControls({ className = '' }: AudioControlsProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  useEffect(() => {
    // Load preferences from localStorage
    const savedMuted = localStorage.getItem('cyberpunk-audio-muted');
    const savedVolume = localStorage.getItem('cyberpunk-audio-volume');

    if (savedMuted !== null) {
      setIsMuted(JSON.parse(savedMuted));
    }
    if (savedVolume !== null) {
      setVolume(parseFloat(savedVolume));
    }

    // Auto-start audio after component mounts
    const timer = setTimeout(() => {
      if (audioRef.current && !JSON.parse(savedMuted || 'false')) {
        audioRef.current.play().catch(() => {
          // Autoplay blocked, but controls are visible
          console.log('Autoplay blocked');
        });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Update audio element when states change
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      
      if (isPlaying && !isMuted && hasUserInteracted) {
        audioRef.current.play().catch(() => {
          // Autoplay blocked
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, isMuted, volume, hasUserInteracted]);

  const handlePlay = async () => {
    setHasUserInteracted(true);
    if (audioRef.current) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
        localStorage.setItem('cyberpunk-audio-playing', 'true');
      } catch (error) {
        console.error('Failed to play audio:', error);
      }
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      localStorage.setItem('cyberpunk-audio-playing', 'false');
    }
  };

  const handleMuteToggle = () => {
    setHasUserInteracted(true);
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    localStorage.setItem('cyberpunk-audio-muted', JSON.stringify(newMuted));
    
    if (!newMuted && !isPlaying) {
      handlePlay();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasUserInteracted(true);
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    localStorage.setItem('cyberpunk-audio-volume', newVolume.toString());
    
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : newVolume;
    }
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      {/* Audio element */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
        src="/audio/cyberpunk-ambient.mp3"
      />

      {/* Simple audio controls */}
      <div className="flex items-center gap-3 p-3 bg-gray-800/80 backdrop-blur-sm border border-cyan-500/30 rounded-lg">
        {/* Play/Pause button */}
        <button
          onClick={isPlaying ? handlePause : handlePlay}
          className="text-cyan-400 hover:text-cyan-300 transition-colors"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>

        {/* Mute button */}
        <button
          onClick={handleMuteToggle}
          className="text-cyan-400 hover:text-cyan-300 transition-colors"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

        {/* Volume slider */}
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
          className="w-16 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${volume * 100}%, #4b5563 ${volume * 100}%, #4b5563 100%)`
          }}
        />
      </div>
    </div>
  );
}