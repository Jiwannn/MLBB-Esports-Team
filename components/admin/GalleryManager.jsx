import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Plus, Trash2, Upload, X, ImagePlus, Video } from 'lucide-react';
import toast from 'react-hot-toast';

export default function GalleryManager() {
  const [gallery, setGallery] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    title: '',
    category: 'General',
    type: 'image',
    url: '',
  });

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'gallery'));
      setGallery(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching gallery:', error);
      toast.error('Failed to load gallery');
    }
  };

  const handleUpload = async (file) => {
    if (!file) return;
    
    // Check if it's image or video
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');
    
    if (!isVideo && !isImage) {
      toast.error('Please upload an image or video');
      return;
    }

    setUploading(true);
    toast.loading('Uploading...');
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'RVC_UPLOADS');

      const response = await fetch(
        'https://api.cloudinary.com/v1_1/qmsxe5lq/auto/upload',
        { method: 'POST', body: formData }
      );

      const data = await response.json();
      
      if (data.secure_url) {
        setForm(prev => ({ 
          ...prev, 
          url: data.secure_url,
          type: isVideo ? 'video' : 'image'
        }));
        toast.dismiss();
        toast.success(`${isVideo ? 'Video' : 'Image'} uploaded!`);
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
    if (!form.url) {
      toast.error('Please upload a file');
      return;
    }
    try {
      await addDoc(collection(db, 'gallery'), form);
      toast.success('Added to gallery!');
      setIsModalOpen(false);
      setForm({ title: '', category: 'General', type: 'image', url: '' });
      fetchGallery();
    } catch (error) {
      toast.error('Failed to save');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this item?')) {
      await deleteDoc(doc(db, 'gallery', id));
      toast.success('Deleted!');
      fetchGallery();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold gold-text">Gallery</h2>
        <button
          onClick={() => {
            setForm({ title: '', category: 'General', type: 'image', url: '' });
            setIsModalOpen(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-black font-semibold rounded-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Add Media</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {gallery.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.05 }}
            className="relative aspect-square group bg-gray-900 rounded-lg overflow-hidden"
          >
            {item.type === 'video' ? (
              <video
                src={item.url}
                className="w-full h-full object-cover"
                muted
                loop
                playsInline
                onMouseEnter={(e) => e.target.play()}
                onMouseLeave={(e) => e.target.pause()}
              />
            ) : (
              <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white text-sm font-semibold truncate">{item.title || 'Untitled'}</p>
                <p className="text-yellow-500 text-xs">{item.category}</p>
              </div>
            </div>

            <button
              onClick={() => handleDelete(item.id)}
              className="absolute top-2 right-2 bg-red-500 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-3 h-3 text-white" />
            </button>

            {item.type === 'video' && (
              <div className="absolute top-2 left-2 bg-black/50 p-1 rounded">
                <Video className="w-3 h-3 text-yellow-500" />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold gold-text">Add Media</h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center space-y-2 w-full h-40 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-yellow-500"
              >
                {form.url ? (
                  form.type === 'video' ? (
                    <video src={form.url} className="w-full h-full object-cover rounded-lg" controls />
                  ) : (
                    <img src={form.url} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                  )
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="text-gray-400 text-sm">Click to upload image or video</span>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={(e) => handleUpload(e.target.files[0])}
                />
              </div>

              <input
                type="text"
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white"
              />
              
              <input
                type="text"
                placeholder="Category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white"
              />

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 bg-gray-700 text-gray-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 py-2 bg-yellow-500 text-black font-semibold rounded-lg"
                >
                  {uploading ? 'Uploading...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}