import { useState } from 'react';
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
      className="p-2.5 sm:p-3 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors touch-manipulation"
      aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
      type="button"
    >
      {isMuted ? (
        <VolumeX className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
      ) : (
        <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
      )}
    </button>
  );
};

