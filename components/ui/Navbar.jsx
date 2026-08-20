import { useState, useEffect } from 'react';
import { motion, useScroll } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { LayoutDashboard, LogOut, Trophy } from 'lucide-react';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { scrollY } = useScroll();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = scrollY.onChange((value) => {
      setIsScrolled(value > 50);
    });
    return () => unsubscribe();
  }, [scrollY]);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    setIsLoggedIn(false);
    router.push('/');
  };

  const navItems = [
    { label: 'Tournament', href: '/tournament', icon: Trophy },
    { label: 'Home', href: '/' },
    { label: 'About', href: '/#about' },
    { label: 'Teams', href: '/#teams' },
    { label: 'Achievements', href: '/#achievements' },
    { label: 'Gallery', href: '/#gallery' },
    { label: 'Contact', href: '/#contact' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/90 backdrop-blur-lg shadow-lg shadow-yellow-500/10' : 'bg-transparent'
      }`}
      style={{ pointerEvents: 'auto' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo - Left */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <img 
              src="/images/RVCLOGO.jpg" 
              alt="RVC" 
              className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <span className="text-xl md:text-2xl font-bold gold-text">RVC</span>
          </Link>

          {/* Centered Nav Items */}
          <div className="hidden lg:flex items-center space-x-6 flex-1 justify-center">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="relative group"
                >
                  <span className={`flex items-center space-x-1 text-sm transition-colors ${
                    router.pathname === item.href
                      ? 'text-yellow-500 font-semibold'
                      : 'text-gray-300 hover:text-yellow-500'
                  }`}>
                    {Icon && <Icon className="w-4 h-4" />}
                    <span>{item.label}</span>
                  </span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-500 transition-all duration-300 group-hover:w-full" />
                </Link>
              );
            })}
          </div>

          {/* Admin Buttons - Right */}
          <div className="hidden lg:flex items-center space-x-3 flex-shrink-0">
            {isLoggedIn ? (
              <>
                <Link href="/admin/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-300 text-black font-semibold rounded-lg text-sm"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </motion.button>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 text-red-400 font-semibold rounded-lg text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </motion.button>
              </>
            ) : (
              <Link href="/admin/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-300 text-black font-semibold rounded-lg text-sm"
                >
                  Admin
                </motion.button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-gray-300 hover:text-yellow-500"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={isMobileMenuOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        className="lg:hidden overflow-hidden bg-black/95 backdrop-blur-lg"
      >
        <div className="px-4 py-4 space-y-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-2 text-gray-300 hover:text-yellow-500 transition-colors py-2"
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span>{item.label}</span>
              </Link>
            );
          })}
          
          <div className="border-t border-gray-800 pt-3 space-y-2">
            {isLoggedIn ? (
              <>
                <Link href="/admin/dashboard">
                  <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-300 text-black font-semibold rounded-lg">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </button>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-500/20 text-red-400 font-semibold rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link href="/admin/login">
                <button className="w-full px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-300 text-black font-semibold rounded-lg">
                  Admin Login
                </button>
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    </motion.nav>
  );
}