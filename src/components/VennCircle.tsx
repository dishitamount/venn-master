import { motion, useMotionValue } from 'framer-motion';

interface VennCircleProps {
  type: 'A' | 'B';
  initialPosition: { x: number; y: number };
  onPositionChange: (type: 'A' | 'B', position: { x: number; y: number }) => void;
  label: string;
  size: number;
}

const VennCircle = ({ type, initialPosition, onPositionChange, label, size }: VennCircleProps) => {
  const x = useMotionValue(initialPosition.x);
  const y = useMotionValue(initialPosition.y);

  const colorClasses = {
    A: 'border-circle-a bg-circle-a/20',
    B: 'border-circle-b bg-circle-b/20',
  };

  const glowClasses = {
    A: 'circle-glow-a',
    B: 'circle-glow-b',
  };

  const handleDragEnd = () => {
    onPositionChange(type, { x: x.get(), y: y.get() });
  };

  return (
    <motion.div
      className={`absolute rounded-full border-4 ${colorClasses[type]} ${glowClasses[type]} backdrop-blur-sm cursor-move flex items-center justify-center`}
      style={{ 
        x,
        y,
        width: size, 
        height: size 
      }}
      drag
      dragElastic={0}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: 1.02 }}
      whileDrag={{ scale: 1.05 }}
    >
      <span className="font-display font-bold text-lg text-foreground/80 pointer-events-none select-none text-center px-4">
        {label}
      </span>
    </motion.div>
  );
};

export default VennCircle;
