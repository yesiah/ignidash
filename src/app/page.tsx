import HeroSection from "./components/hero-section";
import Footer from "./components/footer";
import CTASection from "./components/cta-section";
import FAQSection from "./components/faq-section";
import LogoCloud from "./components/logo-cloud";
import LinkSharingFeature from "./components/link-sharing-feature";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <LogoCloud />
      <LinkSharingFeature />
      <FAQSection />
      <CTASection />
      <Footer />
    </>
  );
}
