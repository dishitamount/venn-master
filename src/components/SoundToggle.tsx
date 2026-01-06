import { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { soundManager } from '@/lib/soundManager';

export const SoundToggle = () => {
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());

  const toggleSound = () => {
    const newMutedState = soundManager.toggleMute();
    setIsMuted(newMutedState);
  };

  return (
    <button
      onClick={toggleSound}
      className="fixed top-4 right-4 z-50 p-3 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
      aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
    >
      {isMuted ? (
        <VolumeX className="w-6 h-6 text-primary" />
      ) : (
        <Volume2 className="w-6 h-6 text-primary" />
      )}
    </button>
  );
};

