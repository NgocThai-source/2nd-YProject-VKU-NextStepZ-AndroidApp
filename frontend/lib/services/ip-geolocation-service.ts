/**
 * IP Geolocation Service - Fallback khi GPS không hoạt động
 * Sử dụng dịch vụ miễn phí IP geolocation
 */

export interface IPGeolocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  city?: string;
  country?: string;
}

/**
 * Lấy vị trí từ IP address (fallback khi GPS không hoạt động)
 */
export const getLocationFromIP = async (): Promise<IPGeolocationData> => {
  try {
    // Sử dụng ip-api.com hoặc ipinfo.io
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();

    if (data.latitude && data.longitude) {
      return {
        latitude: data.latitude,
        longitude: data.longitude,
        accuracy: 5000, // IP geolocation có độ chính xác thấp hơn GPS (5km)
        city: data.city,
        country: data.country_name,
      };
    }

    // Fallback: Trả về vị trí Việt Nam mặc định (TP HCM)
    return {
      latitude: 10.8231,
      longitude: 106.6797,
      accuracy: 10000,
      city: 'Ho Chi Minh City',
      country: 'Vietnam',
    };
  } catch (error) {
    console.warn('Không thể lấy vị trí từ IP:', error);
    // Fallback: TP HCM, Việt Nam
    return {
      latitude: 10.8231,
      longitude: 106.6797,
      accuracy: 10000,
      city: 'Ho Chi Minh City',
      country: 'Vietnam',
    };
  }
};
