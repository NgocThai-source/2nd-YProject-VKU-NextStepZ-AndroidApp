'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { motion } from 'framer-motion';
import { AlertCircle, Loader } from 'lucide-react';
import { Company } from '@/lib/companies-mock-data';

// Ẩn Mapbox attribution
import './map.css';

interface JobMapProps {
  companies: Company[];
  selectedCompany?: Company | null;
  onCompanySelect?: (company: Company | null) => void;
  userLocation?: { latitude: number; longitude: number } | null;
}

export function JobMap({
  companies,
  selectedCompany,
  onCompanySelect,
  userLocation,
}: JobMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);

  // Set Mapbox token
  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      setError('Mapbox token không được cấu hình. Vui lòng thêm NEXT_PUBLIC_MAPBOX_TOKEN vào .env.local');
      setIsLoading(false);
      return;
    }
    mapboxgl.accessToken = token;
  }, []);

  // Thêm markers cho công ty
  const addMarkers = useCallback(() => {
    // Xóa markers cũ
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    if (!map.current) return;

    companies.forEach((company) => {
      // Tạo popup content
      const popupContent = `
        <div class="bg-slate-900 rounded-lg p-4 border border-cyan-400/30 max-w-xs">
          <div class="flex gap-3">
            <img src="${company.logo}" alt="${company.name}" class="w-12 h-12 rounded object-cover" />
            <div class="flex-1">
              <h3 class="font-bold text-white text-sm">${company.name}</h3>
              <p class="text-cyan-300 text-xs">${company.location}</p>
            </div>
          </div>
          <p class="text-gray-300 text-xs mt-2">${company.description}</p>
          <div class="flex gap-2 mt-2">
            <span class="px-2 py-1 rounded bg-cyan-400/20 text-cyan-300 text-xs">
              ${company.openPositions} việc làm
            </span>
          </div>
        </div>
      `;

      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: true,
      }).setHTML(popupContent);

      // Tạo custom marker element
      const markerEl = document.createElement('div');
      markerEl.className = 'marker-container';
      markerEl.innerHTML = `
        <div class="relative w-10 h-10 cursor-pointer transition-all hover:scale-125">
          <div class="w-10 h-10 rounded-full bg-linear-to-br from-cyan-400 to-cyan-600 flex items-center justify-center border-2 border-white shadow-lg hover:shadow-xl hover:from-cyan-300 hover:to-cyan-500">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 2a4 4 0 00-4 4v.5H5a1 1 0 00-.994.89l-1 9A1 1 0 004 20h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 6.5H14V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div class="absolute inset-0 rounded-full bg-cyan-400/20 animate-pulse"></div>
        </div>
      `;

      // Thêm event listener cho marker
      markerEl.addEventListener('click', (e) => {
        e.stopPropagation();
        onCompanySelect?.(company);
      });

      const marker = new mapboxgl.Marker(markerEl)
        .setLngLat([company.longitude, company.latitude])
        .setPopup(popup)
        .addTo(map.current!);

      markersRef.current.push(marker);
    });
  }, [companies, onCompanySelect]);

  // Khởi tạo Mapbox
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
      if (!token) {
        setError('Mapbox token không được cấu hình');
        setIsLoading(false);
        return;
      }

      mapboxgl.accessToken = token;

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [106.6797, 10.8231], // TP HCM
        zoom: 12,
      });

      // Khi map tải xong
      map.current.on('load', () => {
        setIsLoading(false);
        addMarkers();
      });

      // Xử lý lỗi
      map.current.on('error', (e) => {
        console.error('Mapbox error:', e.error);
        setError('Lỗi tải bản đồ. Vui lòng tải lại trang.');
        setIsLoading(false);
      });
    } catch (err) {
      console.error('Map initialization error:', err);
      setError('Không thể khởi tạo bản đồ');
      setIsLoading(false);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Cập nhật markers khi companies thay đổi
  useEffect(() => {
    if (map.current?.loaded()) {
      addMarkers();
    }
  }, [addMarkers]);

  // Highlight marker khi có company được chọn
  useEffect(() => {
    if (!selectedCompany || !map.current) return;

    // Zoom tới company
    map.current.flyTo({
      center: [selectedCompany.longitude, selectedCompany.latitude],
      zoom: 16,
      duration: 1000,
    });
  }, [selectedCompany]);

  // Thêm user location marker
  useEffect(() => {
    if (!userLocation || !map.current) return;

    // Xóa marker cũ
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
    }

    // Tạo user location marker
    const userMarkerEl = document.createElement('div');
    userMarkerEl.innerHTML = `
      <div class="w-4 h-4 bg-blue-500 rounded-full border-3 border-white shadow-lg animate-pulse"></div>
    `;

    userMarkerRef.current = new mapboxgl.Marker(userMarkerEl, {
      anchor: 'center',
    })
      .setLngLat([userLocation.longitude, userLocation.latitude])
      .addTo(map.current);

    // Zoom to user location
    map.current.flyTo({
      center: [userLocation.longitude, userLocation.latitude],
      zoom: 13,
      duration: 1000,
    });
  }, [userLocation]);

  return (
    <div className="relative w-full h-full bg-slate-900 rounded-lg overflow-hidden border border-cyan-400/20">
      {/* Map Container */}
      <div
        ref={mapContainer}
        className="w-full h-full"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />

      {/* Loading State */}
      {isLoading && (
        <motion.div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-3">
            <Loader className="w-8 h-8 text-cyan-400 animate-spin" />
            <p className="text-gray-300">Đang tải bản đồ...</p>
          </div>
        </motion.div>
      )}

      {/* Error State */}
      {error && (
        <motion.div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-3 bg-slate-800 border border-red-500/30 rounded-lg p-6 max-w-sm">
            <AlertCircle className="w-8 h-8 text-red-400" />
            <p className="text-gray-300 text-center">{error}</p>
          </div>
        </motion.div>
      )}

      {/* Map Attribution */}
      <div className="absolute bottom-4 left-4 text-xs text-gray-400 pointer-events-none z-0">
        <p>© OpenStreetMap contributors</p>
      </div>
    </div>
  );
}
