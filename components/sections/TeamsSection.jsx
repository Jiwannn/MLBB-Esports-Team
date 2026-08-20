import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Users, X, Gamepad2 } from 'lucide-react';

export default function TeamsSection() {
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamPlayers, setTeamPlayers] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [teamsSnap, playersSnap] = await Promise.all([
        getDocs(collection(db, 'teams')),
        getDocs(collection(db, 'players')),
      ]);
      setTeams(teamsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setPlayers(playersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTeamClick = (team) => {
    setSelectedTeam(team);
    setTeamPlayers(players.filter(p => p.team === team.name));
  };

  return (
    <section id="teams" className="min-h-screen bg-black py-20">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-bold mb-12 text-center"
        >
          <span className="gold-text">Our</span> <span className="silver-text">Teams</span>
        </motion.h2>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin mx-auto" />
          </div>
        ) : teams.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <p>No teams available yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            {teams.map((team, index) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.3 }}
                transition={{ delay: index * 0.03 }}
                className="team-card bg-gray-900 rounded-lg border border-yellow-500/40 overflow-hidden cursor-pointer"
                onClick={() => handleTeamClick(team)}
              >
                {/* Smaller banner - 480x480 displayed small */}
                <div className="w-full aspect-square max-h-[150px] md:max-h-[180px]">
                  {team.banner ? (
                    <img src={team.banner} alt={team.name} className="w-full h-full object-cover object-center" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-yellow-500/20 to-gray-700 flex items-center justify-center">
                      <Users className="w-6 h-6 text-gray-500" />
                    </div>
                  )}
                </div>
                
                {/* Compact info */}
                <div className="p-2 md:p-3">
                  <h3 className="text-xs md:text-sm font-bold gold-text truncate">{team.name}</h3>
                  <p className="text-gray-400 text-[10px] md:text-xs truncate">{team.division}</p>
                  <div className="flex justify-between text-[9px] md:text-[10px] text-gray-400 mt-1">
                    <span>{team.players || 0}P</span>
                    <span>{team.wins || 0}W - {team.losses || 0}L</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Team Players Modal */}
      {selectedTeam && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedTeam(null)}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="bg-gray-900 p-6 rounded-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold gold-text">{selectedTeam.name}</h3>
                <p className="text-gray-400">{selectedTeam.division}</p>
              </div>
              <button onClick={() => setSelectedTeam(null)}>
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            
            {teamPlayers.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Gamepad2 className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <p>No players assigned to this team yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {teamPlayers.map((player) => (
                  <div key={player.id} className="bg-black rounded-xl overflow-hidden">
                    <div className="w-full aspect-square">
                      {player.image ? (
                        <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                          <Gamepad2 className="w-8 h-8 text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="font-bold gold-text text-sm">{player.name}</p>
                      <p className="text-gray-400 text-xs">{player.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}