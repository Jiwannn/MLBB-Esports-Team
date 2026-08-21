import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Plus, Edit, Trash2, X, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function FAQManager() {
  const [faqs, setFaqs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState(null);
  const [form, setForm] = useState({ question: '', answer: '' });

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'faqs'));
      setFaqs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      toast.error('Failed to load FAQs');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.question || !form.answer) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      if (editingFAQ) {
        await updateDoc(doc(db, 'faqs', editingFAQ.id), form);
        toast.success('FAQ updated!');
      } else {
        await addDoc(collection(db, 'faqs'), form);
        toast.success('FAQ added!');
      }
      setIsModalOpen(false);
      setEditingFAQ(null);
      setForm({ question: '', answer: '' });
      fetchFAQs();
    } catch (error) {
      toast.error('Failed to save');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this FAQ?')) {
      await deleteDoc(doc(db, 'faqs', id));
      toast.success('Deleted!');
      fetchFAQs();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold gold-text">FAQ</h2>
        <button onClick={() => { setEditingFAQ(null); setForm({ question: '', answer: '' }); setIsModalOpen(true); }} className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-black font-semibold rounded-lg">
          <Plus className="w-4 h-4" />
          <span>Add FAQ</span>
        </button>
      </div>

      <div className="space-y-3">
        {faqs.map((faq) => (
          <motion.div key={faq.id} className="bg-gray-900 p-4 rounded-xl border border-yellow-500/30">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-bold gold-text text-sm">{faq.question}</h3>
                <p className="text-gray-400 text-sm mt-1">{faq.answer}</p>
              </div>
              <div className="flex space-x-2 ml-4">
                <button onClick={() => { setEditingFAQ(faq); setForm(faq); setIsModalOpen(true); }} className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded text-xs">Edit</button>
                <button onClick={() => handleDelete(faq.id)} className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded text-xs">Delete</button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold gold-text">{editingFAQ ? 'Edit' : 'Add'} FAQ</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Question *" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white" required />
              <textarea placeholder="Answer *" rows="4" value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white" required />
              <div className="flex space-x-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 bg-gray-700 text-gray-300 rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-yellow-500 text-black font-semibold rounded-lg">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}