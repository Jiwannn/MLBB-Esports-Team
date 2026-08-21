import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Handshake } from 'lucide-react';

export default function SponsorsSection() {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSponsors();
  }, []);

  const fetchSponsors = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'sponsors'));
      setSponsors(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // DON'T SHOW if no sponsors
  if (loading) return null;
  if (sponsors.length === 0) return null;

  return (
    <section id="sponsors" className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.5 }}
          className="text-3xl md:text-4xl font-bold mb-8 text-center"
        >
          <span className="gold-text">Our</span> <span className="silver-text">Sponsors</span>
        </motion.h2>

        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          {sponsors.map((sponsor, index) => (
            <motion.a
              key={sponsor.id}
              href={sponsor.link || '#'}
              target={sponsor.link ? '_blank' : '_self'}
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ amount: 0.3 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.1 }}
              className="bg-black p-4 rounded-xl border border-yellow-500/30 w-28 h-28 md:w-36 md:h-36 flex items-center justify-center"
            >
              {sponsor.logo ? (
                <img src={sponsor.logo} alt={sponsor.name} className="w-full h-full object-contain" />
              ) : (
                <Handshake className="w-10 h-10 text-gray-500" />
              )}
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}