class SoundManager {
  private backgroundMusic: HTMLAudioElement | null = null;
  private gameMusic: HTMLAudioElement | null = null;
  private currentMusic: HTMLAudioElement | null = null;
  private isMuted: boolean = false;
  private currentGameMusicType: 'junior' | 'senior' | null = null;

  constructor() {
    // Load mute preference from localStorage
    const saved = localStorage.getItem('soundMuted');
    this.isMuted = saved === 'true';
  }

  private initBackgroundMusic() {
    if (!this.backgroundMusic) {
      this.backgroundMusic = new Audio('/background-music.mp3');
      this.backgroundMusic.loop = true;
      this.backgroundMusic.volume = 0.3;
      this.backgroundMusic.preload = 'auto';
    }
    return this.backgroundMusic;
  }

  private initGameMusic() {
    if (!this.gameMusic) {
      this.gameMusic = new Audio();
      this.gameMusic.loop = true;
      this.gameMusic.volume = 0.4;
      this.gameMusic.preload = 'auto';
    }
    return this.gameMusic;
  }

  playBackgroundMusic() {
    if (this.isMuted) return;
    
    // Stop game music if playing
    if (this.gameMusic && !this.gameMusic.paused) {
      this.gameMusic.pause();
      this.gameMusic.currentTime = 0;
    }
    
    const music = this.initBackgroundMusic();
    
    // Only restart if not already playing
    if (music.paused || music.ended) {
      music.currentTime = 0;
      music.play().catch(err => console.log('Background music play failed:', err));
    }
    
    this.currentMusic = music;
    this.currentGameMusicType = null;
  }

  playGameMusic(difficulty: 'junior' | 'senior') {
    if (this.isMuted) return;
    
    // If same music is already playing, don't restart
    if (this.currentGameMusicType === difficulty && this.gameMusic && !this.gameMusic.paused) {
      return;
    }
    
    // Stop background music if playing
    if (this.backgroundMusic && !this.backgroundMusic.paused) {
      this.backgroundMusic.pause();
    }
    
    const musicFile = difficulty === 'junior' ? '/junior-music.mp3' : '/senior-music.mp3';
    const music = this.initGameMusic();
    
    // Only change source if different
    if (music.src !== location.origin + musicFile) {
      music.src = musicFile;
    }
    
    // Play the music
    if (music.paused || music.ended) {
      music.currentTime = 0;
      music.play().catch(err => console.log('Game music play failed:', err));
    }
    
    this.currentMusic = music;
    this.currentGameMusicType = difficulty;
  }

  playSound(soundName: string) {
    if (this.isMuted) return;
    
    const soundMap: Record<string, string> = {
      'button-click': '/button-click.mp3',
      'circle-pop': '/circle-pop.mp3',
      'correct': '/correct-answer.mp3',
      'wrong': '/wrong-answer.mp3',
      'level-up': '/level-up.mp3',
      'drag': '/drag-circle.mp3',
      'leaderboard': '/leaderboard-appears.mp3',
      'points': '/points-added.mp3',
    };

    const soundFile = soundMap[soundName];
    if (soundFile) {
      const audio = new Audio(soundFile);
      audio.volume = 0.6;
      audio.preload = 'auto';
      audio.play().catch(err => {
        console.log(`Sound '${soundName}' play failed:`, err);
        // Try again after a brief delay
        setTimeout(() => {
          audio.play().catch(e => console.log('Retry failed:', e));
        }, 100);
      });
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
      // Pause all sounds
      if (this.currentMusic && !this.currentMusic.paused) {
        this.currentMusic.pause();
      }
    } else {
      // Resume current music if any
      if (this.currentMusic && this.currentMusic.paused) {
        this.currentMusic.play().catch(err => console.log('Audio resume failed:', err));
      }
    }
    
    return this.isMuted;
  }

  getMuted() {
    return this.isMuted;
  }

  // Public method to initialize audio on first user interaction (for mobile)
  initAudio() {
    // Pre-initialize audio objects on first click to unlock audio on mobile
    this.initBackgroundMusic();
    this.initGameMusic();
  }
}

// Export singleton instance
export const soundManager = new SoundManager();

