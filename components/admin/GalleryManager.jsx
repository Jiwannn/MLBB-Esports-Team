import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Plus, Trash2, Upload, X, Video, ImagePlus } from 'lucide-react';
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
      console.error('Error:', error);
      toast.error('Failed to load gallery');
    }
  };

  const handleUpload = async (file) => {
    if (!file) return;
    
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');
    
    if (!isVideo && !isImage) {
      toast.error('Please upload an image or video');
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      toast.error('File must be less than 100MB');
      return;
    }

    setUploading(true);
    toast.loading('Uploading...');
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'RVC_MEDIA');

      const response = await fetch(
        'https://api.cloudinary.com/v1_1/qmsxe5lq/auto/upload',
        { method: 'POST', body: formData }
      );

      const data = await response.json();
      console.log('Upload response:', data);
      
      if (data.secure_url) {
        setForm(prev => ({ 
          ...prev, 
          url: data.secure_url,
          type: data.resource_type === 'video' ? 'video' : 'image'
        }));
        toast.dismiss();
        toast.success(`${isVideo ? 'Video' : 'Image'} uploaded!`);
      } else {
        toast.dismiss();
        console.error('Upload error:', data);
        toast.error('Upload failed: ' + (data.error?.message || 'Unknown'));
      }
    } catch (error) {
      toast.dismiss();
      console.error('Upload error:', error);
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.url) {
      toast.error('Please upload a file first');
      return;
    }
    try {
      await addDoc(collection(db, 'gallery'), form);
      toast.success('Added to gallery!');
      setIsModalOpen(false);
      setForm({ title: '', category: 'General', type: 'image', url: '' });
      fetchGallery();
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this item?')) {
      try {
        await deleteDoc(doc(db, 'gallery', id));
        toast.success('Deleted!');
        fetchGallery();
      } catch (error) {
        toast.error('Failed to delete');
      }
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
          className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400"
        >
          <Plus className="w-4 h-4" />
          <span>Add Media</span>
        </button>
      </div>

      {gallery.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <ImagePlus className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <p>No media yet. Click "Add Media" to upload images or videos!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {gallery.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.05 }}
              className="relative aspect-square group bg-gray-900 rounded-lg overflow-hidden border border-yellow-500/30"
            >
              {item.type === 'video' ? (
                <video
                  src={item.url}
                  className="w-full h-full object-cover"
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  onMouseEnter={(e) => e.target.play()}
                  onMouseLeave={(e) => e.target.pause()}
                />
              ) : (
                <img 
                  src={item.url} 
                  alt={item.title || 'Gallery'} 
                  className="w-full h-full object-cover"
                />
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white text-sm font-semibold truncate">{item.title || 'Untitled'}</p>
                  <p className="text-yellow-500 text-xs">{item.category || 'General'}</p>
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
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold gold-text">Add Media</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Upload Area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center space-y-2 w-full h-40 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-yellow-500 transition-colors"
              >
                {form.url ? (
                  form.type === 'video' ? (
                    <video src={form.url} className="w-full h-full object-cover rounded-lg" controls />
                  ) : (
                    <img src={form.url} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                  )
                ) : (
                  <>
                    {uploading ? (
                      <>
                        <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-gray-400 text-sm">Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400" />
                        <span className="text-gray-400 text-sm">Click to upload image or video</span>
                        <span className="text-xs text-gray-500">MP4, WebM, PNG, JPG up to 100MB</span>
                      </>
                    )}
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

              <div>
                <label className="block text-sm silver-text mb-2">Title</label>
                <input
                  type="text"
                  placeholder="e.g., Championship Match"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm silver-text mb-2">Category</label>
                <input
                  type="text"
                  placeholder="e.g., Matches, Events, Behind the Scenes"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white"
                />
              </div>

              <div className="flex space-x-4 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || !form.url}
                  className="flex-1 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 disabled:opacity-50"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}