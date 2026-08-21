import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // 1 second

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-6"
      >
        <img 
          src="/images/RVCLOGO.jpg" 
          alt="RVC Logo" 
          className="w-24 h-24 md:w-40 md:h-40 rounded-full object-cover"
          style={{
            filter: 'drop-shadow(0 0 20px rgba(255,215,0,0.8))',
          }}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-3xl md:text-6xl font-black mb-3"
      >
        <span className="gold-text">RVC</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-base md:text-xl silver-text mb-6"
      >
        Esports Management
      </motion.p>

      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '150px' }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="h-1 bg-gradient-to-r from-yellow-500 to-yellow-300 rounded-full"
      />
    </motion.div>
  );
}