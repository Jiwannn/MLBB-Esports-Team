import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ImagePlus, X } from 'lucide-react';

export default function GallerySection() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'gallery'));
      setImages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="gallery" className="relative min-h-screen overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}
      >
        <source src="/videos/beams-1787229790997.webm" type="video/webm" />
        Your browser does not support the video tag.
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" style={{ zIndex: 1 }} />

      {/* Content */}
      <div className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.5 }}
            transition={{ duration: 0.8 }}
            className="text-5xl font-bold mb-12 text-center"
          >
            <span className="gold-text">Gallery</span>
          </motion.h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin mx-auto" />
            </div>
          ) : images.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              <ImagePlus className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <p>No images yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ amount: 0.3 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="relative group cursor-pointer aspect-square"
                  onClick={() => setSelectedImage(image)}
                >
                  {image.url ? (
                    <img
                      src={image.url}
                      alt={image.title || 'Gallery Image'}
                      className="w-full h-full object-cover rounded-lg border-2 border-yellow-500/30"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800/80 rounded-lg flex items-center justify-center">
                      <ImagePlus className="w-12 h-12 text-gray-500" />
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white font-semibold">{image.title || 'Untitled'}</p>
                      <p className="text-yellow-500 text-sm">{image.category || 'General'}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <motion.img
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            src={selectedImage.url}
            alt={selectedImage.title}
            className="max-w-full max-h-full rounded-lg"
          />
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white text-2xl bg-black/50 p-2 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </motion.div>
      )}
    </section>
  );
}