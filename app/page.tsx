import { HeroSection } from "../components/home/HeroSection";
import { FeatureCards } from "../components/home/FeatureCards";

export default function Home() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <HeroSection />
      <FeatureCards />
    </div>
  );
}

