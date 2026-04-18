'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { mockCompanies, Company } from '@/lib/companies-mock-data';
import { JobMap, JobMapFilters, JobMapDetails, JobMapMobile } from '@/components/job-map';
import {
  GeolocationCoords,
  filterCompaniesByRadius,
} from '@/lib/services/geolocation-service';
import { updateCompaniesCache } from '@/lib/services/companies-cache-service';

export default function JobMapPage() {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [userLocation, setUserLocation] = useState<GeolocationCoords | null>(
    null
  );
  const [radius, setRadius] = useState(5);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Cập nhật cache companies khi component mount
  useEffect(() => {
    updateCompaniesCache(mockCompanies);
    
    // Detect mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Compute filtered companies based on user location and radius
  const filteredCompanies = useMemo(() => {
    // Luôn hiển thị tất cả công ty trên map, bất kể bán kính
    return mockCompanies;
  }, []);

  // Tính số công ty trong bán kính (chỉ để hiển thị thông tin)
  const companiesInRadius = useMemo(() => {
    if (!userLocation) {
      return mockCompanies;
    }

    const filtered = filterCompaniesByRadius(
      mockCompanies as Array<{ latitude: number; longitude: number }>,
      userLocation.latitude,
      userLocation.longitude,
      radius
    );

    return filtered as unknown as Company[];
  }, [userLocation, radius]);

  const handleLocationChange = (coords: GeolocationCoords) => {
    setIsLoadingLocation(true);
    // Simulate API delay
    setTimeout(() => {
      setUserLocation(coords);
      setIsLoadingLocation(false);
    }, 500);
  };

  const handleAddressSearch = (
    query: string,
    coords: GeolocationCoords
  ) => {
    setIsLoadingLocation(true);
    setTimeout(() => {
      setUserLocation(coords);
      setIsLoadingLocation(false);
    }, 500);
  };

  // Render mobile layout
  if (isMobile) {
    return (
      <JobMapMobile
        filteredCompanies={filteredCompanies}
        selectedCompany={selectedCompany}
        onCompanySelect={setSelectedCompany}
        userLocation={userLocation}
        radius={radius}
        onRadiusChange={setRadius}
        onLocationChange={handleLocationChange}
        onAddressSearch={handleAddressSearch}
        isLoadingLocation={isLoadingLocation}
        companiesInRadius={companiesInRadius}
      />
    );
  }

  // Original desktop layout
  return (
    <main className="w-full min-h-screen bg-slate-950 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-8 border-b border-cyan-400/10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1
            className="text-4xl md:text-5xl font-bold text-white mb-2"
            style={{ fontFamily: "'Exo 2 ExtraBold', sans-serif" }}
          >
            Job Map (Bản Đồ Công Việc)
          </h1>
          <p className="text-gray-400 text-lg">
            Giúp bạn tìm kiếm những công việc và cơ hội việc làm gần vị trí của bạn.
          </p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="flex gap-6 p-6 h-[calc(100vh-140px)] overflow-hidden">
        {/* Left Sidebar - Filters */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-96"
        >
          <JobMapFilters
            onLocationChange={handleLocationChange}
            onRadiusChange={setRadius}
            onAddressSearch={handleAddressSearch}
            userLocation={userLocation}
            initialRadius={radius}
            isLoadingLocation={isLoadingLocation}
          />

          {/* Company Count */}
          {userLocation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 bg-slate-900 border border-cyan-400/20 rounded-lg p-4 space-y-3"
            >
              <div>
                <p className="text-sm font-medium text-gray-200 mb-1">
                  Tất cả công ty
                </p>
                <p className="text-2xl font-bold text-cyan-300">
                  {filteredCompanies.length}
                </p>
              </div>
              
              <div className="border-t border-cyan-400/10 pt-3">
                <p className="text-sm font-medium text-gray-200 mb-1">
                  Trong bán kính {radius}km
                </p>
                <p className="text-lg font-bold text-cyan-400">
                  {companiesInRadius.length}
                </p>
              </div>
              
              <p className="text-xs text-gray-400 mt-2">
                💡 Bản đồ hiển thị tất cả công ty. Bộ lọc bán kính giúp bạn tìm công ty gần nhất.
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Center - Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 relative"
        >
          <JobMap
            companies={filteredCompanies}
            selectedCompany={selectedCompany}
            onCompanySelect={setSelectedCompany}
            userLocation={userLocation}
          />
        </motion.div>

        {/* Right Sidebar - Company Details */}
        {selectedCompany && (
          <JobMapDetails
            company={selectedCompany}
            onClose={() => setSelectedCompany(null)}
            userLocation={userLocation}
          />
        )}
      </div>
    </main>
  );
}
