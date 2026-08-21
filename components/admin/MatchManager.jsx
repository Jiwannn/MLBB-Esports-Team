import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Plus, Edit, Trash2, X, Swords, Upload, ImagePlus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MatchManager() {
  const [matches, setMatches] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    opponent: '',
    tournament: '',
    date: '',
    time: '',
    format: 'Bo3',
    status: 'scheduled',
    result: 'Upcoming',
    score: { team: 0, opponent: 0 },
    banner: '',
  });

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'matches'));
      const matchData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      matchData.sort((a, b) => new Date(a.date) - new Date(b.date));
      setMatches(matchData);
    } catch (error) {
      console.error('Error fetching matches:', error);
      toast.error('Failed to load matches');
    }
  };

  const handleBannerUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'RVC_MEDIA');

      const response = await fetch(
        'https://api.cloudinary.com/v1_1/qmsxe5lq/image/upload',
        { method: 'POST', body: formData }
      );

      const data = await response.json();
      if (data.secure_url) {
        setForm(prev => ({ ...prev, banner: data.secure_url }));
        toast.success('Banner uploaded!');
      }
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
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
        banner: '',
      });
      fetchMatches();
    } catch (error) {
      toast.error('Failed to save match');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this match?')) {
      await deleteDoc(doc(db, 'matches', id));
      toast.success('Match deleted!');
      fetchMatches();
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
              banner: '',
            });
            setIsModalOpen(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-black font-semibold rounded-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Add Match</span>
        </button>
      </div>

      {matches.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Swords className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <p>No matches yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matches.map((match) => (
            <motion.div
              key={match.id}
              whileHover={{ scale: 1.02 }}
              className="bg-gray-900 rounded-xl border border-yellow-500/30 overflow-hidden"
            >
              {/* Match Banner */}
              <div className="relative w-full h-40">
                {match.banner ? (
                  <img src={match.banner} alt={match.opponent} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-yellow-500/20 to-gray-700 flex items-center justify-center">
                    <ImagePlus className="w-8 h-8 text-gray-500" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                <span className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(match.status)}`}>
                  {match.status.toUpperCase()}
                </span>
              </div>

              {/* Match Info */}
              <div className="p-4">
                <p className="text-sm text-gray-400">{match.tournament}</p>
                <div className="flex items-center justify-between my-2">
                  <span className="font-bold gold-text">RVC</span>
                  <span className="text-gray-500">VS</span>
                  <span className="font-bold silver-text">{match.opponent}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{match.date ? new Date(match.date).toLocaleDateString() : 'TBD'}</span>
                  <span>{match.time || 'TBD'}</span>
                  <span>{match.format}</span>
                </div>
                <div className="flex space-x-2 mt-3">
                  <button
                    onClick={() => {
                      setEditingMatch(match);
                      setForm(match);
                      setIsModalOpen(true);
                    }}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(match.id)}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-red-500/20 text-red-400 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
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
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Banner Upload */}
              <div>
                <label className="block text-sm silver-text mb-2">Match Banner</label>
                {form.banner ? (
                  <div className="relative">
                    <img src={form.banner} alt="Banner" className="w-full h-32 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, banner: '' })}
                      className="absolute top-2 right-2 bg-red-500 p-1 rounded-full"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-yellow-500"
                  >
                    <Upload className="w-6 h-6 text-gray-400" />
                    <span className="text-gray-400 text-sm">{uploading ? 'Uploading...' : 'Upload Banner'}</span>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleBannerUpload(e.target.files[0])}
                />
              </div>

              <div>
                <label className="block text-sm silver-text mb-2">Opponent *</label>
                <input type="text" value={form.opponent} onChange={(e) => setForm({ ...form, opponent: e.target.value })} className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white" required />
              </div>

              <div>
                <label className="block text-sm silver-text mb-2">Tournament *</label>
                <input type="text" value={form.tournament} onChange={(e) => setForm({ ...form, tournament: e.target.value })} className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm silver-text mb-2">Date</label>
                  <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white" />
                </div>
                <div>
                  <label className="block text-sm silver-text mb-2">Time</label>
                  <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm silver-text mb-2">Format</label>
                  <select value={form.format} onChange={(e) => setForm({ ...form, format: e.target.value })} className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white">
                    <option>Bo1</option>
                    <option>Bo3</option>
                    <option>Bo5</option>
                    <option>Bo7</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm silver-text mb-2">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white">
                    <option value="scheduled">Scheduled</option>
                    <option value="live">Live</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm silver-text mb-2">Result</label>
                <select value={form.result} onChange={(e) => setForm({ ...form, result: e.target.value })} className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white">
                  <option>Upcoming</option>
                  <option>Win</option>
                  <option>Loss</option>
                  <option>Draw</option>
                </select>
              </div>

              <div className="flex space-x-4 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 bg-gray-700 text-gray-300 rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-yellow-500 text-black font-semibold rounded-lg">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}