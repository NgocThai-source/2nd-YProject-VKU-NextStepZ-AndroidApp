'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MapPin } from 'lucide-react';
import { Company } from '@/lib/companies-mock-data';
import { JobMap } from './map';
import { JobMapDetails } from './details';
import { JobMapFilters } from './filters';
import { GeolocationCoords } from '@/lib/services/geolocation-service';

interface JobMapMobileProps {
  filteredCompanies: Company[];
  selectedCompany: Company | null;
  onCompanySelect: (company: Company | null) => void;
  userLocation: GeolocationCoords | null;
  radius: number;
  onRadiusChange: (radius: number) => void;
  onLocationChange: (coords: GeolocationCoords) => void;
  onAddressSearch: (query: string, coords: GeolocationCoords) => void;
  isLoadingLocation: boolean;
  companiesInRadius: Company[];
}

export function JobMapMobile({
  filteredCompanies,
  selectedCompany,
  onCompanySelect,
  userLocation,
  radius,
  onRadiusChange,
  onLocationChange,
  onAddressSearch,
  isLoadingLocation,
  companiesInRadius,
}: JobMapMobileProps) {
  const [showFilters, setShowFilters] = useState(false);

  const handleCloseDetails = () => {
    onCompanySelect(null);
  };

  return (
    <main className="w-full h-screen flex flex-col bg-slate-950 overflow-hidden">
      {/* Header */}
      <div className="shrink-0 px-4 py-4 border-b border-cyan-400/10 bg-slate-950">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1
            className="text-2xl font-bold text-white mb-1"
            style={{ fontFamily: "'Exo 2 ExtraBold', sans-serif" }}
          >
            Bản Đồ Công Việc
          </h1>
          <p className="text-xs text-gray-400">
            Tìm công việc phù hợp với vị trí của bạn
          </p>
        </motion.div>
      </div>

      {/* Map Container - Main Content */}
      <div className="flex-1 relative overflow-hidden">
        <JobMap
          companies={filteredCompanies}
          selectedCompany={selectedCompany}
          onCompanySelect={onCompanySelect}
          userLocation={userLocation}
        />

        {/* Floating Filters Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFilters(true)}
          className="absolute top-4 right-4 z-30 bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 shadow-lg"
        >
          <MapPin className="w-4 h-4" />
          Lọc
        </motion.button>

        {/* Company Count Badge */}
        {userLocation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bottom-4 left-4 z-20 bg-slate-900/95 border border-cyan-400/30 rounded-lg p-3 backdrop-blur"
          >
            <p className="text-xs text-gray-300 mb-1">Tất cả công ty</p>
            <p className="text-2xl font-bold text-cyan-300">{filteredCompanies.length}</p>
            <p className="text-xs text-gray-400 mt-1">
              {companiesInRadius.length} trong {radius}km
            </p>
          </motion.div>
        )}
      </div>

      {/* Filters Drawer */}
      <AnimatePresence>
        {showFilters && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />

            {/* Filters Panel */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 rounded-t-2xl max-h-[85vh] overflow-y-auto"
            >
              {/* Handle Bar */}
              <div className="sticky top-0 flex justify-center pt-3 pb-2 bg-slate-900 border-b border-cyan-400/10">
                <div className="w-12 h-1 bg-gray-600 rounded-full" />
              </div>

              {/* Header */}
              <div className="px-4 py-4 border-b border-cyan-400/10 sticky top-8 bg-slate-900">
                <div className="flex items-center justify-between">
                  <h2
                    className="text-lg font-bold text-white"
                    style={{ fontFamily: "'Exo 2 ExtraBold', sans-serif" }}
                  >
                    Tìm Kiếm Công Việc
                  </h2>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Filters Content */}
              <div className="px-4 py-6 space-y-6 pb-20">
                <JobMapFilters
                  onLocationChange={onLocationChange}
                  onRadiusChange={onRadiusChange}
                  onAddressSearch={onAddressSearch}
                  userLocation={userLocation}
                  initialRadius={radius}
                  isLoadingLocation={isLoadingLocation}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Details Sheet */}
      <AnimatePresence>
        {selectedCompany && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseDetails}
              className="fixed inset-0 bg-black/50 z-50"
            />

            {/* Details Panel */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 rounded-t-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Handle Bar */}
              <div className="sticky top-0 flex justify-center pt-3 pb-2 bg-slate-900 border-b border-cyan-400/10">
                <div className="w-12 h-1 bg-gray-600 rounded-full" />
              </div>

              {/* Details Content */}
              <div className="p-4 pb-20">
                <JobMapDetails
                  company={selectedCompany}
                  onClose={handleCloseDetails}
                  userLocation={userLocation}
                  isMobile={true}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
