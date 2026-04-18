'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Search,
  Loader,
  AlertCircle,
  Navigation,
  X,
} from 'lucide-react';
import {
  getCurrentLocation,
  GeolocationCoords,
  GeolocationError,
  clearLocationHistory,
} from '@/lib/services/geolocation-service';
import { searchAddress } from '@/lib/services/nominatim-service';

interface JobMapFiltersProps {
  onLocationChange?: (coords: GeolocationCoords) => void;
  onRadiusChange?: (radius: number) => void;
  onAddressSearch?: (query: string, coords: GeolocationCoords) => void;
  userLocation?: GeolocationCoords | null;
  initialRadius?: number;
  isLoadingLocation?: boolean;
}

export function JobMapFilters({
  onLocationChange,
  onRadiusChange,
  onAddressSearch,
  userLocation,
  initialRadius = 5,
  isLoadingLocation = false,
}: JobMapFiltersProps) {
  const [addressQuery, setAddressQuery] = useState('');
  const [addressSuggestions, setAddressSuggestions] = useState<
    Array<{ lat: string; lon: string; display_name: string }>
  >([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  
  // Debounce timer
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleGetLocation = async () => {
    setError(null);
    try {
      const coords = await getCurrentLocation();
      onLocationChange?.(coords);
    } catch (err) {
      const geoError = err as GeolocationError;
      setError(geoError.message);
    }
  };

  const handleRetryLocation = () => {
    // Xóa lịch sử để reset
    clearLocationHistory();
    handleGetLocation();
  };

  const handleAddressSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setAddressQuery(query);
    setError(null);

    // Clear debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (query.length < 1) {
      setAddressSuggestions([]);
      setShowAddressSuggestions(false);
      return;
    }

    // Debounce search - chỉ search sau khi user ngừng gõ 300ms
    debounceTimerRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchAddress(query);
        setAddressSuggestions(results);
        setShowAddressSuggestions(results.length > 0);
        
        if (results.length === 0 && query.length >= 2) {
          setError('Không tìm thấy địa chỉ. Thử nhập tên thành phố (ví dụ: Hà Nội, TP HCM, Đà Nẵng)');
        }
      } catch (err) {
        console.error('Address search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  };

  const handleSelectAddress = (suggestion: (typeof addressSuggestions)[0]) => {
    const coords: GeolocationCoords = {
      latitude: parseFloat(suggestion.lat),
      longitude: parseFloat(suggestion.lon),
      accuracy: 0,
    };

    setAddressQuery(suggestion.display_name);
    setShowAddressSuggestions(false);
    onAddressSearch?.(suggestion.display_name, coords);
  };

  const handleClearAddress = () => {
    setAddressQuery('');
    setAddressSuggestions([]);
    setShowAddressSuggestions(false);
    setError(null);
  };

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900 border border-cyan-400/20 rounded-lg p-6 space-y-6 h-full max-h-[calc(100vh-180px)] overflow-y-auto"
    >
      {/* Header */}
      <div>
        <h3
          className="text-xl font-bold text-white mb-1"
          style={{ fontFamily: "'Exo 2 ExtraBold', sans-serif" }}
        >
          Tìm Kiếm Công Việc
        </h3>
        <p className="text-gray-400 text-sm">Lọc công ty theo vị trí của bạn</p>
      </div>

      {/* Location Search */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-300">
          Địa chỉ
        </label>
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Nhập địa chỉ hoặc thành phố..."
              value={addressQuery}
              onChange={handleAddressSearch}
              onFocus={() => addressQuery && setShowAddressSuggestions(true)}
              className="w-full pl-10 pr-10 py-2.5 bg-slate-800 border border-cyan-400/20 rounded-lg text-gray-100 placeholder-gray-500 focus:border-cyan-400/50 focus:outline-none transition-all"
            />
            {addressQuery && (
              <button
                onClick={handleClearAddress}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Address Suggestions */}
          {showAddressSuggestions && addressSuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-cyan-400/20 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto"
            >
              {addressSuggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectAddress(suggestion)}
                  className="w-full text-left px-4 py-2.5 hover:bg-cyan-400/10 border-b border-cyan-400/10 last:border-b-0 transition-colors"
                >
                  <p className="text-sm text-gray-200 truncate">
                    {suggestion.display_name}
                  </p>
                </button>
              ))}
            </motion.div>
          )}

          {isSearching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader className="w-4 h-4 text-cyan-400 animate-spin" />
            </div>
          )}
        </div>
      </div>

      {/* Current Location Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleGetLocation}
        disabled={isLoadingLocation}
        className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-all"
      >
        {isLoadingLocation ? (
          <>
            <Loader className="w-4 h-4 animate-spin" />
            Đang lấy vị trí...
          </>
        ) : (
          <>
            <Navigation className="w-4 h-4" />
            Lấy Vị Trí Của Tôi
          </>
        )}
      </motion.button>

      {/* User Location Info */}
      {userLocation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-cyan-400/10 border border-cyan-400/30 rounded-lg p-3 flex items-start gap-3"
        >
          <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs text-cyan-300 font-medium">Vị trí của bạn</p>
              <div className="flex items-center gap-1">
                {(userLocation as any).source && (
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${
                    (userLocation as any).source === 'GPS' 
                      ? 'bg-green-500/20 text-green-400' 
                      : (userLocation as any).source === 'IP'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {(userLocation as any).source === 'GPS' && '📍 GPS'}
                    {(userLocation as any).source === 'IP' && '🌐 IP'}
                    {(userLocation as any).source === 'DEFAULT' && '🗺️ Mặc định'}
                  </span>
                )}
                {(userLocation as any).smoothed && (
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-orange-500/20 text-orange-400">
                    🔄 Làm mượt
                  </span>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-300">
              {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
            </p>
            <p className="text-xs text-gray-400">
              Độ chính xác: ±{Math.round(userLocation.accuracy)}m
            </p>
            {userLocation.accuracy > 100 && (userLocation as any).source !== 'IP' && (
              <div className="flex items-center justify-between gap-2 mt-1">
                <p className="text-xs text-yellow-400">
                  ⚠️ Vị trí không chính xác. Đảm bảo bật GPS đầy đủ.
                </p>
                <button
                  onClick={handleRetryLocation}
                  className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 rounded transition-colors"
                >
                  Thử lại
                </button>
              </div>
            )}
            {userLocation.accuracy <= 50 && (userLocation as any).source === 'GPS' && (
              <p className="text-xs text-green-400">
                ✓ Vị trí rất chính xác
              </p>
            )}
            {(userLocation as any).source === 'IP' && (
              <p className="text-xs text-blue-400">
                💡 Sử dụng vị trí từ IP (kém chính xác hơn GPS)
              </p>
            )}
          </div>
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-start gap-2"
        >
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <p className="text-xs text-red-300">{error}</p>
        </motion.div>
      )}

      {/* Info */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 space-y-2">
        <p className="text-xs text-blue-300 font-semibold">
          💡 GPS bất ổn định? Đây là các biện pháp khắc phục:
        </p>
        <div className="text-xs text-blue-200 space-y-1">
          <p><strong>1. Để GPS có độ chính xác cao:</strong></p>
          <ul className="list-disc list-inside space-y-0.5 ml-1">
            <li>Bật GPS trên điện thoại (không dùng Wi-Fi hoặc LTE)</li>
            <li>Chờ GPS khóa được tín hiệu (20-60 giây)</li>
            <li>Ở ngoài trời, tránh khu vực đô thị dày đặc</li>
            <li>Hạ gục lên để có tín hiệu tốt hơn</li>
          </ul>
        </div>
        <div className="text-xs text-blue-200 space-y-1">
          <p><strong>2. Nếu GPS vẫn không ổn định:</strong></p>
          <ul className="list-disc list-inside space-y-0.5 ml-1">
            <li>Ứng dụng tự động &quot;làm mượt&quot; vị trí bất thường</li>
            <li>Nếu vẫn sai, nhấn &quot;Thử lại&quot; để reset GPS</li>
            <li>Dùng tìm kiếm địa chỉ thay vì GPS</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
