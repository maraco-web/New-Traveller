'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Star, MapPin, Heart, X, Globe2, Utensils, Camera, Landmark } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ALL_PLACES } from '@/data/mockAttractions';
import { Place, PlaceType } from '@/types';

const ExploreMap = dynamic(() => import('@/components/explore/ExploreMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-100 rounded-xl flex items-center justify-center">
      <div className="text-slate-400 text-sm flex flex-col items-center gap-2">
        <Globe2 className="w-8 h-8 animate-pulse" />
        載入地圖中...
      </div>
    </div>
  ),
});

const PRICE_LEVEL_LABELS = ['', '$ 便宜', '$$ 適中', '$$$ 較貴', '$$$$ 高檔'];

const TYPE_FILTERS: { value: 'all' | PlaceType; label: string; icon: React.ElementType }[] = [
  { value: 'all', label: '全部', icon: Globe2 },
  { value: 'attraction', label: '景點', icon: Camera },
  { value: 'restaurant', label: '餐廳', icon: Utensils },
  { value: 'museum', label: '博物館', icon: Landmark },
  { value: 'park', label: '公園', icon: Globe2 },
];

export default function ExplorePage() {
  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | PlaceType>('all');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showMap, setShowMap] = useState(true);

  const filteredPlaces = useMemo(() => {
    return ALL_PLACES.filter((p) => {
      const matchesType = selectedType === 'all' || p.type === selectedType;
      const matchesQuery =
        !query ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.city.toLowerCase().includes(query.toLowerCase()) ||
        p.country.toLowerCase().includes(query.toLowerCase());
      return matchesType && matchesQuery;
    });
  }, [query, selectedType]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="px-4 py-4 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <h1 className="text-2xl font-bold text-slate-900 shrink-0">探索景點 & 餐廳</h1>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <Input
                placeholder="搜尋城市、景點名稱..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMap(!showMap)}
              className="gap-2 shrink-0"
            >
              <MapPin className="w-4 h-4" />
              {showMap ? '隱藏地圖' : '顯示地圖'}
            </Button>
          </div>

          {/* Type Filters */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {TYPE_FILTERS.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setSelectedType(value)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedType === value
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex gap-0">
        {/* Map */}
        <AnimatePresence>
          {showMap && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '55%', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="hidden md:block h-full p-4 shrink-0"
            >
              <ExploreMap
                places={filteredPlaces}
                selectedId={selectedPlace?.id}
                onSelectPlace={(id) => setSelectedPlace(filteredPlaces.find((p) => p.id === id) || null)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Place Cards */}
        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-sm text-slate-500 mb-4">
            找到 <span className="font-semibold text-slate-800">{filteredPlaces.length}</span> 個地點
          </p>

          {filteredPlaces.length === 0 ? (
            <Card className="p-12 text-center">
              <Search className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-500">找不到符合條件的地點</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {filteredPlaces.map((place, i) => (
                <motion.div
                  key={place.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ y: -2 }}
                  onClick={() => setSelectedPlace(place)}
                  className={`cursor-pointer rounded-xl border transition-all duration-200 overflow-hidden ${
                    selectedPlace?.id === place.id
                      ? 'border-sky-500 ring-2 ring-sky-100 shadow-md'
                      : 'border-slate-100 hover:border-slate-300 hover:shadow-md bg-white'
                  }`}
                >
                  <div className="flex">
                    <div className="relative w-28 h-28 shrink-0">
                      <Image
                        src={place.image}
                        alt={place.name}
                        fill
                        className="object-cover"
                        sizes="112px"
                      />
                    </div>
                    <div className="flex-1 p-3 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <Badge
                              variant={place.type === 'attraction' ? 'info' : 'default'}
                              className="text-xs shrink-0"
                            >
                              {place.type === 'attraction' ? '景點' : '餐廳'}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-slate-900 text-sm leading-tight truncate">{place.name}</h3>
                          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3" />
                            {place.city}, {place.country}
                          </p>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleFavorite(place.id); }}
                          className={`shrink-0 p-1.5 rounded-full transition-colors ${
                            favorites.has(place.id) ? 'text-red-500' : 'text-slate-300 hover:text-red-400'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${favorites.has(place.id) ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-semibold text-slate-700">{place.rating}</span>
                          <span className="text-xs text-slate-400">({place.reviewCount.toLocaleString()})</span>
                        </div>
                        <span className="text-xs text-slate-400">{PRICE_LEVEL_LABELS[place.priceLevel]}</span>
                      </div>

                      <div className="flex gap-1 mt-2 flex-wrap">
                        {place.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-xs px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Place Detail Panel */}
      <AnimatePresence>
        {selectedPlace && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50 md:absolute md:bottom-4 md:right-4 md:left-auto md:w-80 bg-white rounded-t-2xl md:rounded-2xl shadow-2xl border border-slate-100 max-h-[60vh] overflow-y-auto"
          >
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-slate-900 text-lg leading-tight">{selectedPlace.name}</h3>
                <button
                  onClick={() => setSelectedPlace(null)}
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative h-36 rounded-xl overflow-hidden mb-3">
                <Image src={selectedPlace.image} alt={selectedPlace.name} fill className="object-cover" />
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">{selectedPlace.rating}</span>
                  <span className="text-sm text-slate-400">({selectedPlace.reviewCount.toLocaleString()})</span>
                </div>
                <Badge variant={selectedPlace.type === 'attraction' ? 'info' : 'default'}>
                  {selectedPlace.type === 'attraction' ? '景點' : '餐廳'}
                </Badge>
              </div>

              <p className="text-sm text-slate-500 mb-3 leading-relaxed">{selectedPlace.description}</p>

              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2 text-slate-600">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {selectedPlace.location}
                </p>
                {selectedPlace.openingHours && (
                  <p className="flex items-center gap-2 text-slate-600">
                    <span className="w-4 h-4 text-center text-slate-400">⏰</span>
                    {selectedPlace.openingHours}
                  </p>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => toggleFavorite(selectedPlace.id)}
                  variant={favorites.has(selectedPlace.id) ? 'destructive' : 'default'}
                >
                  <Heart className={`w-4 h-4 ${favorites.has(selectedPlace.id) ? 'fill-current' : ''}`} />
                  {favorites.has(selectedPlace.id) ? '已收藏' : '收藏'}
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  加入行程
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
