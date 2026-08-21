import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { doc, getDoc } from 'firebase/firestore';
import { Gamepad2, Mail, Send, Trophy } from 'lucide-react';
import { sendRegistrationEmail } from '../lib/emailjs';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [form, setForm] = useState({
    teamName: '',
    captainName: '',
    gmail: '',
    region: '',
    players: ['', '', '', '', '', '', ''], // 7 players
    coach: '',
  });
  const [registrationFee, setRegistrationFee] = useState(0);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

  useEffect(() => {
    fetchPaymentSettings();
  }, []);

  const fetchPaymentSettings = async () => {
    try {
      const docRef = doc(db, 'settings', 'tournament');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setRegistrationFee(docSnap.data().registrationFee || 0);
        setQrCodeUrl(docSnap.data().qrCodeUrl || '');
      }
    } catch (error) {
      console.error('Error fetching payment settings:', error);
    }
  };

  const handlePlayerChange = (index, value) => {
    const newPlayers = [...form.players];
    newPlayers[index] = value;
    setForm({ ...form, players: newPlayers });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.teamName || !form.captainName || !form.gmail) {
      toast.error('Please fill in required fields');
      return;
    }

    if (!form.gmail.endsWith('@gmail.com')) {
      toast.error('Please use a valid Gmail account');
      return;
    }

    setSendingEmail(true);
    
    try {
      const status = registrationFee > 0 ? 'pending_payment' : 'pending';
      
      await addDoc(collection(db, 'registrations'), {
        ...form,
        registrationFee,
        status,
        registeredAt: new Date().toISOString(),
      });

      await sendRegistrationEmail({
        ...form,
        status,
        registrationFee,
      });

      toast.success('Registration submitted! Check your Gmail for confirmation.');
      
      setForm({
        teamName: '',
        captainName: '',
        gmail: '',
        region: '',
        players: ['', '', '', '', '', '', ''],
        coach: '',
      });
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Failed to submit registration');
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-4xl md:text-6xl font-black mb-4">
            <span className="gold-text">Team Registration</span>
          </h1>
          <p className="text-xl text-gray-400">Register your team for the tournament</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onSubmit={handleSubmit}
          className="bg-gray-900 p-6 md:p-8 rounded-xl border-2 border-yellow-500/50 space-y-6"
        >
          {/* Team Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <label className="block text-sm silver-text mb-2">Team Name *</label>
              <input type="text" value={form.teamName} onChange={(e) => setForm({ ...form, teamName: e.target.value })} className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white" placeholder="e.g., Team Alpha" required />
            </div>
            <div>
              <label className="block text-sm silver-text mb-2">Captain Name *</label>
              <input type="text" value={form.captainName} onChange={(e) => setForm({ ...form, captainName: e.target.value })} className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white" placeholder="Captain's full name" required />
            </div>
          </div>

          {/* Gmail + Region */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <label className="block text-sm silver-text mb-2 flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>Gmail Account *</span>
              </label>
              <input type="email" value={form.gmail} onChange={(e) => setForm({ ...form, gmail: e.target.value })} className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white" placeholder="yourname@gmail.com" required />
            </div>
            <div>
              <label className="block text-sm silver-text mb-2">Region</label>
              <input type="text" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white" placeholder="e.g., Manila" />
            </div>
          </div>

          {/* 7 Players */}
          <div>
            <label className="block text-sm silver-text mb-4 flex items-center space-x-2">
              <Gamepad2 className="w-4 h-4" />
              <span>Players (7 members)</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {form.players.map((player, index) => (
                <div key={index}>
                  <input
                    type="text"
                    value={player}
                    onChange={(e) => handlePlayerChange(index, e.target.value)}
                    className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white"
                    placeholder={`Player ${index + 1} name`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Coach */}
          <div>
            <label className="block text-sm silver-text mb-2">Coach (Optional)</label>
            <input type="text" value={form.coach} onChange={(e) => setForm({ ...form, coach: e.target.value })} className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white" placeholder="Coach name" />
          </div>

          {/* Registration Fee + QR */}
          {registrationFee > 0 && qrCodeUrl && (
            <div className="bg-black p-6 rounded-xl border border-yellow-500/30">
              <h3 className="text-xl font-bold gold-text mb-4 text-center">Registration Fee</h3>
              <p className="text-3xl font-black gold-text text-center mb-4">₱{registrationFee}</p>
              <p className="text-gray-400 text-center mb-4">Scan the QR code to pay:</p>
              <div className="flex justify-center">
                <img src={qrCodeUrl} alt="Payment QR Code" className="w-40 h-40 object-contain rounded-lg bg-white p-2" />
              </div>
              <p className="text-gray-500 text-center mt-4 text-sm">After payment, we will verify and send confirmation to your Gmail</p>
            </div>
          )}

          {/* Submit */}
          <motion.button 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }} 
            type="submit" 
            disabled={sendingEmail}
            className="w-full py-4 bg-gradient-to-r from-yellow-500 to-yellow-300 text-black text-xl font-bold rounded-lg shadow-lg disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <Send className="w-5 h-5" />
            <span>{sendingEmail ? 'SUBMITTING...' : 'SUBMIT REGISTRATION'}</span>
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
}