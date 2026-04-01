'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { useInView } from 'react-intersection-observer';
import { MapPin, Star, TrendingUp } from 'lucide-react';

const DESTINATIONS = [
  {
    name: '東京',
    country: '日本',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop',
    rating: 4.8,
    trips: '12,430',
    tags: ['文化', '美食', '購物'],
    trending: true,
  },
  {
    name: '峇里島',
    country: '印尼',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=600&fit=crop',
    rating: 4.9,
    trips: '9,870',
    tags: ['沙灘', 'Spa', '自然'],
    trending: false,
  },
  {
    name: '首爾',
    country: '韓國',
    image: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=800&h=600&fit=crop',
    rating: 4.7,
    trips: '15,200',
    tags: ['K-Pop', '美食', '購物'],
    trending: true,
  },
  {
    name: '巴黎',
    country: '法國',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600&fit=crop',
    rating: 4.8,
    trips: '8,560',
    tags: ['浪漫', '藝術', '時尚'],
    trending: false,
  },
  {
    name: '新加坡',
    country: '新加坡',
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&h=600&fit=crop',
    rating: 4.7,
    trips: '7,340',
    tags: ['美食', '現代', '家庭'],
    trending: false,
  },
  {
    name: '曼谷',
    country: '泰國',
    image: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800&h=600&fit=crop',
    rating: 4.6,
    trips: '11,080',
    tags: ['寺廟', '夜市', '美食'],
    trending: true,
  },
];

export function DestinationShowcase() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section ref={ref} className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12"
        >
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 text-sm font-medium mb-4">
              熱門目的地
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
              探索世界每個角落
            </h2>
          </div>
          <Link
            href="/register"
            className="mt-4 md:mt-0 text-sm font-medium text-sky-600 hover:text-sky-700 underline-offset-4 hover:underline"
          >
            查看全部目的地 →
          </Link>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {DESTINATIONS.map((dest, index) => (
            <motion.div
              key={dest.name}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -6 }}
              className="group cursor-pointer"
            >
              <Link href="/register">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-md hover:shadow-xl transition-shadow duration-300">
                  <Image
                    src={dest.image}
                    alt={dest.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {/* Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Trending badge */}
                  {dest.trending && (
                    <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400/90 text-amber-900 text-xs font-semibold backdrop-blur-sm">
                      <TrendingUp className="w-3 h-3" />
                      熱門
                    </div>
                  )}

                  {/* Rating */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/30 backdrop-blur-sm text-white text-xs font-medium">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {dest.rating}
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 text-white/80 text-sm mb-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {dest.country}
                        </div>
                        <h3 className="text-2xl font-bold text-white">{dest.name}</h3>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {dest.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right text-white/70 text-xs">
                        <div className="text-white font-semibold text-sm">{dest.trips}</div>
                        <div>個行程</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
