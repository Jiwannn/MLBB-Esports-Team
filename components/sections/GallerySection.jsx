import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ImagePlus, X, Video, Play } from 'lucide-react';

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
          viewport={{ amount: 0.5 }}
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
            {gallery.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ amount: 0.3 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.03 }}
                className="relative cursor-pointer aspect-square rounded-lg overflow-hidden border-2 border-yellow-500/30"
                onClick={() => setSelectedItem(item)}
              >
                {item.type === 'video' ? (
                  <>
                    <video
                      src={item.url}
                      className="w-full h-full object-cover"
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    />
                    {/* Play icon overlay - makes it obvious it's clickable */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-yellow-500 flex items-center justify-center">
                        <Play className="w-6 h-6 md:w-8 md:h-8 text-black" />
                      </div>
                    </div>
                    <div className="absolute top-2 left-2 bg-black/50 p-1 rounded">
                      <Video className="w-3 h-3 md:w-4 md:h-4 text-yellow-500" />
                    </div>
                  </>
                ) : (
                  <img
                    src={item.url}
                    alt={item.title || 'Gallery'}
                    className="w-full h-full object-cover"
                  />
                )}
                
                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2 md:p-3">
                  <p className="text-white text-xs md:text-sm font-semibold truncate">{item.title || 'Untitled'}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox - Works on Mobile */}
      {selectedItem && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          {selectedItem.type === 'video' ? (
            <video 
              src={selectedItem.url} 
              controls 
              autoPlay 
              playsInline
              className="max-w-full max-h-full rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <img 
              src={selectedItem.url} 
              alt={selectedItem.title} 
              className="max-w-full max-h-full rounded-lg"
            />
          )}
          <button
            onClick={() => setSelectedItem(null)}
            className="absolute top-4 right-4 text-white text-2xl bg-black/50 p-2 rounded-full w-10 h-10 flex items-center justify-center"
          >
            <X className="w-6 h-6" />
          </button>
        </motion.div>
      )}
    </section>
  );
}