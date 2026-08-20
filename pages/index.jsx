import HeroSection from '../components/sections/HeroSection';
import AboutSection from '../components/sections/AboutSection';
import TeamsSection from '../components/sections/TeamsSection';
import MatchesSection from '../components/sections/MatchesSection';
import AchievementsSection from '../components/sections/AchievementsSection';
import GallerySection from '../components/sections/GallerySection';
import ContactSection from '../components/sections/ContactSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <HeroSection />
      <AboutSection />
      <TeamsSection />
      <MatchesSection />
      <AchievementsSection />
      <GallerySection />
      <ContactSection />
    </div>
  );
}