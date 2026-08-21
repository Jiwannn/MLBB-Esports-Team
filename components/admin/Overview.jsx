import { motion } from 'framer-motion';
import { Users, Gamepad2, Swords, MessageSquare, ClipboardList, Image, Settings, LayoutDashboard, Trophy, Megaphone, Handshake, HelpCircle } from 'lucide-react';

export default function Overview({ setActiveTab }) {
  const quickActions = [
    { label: 'Registrations', icon: ClipboardList, tab: 'registrations' },
    { label: 'Teams', icon: Users, tab: 'teams' },
    { label: 'Players', icon: Gamepad2, tab: 'players' },
    { label: 'Messages', icon: MessageSquare, tab: 'contacts' },
    { label: 'Matches', icon: Swords, tab: 'matches' },
    { label: 'Achievements', icon: Trophy, tab: 'achievements' },
    { label: 'Announcements', icon: Megaphone, tab: 'announcements' },
    { label: 'Sponsors', icon: Handshake, tab: 'sponsors' },
    { label: 'Gallery', icon: Image, tab: 'gallery' },
    { label: 'FAQ', icon: HelpCircle, tab: 'faqs' },
    { label: 'Settings', icon: Settings, tab: 'settings' },
  ];

  return (
    <div>
      {/* Welcome Banner - Mobile responsive */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-yellow-500/20 to-gray-900 p-4 md:p-8 rounded-xl border border-yellow-500/30 mb-4 md:mb-8 text-center"
      >
        <LayoutDashboard className="w-8 h-8 md:w-16 md:h-16 text-yellow-500 mx-auto mb-2 md:mb-4" />
        <h3 className="text-lg md:text-3xl font-bold gold-text mb-1 md:mb-2">Welcome to RVC Admin</h3>
        <p className="text-gray-400 text-xs md:text-base">Select a section to manage</p>
      </motion.div>

      {/* Quick Navigation - MOBILE: 3 columns, SMALL buttons */}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1.5 md:gap-3">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.tab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              onClick={() => setActiveTab(action.tab)}
              className="p-1.5 md:p-3 bg-gray-900 rounded-lg border border-yellow-500/30 hover:bg-yellow-500/10 hover:border-yellow-500 transition-all flex flex-col items-center space-y-0.5 md:space-y-1 cursor-pointer text-center"
            >
              <Icon className="w-3.5 h-3.5 md:w-5 md:h-5 text-yellow-500" />
              <span className="text-yellow-500 font-semibold text-[8px] md:text-xs leading-tight">
                {action.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}