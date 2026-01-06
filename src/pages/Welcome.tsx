import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGame } from '@/contexts/GameContext';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SoundToggle } from '@/components/SoundToggle';
import { soundManager } from '@/lib/soundManager';
import { CircleDot, Sparkles } from 'lucide-react';

const Welcome = () => {
  const [name, setName] = useState('');
  const [className, setClassName] = useState('');
  const navigate = useNavigate();
  // @ts-ignore - startNewGame exists in context
  const { setPlayer, resetGame, startNewGame } = useGame();
  const { theme } = useTheme();

  // Music will start when user clicks "Start Adventure" button
  // This ensures mobile browsers allow audio (requires user interaction)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Initialize audio on first click (unlocks audio on mobile)
    soundManager.initAudio();
    
    // Now play sounds
    soundManager.playBackgroundMusic();
    soundManager.playSound('button-click');
    if (name.trim() && className.trim()) {
      const classNumber = parseInt(className);
      
      // Validate class is between 6-12
      if (isNaN(classNumber) || classNumber < 6 || classNumber > 12) {
        alert('Please enter a class between 6 and 12');
        return;
      }
      
      try {
        // @ts-ignore - startNewGame exists in context
        await startNewGame(name.trim(), classNumber);
        navigate('/rules');
      } catch (error) {
        console.error('Failed to start game:', error);
        alert('Failed to start game. Please make sure the backend is running.');
      }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      <div className="fixed top-4 right-4 z-50 flex gap-3 items-center">
        <ThemeToggle />
        <SoundToggle />
      </div>
      
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-bg" />
      
      {theme === 'dark' && (
        <>
          <div className="absolute inset-0 grid-bg opacity-20" />
          <div className="absolute inset-0 scanlines" />
          <motion.div 
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-[100px]"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-secondary/10 blur-[100px]"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </>
      )}
      
      {theme === 'light' && (
        <>
          <motion.div 
            className="absolute top-10 left-10 w-64 h-64 rounded-full bg-pastel-pink/30 pastel-blob"
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div 
            className="absolute top-1/3 right-20 w-80 h-80 rounded-full bg-pastel-mint/30 pastel-blob"
            animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-20 left-1/3 w-72 h-72 rounded-full bg-pastel-lavender/30 pastel-blob"
            animate={{ x: [0, 20, 0], y: [0, -30, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
        </>
      )}

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <motion.div
          className="bg-card/80 backdrop-blur-xl rounded-2xl p-8 border-2 border-primary/20 shadow-glow"
          whileHover={{ boxShadow: theme === 'dark' ? '0 0 60px hsl(var(--primary) / 0.4)' : '0 8px 40px hsl(var(--primary) / 0.2)' }}
        >
          {/* Logo */}
          <motion.div 
            className="flex items-center justify-center gap-3 mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <CircleDot className={`w-12 h-12 text-primary ${theme === 'dark' ? 'neon-text' : ''}`} />
            </motion.div>
            <h1 className={`text-4xl font-display font-bold text-primary ${theme === 'dark' ? 'neon-text' : ''}`}>
              VennQuest
            </h1>
            <Sparkles className={`w-8 h-8 text-secondary ${theme === 'dark' ? 'neon-text' : ''}`} />
          </motion.div>

          <motion.p 
            className="text-center text-muted-foreground mb-8 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Master the art of classification!
          </motion.p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-sm font-medium text-foreground mb-2">
                Your Name
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
                className="w-full"
              />
            </motion.div>

            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <label className="block text-sm font-medium text-foreground mb-2">
                Class (6-12)
              </label>
              <Input
                type="number"
                min="6"
                max="12"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="Enter your class (6-12)"
                required
                className="w-full"
              />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Button
                type="submit"
                variant={theme === 'dark' ? 'neon' : 'default'}
                size="xl"
                className="w-full"
              >
                Start Adventure
              </Button>
            </motion.div>
          </form>

          {/* Decorative circles */}
          <div className="flex justify-center gap-4 mt-8">
            {['A', 'B', 'C'].map((letter, i) => (
              <motion.div
                key={letter}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold
                  ${i === 0 ? 'border-circle-a bg-circle-a/20 text-circle-a' : ''}
                  ${i === 1 ? 'border-circle-b bg-circle-b/20 text-circle-b' : ''}
                  ${i === 2 ? 'border-circle-c bg-circle-c/20 text-circle-c' : ''}
                `}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8 + i * 0.1, type: "spring" }}
                whileHover={{ scale: 1.2 }}
              >
                {letter}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Welcome;
