import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ChevronDown } from 'lucide-react';

export default function FAQSection() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'faqs'));
      setFaqs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // DON'T SHOW if no FAQs
  if (loading) return null;
  if (faqs.length === 0) return null;

  return (
    <section id="faq" className="py-16 bg-gray-900">
      <div className="max-w-4xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.5 }}
          className="text-3xl md:text-4xl font-bold mb-8 text-center"
        >
          <span className="gold-text">FAQ</span>
        </motion.h2>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div key={faq.id} className="bg-black rounded-xl border border-yellow-500/30 overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex justify-between items-center p-4 text-left"
              >
                <span className="font-semibold silver-text">{faq.question}</span>
                <ChevronDown className={`w-5 h-5 text-yellow-500 transition-transform ${openIndex === index ? 'rotate-180' : ''}`} />
              </button>
              {openIndex === index && (
                <div className="px-4 pb-4">
                  <p className="text-gray-400 text-sm">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}