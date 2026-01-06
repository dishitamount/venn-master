import { useRef } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

interface DraggableItemProps {
  id: string;
  text: string;
  initialPosition: { x: number; y: number };
  onPositionChange: (id: string, x: number, y: number) => void;
}

export const DraggableItem = ({ id, text, initialPosition, onPositionChange }: DraggableItemProps) => {
  const { theme } = useTheme();
  const constraintsRef = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(initialPosition.x);
  const y = useMotionValue(initialPosition.y);

  const handleDragEnd = () => {
    onPositionChange(id, x.get(), y.get());
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0}
      style={{ x, y }}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileDrag={{ scale: 1.1, zIndex: 100 }}
      className={`absolute cursor-grab active:cursor-grabbing px-4 py-2 rounded-lg font-medium text-sm select-none
        bg-card border-2 border-primary/30 text-foreground shadow-soft
        hover:border-primary hover:shadow-glow transition-colors
        ${theme === 'dark' ? 'backdrop-blur-sm' : ''}
      `}
    >
      {text}
    </motion.div>
  );
};
