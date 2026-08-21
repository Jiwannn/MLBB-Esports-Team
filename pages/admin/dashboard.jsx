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
import SponsorsManager from '../../components/admin/SponsorsManager';
import AnnouncementsManager from '../../components/admin/AnnouncementsManager';
import FAQManager from '../../components/admin/FAQManager';
import AchievementsManager from '../../components/admin/AchievementsManager';

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
        <div className="bg-gray-900/50 backdrop-blur-lg border-b border-yellow-500/30 px-8 py-4 flex justify-between items-center sticky top-0 z-40">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-400 hover:text-yellow-500 text-2xl">☰</button>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300 text-sm hidden md:block admin-text">{adminEmail}</span>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-300 flex items-center justify-center">
              <span className="text-black font-bold">{adminEmail?.charAt(0)?.toUpperCase() || 'A'}</span>
            </div>
          </div>
        </div>

        <div className="p-8">
          {activeTab === 'overview' && <Overview setActiveTab={setActiveTab} />}
          {activeTab === 'registrations' && <RegistrationsManager />}
          {activeTab === 'contacts' && <ContactsManager />}
          {activeTab === 'teams' && <TeamsManager />}
          {activeTab === 'players' && <PlayersManager />}
          {activeTab === 'achievements' && <AchievementsManager />}
          {activeTab === 'matches' && <MatchManager />}
          {activeTab === 'announcements' && <AnnouncementsManager />}
          {activeTab === 'sponsors' && <SponsorsManager />}
          {activeTab === 'gallery' && <GalleryManager />}
          {activeTab === 'faqs' && <FAQManager />}
          {activeTab === 'settings' && <SettingsManager />}
        </div>
      </div>
    </div>
  );
}