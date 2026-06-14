import HeroSection from '@/components/sections/hero-section';
import DistrictsSection from '@/components/sections/districts-section';
import WeatherBar from '@/components/sections/weather-bar';
import FeaturedDestinationsSection from '@/components/sections/featured-destinations-section';
import VisualGallerySection from '@/components/sections/visual-gallery-section';
import WhyPakistanSection from '@/components/sections/why-pakistan-section';
import TravelTipsSection from '@/components/sections/travel-tips-section';


export default function Home() {
  return (
    <>
      <HeroSection />
      <WeatherBar />
      <WhyPakistanSection />
      <DistrictsSection />
      <FeaturedDestinationsSection />
      <TravelTipsSection />
      <VisualGallerySection />
    </>
  );
}


