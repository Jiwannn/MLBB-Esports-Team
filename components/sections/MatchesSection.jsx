import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Swords } from 'lucide-react';

export default function MatchesSection() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'matches'));
      const allMatches = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      allMatches.sort((a, b) => new Date(a.date) - new Date(b.date));
      setMatches(allMatches);
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const upcomingMatches = matches.filter(m => m.status === 'scheduled');
  const completedMatches = matches.filter(m => m.status === 'completed');

  return (
    <section id="matches" className="min-h-screen bg-black py-20">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-bold mb-12 text-center"
        >
          <span className="gold-text">Matches</span>
        </motion.h2>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin mx-auto" />
          </div>
        ) : (
          <>
            {upcomingMatches.length > 0 && (
              <div className="mb-16">
                <h3 className="text-2xl font-bold silver-text mb-6">Upcoming Matches</h3>
                <div className="space-y-4">
                  {upcomingMatches.map((match) => (
                    <motion.div
                      key={match.id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-gray-900 p-6 rounded-xl border border-yellow-500/30"
                    >
                      <div className="flex flex-col md:flex-row items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-400">{match.tournament}</p>
                          <p className="text-lg silver-text">{match.format}</p>
                        </div>
                        <div className="flex items-center space-x-8 my-4 md:my-0">
                          <span className="text-xl font-bold gold-text">RVC</span>
                          <span className="text-2xl text-gray-500">VS</span>
                          <span className="text-xl font-bold silver-text">{match.opponent}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-300">
                            {match.date ? new Date(match.date).toLocaleDateString() : 'TBD'}
                          </p>
                          <p className="text-gray-400">{match.time || 'TBD'}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {completedMatches.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold silver-text mb-6">Recent Results</h3>
                <div className="grid gap-4">
                  {completedMatches.map((match) => (
                    <motion.div
                      key={match.id}
                      whileHover={{ scale: 1.02 }}
                      className={`p-4 rounded-lg border ${
                        match.result === 'Win' 
                          ? 'bg-green-900/40 border-green-500/30' 
                          : 'bg-red-900/40 border-red-500/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="silver-text font-semibold">{match.opponent}</span>
                        <span className={`font-bold ${
                          match.result === 'Win' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {match.score?.team || 0} - {match.score?.opponent || 0}
                        </span>
                        <span className="text-gray-400 text-sm">
                          {match.date ? new Date(match.date).toLocaleDateString() : ''}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {upcomingMatches.length === 0 && completedMatches.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <Swords className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <p>No matches scheduled yet</p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}