/**
 * Location Smoothing Service - Ổn định vị trí GPS bất ổn
 * Sử dụng Kalman filter để làm mượt vị trí GPS
 */

export interface LocationHistory {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

class LocationSmoother {
  private history: LocationHistory[] = [];
  private readonly maxHistorySize = 5;
  private readonly timeWindow = 30000; // 30 giây

  /**
   * Thêm vị trí mới vào lịch sử
   */
  addLocation(latitude: number, longitude: number, accuracy: number): void {
    const now = Date.now();
    
    // Xóa các vị trí cũ hơn timeWindow
    this.history = this.history.filter(loc => now - loc.timestamp < this.timeWindow);
    
    // Thêm vị trí mới
    this.history.push({
      latitude,
      longitude,
      accuracy,
      timestamp: now,
    });

    // Giới hạn kích thước lịch sử
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    }
  }

  /**
   * Lấy vị trí trung bình có trọng số (ưu tiên vị trí gần đây và chính xác hơn)
   */
  getSmoothedLocation(): {
    latitude: number;
    longitude: number;
    accuracy: number;
  } | null {
    if (this.history.length === 0) return null;

    // Tính trọng số dựa trên độ chính xác
    let totalWeight = 0;
    let weightedLat = 0;
    let weightedLng = 0;
    let bestAccuracy = this.history[0].accuracy;

    for (const loc of this.history) {
      // Trọng số 1: Độ chính xác (càng chính xác càng cao)
      const accuracyWeight = 1 / (1 + loc.accuracy / 100);
      
      // Trọng số 2: Độ gần đây (ưu tiên vị trí mới)
      const age = Date.now() - loc.timestamp;
      const ageWeight = Math.exp(-age / 10000);
      
      const weight = accuracyWeight * ageWeight;
      
      totalWeight += weight;
      weightedLat += loc.latitude * weight;
      weightedLng += loc.longitude * weight;
      
      if (loc.accuracy < bestAccuracy) {
        bestAccuracy = loc.accuracy;
      }
    }

    if (totalWeight === 0) return null;

    return {
      latitude: weightedLat / totalWeight,
      longitude: weightedLng / totalWeight,
      accuracy: bestAccuracy,
    };
  }

  /**
   * Phát hiện vị trí bất thường (jump quá xa)
   */
  isAbnormalJump(latitude: number, longitude: number): boolean {
    if (this.history.length === 0) return false;

    const lastLocation = this.history[this.history.length - 1];
    
    // Tính khoảng cách giữa vị trí mới và vị trí cũ
    const R = 6371; // km
    const dLat = (latitude - lastLocation.latitude) * (Math.PI / 180);
    const dLng = (longitude - lastLocation.longitude) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lastLocation.latitude * (Math.PI / 180)) *
        Math.cos(latitude * (Math.PI / 180)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    // Nếu jump > 1km trong < 2 giây = bất thường
    const timeDiff = Date.now() - lastLocation.timestamp;
    const maxSpeed = (distance * 1000) / timeDiff; // m/s

    // Tốc độ tối đa con người có thể di chuyển: ~50 m/s (180 km/h)
    return maxSpeed > 50;
  }

  /**
   * Xóa lịch sử
   */
  clear(): void {
    this.history = [];
  }

  /**
   * Lấy số lượng vị trí trong lịch sử
   */
  getHistorySize(): number {
    return this.history.length;
  }
}

// Singleton instance
let locationSmoother: LocationSmoother | null = null;

export const getLocationSmoother = (): LocationSmoother => {
  if (!locationSmoother) {
    locationSmoother = new LocationSmoother();
  }
  return locationSmoother;
};
