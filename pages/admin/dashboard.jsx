import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../../components/admin/Sidebar';
import Overview from '../../components/admin/Overview';
import TeamsManager from '../../components/admin/TeamsManager';
import PlayersManager from '../../components/admin/PlayersManager';
import GalleryManager from '../../components/admin/GalleryManager';
import MatchManager from '../../components/admin/MatchManager';
import SettingsManager from '../../components/admin/SettingsManager';
import RegistrationsManager from '../../components/admin/RegistrationsManager';
import ContactsManager from '../../components/admin/ContactsManager';

export default function AdminDashboard() {
  const router = useRouter();
  const [adminEmail, setAdminEmail] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const email = localStorage.getItem('adminEmail');
    
    if (!token) {
      router.push('/admin/login');
    } else {
      setAdminEmail(email || 'Admin');
    }
  }, []);

  return (
    <div className="min-h-screen bg-black flex">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
      />

      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Top Bar */}
        <div className="bg-gray-900/50 backdrop-blur-lg border-b border-yellow-500/30 px-8 py-4 flex justify-between items-center sticky top-0 z-40">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-400 hover:text-yellow-500 text-2xl"
          >
            ☰
          </button>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300 text-sm hidden md:block admin-text">{adminEmail}</span>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-300 flex items-center justify-center">
              <span className="text-black font-bold">
                {adminEmail?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8">
          <div className="mb-8">
            <h2 className="admin-title text-3xl gold-text mb-2">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
            <p className="text-gray-400 admin-text">Manage your esports organization</p>
          </div>

          {/* Render Active Tab */}
          {activeTab === 'overview' && <Overview />}
          {activeTab === 'registrations' && <RegistrationsManager />}
          {activeTab === 'contacts' && <ContactsManager />}
          {activeTab === 'teams' && <TeamsManager />}
          {activeTab === 'players' && <PlayersManager />}
          {activeTab === 'matches' && <MatchManager />}
          {activeTab === 'gallery' && <GalleryManager />}
          {activeTab === 'settings' && <SettingsManager />}
          {activeTab === 'overview' && <Overview setActiveTab={setActiveTab} />}
        </div>
      </div>
    </div>
  );
}