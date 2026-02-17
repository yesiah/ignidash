import HeroSection from './components/hero-section';
import FeaturesSection from './components/features-section';
import AIChatFeatureSection from './components/ai-chat-feature-section';
import InsightsFeatureSection from './components/insights-feature-section';
import CTASection from './components/cta-section';
import FAQSection from './components/faq-section';

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <AIChatFeatureSection />
      <InsightsFeatureSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
