import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Zap, CheckCircle, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGame } from '@/contexts/GameContext';
import { useTheme } from '@/contexts/ThemeContext';
import { gameAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import VennCircle from '@/components/VennCircle';
import { DraggableItem } from '@/components/DraggableItem';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SoundToggle } from '@/components/SoundToggle';
import { soundManager } from '@/lib/soundManager';

interface CircleState {
  visible: boolean;
  position: { x: number; y: number };
  size: number;
}

interface ItemPosition {
  id: string;
  x: number;
  y: number;
}

interface LevelData {
  level_id: number;
  items: string[];
  points: number;
  circle_a_label: string;
  circle_b_label: string;
}

const Game = () => {
  const navigate = useNavigate();
  // @ts-ignore
  const { player, currentLevel, setCurrentLevel, score, setScore, resetGame, sessionId, difficulty, fetchLeaderboard } = useGame();
  const { theme } = useTheme();
  const [gameKey, setGameKey] = useState(0);
  const [levelData, setLevelData] = useState<LevelData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [circles, setCircles] = useState<Record<'A' | 'B', CircleState>>({
    A: { visible: false, position: { x: 100, y: 120 }, size: 200 },
    B: { visible: false, position: { x: 280, y: 120 }, size: 200 },
  });
  
  const [itemPositions, setItemPositions] = useState<ItemPosition[]>([]);
  const [showResult, setShowResult] = useState<'correct' | 'wrong' | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [resultMessage, setResultMessage] = useState('');

  // Redirect if no player/session
  useEffect(() => {
    if (!player || !sessionId) {
      navigate('/');
      return;
    }
  }, [player, sessionId, navigate]);

  // Game music will be started by user interaction (button clicks)
  // to comply with mobile browser autoplay policies

  // Load level from backend
  useEffect(() => {
    const loadLevel = async () => {
      if (!sessionId) return;
      
      setLoading(true);
      try {
        const data = await gameAPI.getLevel(currentLevel, sessionId);
        setLevelData(data);
        
        // Initialize item positions
        const startY = 30;
        const spacing = 60;
        const itemsPerColumn = 3;
        setItemPositions(data.items.map((item, index) => {
          const col = Math.floor(index / itemsPerColumn);
          const row = index % itemsPerColumn;
          return {
            id: `item-${index}`,
            x: 20 + (col * 140),
            y: startY + (row * spacing),
          };
        }));
        
        // Reset circles for new level
        setCircles({
          A: { visible: false, position: { x: 100, y: 120 }, size: 200 },
          B: { visible: false, position: { x: 280, y: 120 }, size: 200 },
        });
        
        setGameKey(prev => prev + 1);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load level:', error);
        alert('Failed to load level. Returning to home.');
        navigate('/');
      }
    };
    
    loadLevel();
  }, [currentLevel, sessionId, navigate]);

  if (!player || !levelData || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading level...</p>
        </div>
      </div>
    );
  }

  const toggleCircle = (circle: 'A' | 'B') => {
    soundManager.playSound('circle-pop');
    setCircles(prev => ({
      ...prev,
      [circle]: { ...prev[circle], visible: !prev[circle].visible }
    }));
  };

  const handleCirclePositionChange = (circle: 'A' | 'B', position: { x: number; y: number }) => {
    setCircles(prev => ({
      ...prev,
      [circle]: { ...prev[circle], position }
    }));
  };

  const handleCircleSizeChange = (circle: 'A' | 'B', size: number) => {
    setCircles(prev => ({
      ...prev,
      [circle]: { ...prev[circle], size }
    }));
  };

  const handleItemPositionChange = (id: string, x: number, y: number) => {
    setItemPositions(prev => prev.map(item => 
      item.id === id ? { ...item, x, y } : item
    ));
  };

  const getItemZone = (itemX: number, itemY: number): 'A' | 'B' | 'AB' | 'outside' => {
    const itemCenterX = itemX + 60;
    const itemCenterY = itemY + 20;
    
    const inCircle = (circleKey: 'A' | 'B') => {
      if (!circles[circleKey].visible) return false;
      const circle = circles[circleKey];
      const radius = circle.size / 2;
      const circleCenterX = circle.position.x + radius;
      const circleCenterY = circle.position.y + radius;
      const distance = Math.sqrt(
        Math.pow(itemCenterX - circleCenterX, 2) + 
        Math.pow(itemCenterY - circleCenterY, 2)
      );
      return distance <= radius;
    };

    const inA = inCircle('A');
    const inB = inCircle('B');

    if (inA && inB) return 'AB';
    if (inA) return 'A';
    if (inB) return 'B';
    return 'outside';
  };

  const checkAnswers = async () => {
    if (!sessionId) return;
    
    soundManager.playSound('button-click');
    setIsChecking(true);
    
    // Build user answers mapping
    const userAnswers: Record<string, string> = {};
    levelData.items.forEach((item, index) => {
      const position = itemPositions.find(p => p.id === `item-${index}`);
      if (position) {
        const zone = getItemZone(position.x, position.y);
        userAnswers[item] = zone;
      }
    });

    try {
      const result = await gameAPI.submitAnswer({
        session_id: sessionId,
        level_id: levelData.level_id,
        user_answers: userAnswers,
      });

      setResultMessage(result.explanation);

      if (result.correct) {
        soundManager.playSound('correct');
        soundManager.playSound('level-up');
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        setScore(result.total_score);
        setShowResult('correct');
      } else {
        soundManager.playSound('wrong');
        setShowResult('wrong');
        // Game over - refresh leaderboard
        await fetchLeaderboard();
      }
    } catch (error) {
      console.error('Failed to submit answer:', error);
      alert('Failed to submit answer. Please try again.');
      setIsChecking(false);
    }
  };

  const handleNextLevel = () => {
    soundManager.playSound('button-click');
    setCurrentLevel(currentLevel + 1);
    setShowResult(null);
    setIsChecking(false);
  };

  const handleGameOver = () => {
    soundManager.playSound('button-click');
    // Switch to background music and play leaderboard sounds
    soundManager.playBackgroundMusic();
    soundManager.playSound('leaderboard');
    setTimeout(() => {
      soundManager.playSound('points');
    }, 1000);
    navigate('/score');
  };

  const handleRetry = () => {
    soundManager.playSound('button-click');
    resetGame();
    navigate('/');
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-bg" />
      <div className="absolute inset-0 grid-pattern opacity-30" />

      {/* Header */}
      <motion.div 
        className="relative z-20 flex items-center justify-between p-4 bg-card/80 backdrop-blur-sm border-b border-primary/20"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Player</span>
            <span className={`font-display font-bold text-primary ${theme === 'dark' ? 'neon-text-subtle' : ''}`}>
              {player.name}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Level</span>
            <span className={`font-display font-bold text-secondary ${theme === 'dark' ? 'neon-text-secondary' : ''}`}>
              {currentLevel}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Difficulty</span>
            <span className="font-semibold text-foreground">
              {difficulty}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2 bg-card px-3 py-2 rounded-lg border border-primary/30">
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            <span className={`font-display font-bold text-sm sm:text-lg text-primary ${theme === 'dark' ? 'neon-text-subtle' : ''}`}>
              {score}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-card px-3 py-2 rounded-lg border border-secondary/30">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" />
            <span className="font-display font-bold text-sm sm:text-lg text-secondary">
              +{levelData.points}
            </span>
          </div>
          <ThemeToggle />
          <SoundToggle />
        </div>
      </motion.div>

      {/* Level Info */}
      <motion.div
        className="relative z-10 text-center py-4 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className={`text-2xl sm:text-3xl font-display font-bold text-primary mb-1 ${theme === 'dark' ? 'neon-text' : ''}`}>
          Level {levelData.level_id}
        </h1>
        <p className="text-muted-foreground">
          {levelData.circle_a_label} vs {levelData.circle_b_label}
        </p>
      </motion.div>

      {/* Game Area */}
      <div className="flex-1 relative z-10 mx-4 mb-4">
        <div 
          className="relative w-full h-full min-h-[400px] bg-card/50 backdrop-blur-sm rounded-2xl border-2 border-primary/20 overflow-hidden"
        >
          {/* Venn Circles */}
          <AnimatePresence>
            {circles.A.visible && (
              <VennCircle
                key={`A-${gameKey}`}
                type="A"
                initialPosition={circles.A.position}
                onPositionChange={handleCirclePositionChange}
                label={levelData.circle_a_label}
                size={circles.A.size}
              />
            )}
            {circles.B.visible && (
              <VennCircle
                key={`B-${gameKey}`}
                type="B"
                initialPosition={circles.B.position}
                onPositionChange={handleCirclePositionChange}
                label={levelData.circle_b_label}
                size={circles.B.size}
              />
            )}
          </AnimatePresence>

          {/* Draggable items */}
          {itemPositions.map((item, index) => {
            const itemText = levelData.items[index];
            return (
              <DraggableItem
                key={`${item.id}-${gameKey}`}
                id={item.id}
                text={itemText}
                initialPosition={{ x: item.x, y: item.y }}
                onPositionChange={handleItemPositionChange}
              />
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <motion.div
        className="relative z-20 p-4 bg-card/80 backdrop-blur-sm border-t border-primary/20"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="circleA"
              size="circle"
              onClick={() => toggleCircle('A')}
              className={circles.A.visible ? 'ring-2 ring-offset-2 ring-circle-a' : ''}
            >
              A
            </Button>
            {circles.A.visible && (
              <div className="w-24">
                <Slider
                  value={[circles.A.size]}
                  onValueChange={(v) => handleCircleSizeChange('A', v[0])}
                  min={100}
                  max={300}
                  step={10}
                  className="[&_[data-radix-slider-track]]:bg-circle-a/30 [&_[data-radix-slider-range]]:bg-circle-a [&_[data-radix-slider-thumb]]:border-circle-a"
                />
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="circleB"
              size="circle"
              onClick={() => toggleCircle('B')}
              className={circles.B.visible ? 'ring-2 ring-offset-2 ring-circle-b' : ''}
            >
              B
            </Button>
            {circles.B.visible && (
              <div className="w-24">
                <Slider
                  value={[circles.B.size]}
                  onValueChange={(v) => handleCircleSizeChange('B', v[0])}
                  min={100}
                  max={300}
                  step={10}
                  className="[&_[data-radix-slider-track]]:bg-circle-b/30 [&_[data-radix-slider-range]]:bg-circle-b [&_[data-radix-slider-thumb]]:border-circle-b"
                />
              </div>
            )}
          </div>
          
          <Button
            onClick={checkAnswers}
            disabled={isChecking}
            className="px-8"
          >
            {isChecking ? 'Checking...' : 'Check Answers'}
          </Button>
        </div>
      </motion.div>

      {/* Result Modal */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`p-8 rounded-2xl border-2 text-center max-w-sm w-full ${
                showResult === 'correct' 
                  ? 'bg-card border-green-500' 
                  : 'bg-card border-destructive'
              }`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              {showResult === 'correct' ? (
                <>
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h2 className={`text-2xl font-display font-bold text-green-500 mb-2 ${theme === 'dark' ? 'neon-text-secondary' : ''}`}>
                    Correct!
                  </h2>
                  <p className="text-muted-foreground mb-2">
                    You earned {levelData.points} points!
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    {resultMessage}
                  </p>
                  <Button onClick={handleNextLevel} className="gap-2">
                    Next Level <ArrowRight className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <>
                  <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
                  <h2 className="text-2xl font-display font-bold text-destructive mb-2">
                    Game Over!
                  </h2>
                  <p className="text-muted-foreground mb-2">
                    Your final score: {score} points
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    {resultMessage}
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button variant="outline" onClick={handleRetry} className="gap-2">
                      <RotateCcw className="w-4 h-4" /> Try Again
                    </Button>
                    <Button onClick={handleGameOver}>
                      View Leaderboard
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Game;
