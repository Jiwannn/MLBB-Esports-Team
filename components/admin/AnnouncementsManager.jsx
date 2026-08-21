import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Plus, Edit, Trash2, X, Megaphone, Upload, ImagePlus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AnnouncementsManager() {
  const [announcements, setAnnouncements] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({ 
    title: '', 
    content: '', 
    image: '' 
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'announcements'));
      setAnnouncements(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      toast.error('Failed to load announcements');
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image');
      return;
    }

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
        setForm(prev => ({ ...prev, image: data.secure_url }));
        toast.success('Image uploaded!');
      } else {
        toast.error('Upload failed');
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
        toast.success('Announcement updated!');
      } else {
        await addDoc(collection(db, 'announcements'), { 
          ...form, 
          createdAt: new Date().toISOString() 
        });
        toast.success('Announcement added!');
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
    if (confirm('Delete this announcement?')) {
      await deleteDoc(doc(db, 'announcements', id));
      toast.success('Deleted!');
      fetchAnnouncements();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold gold-text">Announcements</h2>
        <button 
          onClick={() => { 
            setEditingAnnouncement(null); 
            setForm({ title: '', content: '', image: '' }); 
            setIsModalOpen(true); 
          }} 
          className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-black font-semibold rounded-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Add Announcement</span>
        </button>
      </div>

      {announcements.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Megaphone className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <p>No announcements yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {announcements.map((announcement) => (
            <motion.div 
              key={announcement.id} 
              whileHover={{ scale: 1.02 }}
              className="bg-gray-900 rounded-xl border border-yellow-500/30 overflow-hidden"
            >
              {/* Announcement Image */}
              {announcement.image && (
                <div className="relative w-full h-40">
                  <img src={announcement.image} alt={announcement.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                </div>
              )}
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-bold gold-text">{announcement.title}</h3>
                    <p className="text-xs text-gray-500">
                      {announcement.createdAt ? new Date(announcement.createdAt).toLocaleDateString() : ''}
                    </p>
                  </div>
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => { 
                        setEditingAnnouncement(announcement); 
                        setForm(announcement); 
                        setIsModalOpen(true); 
                      }} 
                      className="px-2 py-1.5 bg-blue-500/20 text-blue-400 rounded text-xs"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={() => handleDelete(announcement.id)} 
                      className="px-2 py-1.5 bg-red-500/20 text-red-400 rounded text-xs"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-400 text-sm">{announcement.content}</p>
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
                {editingAnnouncement ? 'Edit' : 'Add'} Announcement
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm silver-text mb-2">Announcement Image/Banner</label>
                {form.image ? (
                  <div className="relative">
                    <img src={form.image} alt="Banner" className="w-full h-32 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, image: '' })}
                      className="absolute top-2 right-2 bg-red-500 p-1 rounded-full"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-yellow-500 transition-colors"
                  >
                    {uploading ? (
                      <>
                        <div className="w-6 h-6 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-gray-400 text-sm">Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-gray-400" />
                        <span className="text-gray-400 text-sm">Upload Image (Optional)</span>
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
                <label className="block text-sm silver-text mb-2">Title *</label>
                <input 
                  type="text" 
                  placeholder="Announcement title" 
                  value={form.title} 
                  onChange={(e) => setForm({ ...form, title: e.target.value })} 
                  className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white" 
                  required 
                />
              </div>

              <div>
                <label className="block text-sm silver-text mb-2">Content *</label>
                <textarea 
                  placeholder="Announcement content" 
                  rows="4" 
                  value={form.content} 
                  onChange={(e) => setForm({ ...form, content: e.target.value })} 
                  className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white" 
                  required 
                />
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