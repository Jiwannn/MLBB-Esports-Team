import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function Overview() {
  const [stats, setStats] = useState({
    teams: 0,
    players: 0,
    tournaments: 0,
    matches: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [teamsSnap, playersSnap, tournamentsSnap, matchesSnap] = await Promise.all([
        getDocs(collection(db, 'teams')),
        getDocs(collection(db, 'players')),
        getDocs(collection(db, 'tournaments')),
        getDocs(collection(db, 'matches')),
      ]);

      setStats({
        teams: teamsSnap.size,
        players: playersSnap.size,
        tournaments: tournamentsSnap.size,
        matches: matchesSnap.size,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Teams', value: stats.teams, icon: '👥', color: 'yellow' },
    { label: 'Total Players', value: stats.players, icon: '🎮', color: 'silver' },
    { label: 'Tournaments', value: stats.tournaments, icon: '🏆', color: 'yellow' },
    { label: 'Total Matches', value: stats.matches, icon: '⚔️', color: 'silver' },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className={`bg-gray-900 p-6 rounded-xl border-2 ${
              stat.color === 'yellow' ? 'border-yellow-500/50' : 'border-silver-500/30'
            }`}
          >
            <span className="text-3xl block mb-4">{stat.icon}</span>
            <p className={`text-4xl font-bold mb-2 ${
              stat.color === 'yellow' ? 'gold-text' : 'silver-text'
            }`}>
              {loading ? '...' : stat.value}
            </p>
            <p className="text-gray-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </>
  );
}