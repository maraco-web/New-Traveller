import Link from 'next/link';
import { Globe2, Plane, Map, PiggyBank } from 'lucide-react';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { DestinationShowcase } from '@/components/landing/DestinationShowcase';
import { CTASection } from '@/components/landing/CTASection';

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      {/* Navbar */}
      <nav className="absolute top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl">
            <Globe2 className="w-7 h-7 text-sky-300" />
            TravelKit
          </Link>
          <div className="hidden md:flex items-center gap-8 text-white/80">
            <Link href="#features" className="hover:text-white transition-colors text-sm">功能介紹</Link>
            <Link href="#destinations" className="hover:text-white transition-colors text-sm">熱門目的地</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-white/80 hover:text-white text-sm font-medium transition-colors"
            >
              登入
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white text-sm font-medium transition-all"
            >
              免費開始
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <HeroSection />

      {/* Features */}
      <div id="features">
        <FeaturesSection />
      </div>

      {/* Destinations */}
      <div id="destinations">
        <DestinationShowcase />
      </div>

      {/* CTA */}
      <CTASection />

      {/* Footer */}
      <footer className="py-12 px-6 bg-slate-900 text-slate-400">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 text-white font-semibold">
              <Globe2 className="w-6 h-6 text-sky-400" />
              TravelKit
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              <Link href="/trips" className="hover:text-white transition-colors flex items-center gap-1.5">
                <Map className="w-4 h-4" /> 行程規劃
              </Link>
              <Link href="/search" className="hover:text-white transition-colors flex items-center gap-1.5">
                <Plane className="w-4 h-4" /> 搜尋機票
              </Link>
              <Link href="/budget" className="hover:text-white transition-colors flex items-center gap-1.5">
                <PiggyBank className="w-4 h-4" /> 預算追蹤
              </Link>
            </div>
            <p className="text-sm">© 2026 TravelKit. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
