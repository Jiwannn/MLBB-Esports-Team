import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Trophy, Users, Calendar, ExternalLink, PlayCircle, ClipboardList } from 'lucide-react';

export default function TournamentPage() {
  const [tournamentData, setTournamentData] = useState({
    title: 'RVC Tournament 2024',
    description: 'MLBB Championship Series',
    prizePool: '₱500,000',
    teams: 32,
    date: '2024',
    challongeUrl: 'https://challonge.com/YOUR_TOURNAMENT',
    facebookUrl: 'https://www.facebook.com/profile.php?id=61591654514167',
    registrationUrl: '',
  });

  useEffect(() => {
    fetchTournamentData();
  }, []);

  const fetchTournamentData = async () => {
    try {
      const docRef = doc(db, 'settings', 'tournament');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setTournamentData(docSnap.data());
      }
    } catch (error) {
      console.error('Error fetching tournament data:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-20">
      {/* Hero Section */}
      <div className="relative py-20 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-black to-gray-900" />
        <div className="relative z-10 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="text-6xl mb-4"
          >
            🏆
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-black mb-4"
          >
            <span className="gold-text">{tournamentData.title}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-2xl silver-text mb-8"
          >
            {tournamentData.description}
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 justify-center items-center"
          >
            {/* Watch Live */}
            <motion.a
              href={tournamentData.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="inline-flex items-center space-x-2 px-10 py-4 bg-gradient-to-r from-yellow-500 to-yellow-300 text-black text-xl font-bold rounded-full shadow-lg"
              style={{ animation: 'glow 2s infinite' }}
            >
              <PlayCircle className="w-6 h-6" />
              <span>WATCH LIVE</span>
            </motion.a>

            {/* Register */}
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="inline-flex items-center space-x-2 px-10 py-4 bg-transparent border-2 border-yellow-500 text-yellow-500 text-xl font-bold rounded-full"
              >
                <ClipboardList className="w-6 h-6" />
                <span>REGISTER NOW</span>
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-3 gap-6 mb-12">
          <motion.div whileHover={{ scale: 1.05 }} className="bg-gray-900 p-6 rounded-xl border border-yellow-500/30 text-center">
            <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold gold-text">{tournamentData.prizePool}</p>
            <p className="text-gray-400 text-sm">Prize Pool</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="bg-gray-900 p-6 rounded-xl border border-yellow-500/30 text-center">
            <Users className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold gold-text">{tournamentData.teams}</p>
            <p className="text-gray-400 text-sm">Teams</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="bg-gray-900 p-6 rounded-xl border border-yellow-500/30 text-center">
            <Calendar className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold gold-text">{tournamentData.date}</p>
            <p className="text-gray-400 text-sm">Season</p>
          </motion.div>
        </div>

        {/* Challonge Bracket */}
        <div className="bg-gray-900 rounded-xl border-2 border-yellow-500/30 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold gold-text">Tournament Bracket</h2>
            <a
              href={tournamentData.challongeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-yellow-500 hover:text-yellow-400"
            >
              <ExternalLink className="w-5 h-5" />
              <span>View Full Bracket</span>
            </a>
          </div>

          <div className="w-full overflow-x-auto bg-black rounded-lg">
            <iframe
              src={`${tournamentData.challongeUrl}/module`}
              width="100%"
              height="600"
              frameBorder="0"
              scrolling="auto"
              allowTransparency="true"
              className="rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}