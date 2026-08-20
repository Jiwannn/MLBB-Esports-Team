import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Save, Globe, Mail, Share2, Info, Upload, X, Trophy, DollarSign, QrCode } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsManager() {
  const [settings, setSettings] = useState({
    siteName: 'RVC',
    siteDescription: 'Esports Management',
    contactEmail: '',
    contactPhone: '',
    facebook: 'https://www.facebook.com/profile.php?id=61591654514167',
    instagram: '',
    youtube: '',
  });
  
  const [aboutData, setAboutData] = useState({
    title: 'About RVC',
    story: 'RVC is a professional esports management organization specializing in Mobile Legends: Bang Bang. We build championship-winning teams through strategic player development and innovative coaching.',
    image: '',
    stats: [
      { number: '15+', label: 'Trophies' },
      { number: '50+', label: 'Matches' },
      { number: '100K+', label: 'Fans' },
    ],
  });

  const [tournamentData, setTournamentData] = useState({
    title: 'RVC Tournament 2024',
    description: 'MLBB Championship Series',
    prizePool: '₱500,000',
    teams: 32,
    date: '2024',
    challongeUrl: 'https://challonge.com/YOUR_TOURNAMENT',
    facebookUrl: 'https://www.facebook.com/profile.php?id=61591654514167',
    registrationFee: 0,
    qrCodeUrl: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const fileInputRef = useRef(null);
  const qrFileInputRef = useRef(null);

  useEffect(() => {
    fetchSettings();
    setAdminEmail(localStorage.getItem('adminEmail') || '');
  }, []);

  const fetchSettings = async () => {
    try {
      const [siteSnap, aboutSnap, tournamentSnap] = await Promise.all([
        getDoc(doc(db, 'settings', 'site')),
        getDoc(doc(db, 'settings', 'about')),
        getDoc(doc(db, 'settings', 'tournament')),
      ]);
      
      if (siteSnap.exists()) setSettings(siteSnap.data());
      if (aboutSnap.exists()) setAboutData(aboutSnap.data());
      if (tournamentSnap.exists()) setTournamentData(tournamentSnap.data());
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setUploading(true);
    toast.loading('Uploading image...');
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'RVC_UPLOADS');

      const response = await fetch(
        'https://api.cloudinary.com/v1_1/qmsxe5lq/image/upload',
        { method: 'POST', body: formData }
      );

      const data = await response.json();
      
      if (data.secure_url) {
        setAboutData(prev => ({ ...prev, image: data.secure_url }));
        toast.dismiss();
        toast.success('Image uploaded! Now click "Save All Settings"!');
      } else {
        toast.dismiss();
        toast.error('Upload failed: ' + (data.error?.message || 'Unknown error'));
      }
    } catch (error) {
      toast.dismiss();
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleQRUpload = async (file) => {
    if (!file) return;
    
    setUploading(true);
    toast.loading('Uploading QR code...');
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'RVC_UPLOADS');

      const response = await fetch(
        'https://api.cloudinary.com/v1_1/qmsxe5lq/image/upload',
        { method: 'POST', body: formData }
      );

      const data = await response.json();
      
      if (data.secure_url) {
        setTournamentData(prev => ({ ...prev, qrCodeUrl: data.secure_url }));
        toast.dismiss();
        toast.success('QR code uploaded!');
      } else {
        toast.dismiss();
        toast.error('Upload failed');
      }
    } catch (error) {
      toast.dismiss();
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveAll = async () => {
    setLoading(true);
    try {
      await Promise.all([
        setDoc(doc(db, 'settings', 'site'), settings),
        setDoc(doc(db, 'settings', 'about'), aboutData),
        setDoc(doc(db, 'settings', 'tournament'), tournamentData),
      ]);
      toast.success('All settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      {/* Tournament Settings */}
      <div className="bg-gray-900 p-6 rounded-xl border border-yellow-500/30 mb-6">
        <div className="flex items-center space-x-2 mb-6">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <h3 className="text-xl font-bold gold-text">Tournament Settings</h3>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm silver-text mb-2">Tournament Title</label>
              <input
                type="text"
                value={tournamentData.title}
                onChange={(e) => setTournamentData({ ...tournamentData, title: e.target.value })}
                className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white"
                placeholder="RVC Tournament 2024"
              />
            </div>
            <div>
              <label className="block text-sm silver-text mb-2">Description</label>
              <input
                type="text"
                value={tournamentData.description}
                onChange={(e) => setTournamentData({ ...tournamentData, description: e.target.value })}
                className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white"
                placeholder="MLBB Championship Series"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm silver-text mb-2">Prize Pool</label>
              <input
                type="text"
                value={tournamentData.prizePool}
                onChange={(e) => setTournamentData({ ...tournamentData, prizePool: e.target.value })}
                className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white"
                placeholder="₱500,000"
              />
            </div>
            <div>
              <label className="block text-sm silver-text mb-2">Teams</label>
              <input
                type="number"
                value={tournamentData.teams}
                onChange={(e) => setTournamentData({ ...tournamentData, teams: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white"
                placeholder="32"
              />
            </div>
            <div>
              <label className="block text-sm silver-text mb-2">Date/Season</label>
              <input
                type="text"
                value={tournamentData.date}
                onChange={(e) => setTournamentData({ ...tournamentData, date: e.target.value })}
                className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white"
                placeholder="2024"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm silver-text mb-2">Challonge Bracket URL</label>
            <input
              type="text"
              value={tournamentData.challongeUrl}
              onChange={(e) => setTournamentData({ ...tournamentData, challongeUrl: e.target.value })}
              className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white"
              placeholder="https://challonge.com/YOUR_TOURNAMENT"
            />
            <p className="text-xs text-gray-500 mt-1">Create tournament at challonge.com and paste URL here</p>
          </div>

          <div>
            <label className="block text-sm silver-text mb-2">Watch Live URL (Facebook)</label>
            <input
              type="text"
              value={tournamentData.facebookUrl}
              onChange={(e) => setTournamentData({ ...tournamentData, facebookUrl: e.target.value })}
              className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white"
              placeholder="https://www.facebook.com/profile.php?id=61591654514167"
            />
          </div>

          {/* Registration Fee */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-800 pt-4">
            <div>
              <label className="block text-sm silver-text mb-2 flex items-center space-x-2">
                <DollarSign className="w-4 h-4" />
                <span>Registration Fee (₱)</span>
              </label>
              <input
                type="number"
                value={tournamentData.registrationFee}
                onChange={(e) => setTournamentData({ ...tournamentData, registrationFee: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white"
                placeholder="500"
              />
              <p className="text-xs text-gray-500 mt-1">Set to 0 for free registration</p>
            </div>
            <div>
              <label className="block text-sm silver-text mb-2 flex items-center space-x-2">
                <QrCode className="w-4 h-4" />
                <span>Payment QR Code</span>
              </label>
              {tournamentData.qrCodeUrl ? (
                <div className="relative">
                  <img src={tournamentData.qrCodeUrl} alt="QR Code" className="w-20 h-20 object-contain rounded-lg bg-white p-1" />
                  <button
                    onClick={() => setTournamentData({ ...tournamentData, qrCodeUrl: '' })}
                    className="absolute top-1 right-1 bg-red-500 p-1 rounded-full"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => qrFileInputRef.current?.click()}
                  className="flex items-center justify-center space-x-2 w-full h-20 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-yellow-500"
                >
                  <Upload className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-400 text-sm">Upload QR Code</span>
                </div>
              )}
              <input
                ref={qrFileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleQRUpload(e.target.files[0])}
              />
            </div>
          </div>
        </div>
      </div>

      {/* About Section Settings */}
      <div className="bg-gray-900 p-6 rounded-xl border border-yellow-500/30 mb-6">
        <div className="flex items-center space-x-2 mb-6">
          <Info className="w-5 h-5 text-yellow-500" />
          <h3 className="text-xl font-bold gold-text">About Section</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm silver-text mb-2">About Title</label>
            <input
              type="text"
              value={aboutData.title}
              onChange={(e) => setAboutData({ ...aboutData, title: e.target.value })}
              className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white"
              placeholder="About RVC"
            />
          </div>

          <div>
            <label className="block text-sm silver-text mb-2">Story</label>
            <textarea
              value={aboutData.story}
              onChange={(e) => setAboutData({ ...aboutData, story: e.target.value })}
              rows="4"
              className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white"
              placeholder="Write your story..."
            />
          </div>

          {/* About Image Upload */}
          <div>
            <label className="block text-sm silver-text mb-2">About Image</label>
            {aboutData.image ? (
              <div className="relative">
                <img src={aboutData.image} alt="About" className="w-full h-48 object-cover rounded-lg" />
                <button
                  onClick={() => setAboutData({ ...aboutData, image: '' })}
                  className="absolute top-2 right-2 bg-red-500 p-1 rounded-full"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center space-y-2 w-full h-48 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-yellow-500"
              >
                {uploading ? (
                  <>
                    <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-gray-400">Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="text-gray-400">Click to upload about image</span>
                  </>
                )}
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload(e.target.files[0])}
            />
          </div>

          {/* Stats */}
          <div>
            <label className="block text-sm silver-text mb-2">Stats</label>
            <div className="grid grid-cols-3 gap-4">
              {aboutData.stats?.map((stat, index) => (
                <div key={index} className="space-y-2">
                  <input
                    type="text"
                    value={stat.number}
                    onChange={(e) => {
                      const newStats = [...aboutData.stats];
                      newStats[index] = { ...newStats[index], number: e.target.value };
                      setAboutData({ ...aboutData, stats: newStats });
                    }}
                    className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg text-white text-center"
                    placeholder="15+"
                  />
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => {
                      const newStats = [...aboutData.stats];
                      newStats[index] = { ...newStats[index], label: e.target.value };
                      setAboutData({ ...aboutData, stats: newStats });
                    }}
                    className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg text-white text-center"
                    placeholder="Trophies"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Site Settings */}
      <div className="bg-gray-900 p-6 rounded-xl border border-yellow-500/30 mb-6">
        <div className="flex items-center space-x-2 mb-6">
          <Globe className="w-5 h-5 text-yellow-500" />
          <h3 className="text-xl font-bold gold-text">Site Settings</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm silver-text mb-2">Site Name</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm silver-text mb-2">Site Description</label>
            <input
              type="text"
              value={settings.siteDescription}
              onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
              className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm silver-text mb-2">Contact Email</label>
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm silver-text mb-2">Contact Phone</label>
            <input
              type="text"
              value={settings.contactPhone}
              onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
              className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white"
            />
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className="bg-gray-900 p-6 rounded-xl border border-yellow-500/30 mb-6">
        <div className="flex items-center space-x-2 mb-6">
          <Share2 className="w-5 h-5 text-yellow-500" />
          <h3 className="text-xl font-bold gold-text">Social Media</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm silver-text mb-2">Facebook</label>
            <input
              type="text"
              value={settings.facebook}
              onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
              className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm silver-text mb-2">Instagram</label>
            <input
              type="text"
              value={settings.instagram}
              onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
              className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm silver-text mb-2">YouTube</label>
            <input
              type="text"
              value={settings.youtube}
              onChange={(e) => setSettings({ ...settings, youtube: e.target.value })}
              className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSaveAll}
        disabled={loading}
        className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-300 text-black font-bold rounded-lg disabled:opacity-50"
      >
        <Save className="w-5 h-5" />
        <span>{loading ? 'Saving...' : 'Save All Settings'}</span>
      </motion.button>
    </div>
  );
}