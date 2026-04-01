'use client';

import { motion } from 'motion/react';
import { useInView } from 'react-intersection-observer';
import { Map, Plane, PiggyBank, Compass, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const FEATURES = [
  {
    icon: Map,
    title: '行程規劃 & 管理',
    description: '輕鬆建立完美行程，支援日曆視圖、拖曳排序，讓每段旅程都完美規劃。',
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
    href: '/trips',
    features: ['多日程日曆視圖', '活動拖曳排序', '行程分享協作'],
  },
  {
    icon: Plane,
    title: '機票 & 住宿搜尋',
    description: '搜尋並比較全球航班和各類住宿，從豪華飯店到精品旅館一網打盡。',
    color: 'from-sky-500 to-cyan-600',
    bgColor: 'bg-sky-50',
    iconColor: 'text-sky-600',
    href: '/search',
    features: ['多航空公司比價', '飯店民宿搜尋', '即時座位查詢'],
  },
  {
    icon: Compass,
    title: '景點 & 餐廳探索',
    description: '互動地圖瀏覽當地景點、米其林餐廳，收藏最愛並加入行程。',
    color: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    href: '/explore',
    features: ['互動地圖探索', '評分與評論', '收藏與分享'],
  },
  {
    icon: PiggyBank,
    title: '旅遊預算追蹤',
    description: '記錄旅遊花費，多幣別即時換算，圖表分析讓你清楚掌握每一分旅費。',
    color: 'from-orange-500 to-amber-600',
    bgColor: 'bg-orange-50',
    iconColor: 'text-orange-600',
    href: '/budget',
    features: ['多幣別換算', '類別圖表分析', '預算進度追蹤'],
  },
];

export function FeaturesSection() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section ref={ref} className="py-24 px-4 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-sky-100 text-sky-700 text-sm font-medium mb-4">
            四大核心功能
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            旅行的每一步，
            <br />
            我們都幫你想好了
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            從行程規劃到預算管理，TravelKit 涵蓋旅行全流程，讓你把心力放在享受旅途。
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="group"
              >
                <div className="h-full p-8 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300">
                  {/* Icon */}
                  <div
                    className={`w-14 h-14 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className={`w-7 h-7 ${feature.iconColor}`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-500 mb-6 leading-relaxed">{feature.description}</p>

                  {/* Feature list */}
                  <ul className="space-y-2 mb-6">
                    {feature.features.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${feature.color}`} />
                        {item}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link
                    href="/register"
                    className={`inline-flex items-center gap-2 text-sm font-medium bg-gradient-to-r ${feature.color} bg-clip-text text-transparent group-hover:gap-3 transition-all`}
                  >
                    了解更多 <ArrowRight className={`w-4 h-4 ${feature.iconColor}`} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
