'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowLeft, Plus, MapPin, Clock, DollarSign, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MOCK_TRIPS, MOCK_TRIP_DAYS } from '@/data/mockTrips';
import { formatDate, getActivityIcon, formatCurrency } from '@/lib/utils';
import { ActivityType } from '@/types';

const TYPE_COLORS: Record<ActivityType, string> = {
  transport: 'bg-blue-100 text-blue-700',
  accommodation: 'bg-purple-100 text-purple-700',
  food: 'bg-orange-100 text-orange-700',
  activity: 'bg-green-100 text-green-700',
  sightseeing: 'bg-amber-100 text-amber-700',
  rest: 'bg-slate-100 text-slate-700',
};

const TYPE_LABELS: Record<ActivityType, string> = {
  transport: '交通',
  accommodation: '住宿',
  food: '餐飲',
  activity: '活動',
  sightseeing: '景點',
  rest: '休息',
};

export default function ItineraryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const trip = MOCK_TRIPS.find((t) => t.id === id) || MOCK_TRIPS[0];
  const allDays = MOCK_TRIP_DAYS.filter((d) => d.tripId === trip.id);
  const [selectedDay, setSelectedDay] = useState(0);

  // Build day list for the whole trip duration
  const tripDays = Array.from(
    { length: Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / 86400000) + 1 },
    (_, i) => {
      const date = new Date(trip.startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const existingDay = allDays.find((d) => d.date === dateStr);
      return {
        dayNumber: i + 1,
        date: dateStr,
        activities: existingDay?.activities || [],
      };
    }
  );

  const currentDay = tripDays[selectedDay];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/trips/${id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{trip.title}</h1>
          <p className="text-slate-500 text-sm">
            {formatDate(trip.startDate, 'M月d日')} — {formatDate(trip.endDate, 'M月d日')} · {tripDays.length} 天
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Day selector - left panel */}
        <div className="lg:w-64 shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-700 text-sm">選擇日期</h3>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="w-7 h-7"
                onClick={() => setSelectedDay(Math.max(0, selectedDay - 1))}
                disabled={selectedDay === 0}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-7 h-7"
                onClick={() => setSelectedDay(Math.min(tripDays.length - 1, selectedDay + 1))}
                disabled={selectedDay === tripDays.length - 1}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-1">
            {tripDays.map((day, i) => (
              <button
                key={day.date}
                onClick={() => setSelectedDay(i)}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                  i === selectedDay
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">第 {day.dayNumber} 天</p>
                    <p className={`text-xs mt-0.5 ${i === selectedDay ? 'text-white/70' : 'text-slate-400'}`}>
                      {formatDate(day.date, 'M/d (E)')}
                    </p>
                  </div>
                  {day.activities.length > 0 && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${i === selectedDay ? 'bg-white/20' : 'bg-sky-50 text-sky-600'}`}>
                      {day.activities.length} 項
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Day content - right panel */}
        <div className="flex-1">
          <motion.div
            key={selectedDay}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Day header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  第 {currentDay.dayNumber} 天
                </h2>
                <p className="text-slate-500 text-sm">{formatDate(currentDay.date, 'yyyy年M月d日 EEEE')}</p>
              </div>
              <Button variant="gradient" size="sm">
                <Plus className="w-4 h-4" />
                新增活動
              </Button>
            </div>

            {/* Activities */}
            {currentDay.activities.length === 0 ? (
              <Card className="p-12 text-center">
                <Clock className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-500 mb-4">這天還沒有安排活動</p>
                <Button variant="gradient" size="sm">
                  <Plus className="w-4 h-4" />
                  新增第一個活動
                </Button>
              </Card>
            ) : (
              <div className="space-y-3">
                {currentDay.activities.map((activity, i) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className="p-4 hover:shadow-sm transition-shadow group">
                      <div className="flex items-start gap-4">
                        {/* Timeline */}
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-lg shrink-0">
                            {getActivityIcon(activity.type)}
                          </div>
                          {i < currentDay.activities.length - 1 && (
                            <div className="w-px flex-1 bg-dashed border-l-2 border-dashed border-slate-200 my-2 min-h-[24px]" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-mono text-sky-600 font-medium bg-sky-50 px-2 py-0.5 rounded">
                                  {activity.time}
                                </span>
                                <Badge variant="ghost" className={`text-xs ${TYPE_COLORS[activity.type]}`}>
                                  {TYPE_LABELS[activity.type]}
                                </Badge>
                              </div>
                              <h4 className="font-semibold text-slate-900">{activity.title}</h4>
                              <p className="text-sm text-slate-400 flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3.5 h-3.5" />
                                {activity.location}
                              </p>
                              {activity.notes && (
                                <p className="text-xs text-slate-500 mt-1 italic">{activity.notes}</p>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                              <Button variant="ghost" size="icon" className="w-8 h-8 text-slate-400">
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>
                              <Button variant="ghost" size="icon" className="w-8 h-8 text-red-400">
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>

                          {/* Cost */}
                          {activity.cost !== undefined && activity.cost > 0 && (
                            <div className="flex items-center gap-1 mt-2 text-sm text-slate-600">
                              <DollarSign className="w-3.5 h-3.5 text-amber-500" />
                              <span>{formatCurrency(activity.cost, 'JPY')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}

                {/* Daily total */}
                {currentDay.activities.some((a) => a.cost && a.cost > 0) && (
                  <Card className="p-4 bg-slate-50">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">今日小計</span>
                      <span className="font-bold text-slate-900">
                        ¥{currentDay.activities.reduce((s, a) => s + (a.cost || 0), 0).toLocaleString()}
                      </span>
                    </div>
                  </Card>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
