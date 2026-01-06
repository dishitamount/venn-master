import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameContext';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SoundToggle } from '@/components/SoundToggle';
import { soundManager } from '@/lib/soundManager';
import { Trophy, Medal, RotateCcw, Crown, Star } from 'lucide-react';

const Score = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  // @ts-ignore
  const { player, score, leaderboard, resetGame, setPlayer, fetchLeaderboard } = useGame();

  // Fetch latest leaderboard on mount and play background music
  useEffect(() => {
    fetchLeaderboard();
    soundManager.playBackgroundMusic();
    
    // Play sounds only once on mount
    soundManager.playSound('leaderboard');
    
    // Play points added sound with delay
    const timer = setTimeout(() => {
      soundManager.playSound('points');
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []); // Empty dependency array - run only once on mount

  const handlePlayAgain = () => {
    soundManager.playSound('button-click');
    setPlayer(null);
    resetGame();
    navigate('/');
  };

  const handleNewPlayer = () => {
    setPlayer(null);
    resetGame();
    navigate('/');
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 1:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return <Star className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden py-8 px-4">
      <div className="fixed top-4 right-4 z-50 flex gap-3 items-center">
        <ThemeToggle />
        <SoundToggle />
      </div>
      
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-bg" />
      
      {theme === 'dark' && (
        <>
          <div className="absolute inset-0 grid-bg opacity-20" />
          <div className="absolute inset-0 scanlines" />
          <motion.div 
            className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full bg-primary/10 blur-[100px]"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
        </>
      )}
      
      {theme === 'light' && (
        <>
          <motion.div 
            className="absolute top-20 left-20 w-72 h-72 rounded-full bg-pastel-yellow/40 pastel-blob"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-pastel-mint/40 pastel-blob"
            animate={{ scale: [1.1, 1, 1.1] }}
            transition={{ duration: 7, repeat: Infinity }}
          />
        </>
      )}

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Score display */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Trophy className={`w-20 h-20 mx-auto text-primary mb-4 ${theme === 'dark' ? 'neon-text' : ''}`} />
          </motion.div>
          
          <h1 className={`text-3xl font-display font-bold text-foreground mb-2`}>
            Game Over, {player?.name}!
          </h1>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-primary/30 inline-block"
          >
            <p className="text-muted-foreground text-sm mb-1">Final Score</p>
            <p className={`text-6xl font-display font-bold text-primary ${theme === 'dark' ? 'neon-text' : ''}`}>
              {score}
            </p>
          </motion.div>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-card/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-primary/20 shadow-glow mb-8"
        >
          <h2 className={`text-2xl font-display font-bold text-center mb-6 text-primary ${theme === 'dark' ? 'neon-text-subtle' : ''}`}>
            🏆 Leaderboard
          </h2>
          
          {leaderboard.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No scores yet. Be the first!
            </p>
          ) : (
            <div className="space-y-3">
              {leaderboard.map((entry, index) => (
                <motion.div
                  key={`${entry.name}-${entry.date}`}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-colors
                    ${entry.name === player?.name && entry.score === score 
                      ? 'bg-primary/20 border-2 border-primary/50' 
                      : 'bg-muted/50 border border-border hover:bg-muted'
                    }
                  `}
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-card">
                    {getRankIcon(index)}
                  </div>
                  
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{entry.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Class {entry.className} • {entry.difficulty || 'N/A'}
                      {entry.levelsCompleted !== undefined && ` • ${entry.levelsCompleted} levels`}
                    </p>
                  </div>
                  
                  <div className={`text-xl font-display font-bold text-primary ${theme === 'dark' ? 'neon-text-subtle' : ''}`}>
                    {entry.score}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex justify-center"
        >
          <Button
            variant={theme === 'dark' ? 'neon' : 'default'}
            size="xl"
            onClick={handlePlayAgain}
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Play Again
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Score;
