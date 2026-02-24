import { motion } from 'framer-motion';
import { Flame, Cog } from 'lucide-react';
import { useUIStore, type UIMode } from '@/store';

export function ModeToggle() {
  const { mode, toggleMode } = useUIStore();
  const isBhakti = mode === 'bhakti';

  return (
    <button
      onClick={toggleMode}
      className="relative flex items-center gap-1 p-1 rounded-full bg-muted border border-border transition-colors hover:bg-muted/80"
      aria-label={`Switch to ${isBhakti ? 'Yantra' : 'Bhakti'} mode`}
    >
      {/* Animated Thumb */}
      <motion.div
        className="absolute w-8 h-8 rounded-full"
        initial={false}
        animate={{
          x: isBhakti ? 0 : 36,
          background: isBhakti 
            ? 'linear-gradient(135deg, #FF6F00, #FFD700)' 
            : 'linear-gradient(135deg, #374151, #B87333)',
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
      
      {/* Bhakti Icon */}
      <div className="relative z-10 flex items-center justify-center w-8 h-8">
        <motion.div
          animate={{ 
            scale: isBhakti ? 1 : 0.8,
            opacity: isBhakti ? 1 : 0.5 
          }}
          transition={{ duration: 0.2 }}
        >
          <Flame className="w-4 h-4 text-white" />
        </motion.div>
      </div>
      
      {/* Yantra Icon */}
      <div className="relative z-10 flex items-center justify-center w-8 h-8">
        <motion.div
          animate={{ 
            scale: !isBhakti ? 1 : 0.8,
            opacity: !isBhakti ? 1 : 0.5 
          }}
          transition={{ duration: 0.2 }}
        >
          <Cog className="w-4 h-4 text-white" />
        </motion.div>
      </div>
      
      {/* Mode Label */}
      <span className="sr-only">
        {isBhakti ? 'Bhakti Bazaar Mode' : 'Yantra Industrial Mode'}
      </span>
    </button>
  );
}

// Mode Badge Component
export function ModeBadge({ mode }: { mode: UIMode }) {
  const isBhakti = mode === 'bhakti';
  
  return (
    <span 
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${
        isBhakti 
          ? 'bg-gradient-to-r from-saffron to-gold text-white' 
          : 'bg-gradient-to-r from-steel to-copper text-white'
      }`}
    >
      {isBhakti ? (
        <>
          <Flame className="w-3 h-3" />
          <span className="devanagari">भक्ति बाजार</span>
        </>
      ) : (
        <>
          <Cog className="w-3 h-3" />
          <span className="devanagari">यंत्र इंडस्ट्रियल</span>
        </>
      )}
    </span>
  );
}
