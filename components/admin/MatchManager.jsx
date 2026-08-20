import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Plus, Edit, Trash2, X, Swords } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MatchManager() {
  const [matches, setMatches] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);
  const [form, setForm] = useState({
    opponent: '',
    tournament: '',
    date: '',
    time: '',
    format: 'Bo3',
    status: 'scheduled',
    result: 'Upcoming',
    score: {
      team: 0,
      opponent: 0,
    },
  });

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'matches'));
      setMatches(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching matches:', error);
      toast.error('Failed to load matches');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.opponent || !form.tournament) {
      toast.error('Please fill in Opponent and Tournament');
      return;
    }

    try {
      if (editingMatch) {
        await updateDoc(doc(db, 'matches', editingMatch.id), form);
        toast.success('Match updated!');
      } else {
        await addDoc(collection(db, 'matches'), form);
        toast.success('Match added!');
      }
      setIsModalOpen(false);
      setEditingMatch(null);
      setForm({
        opponent: '',
        tournament: '',
        date: '',
        time: '',
        format: 'Bo3',
        status: 'scheduled',
        result: 'Upcoming',
        score: { team: 0, opponent: 0 },
      });
      fetchMatches();
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save match');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this match?')) {
      try {
        await deleteDoc(doc(db, 'matches', id));
        toast.success('Match deleted!');
        fetchMatches();
      } catch (error) {
        toast.error('Failed to delete match');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-900/30 text-blue-400';
      case 'live': return 'bg-yellow-900/30 text-yellow-400';
      case 'completed': return 'bg-green-900/30 text-green-400';
      case 'cancelled': return 'bg-red-900/30 text-red-400';
      default: return 'bg-gray-900/30 text-gray-400';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold gold-text">Matches</h2>
        <button
          onClick={() => {
            setEditingMatch(null);
            setForm({
              opponent: '',
              tournament: '',
              date: '',
              time: '',
              format: 'Bo3',
              status: 'scheduled',
              result: 'Upcoming',
              score: { team: 0, opponent: 0 },
            });
            setIsModalOpen(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400"
        >
          <Plus className="w-4 h-4" />
          <span>Add Match</span>
        </button>
      </div>

      {matches.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Swords className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <p>No matches yet. Click "Add Match" to schedule one!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map((match) => (
            <motion.div
              key={match.id}
              whileHover={{ scale: 1.01 }}
              className="bg-gray-900 p-6 rounded-xl border border-yellow-500/30"
            >
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="text-center md:text-left mb-4 md:mb-0">
                  <p className="text-sm text-gray-400">Tournament</p>
                  <p className="text-lg font-semibold silver-text">{match.tournament}</p>
                </div>
                
                <div className="flex items-center space-x-6 mb-4 md:mb-0">
                  <div className="text-center">
                    <p className="font-bold gold-text">RVC</p>
                    {match.result === 'Win' && <p className="text-green-400 font-bold">{match.score?.team || 0}</p>}
                  </div>
                  
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-500">VS</p>
                    <p className="text-xs text-gray-500">{match.format}</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="font-bold silver-text">{match.opponent}</p>
                    {match.result === 'Loss' && <p className="text-red-400 font-bold">{match.score?.opponent || 0}</p>}
                  </div>
                </div>
                
                <div className="text-center md:text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(match.status)}`}>
                    {match.status?.toUpperCase()}
                  </span>
                  <p className="text-sm text-gray-400 mt-2">
                    {match.date ? new Date(match.date).toLocaleDateString() : 'TBD'} {match.time || ''}
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-4 border-t border-gray-800 pt-4">
                <button
                  onClick={() => {
                    setEditingMatch(match);
                    setForm(match);
                    setIsModalOpen(true);
                  }}
                  className="flex items-center space-x-1 px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(match.id)}
                  className="flex items-center space-x-1 px-3 py-2 bg-red-500/20 text-red-400 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold gold-text">
                {editingMatch ? 'Edit Match' : 'Add Match'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm silver-text mb-2">Opponent *</label>
                <input
                  type="text"
                  placeholder="e.g., Team Alpha"
                  value={form.opponent}
                  onChange={(e) => setForm({ ...form, opponent: e.target.value })}
                  className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm silver-text mb-2">Tournament *</label>
                <input
                  type="text"
                  placeholder="e.g., MLBB Championship 2024"
                  value={form.tournament}
                  onChange={(e) => setForm({ ...form, tournament: e.target.value })}
                  className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm silver-text mb-2">Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm silver-text mb-2">Time</label>
                  <input
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm silver-text mb-2">Format</label>
                  <select
                    value={form.format}
                    onChange={(e) => setForm({ ...form, format: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white"
                  >
                    <option>Bo1</option>
                    <option>Bo3</option>
                    <option>Bo5</option>
                    <option>Bo7</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm silver-text mb-2">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="live">Live</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm silver-text mb-2">Result</label>
                <select
                  value={form.result}
                  onChange={(e) => setForm({ ...form, result: e.target.value })}
                  className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white"
                >
                  <option>Upcoming</option>
                  <option>Win</option>
                  <option>Loss</option>
                  <option>Draw</option>
                </select>
              </div>

              {form.result === 'Win' || form.result === 'Loss' ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm silver-text mb-2">RVC Score</label>
                    <input
                      type="number"
                      value={form.score?.team || 0}
                      onChange={(e) => setForm({ ...form, score: { ...form.score, team: parseInt(e.target.value) || 0 } })}
                      className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm silver-text mb-2">Opponent Score</label>
                    <input
                      type="number"
                      value={form.score?.opponent || 0}
                      onChange={(e) => setForm({ ...form, score: { ...form.score, opponent: parseInt(e.target.value) || 0 } })}
                      className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white"
                    />
                  </div>
                </div>
              ) : null}

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 bg-gray-700 text-gray-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-yellow-500 text-black font-semibold rounded-lg"
                >
                  {editingMatch ? 'Update Match' : 'Save Match'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}