import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-yellow-500/20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold gold-text mb-4">RVC ESPORTS</h3>
            <p className="text-gray-400">
              Professional Mobile Legends: Bang Bang esports team competing at the highest level.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold silver-text mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/#about" className="text-gray-400 hover:text-yellow-500">About Us</Link></li>
              <li><Link href="/#players" className="text-gray-400 hover:text-yellow-500">Our Players</Link></li>
              <li><Link href="/#matches" className="text-gray-400 hover:text-yellow-500">Matches</Link></li>
              <li><Link href="/#gallery" className="text-gray-400 hover:text-yellow-500">Gallery</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold silver-text mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <motion.a
                href="#"
                whileHover={{ scale: 1.2 }}
                className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center hover:bg-yellow-500/20"
              >
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                </svg>
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.2 }}
                className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center hover:bg-yellow-500/20"
              >
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                </svg>
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.2 }}
                className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center hover:bg-yellow-500/20"
              >
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M7 3h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4z"/>
                </svg>
              </motion.a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold silver-text mb-4">Newsletter</h4>
            <p className="text-gray-400 mb-4">Stay updated with our latest matches and events.</p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-l-lg focus:border-yellow-500 focus:outline-none"
              />
              <button className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-300 text-black font-semibold rounded-r-lg">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-500">© 2026 RVC Management. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}