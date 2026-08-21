import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center"
        >
          {/* RVC Logo */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <img 
              src="/images/RVCLOGO.jpg" 
              alt="RVC Logo" 
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover"
              style={{
                filter: 'drop-shadow(0 0 30px rgba(255,215,0,0.8)) drop-shadow(0 0 60px rgba(255,215,0,0.4))',
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </motion.div>

          {/* RVC Text */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-4xl md:text-6xl font-black mb-4"
          >
            <span className="gold-text">RVC</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-lg md:text-xl silver-text mb-8"
          >
            Esports Management
          </motion.p>

          {/* Loading Bar */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '200px' }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="h-1 bg-gradient-to-r from-yellow-500 to-yellow-300 rounded-full"
          />

          {/* Spinning circle */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="absolute bottom-10 w-8 h-8 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}