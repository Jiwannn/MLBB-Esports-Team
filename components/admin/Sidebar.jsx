import { motion } from 'framer-motion';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  Gamepad2, 
  Swords, 
  Image, 
  Settings,
  LogOut,
  Home,
  ChevronLeft,
  ClipboardList,
  MessageSquare,
  Handshake,
  Megaphone,
  HelpCircle
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen }) {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'registrations', label: 'Registrations', icon: ClipboardList },
    { id: 'contacts', label: 'Messages', icon: MessageSquare },
    { id: 'teams', label: 'Teams', icon: Users },
    { id: 'players', label: 'Players', icon: Gamepad2 },
    { id: 'matches', label: 'Matches', icon: Swords },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'sponsors', label: 'Sponsors', icon: Handshake },
    { id: 'gallery', label: 'Gallery', icon: Image },
    { id: 'faqs', label: 'FAQ', icon: HelpCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    window.location.href = '/admin/login';
  };

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: isOpen ? 0 : -300 }}
      className="fixed left-0 top-0 h-full w-64 bg-gray-900/95 backdrop-blur-lg border-r border-yellow-500/30 z-50 flex flex-col"
    >
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-center justify-between mb-8">
          <h1 className="admin-title text-3xl">
            <span className="gold-text">RVC</span> <span className="text-xs silver-text admin-label">ADMIN</span>
          </h1>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-yellow-500">
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex-1 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all admin-text ${
                  activeTab === item.id
                    ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 font-semibold'
                    : 'text-gray-300 hover:bg-yellow-500/10 hover:text-yellow-500'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <Link href="/" className="mb-2 mt-4">
          <button className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-yellow-500 hover:bg-yellow-500/20 transition-all border border-yellow-500/30 admin-text">
            <Home className="w-5 h-5" />
            <span className="text-sm">Back to Website</span>
          </button>
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-2.5 rounded-lg text-red-400 hover:bg-red-500/20 transition-all admin-text"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </motion.aside>
  );
}