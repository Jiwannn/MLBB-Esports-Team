import { motion } from 'framer-motion';
import StrokeText from '../StrokeText';
import GlitterWarp from '../GlitterWarp';

export default function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Shooting Stars Background */}
      <GlitterWarp className="absolute inset-0 w-full h-full" />
      
      {/* Background Image with overlay */}
      <div className="absolute inset-0">
        <img
          src="/images/hero-banner.jpg"
          alt="RVC Esports"
          className="w-full h-full object-cover opacity-40"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.style.background = 'linear-gradient(135deg, #0a0a0a, #1a1a1a)';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/50" />
      </div>

      <div className="relative z-10 text-center px-4">
        <StrokeText
          text="RVC"
          strokeColor="#FFD700"
          fillColor="#FFF4CC"
          strokeWidth={3}
          drawDuration={0.6}
          fillDelay={0.05}
          stagger={0.02}
          ease="power3.out"
          trigger="mount"
          fillMode="wipe"
          fontSize={200}
          fontWeight={900}
          letterSpacing={10}
        />
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-2xl md:text-3xl silver-text mt-8"
        >
          Esports Management
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-lg text-gray-300 mt-4 mb-12"
        >
          Professional Mobile Legends: Bang Bang Team Management
        </motion.p>

        <motion.a
          href="https://www.facebook.com/profile.php?id=61591654514167"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="inline-block px-10 py-4 bg-gradient-to-r from-yellow-500 to-yellow-300 text-black text-lg font-bold rounded-full shadow-lg"
          style={{ animation: 'glow 2s infinite' }}
        >
          JOIN RVC
        </motion.a>
      </div>
    </section>
  );
}