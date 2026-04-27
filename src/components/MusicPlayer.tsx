import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music, ListMusic } from 'lucide-react';
import { motion } from 'motion/react';
import { DUMMY_TRACKS } from '../constants.ts';

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleEnded = () => {
    handleNext();
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
  };

  return (
    <footer className="h-24 bg-panel-bg border-t border-border px-8 flex items-center justify-between relative z-50">
      <audio
        ref={audioRef}
        src={currentTrack.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
      
      {/* Track Info */}
      <div className="flex items-center gap-4 w-1/3">
        <div className="w-12 h-12 bg-item-bg rounded-md neon-glow-pink overflow-hidden shrink-0">
          <img 
            src={currentTrack.coverUrl} 
            alt={currentTrack.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold truncate text-white uppercase tracking-tight">{currentTrack.title}</p>
          <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">{currentTrack.artist}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-3 w-1/3">
        <div className="flex items-center gap-6">
          <button 
            onClick={handlePrev}
            className="text-white/50 hover:text-white transition-opacity"
          >
            <SkipBack size={20} />
          </button>
          
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 rounded-full border border-neon-green flex items-center justify-center text-neon-green hover:bg-neon-green hover:text-black transition-colors"
          >
            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="translate-x-0.5" />}
          </button>

          <button 
            onClick={handleNext}
            className="text-white/50 hover:text-white transition-opacity"
          >
            <SkipForward size={20} />
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full max-w-xs bg-zinc-800 h-1 rounded-full overflow-hidden cursor-pointer relative"
           onClick={(e) => {
             const rect = e.currentTarget.getBoundingClientRect();
             const p = (e.clientX - rect.left) / rect.width;
             if (audioRef.current) audioRef.current.currentTime = p * audioRef.current.duration;
           }}>
          <motion.div 
            className="bg-neon-green h-full shadow-[0_0_8px_#39FF14]"
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Volume & Visualizer */}
      <div className="flex items-center justify-end gap-6 w-1/3">
        <div className="flex gap-1 items-end h-6">
          {[0.4, 0.8, 0.3, 1, 0.6].map((opacity, i) => (
            <motion.div
              key={i}
              animate={isPlaying ? { height: ['20%', '100%', '40%', '80%', '20%'] } : { height: '30%' }}
              transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.1 }}
              className="w-1 bg-neon-green"
              style={{ opacity }}
            />
          ))}
        </div>
        <div className="flex items-center gap-3 text-zinc-500">
           <Volume2 size={16} />
           <p className="text-[10px] uppercase tracking-widest font-mono">Volume 85%</p>
        </div>
      </div>
    </footer>
  );
}
