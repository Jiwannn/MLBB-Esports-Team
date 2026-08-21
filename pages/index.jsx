import HeroSection from '../components/sections/HeroSection';
import AboutSection from '../components/sections/AboutSection';
import AnnouncementsSection from '../components/sections/AnnouncementsSection';
import TeamsSection from '../components/sections/TeamsSection';
import MatchesSection from '../components/sections/MatchesSection';
import AchievementsSection from '../components/sections/AchievementsSection';
import SponsorsSection from '../components/sections/SponsorsSection';
import GallerySection from '../components/sections/GallerySection';
import FAQSection from '../components/sections/FAQSection';
import ContactSection from '../components/sections/ContactSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <HeroSection />
      <AnnouncementsSection />  {/* Shows only if announcements exist */}
      <AboutSection />
      <TeamsSection />
      <MatchesSection />
      <AchievementsSection />
      <SponsorsSection />  {/* Shows only if sponsors exist */}
      <GallerySection />
      <FAQSection />  {/* Shows only if FAQs exist */}
      <ContactSection />
    </div>
  );
}