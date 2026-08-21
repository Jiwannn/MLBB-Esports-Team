import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function AboutSection() {
  const [aboutData, setAboutData] = useState({
    title: 'About RVC',
    story: 'RVC is a professional esports management organization specializing in Mobile Legends: Bang Bang. We build championship-winning teams through strategic player development and innovative coaching.',
    image: '',
    stats: [
      { number: '15+', label: 'Trophies' },
      { number: '50+', label: 'Matches' },
      { number: '100K+', label: 'Fans' },
    ],
  });

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const docRef = doc(db, 'settings', 'about');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setAboutData(docSnap.data());
      }
    } catch (error) {
      console.error('Error fetching about data:', error);
    }
  };

  return (
    <section id="about" className="relative min-h-screen flex flex-col bg-gradient-to-b from-black to-gray-900">
      <div className="flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full py-20">
          
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.5 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4">
              <span className="gold-text">{aboutData.title?.split(' ')[0] || 'About'}</span>{' '}
              <span className="silver-text">{aboutData.title?.split(' ')[1] || 'RVC'}</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-yellow-300 mx-auto" />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-yellow-500/20 to-transparent rounded-2xl blur-xl" />
              {aboutData.image ? (
                <img src={aboutData.image} alt="About RVC" className="relative rounded-2xl shadow-2xl w-full aspect-square object-cover" />
              ) : (
                <div className="relative rounded-2xl shadow-2xl w-full aspect-square bg-gradient-to-br from-yellow-500/20 to-gray-700 flex items-center justify-center">
                  <span className="text-6xl">🏆</span>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h3 className="text-2xl font-bold gold-text mb-4">Our Story</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">{aboutData.story}</p>
              
              <div className="grid grid-cols-3 gap-4">
                {aboutData.stats?.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50, scale: 0.8 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ amount: 0.5 }}
                    transition={{ duration: 0.6, delay: 0.4 + index * 0.2 }}
                    className="text-center p-4 bg-gray-900 rounded-lg"
                  >
                    <p className="text-3xl font-bold gold-text">{stat.number}</p>
                    <p className="text-sm text-gray-400">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="relative w-full overflow-hidden border-t-2 border-yellow-500/30 bg-black py-4">
        <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-black to-transparent z-10" />
        <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-black to-transparent z-10" />
        
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: [0, -2000] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
          {[...Array(6)].map((_, index) => (
            <div key={index} className="flex items-center space-x-8 mr-8">
              <span className="text-3xl font-black gold-text">RVC</span>
              <span className="text-yellow-500 text-xl">★</span>
              <span className="text-xl font-bold silver-text">ON TOP!</span>
              <span className="text-yellow-500 text-xl">★</span>
              <span className="text-xl font-bold gold-text">RVC LANG MALAKAS</span>
              <span className="text-yellow-500 text-xl">★</span>
              <span className="text-xl font-bold silver-text">CHAMPIONS!</span>
              <span className="text-yellow-500 text-xl">★</span>

            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}