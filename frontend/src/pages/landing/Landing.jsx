import Navbar from './sections/Navbar.jsx';
import Hero from './sections/Hero.jsx';
import Features from './sections/Features.jsx';
import HowItWorks from './sections/HowItWorks.jsx';
import Overview from './sections/Overview.jsx';
import AIPreview from './sections/AIPreview.jsx';
import CTASection from './sections/CTASection.jsx';
import Footer from './sections/Footer.jsx';

export default function Landing() {
  return (
    <div className="landing">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <Features />
        <HowItWorks />
        <Overview />
        <AIPreview />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}