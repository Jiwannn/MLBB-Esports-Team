import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Gamepad2 } from 'lucide-react';

export default function PlayersSection() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'players'));
      setPlayers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching players:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="players" className="min-h-screen bg-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-bold mb-12 text-center"
        >
          <span className="gold-text">Our</span> <span className="silver-text">Players</span>
        </motion.h2>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin mx-auto" />
          </div>
        ) : players.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <Gamepad2 className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <p>No players yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {players.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.3 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.03 }}
                className="bg-black rounded-xl border border-yellow-500/30 overflow-hidden"
              >
                {/* Player Image */}
                <div className="relative w-full aspect-square">
                  {player.image ? (
                    <img 
                      src={player.image} 
                      alt={player.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-yellow-500/20 to-gray-700 flex items-center justify-center">
                      <Gamepad2 className="w-10 h-10 text-gray-500" />
                    </div>
                  )}
                </div>
                
                {/* Player Info - NO STATS */}
                <div className="p-3 md:p-4 text-center">
                  <h3 className="text-sm md:text-base font-bold gold-text truncate">{player.name}</h3>
                  <p className="text-gray-400 text-xs md:text-sm">{player.role}</p>
                  {player.team && (
                    <p className="text-gray-500 text-xs mt-1">{player.team}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}