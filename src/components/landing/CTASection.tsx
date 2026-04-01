'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function CTASection() {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <section ref={ref} className="py-24 px-4 bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-800 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/90 text-sm font-medium mb-8 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            免費開始使用，無需信用卡
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            你的下一段旅程，
            <br />
            從今天開始規劃
          </h2>

          <p className="text-lg text-white/70 mb-10 max-w-2xl mx-auto">
            加入超過十萬名旅行者的行列，用 TravelKit 讓每趟旅行都成為難忘的回憶。
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button
                size="xl"
                className="bg-white text-sky-700 hover:bg-white/90 shadow-xl hover:shadow-white/25 font-semibold"
              >
                立即免費註冊
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="xl"
                variant="ghost"
                className="text-white border-2 border-white/30 hover:bg-white/10"
              >
                已有帳號？登入
              </Button>
            </Link>
          </div>

          <p className="mt-8 text-white/50 text-sm">
            完全免費 · 無隱藏費用 · 隨時可取消
          </p>
        </motion.div>
      </div>
    </section>
  );
}
