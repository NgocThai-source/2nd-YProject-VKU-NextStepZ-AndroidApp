// Nominatim Geocoding Service
import { getMockCityData } from './nominatim-mock-data';

export interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
  boundingbox: string[];
}

/**
 * Tìm kiếm địa chỉ bằng Nominatim (với retry logic và fallback mock data)
 */
export const searchAddress = async (
  query: string,
  retries: number = 1
): Promise<NominatimResult[]> => {
  try {
    // Thêm Vietnam vào query để tăng độ chính xác
    const enhancedQuery = query.toLowerCase().includes('vietnam') || query.toLowerCase().includes('việt nam')
      ? query
      : `${query}, Vietnam`;

    // Thử Nominatim trước
    try {
      const nominatimUrl = new URL('https://nominatim.openstreetmap.org/search');
      nominatimUrl.searchParams.set('format', 'json');
      nominatimUrl.searchParams.set('q', enhancedQuery);
      nominatimUrl.searchParams.set('countrycodes', 'vn');
      nominatimUrl.searchParams.set('limit', '10');

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 giây timeout

      const response = await fetch(nominatimUrl.toString(), {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'NextStepZ Job Map',
        },
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        let data = await response.json();
        
        // Lọc kết quả để chỉ giữ những kết quả ở Việt Nam
        data = data.filter((result: NominatimResult) => {
          const lat = parseFloat(result.lat);
          const lon = parseFloat(result.lon);
          const isInVietnam = lat >= 8.5 && lat <= 23.4 && lon >= 102.1 && lon <= 109.6;
          return isInVietnam;
        });
        
        if (data.length > 0) {
          return data;
        }
      }
    } catch (nominatimError) {
      console.warn('Nominatim API thất bại:', nominatimError);
    }

    // Fallback: thử dùng mock data ngay lập tức
    const mockData = getMockCityData(query);
    if (mockData.length > 0) {
      console.log('Sử dụng mock data cho query:', query);
      return mockData;
    }

    return [];
  } catch (error) {
    console.error('Address search error:', error);
    
    // Final fallback: mock data
    const mockData = getMockCityData(query);
    if (mockData.length > 0) {
      return mockData;
    }
    
    return [];
  }
};


/**
 * Reverse geocoding - lấy địa chỉ từ tọa độ
 */
export const getReverseGeocoding = async (
  latitude: number,
  longitude: number
): Promise<NominatimResult | null> => {
  try {
    // Kiểm tra xem tọa độ có nằm trong Việt Nam không
    const isInVietnam = latitude >= 8.5 && latitude <= 23.4 && longitude >= 102.1 && longitude <= 109.6;
    
    if (!isInVietnam) {
      console.warn('Tọa độ nằm ngoài biên giới Việt Nam');
      return null;
    }

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
    );

    if (!response.ok) {
      throw new Error('Lỗi khi lấy địa chỉ từ tọa độ');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Nominatim reverse geocoding error:', error);
    return null;
  }
};
