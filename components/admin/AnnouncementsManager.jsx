import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Plus, Edit, Trash2, X, Megaphone } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AnnouncementsManager() {
  const [announcements, setAnnouncements] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [form, setForm] = useState({ title: '', content: '' });

  useEffect(() => {
    fetchAnnouncements();
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
        await addDoc(collection(db, 'announcements'), { ...form, createdAt: new Date().toISOString() });
        toast.success('Announcement added!');
      }
      setIsModalOpen(false);
      setEditingAnnouncement(null);
      setForm({ title: '', content: '' });
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
          onClick={() => { setEditingAnnouncement(null); setForm({ title: '', content: '' }); setIsModalOpen(true); }}
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
        <div className="space-y-3">
          {announcements.map((announcement) => (
            <motion.div
              key={announcement.id}
              whileHover={{ scale: 1.01 }}
              className="bg-gray-900 p-4 rounded-lg border border-yellow-500/30 flex items-start justify-between gap-4"
            >
              <div className="flex-1">
                <h3 className="text-sm font-bold gold-text mb-1">{announcement.title}</h3>
                <p className="text-gray-400 text-sm">{announcement.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {announcement.createdAt ? new Date(announcement.createdAt).toLocaleDateString() : ''}
                </p>
              </div>
              <div className="flex space-x-1 flex-shrink-0">
                <button
                  onClick={() => { setEditingAnnouncement(announcement); setForm(announcement); setIsModalOpen(true); }}
                  className="p-1.5 bg-blue-500/20 text-blue-400 rounded"
                >
                  <Edit className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleDelete(announcement.id)}
                  className="p-1.5 bg-red-500/20 text-red-400 rounded"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold gold-text">{editingAnnouncement ? 'Edit' : 'Add'} Announcement</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white" required />
              <textarea placeholder="Content *" rows="4" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white" required />
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