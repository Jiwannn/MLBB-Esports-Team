import { motion } from 'framer-motion';

export default function RVC_CD() {
  return (
    <div className="relative flex items-center justify-center" style={{ perspective: '1000px' }}>
      <motion.div
        animate={{ 
          rotateY: [0, 360],
        }}
        transition={{ 
          rotateY: { duration: 15, repeat: Infinity, ease: "linear" },
        }}
        style={{ 
          transformStyle: 'preserve-3d',
        }}
      >
        <h1 
          className="font-black"
          style={{
            fontSize: '10rem',
            fontWeight: '900',
            lineHeight: '1',
            background: 'linear-gradient(135deg, #FFD700 0%, #FFF4CC 20%, #FFD700 40%, #B8860B 60%, #FFD700 80%, #FFF4CC 100%)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'shimmer 3s linear infinite',
            filter: 'drop-shadow(0 0 30px rgba(255,215,0,0.8)) drop-shadow(0 0 60px rgba(255,215,0,0.5)) drop-shadow(0 0 90px rgba(255,215,0,0.3))',
            letterSpacing: '15px',
            WebkitTextStroke: '3px #FFD700',
          }}
        >
          RVC
        </h1>
      </motion.div>
      
      {/* Glow rings */}
      <motion.div
        className="absolute w-72 h-72 rounded-full border-4 border-yellow-500/40"
        animate={{ rotate: 360, scale: [1, 1.1, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        style={{ pointerEvents: 'none', boxShadow: '0 0 40px rgba(255,215,0,0.3)' }}
      />
      <motion.div
        className="absolute w-80 h-80 rounded-full border-2 border-silver-500/30"
        animate={{ rotate: -360, scale: [1.1, 1, 1.1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{ pointerEvents: 'none' }}
      />
    </div>
  );
}