import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Users, Gamepad2, Trophy, Swords, MessageSquare, ClipboardList, Image, Settings } from 'lucide-react';

export default function Overview({ setActiveTab }) {
  const [stats, setStats] = useState({
    teams: 0,
    players: 0,
    matches: 0,
    registrations: 0,
    contacts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [teamsSnap, playersSnap, matchesSnap, registrationsSnap, contactsSnap] = await Promise.all([
        getDocs(collection(db, 'teams')),
        getDocs(collection(db, 'players')),
        getDocs(collection(db, 'matches')),
        getDocs(collection(db, 'registrations')),
        getDocs(collection(db, 'contacts')),
      ]);

      setStats({
        teams: teamsSnap.size,
        players: playersSnap.size,
        matches: matchesSnap.size,
        registrations: registrationsSnap.size,
        contacts: contactsSnap.size,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Teams', value: stats.teams, icon: Users, color: 'yellow' },
    { label: 'Total Players', value: stats.players, icon: Gamepad2, color: 'silver' },
    { label: 'Matches', value: stats.matches, icon: Swords, color: 'yellow' },
    { label: 'Registrations', value: stats.registrations, icon: ClipboardList, color: 'silver' },
    { label: 'Messages', value: stats.contacts, icon: MessageSquare, color: 'yellow' },
    { label: 'Tournaments', value: 1, icon: Trophy, color: 'silver' },
  ];

  const quickActions = [
    { label: 'View Teams', icon: Users, tab: 'teams' },
    { label: 'View Players', icon: Gamepad2, tab: 'players' },
    { label: 'Registrations', icon: ClipboardList, tab: 'registrations' },
    { label: 'Messages', icon: MessageSquare, tab: 'contacts' },
    { label: 'Matches', icon: Swords, tab: 'matches' },
    { label: 'Gallery', icon: Image, tab: 'gallery' },
    { label: 'Settings', icon: Settings, tab: 'settings' },
  ];

  return (
    <div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
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
              <div className="flex justify-between items-start mb-4">
                <Icon className={`w-10 h-10 ${
                  stat.color === 'yellow' ? 'text-yellow-500' : 'text-gray-400'
                }`} />
              </div>
              <p className={`text-4xl font-bold mb-2 ${
                stat.color === 'yellow' ? 'gold-text' : 'silver-text'
              }`}>
                {loading ? '...' : stat.value}
              </p>
              <p className="text-gray-400">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions - WORKING BUTTONS */}
      <div className="bg-gray-900 p-6 rounded-xl border border-yellow-500/30">
        <h3 className="text-xl font-bold gold-text mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.tab}
                onClick={() => setActiveTab(action.tab)}
                className="p-4 bg-yellow-500/10 rounded-lg hover:bg-yellow-500/20 transition-all flex flex-col items-center space-y-2 cursor-pointer"
              >
                <Icon className="w-8 h-8 text-yellow-500" />
                <span className="text-yellow-500 text-sm font-semibold">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}