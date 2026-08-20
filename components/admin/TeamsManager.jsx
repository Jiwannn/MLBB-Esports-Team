import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Plus, Edit, Trash2, Upload, X, ImagePlus } from 'lucide-react';
import toast from 'react-hot-toast';
import GlareHover from '../GlareHover';

export default function TeamsManager() {
  const [teams, setTeams] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    name: '',
    division: '',
    banner: '',
    players: 0,
    wins: 0,
    losses: 0,
  });

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'teams'));
      setTeams(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching teams:', error);
      toast.error('Failed to load teams');
    }
  };

  const handleBannerUpload = async (file) => {
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
        setForm(prev => ({ ...prev, banner: data.secure_url }));
        toast.success('Banner uploaded successfully!');
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
    
    if (!form.name || !form.division) {
      toast.error('Please fill in Team Name and Division');
      return;
    }

    try {
      if (editingTeam) {
        await updateDoc(doc(db, 'teams', editingTeam.id), form);
        toast.success('Team updated successfully!');
      } else {
        await addDoc(collection(db, 'teams'), form);
        toast.success('Team added successfully!');
      }
      setIsModalOpen(false);
      setEditingTeam(null);
      setForm({ name: '', division: '', banner: '', players: 0, wins: 0, losses: 0 });
      fetchTeams();
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save team');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this team?')) {
      try {
        await deleteDoc(doc(db, 'teams', id));
        toast.success('Team deleted!');
        fetchTeams();
      } catch (error) {
        console.error('Delete error:', error);
        toast.error('Failed to delete team');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold gold-text">Teams</h2>
        <button
          onClick={() => {
            setEditingTeam(null);
            setForm({ name: '', division: '', banner: '', players: 0, wins: 0, losses: 0 });
            setIsModalOpen(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Team</span>
        </button>
      </div>

      {teams.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <ImagePlus className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <p>No teams yet. Click "Add Team" to create your first team!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <motion.div
              key={team.id}
              whileHover={{ scale: 1.02 }}
            >
              <GlareHover
                glareColor="#FFD700"
                glareOpacity={0.3}
                glareSize={200}
                className="rounded-xl"
              >
                <div className="bg-gray-900 rounded-xl border border-yellow-500/30 overflow-hidden">
                  <div className="relative w-full aspect-square">
                    {team.banner ? (
                      <img 
                        src={team.banner} 
                        alt={team.name} 
                        className="w-full h-full object-cover object-center"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.style.background = 'linear-gradient(135deg, #FFD700, #1a1a1a)';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-yellow-500/20 to-gray-700 flex items-center justify-center">
                        <ImagePlus className="w-12 h-12 text-gray-500" />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 border-t border-yellow-500/30">
                    <h3 className="text-xl font-bold gold-text mb-1">{team.name}</h3>
                    <p className="text-gray-400 text-sm mb-3">{team.division}</p>
                    <div className="flex justify-between text-xs text-gray-400 mb-3">
                      <span>{team.players || 0} Players</span>
                      <span>{team.wins || 0}W - {team.losses || 0}L</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingTeam(team);
                          setForm(team);
                          setIsModalOpen(true);
                        }}
                        className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 text-sm"
                      >
                        <Edit className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(team.id)}
                        className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 text-sm"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </GlareHover>
            </motion.div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold gold-text">
                {editingTeam ? 'Edit Team' : 'Add Team'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm silver-text mb-2">Team Banner (480x480 recommended)</label>
                {form.banner ? (
                  <div className="relative">
                    <img 
                      src={form.banner} 
                      alt="Banner Preview" 
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, banner: '' })}
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
                        <span className="text-gray-400">Click to upload banner</span>
                        <span className="text-xs text-gray-500">480x480 PNG, JPG</span>
                      </>
                    )}
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
                <label className="block text-sm silver-text mb-2">Team Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Team Alpha"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg focus:border-yellow-500 focus:outline-none text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm silver-text mb-2">Division *</label>
                <input
                  type="text"
                  placeholder="e.g., MLBB Pro Division"
                  value={form.division}
                  onChange={(e) => setForm({ ...form, division: e.target.value })}
                  className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg focus:border-yellow-500 focus:outline-none text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm silver-text mb-2">Players</label>
                  <input
                    type="number"
                    placeholder="5"
                    value={form.players}
                    onChange={(e) => setForm({ ...form, players: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm silver-text mb-2">Wins</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={form.wins}
                    onChange={(e) => setForm({ ...form, wins: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm silver-text mb-2">Losses</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={form.losses}
                    onChange={(e) => setForm({ ...form, losses: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white"
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
                  {editingTeam ? 'Update Team' : 'Save Team'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}