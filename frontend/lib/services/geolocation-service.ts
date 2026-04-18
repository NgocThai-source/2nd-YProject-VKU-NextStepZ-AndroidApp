import { getLocationFromIP } from './ip-geolocation-service';
import { getLocationSmoother } from './location-smoother';

// Geolocation Service - Lấy vị trí hiện tại từ browser
export interface GeolocationCoords {
  latitude: number;
  longitude: number;
  accuracy: number;
  source?: 'GPS' | 'IP' | 'DEFAULT'; // Thêm thông tin nguồn vị trí
  smoothed?: boolean; // Vị trí đã được làm mượt hay không
}

export interface GeolocationError {
  code: number;
  message: string;
}

/**
 * Lấy vị trí hiện tại của người dùng (với fallback IP)
 */
export const getCurrentLocation = async (): Promise<GeolocationCoords> => {
  return new Promise(async (resolve, reject) => {
    if (!navigator.geolocation) {
      try {
        const ipLocation = await getLocationFromIP();
        resolve({
          ...ipLocation,
          source: 'IP',
        });
      } catch (error) {
        reject({
          code: 0,
          message: 'Trình duyệt không hỗ trợ Geolocation API',
        });
      }
      return;
    }

    // Thử lấy vị trí từ GPS
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const smoother = getLocationSmoother();
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = position.coords.accuracy;

        // Kiểm tra nếu vị trí là bất thường jump
        if (smoother.isAbnormalJump(lat, lng)) {
          console.warn('Phát hiện jump vị trí bất thường, sử dụng vị trí đã làm mượt');
          const smoothed = smoother.getSmoothedLocation();
          if (smoothed) {
            resolve({
              latitude: smoothed.latitude,
              longitude: smoothed.longitude,
              accuracy: smoothed.accuracy,
              source: 'GPS',
              smoothed: true,
            });
            return;
          }
        }

        // Thêm vào smoother cho lần tiếp theo
        smoother.addLocation(lat, lng, accuracy);

        resolve({
          latitude: lat,
          longitude: lng,
          accuracy: accuracy,
          source: 'GPS',
          smoothed: false,
        });
      },
      async (error) => {
        let message = 'Không thể lấy vị trí của bạn';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Bạn đã từ chối quyền truy cập vị trí';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Thông tin vị trí không có sẵn';
            break;
          case error.TIMEOUT:
            message = 'Yêu cầu vị trí đã hết thời gian chờ';
            break;
        }

        // Fallback: Lấy vị trí từ IP address
        try {
          console.warn('GPS thất bại, sử dụng IP geolocation:', message);
          const ipLocation = await getLocationFromIP();
          resolve({
            ...ipLocation,
            source: 'IP',
          });
        } catch (ipError) {
          reject({
            code: error.code,
            message: message + ' (Không thể sử dụng fallback IP)',
          });
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 30000, // Tăng timeout lên 30 giây để GPS có đủ thời gian
        maximumAge: 0, // Không dùng cache để lấy vị trí mới nhất
      }
    );
  });
};

/**
 * Tính khoảng cách giữa hai điểm (sử dụng Haversine formula)
 */
export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371; // Bán kính Trái Đất (km)
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Xóa lịch sử vị trí (để reset khi cần)
 */
export const clearLocationHistory = (): void => {
  getLocationSmoother().clear();
};

/**
 * Lọc công ty theo bán kính từ vị trí
 */
export const filterCompaniesByRadius = (
  companies: Array<{ latitude: number; longitude: number; [key: string]: unknown }>,
  centerLat: number,
  centerLng: number,
  radiusKm: number
) => {
  // Kiểm tra vị trí có nằm trong Việt Nam không
  const isInVietnam = centerLat >= 8.5 && centerLat <= 23.4 && centerLng >= 102.1 && centerLng <= 109.6;
  if (!isInVietnam) {
    console.warn('Vị trí không nằm trong Việt Nam. Sẽ hiển thị tất cả công ty.');
    return companies;
  }

  return companies.filter((company) => {
    const distance = calculateDistance(
      centerLat,
      centerLng,
      company.latitude,
      company.longitude
    );
    return distance <= radiusKm;
  });
};
