import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Swords, ImagePlus } from 'lucide-react';

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
            {/* Upcoming Matches */}
            {upcomingMatches.length > 0 && (
              <div className="mb-16">
                <h3 className="text-2xl font-bold silver-text mb-6">Upcoming Matches</h3>
                <div className="space-y-4">
                  {upcomingMatches.map((match) => (
                    <motion.div
                      key={match.id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-gray-900 p-4 md:p-6 rounded-xl border border-yellow-500/30"
                    >
                      <div className="flex items-center justify-between gap-2 md:gap-4">
                        {/* RVC Side */}
                        <div className="flex-1 text-center">
                          <div className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-2 rounded-full overflow-hidden border-2 border-yellow-500/50">
                            <img 
                              src="/images/RVCLOGO.jpg" 
                              alt="RVC" 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          </div>
                          <p className="font-bold gold-text text-sm md:text-lg">RVC</p>
                        </div>

                        {/* VS + Info */}
                        <div className="flex flex-col items-center">
                          <span className="text-xl md:text-3xl font-black text-gray-500">VS</span>
                          <div className="text-center mt-2">
                            <p className="text-xs md:text-sm text-gray-400">{match.tournament}</p>
                            <p className="text-xs text-gray-500">{match.format}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {match.date ? new Date(match.date).toLocaleDateString() : 'TBD'}
                            </p>
                            <p className="text-xs text-gray-500">{match.time || 'TBD'}</p>
                          </div>
                        </div>

                        {/* Opponent Side */}
                        <div className="flex-1 text-center">
                          <div className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-2 rounded-full overflow-hidden border-2 border-silver-500/50">
                            {match.banner ? (
                              <img 
                                src={match.banner} 
                                alt={match.opponent} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                                <ImagePlus className="w-6 h-6 text-gray-500" />
                              </div>
                            )}
                          </div>
                          <p className="font-bold silver-text text-sm md:text-lg">{match.opponent}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Completed Matches */}
            {completedMatches.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold silver-text mb-6">Recent Results</h3>
                <div className="space-y-4">
                  {completedMatches.map((match) => (
                    <motion.div
                      key={match.id}
                      whileHover={{ scale: 1.02 }}
                      className={`p-4 md:p-6 rounded-xl border ${
                        match.result === 'Win' 
                          ? 'bg-green-900/30 border-green-500/30' 
                          : 'bg-red-900/30 border-red-500/30'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 md:gap-4">
                        {/* RVC */}
                        <div className="flex-1 flex items-center gap-2 md:gap-3">
                          <div className="w-10 h-10 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-yellow-500/50">
                            <img src="/images/RVCLOGO.jpg" alt="RVC" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-bold gold-text text-sm md:text-base">RVC</p>
                            <p className="text-green-400 font-bold text-lg md:text-2xl">{match.score?.team || 0}</p>
                          </div>
                        </div>

                        {/* VS */}
                        <span className="text-gray-500 font-bold text-sm md:text-lg">VS</span>

                        {/* Opponent */}
                        <div className="flex-1 flex items-center gap-2 md:gap-3 justify-end">
                          <div className="text-right">
                            <p className="font-bold silver-text text-sm md:text-base">{match.opponent}</p>
                            <p className="text-red-400 font-bold text-lg md:text-2xl">{match.score?.opponent || 0}</p>
                          </div>
                          <div className="w-10 h-10 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-silver-500/50">
                            {match.banner ? (
                              <img src={match.banner} alt={match.opponent} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                                <ImagePlus className="w-4 h-4 text-gray-500" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-center mt-2 text-xs text-gray-400">
                        {match.date ? new Date(match.date).toLocaleDateString() : ''}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* No matches */}
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