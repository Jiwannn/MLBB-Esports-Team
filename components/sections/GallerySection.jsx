import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ImagePlus, X, Video } from 'lucide-react';

export default function GallerySection() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'gallery'));
      setGallery(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="gallery" className="min-h-screen bg-black py-20">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold mb-12 text-center"
        >
          <span className="gold-text">Gallery</span>
        </motion.h2>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin mx-auto" />
          </div>
        ) : gallery.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <ImagePlus className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <p>No media yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ amount: 0.3 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="relative group cursor-pointer aspect-square"
                onClick={() => setSelectedItem(item)}
              >
                {item.type === 'video' ? (
                  <video
                    src={item.url}
                    className="w-full h-full object-cover rounded-lg border-2 border-yellow-500/30"
                    muted
                    loop
                    playsInline
                    onMouseEnter={(e) => e.target.play()}
                    onMouseLeave={(e) => e.target.pause()}
                  />
                ) : (
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover rounded-lg border-2 border-yellow-500/30"
                  />
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-semibold">{item.title || 'Untitled'}</p>
                    <p className="text-yellow-500 text-sm">{item.category || 'General'}</p>
                  </div>
                </div>

                {item.type === 'video' && (
                  <div className="absolute top-2 left-2 bg-black/50 p-1 rounded">
                    <Video className="w-4 h-4 text-yellow-500" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox for Image or Video */}
      {selectedItem && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          {selectedItem.type === 'video' ? (
            <video src={selectedItem.url} controls autoPlay className="max-w-full max-h-full rounded-lg" />
          ) : (
            <img src={selectedItem.url} alt={selectedItem.title} className="max-w-full max-h-full rounded-lg" />
          )}
          <button
            onClick={() => setSelectedItem(null)}
            className="absolute top-4 right-4 text-white text-2xl bg-black/50 p-2 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </motion.div>
      )}
    </section>
  );
}