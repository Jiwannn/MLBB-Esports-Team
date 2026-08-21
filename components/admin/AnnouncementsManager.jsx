import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Plus, Edit, Trash2, X, Megaphone, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AnnouncementsManager() {
  const [announcements, setAnnouncements] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({ title: '', content: '', image: '' });
  const [adminEmail, setAdminEmail] = useState('');

  useEffect(() => {
    fetchAnnouncements();
    setAdminEmail(localStorage.getItem('adminEmail') || '');
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'announcements'));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setAnnouncements(data);
    } catch (error) {
      toast.error('Failed to load announcements');
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'RVC_MEDIA');
      const response = await fetch('https://api.cloudinary.com/v1_1/qmsxe5lq/image/upload', { method: 'POST', body: formData });
      const data = await response.json();
      if (data.secure_url) {
        setForm(prev => ({ ...prev, image: data.secure_url }));
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
    if (!form.title || !form.content) {
      toast.error('Please fill in title and content');
      return;
    }
    try {
      if (editingAnnouncement) {
        await updateDoc(doc(db, 'announcements', editingAnnouncement.id), form);
        toast.success('Updated!');
      } else {
        await addDoc(collection(db, 'announcements'), { 
          ...form, 
          createdAt: new Date().toISOString(),
          authorEmail: adminEmail,
        });
        toast.success('Added!');
      }
      setIsModalOpen(false);
      setEditingAnnouncement(null);
      setForm({ title: '', content: '', image: '' });
      fetchAnnouncements();
    } catch (error) {
      toast.error('Failed to save');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete?')) {
      await deleteDoc(doc(db, 'announcements', id));
      toast.success('Deleted!');
      fetchAnnouncements();
    }
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4 md:mb-6 w-full">
        <h2 className="text-xl md:text-2xl font-bold gold-text shrink-0">Announcements</h2>
        <button
          onClick={() => { setEditingAnnouncement(null); setForm({ title: '', content: '', image: '' }); setIsModalOpen(true); }}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-yellow-500 text-black font-semibold rounded-lg text-sm md:text-base shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </div>

      {announcements.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Megaphone className="w-12 h-12 mx-auto mb-3 text-gray-600" />
          <p className="text-sm">No announcements yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 w-full">
          {announcements.map((announcement) => (
            <motion.div
              key={announcement.id}
              whileHover={{ scale: 1.01 }}
              className="bg-gray-900 rounded-lg border border-yellow-500/30 overflow-hidden w-full"
            >
              {announcement.image && (
                <div className="relative w-full h-32 md:h-40">
                  <img src={announcement.image} alt={announcement.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                </div>
              )}

              <div className="p-3 md:p-4 w-full">
                {announcement.authorEmail && (
                  <div className="flex items-center space-x-2 mb-2 w-full">
                    <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-300 flex items-center justify-center shrink-0">
                      <span className="text-black font-bold text-[10px] md:text-xs">
                        {announcement.authorEmail?.charAt(0)?.toUpperCase() || 'A'}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 overflow-hidden">
                      <p className="text-[10px] md:text-xs text-gray-300 truncate">{announcement.authorEmail}</p>
                      <p className="text-[8px] md:text-[10px] text-gray-500">
                        {announcement.createdAt ? new Date(announcement.createdAt).toLocaleString() : ''}
                      </p>
                    </div>
                  </div>
                )}

                <h3 className="text-xs md:text-sm font-bold gold-text mb-1 break-words">{announcement.title}</h3>
                <p className="text-gray-400 text-[10px] md:text-xs break-words">{announcement.content}</p>

                <div className="flex space-x-1 md:space-x-2 mt-2 md:mt-3 w-full">
                  <button
                    onClick={() => { setEditingAnnouncement(announcement); setForm(announcement); setIsModalOpen(true); }}
                    className="flex-1 flex items-center justify-center space-x-1 px-2 md:px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded text-[10px] md:text-xs"
                  >
                    <Edit className="w-3 h-3 shrink-0" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(announcement.id)}
                    className="flex-1 flex items-center justify-center space-x-1 px-2 md:px-3 py-1.5 bg-red-500/20 text-red-400 rounded text-[10px] md:text-xs"
                  >
                    <Trash2 className="w-3 h-3 shrink-0" />
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
        <div className="fixed inset-0 bg-black/80 flex items-end sm:items-center justify-center z-50 sm:p-4">
          <div className="bg-gray-900 p-4 md:p-6 rounded-t-xl sm:rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg md:text-2xl font-bold gold-text">{editingAnnouncement ? 'Edit' : 'Add'} Announcement</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm silver-text mb-2">Banner Image</label>
                {form.image ? (
                  <div className="relative">
                    <img src={form.image} alt="Banner" className="w-full h-28 md:h-32 object-cover rounded-lg" />
                    <button type="button" onClick={() => setForm({ ...form, image: '' })} className="absolute top-2 right-2 bg-red-500 p-1 rounded-full"><X className="w-4 h-4 text-white" /></button>
                  </div>
                ) : (
                  <div onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center justify-center w-full h-28 md:h-32 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer">
                    <Upload className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-400 text-xs">Upload Banner</span>
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e.target.files[0])} />
              </div>
              <input type="text" placeholder="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white text-sm" required />
              <textarea placeholder="Content *" rows="3" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white text-sm" required />
              <div className="flex space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-yellow-500 text-black font-semibold rounded-lg text-sm">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}