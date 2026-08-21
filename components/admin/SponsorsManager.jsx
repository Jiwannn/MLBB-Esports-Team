import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Plus, Edit, Trash2, Upload, X, Handshake } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SponsorsManager() {
  const [sponsors, setSponsors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    name: '',
    logo: '',
    link: '',
  });

  useEffect(() => {
    fetchSponsors();
  }, []);

  const fetchSponsors = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'sponsors'));
      setSponsors(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      toast.error('Failed to load sponsors');
    }
  };

  const handleLogoUpload = async (file) => {
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
        setForm(prev => ({ ...prev, logo: data.secure_url }));
        toast.success('Logo uploaded!');
      }
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.logo) {
      toast.error('Please fill name and upload logo');
      return;
    }
    try {
      if (editingSponsor) {
        await updateDoc(doc(db, 'sponsors', editingSponsor.id), form);
        toast.success('Sponsor updated!');
      } else {
        await addDoc(collection(db, 'sponsors'), form);
        toast.success('Sponsor added!');
      }
      setIsModalOpen(false);
      setEditingSponsor(null);
      setForm({ name: '', logo: '', link: '' });
      fetchSponsors();
    } catch (error) {
      toast.error('Failed to save');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this sponsor?')) {
      await deleteDoc(doc(db, 'sponsors', id));
      toast.success('Sponsor deleted!');
      fetchSponsors();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold gold-text">Sponsors</h2>
        <button
          onClick={() => {
            setEditingSponsor(null);
            setForm({ name: '', logo: '', link: '' });
            setIsModalOpen(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-black font-semibold rounded-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Add Sponsor</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sponsors.map((sponsor) => (
          <motion.div key={sponsor.id} whileHover={{ scale: 1.05 }} className="bg-gray-900 rounded-xl border border-yellow-500/30 p-4">
            <div className="w-full h-24 mb-2">
              {sponsor.logo ? (
                <img src={sponsor.logo} alt={sponsor.name} className="w-full h-full object-contain" />
              ) : (
                <Handshake className="w-10 h-10 text-gray-500 mx-auto" />
              )}
            </div>
            <p className="text-sm font-bold gold-text text-center truncate">{sponsor.name}</p>
            <div className="flex space-x-1 mt-2">
              <button onClick={() => { setEditingSponsor(sponsor); setForm(sponsor); setIsModalOpen(true); }} className="flex-1 px-2 py-1.5 bg-blue-500/20 text-blue-400 rounded text-xs">Edit</button>
              <button onClick={() => handleDelete(sponsor.id)} className="flex-1 px-2 py-1.5 bg-red-500/20 text-red-400 rounded text-xs">Delete</button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold gold-text">{editingSponsor ? 'Edit Sponsor' : 'Add Sponsor'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm silver-text mb-2">Sponsor Logo</label>
                {form.logo ? (
                  <div className="relative">
                    <img src={form.logo} alt="Logo" className="w-full h-24 object-contain rounded-lg bg-white p-2" />
                    <button type="button" onClick={() => setForm({ ...form, logo: '' })} className="absolute top-1 right-1 bg-red-500 p-1 rounded-full"><X className="w-3 h-3 text-white" /></button>
                  </div>
                ) : (
                  <div onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer">
                    <Upload className="w-6 h-6 text-gray-400" />
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleLogoUpload(e.target.files[0])} />
              </div>
              <input type="text" placeholder="Sponsor Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white" required />
              <input type="text" placeholder="Website Link (optional)" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white" />
              <div className="flex space-x-4">
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