import { useEffect, useState } from 'react';
import { Music } from 'lucide-react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PlatformMarquee from './components/PlatformMarquee';
import Stats from './components/Stats';
import About from './components/About';
import Distribution from './components/Distribution';
import Platforms from './components/Platforms';
import FeaturedPlatforms from './components/FeaturedPlatforms';
import Services from './components/Services';
import Network from './components/Network';
import FAQ from './components/FAQ';
import CTA from './components/CTA';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import DashboardModal from './components/DashboardModal';

// Page Loader
function PageLoader({ visible }) {
  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-all duration-500 ${
        visible ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
      }`}
      style={{ background: '#050813' }}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Logo */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/40">
          <Music className="w-8 h-8 text-white" />
        </div>
        <div className="text-center">
          <p className="text-white font-bold text-lg tracking-wide">RK DIGITAL MEDIA</p>
          <p className="text-indigo-400 text-xs font-semibold uppercase tracking-widest mt-1">
            Music Distribution
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
            style={{
              animation: 'loaderBar 1.2s ease-out forwards',
            }}
          />
        </div>
        <p className="text-gray-500 text-xs">Loading Experience...</p>
      </div>

      <style>{`
        @keyframes loaderBar {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  );
}

function MainApp() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <PageLoader visible={loading} />

      <div className={`transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        <Navbar />

        <main>
          {/* 1. Hero */}
          <Hero />

          {/* 2. Platform Marquee */}
          <PlatformMarquee />

          {/* 3. Stats */}
          <Stats />

          {/* 4. About */}
          <About />

          {/* 5. Distribution Process */}
          <Distribution />

          {/* 6. Featured Platforms */}
          <FeaturedPlatforms />

          {/* 7. All Platforms with Filter */}
          <Platforms />

          {/* 8. Services */}
          <Services />

          {/* 9. Network Channel Directory */}
          <Network />

          {/* 10. FAQ */}
          <FAQ />

          {/* 11. CTA */}
          <CTA />

          {/* 12. Contact */}
          <Contact />
        </main>

        <Footer />

        {/* Authentication Modal (Sign In, Sign Up, Google Login, Forgot Password) */}
        <AuthModal />

        {/* Artist / Creator Dashboard Modal */}
        <DashboardModal />
      </div>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
