'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Plus, Map, Plane, Compass, PiggyBank, Calendar, ArrowRight, TrendingUp, Users, Bell, Heart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MOCK_TRIPS } from '@/data/mockTrips';
import { useAuth } from '@/hooks/useAuth';
import { useFriends } from '@/hooks/useFriends';
import { formatDate, getTripDuration, formatCurrency } from '@/lib/utils';

const QUICK_ACTIONS = [
  {
    icon: Map,
    label: '規劃新行程',
    description: '建立行程日曆',
    href: '/trips/new',
    color: 'bg-blue-500',
    bg: 'bg-blue-50',
  },
  {
    icon: Plane,
    label: '搜尋機票',
    description: '比較最優惠票價',
    href: '/search',
    color: 'bg-sky-500',
    bg: 'bg-sky-50',
  },
  {
    icon: Compass,
    label: '探索目的地',
    description: '景點與餐廳',
    href: '/explore',
    color: 'bg-emerald-500',
    bg: 'bg-emerald-50',
  },
  {
    icon: PiggyBank,
    label: '預算追蹤',
    description: '管理旅遊費用',
    href: '/budget',
    color: 'bg-orange-500',
    bg: 'bg-orange-50',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} 分鐘前`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} 小時前`;
  return `${Math.floor(hrs / 24)} 天前`;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { pendingRequests, activities, pendingCount } = useFriends();
  const upcomingTrips = MOCK_TRIPS.filter(
    (t) => t.status === 'upcoming' || t.status === 'planning'
  );

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '早安';
    if (hour < 18) return '午安';
    return '晚安';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-slate-900">
          {greeting()}，{user?.displayName?.split(' ')[0] || '旅行者'} ✈️
        </h1>
        <p className="text-slate-500 mt-1">準備好你的下一段旅程了嗎？</p>
      </motion.div>

      {/* Friend request notification banner */}
      {pendingCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link href="/friends?tab=requests">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100 rounded-2xl hover:shadow-sm transition-shadow cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5 text-violet-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-violet-900">
                  你有 {pendingCount} 則好友請求待確認
                </p>
                <p className="text-xs text-violet-500 mt-0.5">
                  {pendingRequests[0]?.fromDisplayName} 等人想和你成為旅遊好友
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-violet-400 shrink-0" />
            </div>
          </Link>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <motion.div key={action.label} variants={itemVariants}>
              <Link href={action.href}>
                <Card className="p-5 hover:shadow-md transition-all duration-200 cursor-pointer group hover:-translate-y-0.5">
                  <div
                    className={`w-11 h-11 rounded-xl ${action.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className={`w-5 h-5 text-white ${action.color.replace('bg-', 'bg-')}`} style={{ color: action.color.includes('blue') ? '#3b82f6' : action.color.includes('sky') ? '#0ea5e9' : action.color.includes('emerald') ? '#10b981' : '#f97316' }} />
                  </div>
                  <p className="font-semibold text-slate-800 text-sm">{action.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{action.description}</p>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Trips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">即將出發的行程</h2>
            <Link href="/trips" className="text-sm text-sky-600 hover:underline flex items-center gap-1">
              查看全部 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {upcomingTrips.length === 0 ? (
            <Card className="p-12 text-center">
              <Map className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 mb-4">還沒有行程，開始規劃吧！</p>
              <Link href="/trips/new">
                <Button variant="gradient">
                  <Plus className="w-4 h-4" />
                  建立第一個行程
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-4">
              {upcomingTrips.map((trip, i) => (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <Link href={`/trips/${trip.id}`}>
                    <Card className="overflow-hidden hover:shadow-md transition-all duration-200 group">
                      <div className="flex">
                        <div className="relative w-32 h-28 shrink-0">
                          <Image
                            src={trip.coverImage}
                            alt={trip.destination}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1 p-4">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-semibold text-slate-900 group-hover:text-sky-600 transition-colors">
                                {trip.title}
                              </h3>
                              <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                                <Map className="w-3.5 h-3.5" />
                                {trip.destination}
                              </p>
                            </div>
                            <Badge variant={trip.status === 'upcoming' ? 'warning' : 'info'} className="shrink-0">
                              {trip.status === 'upcoming' ? '即將出發' : '規劃中'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {formatDate(trip.startDate, 'M月d日')} — {formatDate(trip.endDate, 'M月d日')}
                            </span>
                            <span>{getTripDuration(trip.startDate, trip.endDate)} 天</span>
                            <span className="text-slate-600 font-medium">
                              {formatCurrency(trip.totalBudget, trip.currency)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Stats sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          {/* Stats */}
          <Card className="p-5">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-sky-500" />
              旅行統計
            </h3>
            <div className="space-y-3">
              {[
                { label: '已完成行程', value: MOCK_TRIPS.filter(t => t.status === 'completed').length.toString(), unit: '趟' },
                { label: '走訪國家', value: new Set(MOCK_TRIPS.map(t => t.country)).size.toString(), unit: '個' },
                { label: '旅行天數', value: '28', unit: '天' },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">{stat.label}</span>
                  <span className="font-bold text-slate-900">
                    {stat.value} <span className="font-normal text-slate-400 text-xs">{stat.unit}</span>
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Add new trip CTA */}
          <Card className="p-5 bg-gradient-to-br from-sky-500 to-indigo-600 border-0 text-white">
            <div className="mb-3">
              <p className="font-semibold text-lg">開始新旅程</p>
              <p className="text-white/70 text-sm mt-1">用 TravelKit 規劃你的下一次冒險</p>
            </div>
            <Link href="/trips/new">
              <Button className="w-full bg-white text-sky-700 hover:bg-white/90" size="sm">
                <Plus className="w-4 h-4" />
                新增行程
              </Button>
            </Link>
          </Card>

          {/* Friends activity feed */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-violet-500" />
                好友動態
              </h3>
              <Link href="/friends" className="text-xs text-sky-600 hover:underline flex items-center gap-0.5">
                查看全部 <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {activities.slice(0, 3).map((act) => (
                <div key={act.id} className="flex items-start gap-2.5">
                  {act.userPhoto ? (
                    <Image
                      src={act.userPhoto}
                      alt={act.userName}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {act.userName[0]}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-700 line-clamp-2">
                      <span className="font-semibold">{act.userName}</span>{' '}
                      {act.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                      <span>{timeAgo(act.createdAt)}</span>
                      <span className="flex items-center gap-0.5">
                        <Heart className="w-2.5 h-2.5" />
                        {act.likedBy.length}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {activities.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-4">
                  加好友後即可看到動態
                </p>
              )}
            </div>
          </Card>

          {/* Recent destinations */}
          <Card className="p-5">
            <h3 className="font-semibold text-slate-900 mb-3">熱門目的地</h3>
            <div className="space-y-2">
              {['東京', '峇里島', '首爾', '巴黎'].map((city) => (
                <Link
                  key={city}
                  href="/explore"
                  className="flex items-center justify-between py-1.5 text-sm text-slate-600 hover:text-sky-600 transition-colors"
                >
                  <span>{city}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
