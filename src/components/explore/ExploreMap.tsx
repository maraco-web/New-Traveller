'use client';

import { useEffect, useRef } from 'react';
import { Place } from '@/types';

interface ExploreMapProps {
  places: Place[];
  selectedId?: string;
  onSelectPlace?: (id: string) => void;
  center?: [number, number];
}

const TYPE_COLORS: Record<string, string> = {
  attraction: '#0ea5e9',
  restaurant: '#f97316',
  hotel: '#8b5cf6',
  cafe: '#d97706',
  museum: '#3b82f6',
  park: '#10b981',
};

export default function ExploreMap({ places, selectedId, onSelectPlace, center }: ExploreMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<import('leaflet').Map | null>(null);
  const markersRef = useRef<import('leaflet').Marker[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;

    const initMap = async () => {
      const L = (await import('leaflet')).default;

      // Fix default marker icon
      delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      if (!mapInstanceRef.current && mapRef.current) {
        const mapCenter = center ||
          (places.length > 0
            ? [places[0].coordinates.lat, places[0].coordinates.lng] as [number, number]
            : [35.6762, 139.6503] as [number, number]);

        mapInstanceRef.current = L.map(mapRef.current).setView(mapCenter, 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(mapInstanceRef.current);
      }

      // Clear existing markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      // Add markers
      places.forEach((place) => {
        if (!mapInstanceRef.current) return;

        const color = TYPE_COLORS[place.type] || '#6b7280';
        const isSelected = place.id === selectedId;
        const size = isSelected ? 14 : 10;

        const icon = L.divIcon({
          className: '',
          html: `
            <div style="
              width: ${size * 2}px;
              height: ${size * 2}px;
              background: ${color};
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              transition: all 0.2s;
              ${isSelected ? 'transform: scale(1.3);' : ''}
            "></div>
          `,
          iconSize: [size * 2, size * 2],
          iconAnchor: [size, size],
        });

        const marker = L.marker([place.coordinates.lat, place.coordinates.lng], { icon })
          .bindTooltip(place.name, {
            permanent: false,
            direction: 'top',
            className: 'leaflet-custom-tooltip',
          })
          .addTo(mapInstanceRef.current);

        marker.on('click', () => {
          onSelectPlace?.(place.id);
        });

        markersRef.current.push(marker);
      });
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when selection changes
  useEffect(() => {
    const updateMarkers = async () => {
      if (!mapInstanceRef.current || typeof window === 'undefined') return;
      const L = (await import('leaflet')).default;

      markersRef.current.forEach((marker, i) => {
        const place = places[i];
        if (!place) return;
        const color = TYPE_COLORS[place.type] || '#6b7280';
        const isSelected = place.id === selectedId;
        const size = isSelected ? 14 : 10;

        marker.setIcon(L.divIcon({
          className: '',
          html: `
            <div style="
              width: ${size * 2}px;
              height: ${size * 2}px;
              background: ${color};
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              ${isSelected ? 'transform: scale(1.3);' : ''}
            "></div>
          `,
          iconSize: [size * 2, size * 2],
          iconAnchor: [size, size],
        }));

        if (isSelected && mapInstanceRef.current) {
          mapInstanceRef.current.panTo([place.coordinates.lat, place.coordinates.lng]);
        }
      });
    };

    updateMarkers();
  }, [selectedId, places]);

  return (
    <div ref={mapRef} className="w-full h-full min-h-[400px] rounded-xl overflow-hidden z-0" />
  );
}
