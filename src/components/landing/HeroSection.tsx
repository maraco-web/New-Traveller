'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, Calendar, Users, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const HERO_DESTINATIONS = [
  {
    name: '東京',
    country: '日本',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1920&h=1080&fit=crop',
    tagline: '發現繁華都市的無限魅力',
  },
  {
    name: '峇里島',
    country: '印尼',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1920&h=1080&fit=crop',
    tagline: '在熱帶天堂找回內心平靜',
  },
  {
    name: '巴黎',
    country: '法國',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1920&h=1080&fit=crop',
    tagline: '浪漫之都，每條街都是故事',
  },
  {
    name: '新加坡',
    country: '新加坡',
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1920&h=1080&fit=crop',
    tagline: '花園城市裡的現代奇蹟',
  },
];

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_DESTINATIONS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const current = HERO_DESTINATIONS[currentIndex];

  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden">
      {/* Background Images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <Image
            src={current.image}
            alt={current.name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center text-white">
        {/* Location pill */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-6"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium"
            >
              <MapPin className="w-4 h-4 text-sky-300" />
              <span>{current.name}, {current.country}</span>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4 leading-tight"
        >
          你的旅行，
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-cyan-300">
            從這裡開始
          </span>
        </motion.h1>

        {/* Tagline */}
        <AnimatePresence mode="wait">
          <motion.p
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="text-lg md:text-xl text-white/80 mb-10 max-w-lg"
          >
            {current.tagline}
          </motion.p>
        </AnimatePresence>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="w-full max-w-2xl"
        >
          <div className="flex items-center gap-3 p-2 rounded-2xl bg-white/95 backdrop-blur-sm shadow-2xl border border-white/50">
            <div className="flex-1 flex items-center gap-3 px-3">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="你想去哪裡？搜尋城市、國家..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 text-slate-700 placeholder:text-slate-400 focus:outline-none bg-transparent text-base py-2"
              />
            </div>
            <div className="hidden md:flex items-center gap-2 px-3 border-l border-slate-200">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-500">選擇日期</span>
            </div>
            <div className="hidden md:flex items-center gap-2 px-3 border-l border-slate-200">
              <Users className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-500">旅客人數</span>
            </div>
            <Link href="/register">
              <Button variant="gradient" size="default" className="rounded-xl shrink-0">
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">開始探索</span>
              </Button>
            </Link>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {['東京', '峇里島', '首爾', '巴黎', '新加坡'].map((city) => (
              <button
                key={city}
                className="px-3 py-1.5 rounded-full text-sm text-white/80 bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors"
              >
                {city}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex gap-8 mt-12 text-center"
        >
          {[
            { number: '10萬+', label: '行程規劃' },
            { number: '500+', label: '熱門目的地' },
            { number: '50+', label: '航空公司' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-bold text-white">{stat.number}</div>
              <div className="text-sm text-white/60">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Destination indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {HERO_DESTINATIONS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/40'
            }`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 right-8 z-10 hidden md:flex flex-col items-center gap-2 text-white/60"
      >
        <span className="text-xs rotate-90 tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}
