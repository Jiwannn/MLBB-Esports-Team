import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Plus, Edit, Trash2, Upload, X, Trophy, DollarSign, QrCode, ExternalLink, PlayCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TournamentsManager() {
  const [tournament, setTournament] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const qrFileInputRef = useRef(null);
  const [form, setForm] = useState({
    title: 'RVC Tournament 2024',
    description: 'MLBB Championship Series',
    prizePool: '₱500,000',
    teams: 32,
    date: '2024',
    challongeUrl: 'https://challonge.com/YOUR_TOURNAMENT',
    facebookUrl: 'https://www.facebook.com/profile.php?id=61591654514167',
    registrationFee: 0,
    qrCodeUrl: '',
  });

  useEffect(() => {
    fetchTournament();
  }, []);

  const fetchTournament = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'tournaments'));
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        setTournament({ id: doc.id, ...doc.data() });
        setForm({ id: doc.id, ...doc.data() });
      }
    } catch (error) {
      console.error('Error fetching tournament:', error);
      toast.error('Failed to load tournament');
    }
  };

  const handleQRUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    toast.loading('Uploading QR code...');
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'RVC_UPLOADS');

      const response = await fetch(
        'https://api.cloudinary.com/v1_1/qmsxe5lq/image/upload',
        { method: 'POST', body: formData }
      );

      const data = await response.json();
      
      if (data.secure_url) {
        setForm(prev => ({ ...prev, qrCodeUrl: data.secure_url }));
        toast.dismiss();
        toast.success('QR code uploaded!');
      } else {
        toast.dismiss();
        toast.error('Upload failed');
      }
    } catch (error) {
      toast.dismiss();
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.title || !form.challongeUrl) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      if (tournament) {
        await updateDoc(doc(db, 'tournaments', tournament.id), form);
        toast.success('Tournament updated!');
      } else {
        await addDoc(collection(db, 'tournaments'), form);
        toast.success('Tournament created!');
      }
      setIsModalOpen(false);
      fetchTournament();
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save tournament');
    }
  };

  const handleDelete = async () => {
    if (!tournament) return;
    if (confirm('Delete this tournament?')) {
      try {
        await deleteDoc(doc(db, 'tournaments', tournament.id));
        setTournament(null);
        toast.success('Tournament deleted!');
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold gold-text">Tournament</h2>
        <button
          onClick={() => {
            setForm(tournament || {
              title: 'RVC Tournament 2024',
              description: 'MLBB Championship Series',
              prizePool: '₱500,000',
              teams: 32,
              date: '2024',
              challongeUrl: '',
              facebookUrl: 'https://www.facebook.com/profile.php?id=61591654514167',
              registrationFee: 0,
              qrCodeUrl: '',
            });
            setIsModalOpen(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-black font-semibold rounded-lg"
        >
          <Plus className="w-4 h-4" />
          <span>{tournament ? 'Edit Tournament' : 'Create Tournament'}</span>
        </button>
      </div>

      {tournament ? (
        <div className="bg-gray-900 rounded-xl border-2 border-yellow-500/30 overflow-hidden">
          <div className="p-6 border-b border-yellow-500/30">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold gold-text mb-2">{tournament.title}</h3>
                <p className="text-gray-400">{tournament.description}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center space-x-1 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center space-x-1 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 grid grid-cols-3 gap-6">
            <div className="text-center">
              <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-bold gold-text">{tournament.prizePool}</p>
              <p className="text-gray-400 text-sm">Prize Pool</p>
            </div>
            <div className="text-center">
              <DollarSign className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-bold gold-text">₱{tournament.registrationFee || 0}</p>
              <p className="text-gray-400 text-sm">Registration Fee</p>
            </div>
            <div className="text-center">
              <PlayCircle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <a href={tournament.facebookUrl} target="_blank" className="text-yellow-500 underline">Watch Live</a>
              <p className="text-gray-400 text-sm">Facebook</p>
            </div>
          </div>

          {tournament.qrCodeUrl && (
            <div className="p-6 border-t border-yellow-500/30 text-center">
              <p className="text-gray-400 mb-2">Payment QR Code</p>
              <img src={tournament.qrCodeUrl} alt="QR Code" className="w-32 h-32 object-contain bg-white p-2 rounded-lg mx-auto" />
            </div>
          )}

          <div className="p-6 border-t border-yellow-500/30 text-center">
            <a href={tournament.challongeUrl} target="_blank" className="text-yellow-500 underline flex items-center justify-center space-x-2">
              <ExternalLink className="w-4 h-4" />
              <span>View Challonge Bracket</span>
            </a>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <p>No tournament created yet</p>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold gold-text">
                {tournament ? 'Edit Tournament' : 'Create Tournament'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm silver-text mb-2">Title *</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white" required />
              </div>

              <div>
                <label className="block text-sm silver-text mb-2">Description</label>
                <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm silver-text mb-2">Prize Pool</label>
                  <input type="text" value={form.prizePool} onChange={(e) => setForm({ ...form, prizePool: e.target.value })} className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white" />
                </div>
                <div>
                  <label className="block text-sm silver-text mb-2">Teams</label>
                  <input type="number" value={form.teams} onChange={(e) => setForm({ ...form, teams: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm silver-text mb-2">Date/Season</label>
                  <input type="text" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white" />
                </div>
                <div>
                  <label className="block text-sm silver-text mb-2">Registration Fee (₱)</label>
                  <input type="number" value={form.registrationFee} onChange={(e) => setForm({ ...form, registrationFee: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white" />
                </div>
              </div>

              <div>
                <label className="block text-sm silver-text mb-2">Challonge URL *</label>
                <input type="text" value={form.challongeUrl} onChange={(e) => setForm({ ...form, challongeUrl: e.target.value })} className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white" required />
              </div>

              <div>
                <label className="block text-sm silver-text mb-2">Facebook Watch URL</label>
                <input type="text" value={form.facebookUrl} onChange={(e) => setForm({ ...form, facebookUrl: e.target.value })} className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white" />
              </div>

              {/* QR Code Upload */}
              <div>
                <label className="block text-sm silver-text mb-2">Payment QR Code</label>
                {form.qrCodeUrl ? (
                  <div className="relative">
                    <img src={form.qrCodeUrl} alt="QR" className="w-24 h-24 object-contain bg-white p-1 rounded-lg" />
                    <button type="button" onClick={() => setForm({ ...form, qrCodeUrl: '' })} className="absolute top-1 right-1 bg-red-500 p-1 rounded-full">
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ) : (
                  <div onClick={() => qrFileInputRef.current?.click()} className="flex items-center justify-center space-x-2 w-full h-20 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer">
                    <Upload className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-400 text-sm">{uploading ? 'Uploading...' : 'Upload QR Code'}</span>
                  </div>
                )}
                <input ref={qrFileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleQRUpload(e.target.files[0])} />
              </div>

              <div className="flex space-x-4 pt-4">
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