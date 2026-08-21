import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-yellow-500/20">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Brand */}
          <div className="text-center sm:text-left">
            <h3 className="text-lg md:text-xl font-bold gold-text mb-3 md:mb-4">RVC ESPORTS</h3>
            <p className="text-gray-400 text-sm md:text-base">
              Professional Mobile Legends: Bang Bang esports team competing at the highest level.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center sm:text-left">
            <h4 className="text-base md:text-lg font-semibold silver-text mb-3 md:mb-4">Quick Links</h4>
            <ul className="space-y-1.5 md:space-y-2">
              <li><Link href="/#about" className="text-gray-400 hover:text-yellow-500 text-sm md:text-base">About Us</Link></li>
              <li><Link href="/#teams" className="text-gray-400 hover:text-yellow-500 text-sm md:text-base">Our Teams</Link></li>
              <li><Link href="/#achievements" className="text-gray-400 hover:text-yellow-500 text-sm md:text-base">Achievements</Link></li>
              <li><Link href="/#gallery" className="text-gray-400 hover:text-yellow-500 text-sm md:text-base">Gallery</Link></li>
              <li><Link href="/tournament" className="text-gray-400 hover:text-yellow-500 text-sm md:text-base">Tournament</Link></li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="text-center sm:text-left">
            <h4 className="text-base md:text-lg font-semibold silver-text mb-3 md:mb-4">Follow Us</h4>
            <div className="flex space-x-3 md:space-x-4 justify-center sm:justify-start">
              <motion.a
                href="https://www.facebook.com/profile.php?id=61591654514167"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2 }}
                className="w-9 h-9 md:w-10 md:h-10 bg-gray-900 rounded-full flex items-center justify-center hover:bg-yellow-500/20"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                </svg>
              </motion.a>
            </div>
          </div>

          {/* Newsletter */}
          <div className="text-center sm:text-left">
            <h4 className="text-base md:text-lg font-semibold silver-text mb-3 md:mb-4">Newsletter</h4>
            <p className="text-gray-400 text-sm md:text-base mb-3 md:mb-4">Stay updated with our latest matches and events.</p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 md:px-4 md:py-2 bg-gray-900 border border-gray-700 rounded-lg sm:rounded-l-lg sm:rounded-r-none focus:border-yellow-500 focus:outline-none text-sm"
              />
              <button className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-300 text-black font-semibold rounded-lg sm:rounded-r-lg sm:rounded-l-none text-sm">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-500 text-xs md:text-sm">© 2026 RVC Management. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}