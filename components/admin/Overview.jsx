import { motion } from 'framer-motion';
import { Users, Gamepad2, Trophy, Swords, MessageSquare, ClipboardList, Image, Settings, LayoutDashboard } from 'lucide-react';

export default function Overview({ setActiveTab }) {
  const quickActions = [
    { label: 'Registrations', icon: ClipboardList, tab: 'registrations', description: 'View team signups' },
    { label: 'Teams', icon: Users, tab: 'teams', description: 'Manage teams' },
    { label: 'Players', icon: Gamepad2, tab: 'players', description: 'Manage roster' },
    { label: 'Messages', icon: MessageSquare, tab: 'contacts', description: 'Read inquiries' },
    { label: 'Matches', icon: Swords, tab: 'matches', description: 'Schedule games' },
    { label: 'Gallery', icon: Image, tab: 'gallery', description: 'Upload media' },
    { label: 'Settings', icon: Settings, tab: 'settings', description: 'Configure site' },
  ];

  return (
    <div>
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-yellow-500/20 to-gray-900 p-8 rounded-xl border border-yellow-500/30 mb-8 text-center"
      >
        <LayoutDashboard className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-3xl font-bold gold-text mb-2">Welcome to RVC Admin</h3>
        <p className="text-gray-400">Select a section below to manage your esports organization</p>
      </motion.div>

      {/* Quick Navigation - THE ONLY THING */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.tab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setActiveTab(action.tab)}
              className="p-6 bg-gray-900 rounded-xl border border-yellow-500/30 hover:bg-yellow-500/10 hover:border-yellow-500 transition-all flex flex-col items-center space-y-3 cursor-pointer text-center"
            >
              <Icon className="w-10 h-10 text-yellow-500" />
              <span className="text-yellow-500 font-semibold">{action.label}</span>
              <span className="text-gray-400 text-xs">{action.description}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}