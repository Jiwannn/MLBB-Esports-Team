import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Trophy, ImagePlus } from 'lucide-react';

export default function AchievementsSection() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'achievements'));
      setAchievements(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Don't show if no achievements
  if (loading) return null;
  if (achievements.length === 0) return null;

  return (
    <section id="achievements" className="min-h-screen bg-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.5 }}
          className="text-5xl font-bold mb-12 text-center"
        >
          <span className="gold-text">Achievements</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.3 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
              className="bg-black rounded-xl border-2 border-yellow-500/50 overflow-hidden"
            >
              {/* Banner Image */}
              <div className="relative w-full h-40 md:h-48">
                {achievement.image ? (
                  <img src={achievement.image} alt={achievement.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-yellow-500/20 to-gray-700 flex items-center justify-center">
                    <Trophy className="w-12 h-12 text-yellow-500" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
              </div>

              {/* Achievement Info */}
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold gold-text mb-2">{achievement.title}</h3>
                <p className="text-gray-400 text-sm">{achievement.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}