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
      <div className="relative py-12 md:py-20 text-center px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-black to-gray-900" />
        <div className="relative z-10">
          <Trophy className="w-14 h-14 md:w-16 md:h-16 text-yellow-500 mx-auto mb-4" />
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-5xl lg:text-7xl font-black mb-4"
          >
            <span className="gold-text">{tournamentData.title}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg md:text-2xl silver-text mb-6 md:mb-8"
          >
            {tournamentData.description}
          </motion.p>

          {/* Buttons - Stack on mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4 justify-center items-center"
          >
            <motion.a
              href={tournamentData.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center space-x-2 px-6 md:px-10 py-3 md:py-4 bg-gradient-to-r from-yellow-500 to-yellow-300 text-black text-base md:text-xl font-bold rounded-full shadow-lg w-full md:w-auto justify-center"
              style={{ animation: 'glow 2s infinite' }}
            >
              <PlayCircle className="w-5 h-5 md:w-6 md:h-6" />
              <span>WATCH LIVE</span>
            </motion.a>

            <Link href="/register" className="w-full md:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center space-x-2 px-6 md:px-10 py-3 md:py-4 bg-transparent border-2 border-yellow-500 text-yellow-500 text-base md:text-xl font-bold rounded-full w-full justify-center"
              >
                <ClipboardList className="w-5 h-5 md:w-6 md:h-6" />
                <span>REGISTER NOW</span>
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Stats - Mobile Friendly */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6 mb-8 md:mb-12">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gray-900 p-4 md:p-6 rounded-xl border border-yellow-500/30 flex items-center space-x-3 md:flex-col md:space-x-0 md:text-center"
          >
            <Trophy className="w-8 h-8 md:w-10 md:h-10 text-yellow-500 md:mx-auto md:mb-2 flex-shrink-0" />
            <div>
              <p className="text-lg md:text-2xl font-bold gold-text break-words">{tournamentData.prizePool}</p>
              <p className="text-gray-400 text-xs md:text-sm">Prize Pool</p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gray-900 p-4 md:p-6 rounded-xl border border-yellow-500/30 flex items-center space-x-3 md:flex-col md:space-x-0 md:text-center"
          >
            <Users className="w-8 h-8 md:w-10 md:h-10 text-yellow-500 md:mx-auto md:mb-2 flex-shrink-0" />
            <div>
              <p className="text-lg md:text-2xl font-bold gold-text break-words">{tournamentData.teams}</p>
              <p className="text-gray-400 text-xs md:text-sm">Teams</p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gray-900 p-4 md:p-6 rounded-xl border border-yellow-500/30 flex items-center space-x-3 md:flex-col md:space-x-0 md:text-center"
          >
            <Calendar className="w-8 h-8 md:w-10 md:h-10 text-yellow-500 md:mx-auto md:mb-2 flex-shrink-0" />
            <div>
              <p className="text-lg md:text-2xl font-bold gold-text break-words">{tournamentData.date}</p>
              <p className="text-gray-400 text-xs md:text-sm">Season</p>
            </div>
          </motion.div>
        </div>

        {/* Challonge Bracket */}
        <div className="bg-gray-900 rounded-xl border-2 border-yellow-500/30 p-3 md:p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 md:mb-6 gap-2">
            <h2 className="text-xl md:text-3xl font-bold gold-text">Tournament Bracket</h2>
            <a
              href={tournamentData.challongeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-yellow-500 hover:text-yellow-400 text-sm md:text-base"
            >
              <ExternalLink className="w-4 h-4 md:w-5 md:h-5" />
              <span>View Full Bracket</span>
            </a>
          </div>

          <div className="w-full overflow-x-auto bg-black rounded-lg">
            <iframe
              src={`${tournamentData.challongeUrl}/module`}
              width="100%"
              height="500"
              frameBorder="0"
              scrolling="auto"
              allowTransparency="true"
              className="rounded-lg min-w-[600px] md:min-w-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}