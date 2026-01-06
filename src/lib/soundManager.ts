class SoundManager {
  private backgroundMusic: HTMLAudioElement | null = null;
  private gameMusic: HTMLAudioElement | null = null;
  private currentMusic: HTMLAudioElement | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Load mute preference from localStorage
    const saved = localStorage.getItem('soundMuted');
    this.isMuted = saved === 'true';
    
    // Preload audio files
    this.backgroundMusic = new Audio('/background-music.mp3');
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = 0.3;
    
    this.gameMusic = new Audio();
    this.gameMusic.loop = true;
    this.gameMusic.volume = 0.4;
  }

  playBackgroundMusic() {
    if (this.isMuted) return;
    
    // Stop any currently playing music
    this.stopAll();
    
    if (this.backgroundMusic) {
      this.backgroundMusic.play().catch(err => console.log('Audio play failed:', err));
      this.currentMusic = this.backgroundMusic;
    }
  }

  playGameMusic(difficulty: 'junior' | 'senior') {
    if (this.isMuted) return;
    
    // Stop any currently playing music
    this.stopAll();
    
    const musicFile = difficulty === 'junior' ? '/junior-music.mp3' : '/senior-music.mp3';
    
    if (this.gameMusic) {
      this.gameMusic.src = musicFile;
      this.gameMusic.play().catch(err => console.log('Audio play failed:', err));
      this.currentMusic = this.gameMusic;
    }
  }

  playSound(soundName: string) {
    if (this.isMuted) return;
    
    const soundMap: Record<string, string> = {
      'button-click': '/button-click.mp3',
      // Placeholders for sounds to be added later
      'correct': '', 
      'wrong': '',
      'level-up': '',
      'game-over': '',
      'drop': '',
    };

    const soundFile = soundMap[soundName];
    if (soundFile) {
      const audio = new Audio(soundFile);
      audio.volume = 0.5;
      audio.play().catch(err => console.log('Sound play failed:', err));
    }
  }

  stopAll() {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
    }
    if (this.gameMusic) {
      this.gameMusic.pause();
      this.gameMusic.currentTime = 0;
    }
    this.currentMusic = null;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('soundMuted', this.isMuted.toString());
    
    if (this.isMuted) {
      // Stop all sounds
      if (this.currentMusic) {
        this.currentMusic.pause();
      }
    } else {
      // Resume current music if any
      if (this.currentMusic) {
        this.currentMusic.play().catch(err => console.log('Audio play failed:', err));
      }
    }
    
    return this.isMuted;
  }

  getMuted() {
    return this.isMuted;
  }
}

// Export singleton instance
export const soundManager = new SoundManager();

