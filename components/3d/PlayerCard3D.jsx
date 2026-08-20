import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function PlayerCard3D({ player }) {
  const cardRef = useRef(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useSpring(useTransform(y, [-100, 100], [15, -15]), {
    stiffness: 300,
    damping: 30
  });
  
  const rotateY = useSpring(useTransform(x, [-100, 100], [-15, 15]), {
    stiffness: 300,
    damping: 30
  });

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="relative w-64 h-80 cursor-pointer group"
      whileHover={{ scale: 1.05 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-silver-500/20 rounded-2xl transform-gpu transition-all group-hover:shadow-2xl group-hover:shadow-yellow-500/50">
        <div className="relative h-full p-6 rounded-2xl bg-gradient-to-b from-gray-900 to-black border border-yellow-500/30 overflow-hidden">
          <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
            <img
              src={player.image}
              alt={player.name}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              style={{ transform: "translateZ(50px)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
          </div>

          <div style={{ transform: "translateZ(30px)" }}>
            <h3 className="text-xl font-bold gold-text">{player.name}</h3>
            <p className="text-sm silver-text">{player.role}</p>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-yellow-500 font-bold">{player.stats?.winRate || 0}%</p>
                <p className="text-xs text-gray-400">Win Rate</p>
              </div>
              <div>
                <p className="text-yellow-500 font-bold">{player.stats?.kda || 0}</p>
                <p className="text-xs text-gray-400">KDA</p>
              </div>
              <div>
                <p className="text-yellow-500 font-bold">{player.stats?.matches || 0}</p>
                <p className="text-xs text-gray-400">Matches</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}