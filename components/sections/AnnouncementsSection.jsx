import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { Megaphone } from 'lucide-react';

export default function AnnouncementsSection() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'), limit(3));
      const snapshot = await getDocs(q);
      setAnnouncements(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // DON'T SHOW if no announcements
  if (loading) return null;
  if (announcements.length === 0) return null;

  return (
    <section id="announcements" className="py-16 bg-black">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.5 }}
          className="text-3xl md:text-4xl font-bold mb-8 text-center"
        >
          <span className="gold-text">Announcements</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {announcements.map((announcement, index) => (
            <motion.div
              key={announcement.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.3 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-900 p-6 rounded-xl border border-yellow-500/30"
            >
              <div className="flex items-center space-x-2 mb-3">
                <Megaphone className="w-5 h-5 text-yellow-500" />
                <span className="text-xs text-gray-400">
                  {announcement.createdAt ? new Date(announcement.createdAt).toLocaleDateString() : ''}
                </span>
              </div>
              <h3 className="text-lg font-bold gold-text mb-2">{announcement.title}</h3>
              <p className="text-gray-400 text-sm">{announcement.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}