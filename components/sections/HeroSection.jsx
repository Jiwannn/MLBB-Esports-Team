import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import StrokeText from '../StrokeText';

export default function HeroSection() {
  const [showContent, setShowContent] = useState(false);
  const [fontSize, setFontSize] = useState(200);
  const [strokeWidth, setStrokeWidth] = useState(3);

  useEffect(() => {
    // Responsive font size
    const handleResize = () => {
      if (window.innerWidth < 480) {
        setFontSize(80);
        setStrokeWidth(2);
      } else if (window.innerWidth < 768) {
        setFontSize(120);
        setStrokeWidth(2);
      } else if (window.innerWidth < 1024) {
        setFontSize(150);
        setStrokeWidth(3);
      } else {
        setFontSize(200);
        setStrokeWidth(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Wait for LoadingScreen to finish (2.5s)
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 2500);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/images/hero-banner.jpg"
          alt="RVC Esports"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.style.background = 'linear-gradient(135deg, #0a0a0a, #1a1a1a)';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/50" />
      </div>

      {/* Content - Shows AFTER loading screen */}
      {showContent && (
        <div className="relative z-10 text-center px-4">
          {/* StrokeText RVC */}
          <StrokeText
            text="RVC"
            strokeColor="#FFD700"
            fillColor="#FFF4CC"
            strokeWidth={strokeWidth}
            drawDuration={0.6}
            fillDelay={0.05}
            stagger={0.02}
            ease="power3.out"
            trigger="mount"
            fillMode="wipe"
            fontSize={fontSize}
            fontWeight={900}
            letterSpacing={8}
          />
          
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-xl md:text-2xl lg:text-3xl silver-text mt-4 md:mt-8"
          >
            Esports Management
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="text-base md:text-lg lg:text-xl text-gray-300 mt-3 md:mt-4 mb-8 md:mb-12 px-2"
          >
            Professional Mobile Legends: Bang Bang Team Management
          </motion.p>

          {/* Join Button */}
          <motion.a
            href="https://www.facebook.com/profile.php?id=61591654514167"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-8 md:px-10 py-3 md:py-4 bg-gradient-to-r from-yellow-500 to-yellow-300 text-black text-base md:text-lg font-bold rounded-full shadow-lg"
            style={{ animation: 'glow 2s infinite' }}
          >
            JOIN RVC
          </motion.a>
        </div>
      )}
    </section>
  );
}