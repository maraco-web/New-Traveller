'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { Plane, Building2, Search, ArrowRightLeft, Calendar, Users, Star, Wifi, Dumbbell, Coffee, UtensilsCrossed, Car, ArrowRight, SortAsc } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MOCK_FLIGHTS, searchFlights, AIRPORTS } from '@/data/mockFlights';
import { MOCK_HOTELS, searchHotels } from '@/data/mockHotels';
import { formatCurrency } from '@/lib/utils';
import { Flight, Hotel } from '@/types';

type SearchTab = 'flights' | 'hotels';

const AMENITY_ICONS: Record<string, React.ElementType> = {
  WiFi: Wifi,
  健身房: Dumbbell,
  早餐: Coffee,
  餐廳: UtensilsCrossed,
  停車場: Car,
};

export default function SearchPage() {
  const [activeTab, setActiveTab] = useState<SearchTab>('flights');

  // Flight search state
  const [flightFrom, setFlightFrom] = useState('');
  const [flightTo, setFlightTo] = useState('');
  const [departDate, setDepartDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [flightResults, setFlightResults] = useState<Flight[]>([]);
  const [hasSearchedFlights, setHasSearchedFlights] = useState(false);

  // Hotel search state
  const [hotelDestination, setHotelDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [hotelResults, setHotelResults] = useState<Hotel[]>([]);
  const [hasSearchedHotels, setHasSearchedHotels] = useState(false);

  const [sortBy, setSortBy] = useState<'price' | 'rating'>('price');

  const handleFlightSearch = () => {
    const results = flightFrom || flightTo
      ? searchFlights(flightFrom, flightTo)
      : MOCK_FLIGHTS;
    setFlightResults(results);
    setHasSearchedFlights(true);
  };

  const handleHotelSearch = () => {
    const results = searchHotels(hotelDestination);
    setHotelResults(results);
    setHasSearchedHotels(true);
  };

  const sortedFlights = [...flightResults].sort((a, b) =>
    sortBy === 'price' ? a.price - b.price : 0
  );

  const sortedHotels = [...hotelResults].sort((a, b) =>
    sortBy === 'price' ? a.pricePerNight - b.pricePerNight : b.rating - a.rating
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">搜尋機票 & 住宿</h1>
        <p className="text-slate-500 mt-1">比較各航空公司與飯店，找到最划算的選擇</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('flights')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
            activeTab === 'flights'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Plane className="w-4 h-4" />
          機票搜尋
        </button>
        <button
          onClick={() => setActiveTab('hotels')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
            activeTab === 'hotels'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          住宿搜尋
        </button>
      </div>

      {/* Search Form */}
      <AnimatePresence mode="wait">
        {activeTab === 'flights' ? (
          <motion.div
            key="flights"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="p-5 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">出發地</label>
                  <div className="relative">
                    <Plane className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="城市或機場代碼"
                      value={flightFrom}
                      onChange={(e) => setFlightFrom(e.target.value)}
                      className="pl-9"
                      list="airports-from"
                    />
                    <datalist id="airports-from">
                      {AIRPORTS.map((a) => (
                        <option key={a.code} value={a.code}>{a.city}</option>
                      ))}
                    </datalist>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-sky-500"
                    onClick={() => {
                      const temp = flightFrom;
                      setFlightFrom(flightTo);
                      setFlightTo(temp);
                    }}
                  >
                    <ArrowRightLeft className="w-5 h-5" />
                  </Button>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">目的地</label>
                  <div className="relative">
                    <Plane className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 rotate-90" />
                    <Input
                      placeholder="城市或機場代碼"
                      value={flightTo}
                      onChange={(e) => setFlightTo(e.target.value)}
                      className="pl-9"
                      list="airports-to"
                    />
                    <datalist id="airports-to">
                      {AIRPORTS.map((a) => (
                        <option key={a.code} value={a.code}>{a.city}</option>
                      ))}
                    </datalist>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">出發日期</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <Input
                      type="date"
                      value={departDate}
                      onChange={(e) => setDepartDate(e.target.value)}
                      className="pl-9"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">旅客人數</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <Input
                      type="number"
                      min={1}
                      max={9}
                      value={passengers}
                      onChange={(e) => setPassengers(parseInt(e.target.value))}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="md:col-span-5">
                  <Button
                    variant="gradient"
                    size="lg"
                    className="w-full"
                    onClick={handleFlightSearch}
                  >
                    <Search className="w-5 h-5" />
                    搜尋航班
                  </Button>
                </div>
              </div>
            </Card>

            {/* Flight Results */}
            {hasSearchedFlights && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-slate-500">
                    找到 <span className="font-semibold text-slate-800">{sortedFlights.length}</span> 個航班
                  </p>
                  <div className="flex items-center gap-2">
                    <SortAsc className="w-4 h-4 text-slate-400" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'price' | 'rating')}
                      className="text-sm border border-slate-200 rounded-lg px-2 py-1 focus:outline-none"
                    >
                      <option value="price">價格排序</option>
                      <option value="rating">評分排序</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  {sortedFlights.map((flight, i) => (
                    <motion.div
                      key={flight.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <Card className="p-5 hover:shadow-md transition-shadow">
                        <div className="flex flex-wrap items-center gap-4">
                          {/* Airline */}
                          <div className="w-24 shrink-0">
                            <p className="font-semibold text-slate-800 text-sm">{flight.airline}</p>
                            <p className="text-xs text-slate-400">{flight.flightNumber}</p>
                          </div>

                          {/* Route */}
                          <div className="flex-1 flex items-center gap-3">
                            <div className="text-center">
                              <p className="text-2xl font-bold text-slate-900">{flight.departureTime}</p>
                              <p className="text-sm font-medium text-slate-600">{flight.fromCode}</p>
                              <p className="text-xs text-slate-400">{flight.from}</p>
                            </div>

                            <div className="flex-1 flex flex-col items-center gap-1">
                              <p className="text-xs text-slate-400">{flight.duration}</p>
                              <div className="flex items-center gap-1 w-full">
                                <div className="h-px flex-1 bg-slate-200" />
                                <Plane className="w-3.5 h-3.5 text-sky-500" />
                                <div className="h-px flex-1 bg-slate-200" />
                              </div>
                              <p className="text-xs text-slate-400">
                                {flight.stops === 0 ? '直飛' : `${flight.stops} 次轉機`}
                              </p>
                            </div>

                            <div className="text-center">
                              <p className="text-2xl font-bold text-slate-900">{flight.arrivalTime}</p>
                              <p className="text-sm font-medium text-slate-600">{flight.toCode}</p>
                              <p className="text-xs text-slate-400">{flight.to}</p>
                            </div>
                          </div>

                          {/* Price & Action */}
                          <div className="text-right shrink-0">
                            <p className="text-2xl font-bold text-sky-600">
                              {formatCurrency(flight.price * passengers, flight.currency)}
                            </p>
                            <p className="text-xs text-slate-400 mb-2">
                              {passengers > 1 ? `每人 ${formatCurrency(flight.price, flight.currency)}` : '每人'}
                            </p>
                            <div className="flex items-center gap-2 justify-end mb-2">
                              {flight.seatsLeft <= 5 && (
                                <Badge variant="warning" className="text-xs">
                                  僅剩 {flight.seatsLeft} 席
                                </Badge>
                              )}
                              {flight.class === 'business' && (
                                <Badge variant="info" className="text-xs">商務艙</Badge>
                              )}
                            </div>
                            <Button variant="gradient" size="sm">
                              選擇 <ArrowRight className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="hotels"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="p-5 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">目的地城市</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="城市名稱，例如：東京"
                      value={hotelDestination}
                      onChange={(e) => setHotelDestination(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">入住日期</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <Input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="pl-9"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">退房日期</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <Input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="pl-9"
                      min={checkIn || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">住客人數</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <Input
                      type="number"
                      min={1}
                      max={10}
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value))}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="md:col-span-4">
                  <Button
                    variant="gradient"
                    size="lg"
                    className="w-full"
                    onClick={handleHotelSearch}
                  >
                    <Search className="w-5 h-5" />
                    搜尋住宿
                  </Button>
                </div>
              </div>
            </Card>

            {/* Hotel Results */}
            {hasSearchedHotels && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-slate-500">
                    找到 <span className="font-semibold text-slate-800">{sortedHotels.length}</span> 間住宿
                  </p>
                  <div className="flex items-center gap-2">
                    <SortAsc className="w-4 h-4 text-slate-400" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'price' | 'rating')}
                      className="text-sm border border-slate-200 rounded-lg px-2 py-1 focus:outline-none"
                    >
                      <option value="price">價格排序</option>
                      <option value="rating">評分排序</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  {sortedHotels.map((hotel, i) => (
                    <motion.div
                      key={hotel.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <Card className="overflow-hidden hover:shadow-md transition-shadow">
                        <div className="flex flex-col sm:flex-row">
                          <div className="relative w-full sm:w-52 h-40 sm:h-auto shrink-0">
                            <Image
                              src={hotel.image}
                              alt={hotel.name}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 100vw, 208px"
                            />
                          </div>
                          <div className="flex-1 p-5">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-bold text-slate-900 text-lg">{hotel.name}</h3>
                                  <Badge variant="ghost" className="text-xs shrink-0">
                                    {hotel.type === 'hotel' ? '飯店' : hotel.type === 'hostel' ? '旅館' : hotel.type === 'resort' ? '度假村' : '公寓'}
                                  </Badge>
                                </div>
                                <p className="text-sm text-slate-400 flex items-center gap-1">
                                  <Building2 className="w-3.5 h-3.5" />
                                  {hotel.city}, {hotel.country}
                                </p>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="text-2xl font-bold text-sky-600">
                                  {formatCurrency(hotel.pricePerNight, hotel.currency)}
                                </p>
                                <p className="text-xs text-slate-400">每晚/每人</p>
                              </div>
                            </div>

                            <p className="text-sm text-slate-500 mt-2 line-clamp-2">{hotel.description}</p>

                            <div className="flex items-center justify-between mt-4">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                  <span className="font-semibold text-sm">{hotel.rating}</span>
                                  <span className="text-xs text-slate-400">({hotel.reviewCount.toLocaleString()})</span>
                                </div>
                                <div className="flex gap-2">
                                  {hotel.amenities.slice(0, 3).map((amenity) => {
                                    const Icon = AMENITY_ICONS[amenity];
                                    return (
                                      <span key={amenity} className="flex items-center gap-1 text-xs text-slate-500" title={amenity}>
                                        {Icon ? <Icon className="w-3.5 h-3.5" /> : null}
                                        <span className="hidden sm:inline">{amenity}</span>
                                      </span>
                                    );
                                  })}
                                </div>
                              </div>
                              <Button variant="gradient" size="sm">
                                查看詳情
                                <ArrowRight className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Show all hotels if not searched */}
            {!hasSearchedHotels && (
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-4">精選住宿推薦</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {MOCK_HOTELS.slice(0, 4).map((hotel, i) => (
                    <motion.div
                      key={hotel.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                    >
                      <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
                        <div className="relative h-44 overflow-hidden">
                          <Image
                            src={hotel.image}
                            alt={hotel.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                          <div className="absolute bottom-3 left-3 text-white">
                            <p className="font-bold">{hotel.name}</p>
                            <p className="text-sm text-white/70">{hotel.city}, {hotel.country}</p>
                          </div>
                          <div className="absolute top-3 right-3 bg-white rounded-lg px-2 py-1">
                            <span className="font-bold text-sky-600 text-sm">
                              {formatCurrency(hotel.pricePerNight, hotel.currency)}
                            </span>
                            <span className="text-xs text-slate-400">/晚</span>
                          </div>
                        </div>
                        <div className="p-3 flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            <span className="font-semibold text-sm">{hotel.rating}</span>
                          </div>
                          <div className="flex gap-1">
                            {hotel.amenities.slice(0, 4).map((amenity) => (
                              <span key={amenity} className="text-xs bg-slate-100 px-2 py-0.5 rounded-full text-slate-500">
                                {amenity}
                              </span>
                            ))}
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
