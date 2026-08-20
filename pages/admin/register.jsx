import { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { auth } from '../../lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import toast from 'react-hot-toast';

export default function AdminRegister() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    accessCode: '',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ACCESS CODE - Change this to your secret code
  const VALID_ACCESS_CODE = 'RVC2024';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (form.accessCode !== VALID_ACCESS_CODE) {
      toast.error('Invalid access code!');
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    
    try {
      await createUserWithEmailAndPassword(auth, form.email, form.password);
      
      toast.success('Registration successful!');
      
      setTimeout(() => {
        window.location.href = '/admin/login';
      }, 500);
      
    } catch (error) {
      console.error('Registration error:', error);
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          toast.error('Email already registered');
          break;
        case 'auth/operation-not-allowed':
          toast.error('Email/Password not enabled in Firebase Console');
          break;
        default:
          toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 bg-gray-900/50 backdrop-blur-lg rounded-2xl border border-yellow-500/30 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="gold-text">RVC</span>
          </h1>
          <p className="text-gray-400">Admin Registration</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium silver-text mb-2">Access Code</label>
            <input
              type="text"
              value={form.accessCode}
              onChange={(e) => setForm({ ...form, accessCode: e.target.value })}
              className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg focus:border-yellow-500 focus:outline-none text-white"
              placeholder="Enter access code"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Contact RVC management for the code</p>
          </div>

          <div>
            <label className="block text-sm font-medium silver-text mb-2">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg focus:border-yellow-500 focus:outline-none text-white"
              placeholder="admin@rvc.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium silver-text mb-2">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg focus:border-yellow-500 focus:outline-none text-white"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium silver-text mb-2">Confirm Password</label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg focus:border-yellow-500 focus:outline-none text-white"
              placeholder="••••••••"
              required
            />
          </div>
          
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-yellow-500 to-yellow-300 text-black font-bold rounded-lg disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Register'}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Already have an account?{' '}
            <a href="/admin/login" className="text-yellow-500 hover:underline">
              Login here
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}