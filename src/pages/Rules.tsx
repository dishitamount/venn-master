import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SoundToggle } from '@/components/SoundToggle';
import { soundManager } from '@/lib/soundManager';
import { 
  Circle, 
  Move, 
  ListChecks, 
  MousePointerClick, 
  Brain, 
  RefreshCw, 
  Send, 
  Trophy, 
  XCircle,
  Star
} from 'lucide-react';

const rules = [
  { icon: Circle, text: "Use the Circle A and B buttons to add circles to the screen." },
  { icon: Move, text: "Drag circles to position them. Adjust their size with the sliders." },
  { icon: ListChecks, text: "You will receive a list of items (words) to place in the diagram." },
  { icon: MousePointerClick, text: "Drag items into the correct circle, overlap, or outside area." },
  { icon: Brain, text: "Read the circle labels carefully and think logically." },
  { icon: RefreshCw, text: "You may rearrange items before submitting." },
  { icon: Send, text: "Click Check Answers when you are done." },
  { icon: Trophy, text: "All correct → gain points and advance to the next level." },
  { icon: XCircle, text: "Any mistake → game over and score is saved." },
  { icon: Star, text: "View the leaderboard and try again to improve your score." },
];

const Rules = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { x: -30, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  };

  return (
    <div className="min-h-screen relative overflow-hidden py-8 px-4">
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
        </>
      )}
      
      {theme === 'light' && (
        <>
          <motion.div 
            className="absolute top-20 right-20 w-64 h-64 rounded-full bg-pastel-peach/30 pastel-blob"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-pastel-sky/30 pastel-blob"
            animate={{ scale: [1.1, 1, 1.1] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
        </>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-2xl mx-auto"
      >
        <motion.h1 
          className={`text-4xl md:text-5xl font-display font-bold text-center mb-8 text-primary ${theme === 'dark' ? 'neon-text' : ''}`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring" }}
        >
          How to Play
        </motion.h1>

        <motion.div
          className="bg-card/80 backdrop-blur-xl rounded-2xl p-6 md:p-8 border-2 border-primary/20 shadow-glow"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="space-y-4">
            {rules.map((rule, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-primary/5 transition-colors"
                whileHover={{ x: 5 }}
              >
                <motion.div 
                  className={`p-2 rounded-lg bg-primary/10 ${theme === 'dark' ? 'shadow-glow' : ''}`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <rule.icon className={`w-5 h-5 text-primary ${theme === 'dark' ? 'neon-text-subtle' : ''}`} />
                </motion.div>
                <p className="text-foreground text-sm md:text-base leading-relaxed flex-1">
                  {rule.text}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-8 pt-6 border-t border-border"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <Button
              onClick={() => {
                soundManager.playSound('button-click');
                navigate('/game');
              }}
              variant={theme === 'dark' ? 'neon' : 'default'}
              size="xl"
              className="w-full"
            >
              Continue to Game
            </Button>
          </motion.div>
        </motion.div>

        {/* Animated circles decoration */}
        <div className="flex justify-center gap-6 mt-8">
          {[0, 1].map((i) => (
            <motion.div
              key={i}
              className={`w-16 h-16 rounded-full border-2 opacity-50
                ${i === 0 ? 'border-circle-a bg-circle-a/10' : ''}
                ${i === 1 ? 'border-circle-b bg-circle-b/10' : ''}
              `}
              animate={{ 
                y: [0, -10, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{ 
                duration: 2,
                delay: i * 0.3,
                repeat: Infinity,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Rules;
