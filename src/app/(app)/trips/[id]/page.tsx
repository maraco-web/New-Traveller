'use client';

import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, Clock, DollarSign, MapPin, Edit, Share2, Plus, Map } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

import { MOCK_TRIPS, MOCK_TRIP_DAYS } from '@/data/mockTrips';
import { formatDate, getTripDuration, getStatusColor, getActivityIcon, formatCurrency } from '@/lib/utils';

const STATUS_LABELS: Record<string, string> = {
  planning: '規劃中',
  upcoming: '即將出發',
  ongoing: '旅途中',
  completed: '已完成',
};

export default function TripDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const trip = MOCK_TRIPS.find((t) => t.id === id) || MOCK_TRIPS[0];
  const days = MOCK_TRIP_DAYS.filter((d) => d.tripId === trip.id);

  return (
    <div>
      {/* Hero */}
      <div className="relative h-72 md:h-96">
        <Image
          src={trip.coverImage}
          alt={trip.destination}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Back button */}
        <div className="absolute top-4 left-4">
          <Link href="/trips">
            <Button variant="ghost" size="icon" className="bg-black/30 hover:bg-black/50 text-white rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
        </div>

        {/* Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button variant="ghost" size="icon" className="bg-black/30 hover:bg-black/50 text-white rounded-full">
            <Share2 className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="bg-black/30 hover:bg-black/50 text-white rounded-full">
            <Edit className="w-5 h-5" />
          </Button>
        </div>

        {/* Trip info */}
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(trip.status)}`}>
              {STATUS_LABELS[trip.status]}
            </span>
            {trip.tags.map((tag) => (
              <span key={tag} className="px-2.5 py-1 rounded-full text-xs bg-white/20 backdrop-blur-sm">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl font-bold mb-1">{trip.title}</h1>
          <div className="flex items-center gap-1.5 text-white/80">
            <MapPin className="w-4 h-4" />
            {trip.destination}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 py-5">
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                icon: Calendar,
                label: '旅行日期',
                value: `${formatDate(trip.startDate, 'M/d')} — ${formatDate(trip.endDate, 'M/d')}`,
              },
              {
                icon: Clock,
                label: '行程天數',
                value: `${getTripDuration(trip.startDate, trip.endDate)} 天`,
              },
              {
                icon: DollarSign,
                label: '旅遊預算',
                value: formatCurrency(trip.totalBudget, trip.currency),
              },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="text-center">
                <Icon className="w-5 h-5 text-sky-500 mx-auto mb-1" />
                <p className="text-xs text-slate-400">{label}</p>
                <p className="font-semibold text-slate-900 text-sm">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Link href={`/trips/${trip.id}/itinerary`}>
            <Button variant="gradient">
              <Calendar className="w-4 h-4" />
              查看日程
            </Button>
          </Link>
          <Link href={`/budget?tripId=${trip.id}`}>
            <Button variant="outline">
              <DollarSign className="w-4 h-4" />
              管理預算
            </Button>
          </Link>
          <Button variant="outline">
            <Map className="w-4 h-4" />
            行程地圖
          </Button>
        </div>

        {/* Itinerary preview */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">行程日程</h2>
            <Link href={`/trips/${trip.id}/itinerary`}>
              <Button variant="ghost" size="sm" className="text-sky-600">
                查看全部
              </Button>
            </Link>
          </div>

          {days.length === 0 ? (
            <Card className="p-10 text-center">
              <Calendar className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-500 mb-4">尚未新增任何活動</p>
              <Link href={`/trips/${trip.id}/itinerary`}>
                <Button variant="gradient" size="sm">
                  <Plus className="w-4 h-4" />
                  新增活動
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-4">
              {days.slice(0, 2).map((day) => (
                <motion.div
                  key={day.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold text-sm">
                        {day.dayNumber}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">第 {day.dayNumber} 天</p>
                        <p className="text-sm text-slate-400">{formatDate(day.date, 'M月d日 EEEE')}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {day.activities.map((activity, i) => (
                        <div key={activity.id} className="flex items-start gap-3">
                          {/* Timeline connector */}
                          <div className="flex flex-col items-center mt-1">
                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-sm shrink-0">
                              {getActivityIcon(activity.type)}
                            </div>
                            {i < day.activities.length - 1 && (
                              <div className="w-px h-full min-h-[20px] bg-slate-200 my-0.5" />
                            )}
                          </div>
                          <div className="flex-1 pb-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <span className="text-xs text-slate-400 font-mono">{activity.time}</span>
                                <p className="font-medium text-slate-800 text-sm">{activity.title}</p>
                                <p className="text-xs text-slate-400 flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {activity.location}
                                </p>
                              </div>
                              {activity.cost !== undefined && activity.cost > 0 && (
                                <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
                                  ¥{activity.cost.toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              ))}

              {days.length > 2 && (
                <div className="text-center">
                  <Link href={`/trips/${trip.id}/itinerary`}>
                    <Button variant="outline">查看全部 {days.length} 天行程</Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
