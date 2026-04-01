import Link from 'next/link';
import Image from 'next/image';
import { Globe2 } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left panel - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&h=1800&fit=crop"
          alt="Travel inspiration"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-sky-900/70 to-indigo-900/50" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Globe2 className="w-7 h-7 text-sky-300" />
            TravelKit
          </Link>
          <div>
            <blockquote className="text-2xl font-light leading-relaxed mb-4">
              &ldquo;旅行是唯一一種你花錢，卻讓你更富有的事。&rdquo;
            </blockquote>
            <div className="text-white/60 text-sm">— 佚名</div>
          </div>
        </div>
      </div>

      {/* Right panel - Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-white">
        <div className="lg:hidden mb-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-900">
            <Globe2 className="w-7 h-7 text-sky-500" />
            TravelKit
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
