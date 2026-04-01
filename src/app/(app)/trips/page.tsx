'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Plus, Map, Calendar, Clock, Search, Filter, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { MOCK_TRIPS } from '@/data/mockTrips';
import { formatDate, getTripDuration, getStatusColor, formatCurrency } from '@/lib/utils';
import type { TripStatus } from '@/types';

const STATUS_LABELS: Record<TripStatus, string> = {
  planning: '規劃中',
  upcoming: '即將出發',
  ongoing: '旅途中',
  completed: '已完成',
};

const STATUS_TABS: { value: 'all' | TripStatus; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'upcoming', label: '即將出發' },
  { value: 'planning', label: '規劃中' },
  { value: 'ongoing', label: '旅途中' },
  { value: 'completed', label: '已完成' },
];

export default function TripsPage() {
  const [activeTab, setActiveTab] = useState<'all' | TripStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTrips = MOCK_TRIPS.filter((trip) => {
    const matchesTab = activeTab === 'all' || trip.status === activeTab;
    const matchesSearch =
      !searchQuery ||
      trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">我的行程</h1>
          <p className="text-slate-500 mt-1">管理你的所有旅遊計劃</p>
        </div>
        <Link href="/trips/new">
          <Button variant="gradient">
            <Plus className="w-4 h-4" />
            新增行程
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <Input
            placeholder="搜尋行程名稱或目的地..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" className="gap-2 shrink-0">
          <Filter className="w-4 h-4" />
          篩選
        </Button>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === tab.value
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
            {tab.value !== 'all' && (
              <span className={`ml-1.5 text-xs ${activeTab === tab.value ? 'text-white/80' : 'text-slate-400'}`}>
                {MOCK_TRIPS.filter((t) => t.status === tab.value).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Trips Grid */}
      {filteredTrips.length === 0 ? (
        <Card className="p-16 text-center">
          <Map className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">找不到行程</h3>
          <p className="text-slate-400 mb-6">試試調整搜尋條件，或建立新的行程</p>
          <Link href="/trips/new">
            <Button variant="gradient">
              <Plus className="w-4 h-4" />
              建立行程
            </Button>
          </Link>
        </Card>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {filteredTrips.map((trip, i) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -4 }}
            >
              <Link href={`/trips/${trip.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer">
                  {/* Cover Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={trip.coverImage}
                      alt={trip.destination}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Status badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(trip.status)}`}>
                        {STATUS_LABELS[trip.status]}
                      </span>
                    </div>

                    {/* Destination */}
                    <div className="absolute bottom-3 left-3 text-white">
                      <div className="text-xs text-white/70 flex items-center gap-1">
                        <Map className="w-3 h-3" />
                        {trip.destination}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-900 text-lg mb-2 group-hover:text-sky-600 transition-colors">
                      {trip.title}
                    </h3>

                    <div className="space-y-1.5 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>
                          {formatDate(trip.startDate, 'M月d日')} — {formatDate(trip.endDate, 'M月d日')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span>{getTripDuration(trip.startDate, trip.endDate)} 天 {getTripDuration(trip.startDate, trip.endDate) - 1} 夜</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                      <div>
                        <p className="text-xs text-slate-400">預算</p>
                        <p className="font-semibold text-slate-800">
                          {formatCurrency(trip.totalBudget, trip.currency)}
                        </p>
                      </div>
                      <div className="flex gap-1.5">
                        {trip.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="ghost" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-500 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
