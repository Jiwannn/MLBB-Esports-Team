import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Plus, Edit, Trash2, Upload, X, Gamepad2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PlayersManager() {
  const [players, setPlayers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    name: '',
    role: 'Jungler',
    team: '',
    image: '',
    stats: {
      winRate: 0,
      kda: 0,
      matches: 0,
      mvpCount: 0,
    },
  });

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'players'));
      setPlayers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching players:', error);
      toast.error('Failed to load players');
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image must be less than 10MB');
      return;
    }

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'RVC_UPLOADS');

      const response = await fetch(
        'https://api.cloudinary.com/v1_1/qmsxe5lq/image/upload',
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      if (data.secure_url) {
        setForm(prev => ({ ...prev, image: data.secure_url }));
        toast.success('Image uploaded successfully!');
      } else {
        console.error('Cloudinary error:', data);
        toast.error('Upload failed: ' + (data.error?.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.name || !form.role) {
      toast.error('Please fill in Player Name and Role');
      return;
    }

    try {
      if (editingPlayer) {
        await updateDoc(doc(db, 'players', editingPlayer.id), form);
        toast.success('Player updated successfully!');
      } else {
        await addDoc(collection(db, 'players'), form);
        toast.success('Player added successfully!');
      }
      setIsModalOpen(false);
      setEditingPlayer(null);
      setForm({
        name: '',
        role: 'Jungler',
        team: '',
        image: '',
        stats: { winRate: 0, kda: 0, matches: 0, mvpCount: 0 },
      });
      fetchPlayers();
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save player');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this player?')) {
      try {
        await deleteDoc(doc(db, 'players', id));
        toast.success('Player deleted!');
        fetchPlayers();
      } catch (error) {
        console.error('Delete error:', error);
        toast.error('Failed to delete player');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold gold-text">Players</h2>
        <button
          onClick={() => {
            setEditingPlayer(null);
            setForm({
              name: '',
              role: 'Jungler',
              team: '',
              image: '',
              stats: { winRate: 0, kda: 0, matches: 0, mvpCount: 0 },
            });
            setIsModalOpen(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Player</span>
        </button>
      </div>

      {players.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Gamepad2 className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <p>No players yet. Click "Add Player" to create your first player!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {players.map((player) => (
            <motion.div
              key={player.id}
              whileHover={{ scale: 1.02 }}
              className="bg-gray-900 rounded-xl border border-yellow-500/30 overflow-hidden"
            >
              {/* Player Image */}
              <div className="relative w-full aspect-square">
                {player.image ? (
                  <img 
                    src={player.image} 
                    alt={player.name} 
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.style.background = 'linear-gradient(135deg, #FFD700, #1a1a1a)';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-yellow-500/20 to-gray-700 flex items-center justify-center">
                    <Gamepad2 className="w-12 h-12 text-gray-500" />
                  </div>
                )}
              </div>
              
              {/* Player Info */}
              <div className="p-4 border-t border-yellow-500/30">
                <h3 className="text-xl font-bold gold-text mb-1">{player.name}</h3>
                <p className="text-gray-400 text-sm mb-1">{player.role}</p>
                {player.team && <p className="text-gray-400 text-sm mb-3">{player.team}</p>}
                
                <div className="grid grid-cols-4 gap-2 text-center text-xs mb-3">
                  <div>
                    <p className="text-yellow-500 font-bold">{player.stats?.winRate || 0}%</p>
                    <p className="text-gray-500">Win Rate</p>
                  </div>
                  <div>
                    <p className="text-yellow-500 font-bold">{player.stats?.kda || 0}</p>
                    <p className="text-gray-500">KDA</p>
                  </div>
                  <div>
                    <p className="text-yellow-500 font-bold">{player.stats?.matches || 0}</p>
                    <p className="text-gray-500">Matches</p>
                  </div>
                  <div>
                    <p className="text-yellow-500 font-bold">{player.stats?.mvpCount || 0}</p>
                    <p className="text-gray-500">MVP</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingPlayer(player);
                      setForm(player);
                      setIsModalOpen(true);
                    }}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 text-sm"
                  >
                    <Edit className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(player.id)}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 text-sm"
                  >
                    <Trash2 className="w-3 h-3" />
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
                {editingPlayer ? 'Edit Player' : 'Add Player'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm silver-text mb-2">Player Image</label>
                {form.image ? (
                  <div className="relative">
                    <img 
                      src={form.image} 
                      alt="Player Preview" 
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, image: '' })}
                      className="absolute top-2 right-2 bg-red-500 p-1 rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center space-y-2 w-full aspect-square border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-yellow-500 transition-colors"
                  >
                    {uploading ? (
                      <>
                        <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-gray-400">Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400" />
                        <span className="text-gray-400">Click to upload image</span>
                        <span className="text-xs text-gray-500">PNG, JPG up to 10MB</span>
                      </>
                    )}
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e.target.files[0])}
                />
              </div>

              <div>
                <label className="block text-sm silver-text mb-2">Player Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Ace"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg focus:border-yellow-500 focus:outline-none text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm silver-text mb-2">Role *</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg focus:border-yellow-500 focus:outline-none text-white"
                >
                  <option>Jungler</option>
                  <option>Mid Laner</option>
                  <option>Gold Laner</option>
                  <option>Exp Laner</option>
                  <option>Roamer</option>
                  <option>Coach</option>
                  <option>Substitute</option>
                </select>
              </div>

              <div>
                <label className="block text-sm silver-text mb-2">Team</label>
                <input
                  type="text"
                  placeholder="e.g., Team Alpha"
                  value={form.team}
                  onChange={(e) => setForm({ ...form, team: e.target.value })}
                  className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg focus:border-yellow-500 focus:outline-none text-white"
                />
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block text-xs silver-text mb-1">Win Rate %</label>
                  <input
                    type="number"
                    value={form.stats?.winRate || 0}
                    onChange={(e) => setForm({ ...form, stats: { ...form.stats, winRate: parseInt(e.target.value) || 0 } })}
                    className="w-full px-2 py-2 bg-black border border-gray-700 rounded-lg text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs silver-text mb-1">KDA</label>
                  <input
                    type="number"
                    step="0.1"
                    value={form.stats?.kda || 0}
                    onChange={(e) => setForm({ ...form, stats: { ...form.stats, kda: parseFloat(e.target.value) || 0 } })}
                    className="w-full px-2 py-2 bg-black border border-gray-700 rounded-lg text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs silver-text mb-1">Matches</label>
                  <input
                    type="number"
                    value={form.stats?.matches || 0}
                    onChange={(e) => setForm({ ...form, stats: { ...form.stats, matches: parseInt(e.target.value) || 0 } })}
                    className="w-full px-2 py-2 bg-black border border-gray-700 rounded-lg text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs silver-text mb-1">MVP</label>
                  <input
                    type="number"
                    value={form.stats?.mvpCount || 0}
                    onChange={(e) => setForm({ ...form, stats: { ...form.stats, mvpCount: parseInt(e.target.value) || 0 } })}
                    className="w-full px-2 py-2 bg-black border border-gray-700 rounded-lg text-white text-sm"
                  />
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
                >
                  {editingPlayer ? 'Update Player' : 'Save Player'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}