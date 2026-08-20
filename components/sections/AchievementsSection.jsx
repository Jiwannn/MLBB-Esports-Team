import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Trophy, Medal, Award } from 'lucide-react';

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

  const icons = { Trophy, Medal, Award };

  return (
    <section id="achievements" className="min-h-screen bg-black py-20">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-bold mb-12 text-center"
        >
          <span className="gold-text">Achievements</span>
        </motion.h2>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin mx-auto" />
          </div>
        ) : achievements.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <p>No achievements yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => {
              const Icon = icons[achievement.icon] || Trophy;
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ amount: 0.3 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-900 p-8 rounded-xl border-2 border-yellow-500/50 text-center"
                >
                  <Icon className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold gold-text mb-2">{achievement.title}</h3>
                  <p className="text-gray-400">{achievement.description}</p>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}