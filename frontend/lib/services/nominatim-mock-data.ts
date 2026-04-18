/**
 * Mock data cho các thành phố Việt Nam phổ biến
 * Dùng khi Nominatim API không khả dụng
 */

export interface CityMockData {
  lat: string;
  lon: string;
  display_name: string;
  boundingbox: string[];
}

export const VIETNAMESE_CITIES_MOCK: Record<string, CityMockData[]> = {
  'ho chi minh': [
    {
      lat: '10.8231',
      lon: '106.6797',
      display_name: 'Ho Chi Minh City, Vietnam',
      boundingbox: ['10.4428', '10.9711', '106.3409', '107.1013'],
    },
  ],
  'hcm': [
    {
      lat: '10.8231',
      lon: '106.6797',
      display_name: 'Ho Chi Minh City, Vietnam',
      boundingbox: ['10.4428', '10.9711', '106.3409', '107.1013'],
    },
  ],
  'saigon': [
    {
      lat: '10.8231',
      lon: '106.6797',
      display_name: 'Ho Chi Minh City (Saigon), Vietnam',
      boundingbox: ['10.4428', '10.9711', '106.3409', '107.1013'],
    },
  ],
  'hanoi': [
    {
      lat: '21.0285',
      lon: '105.8542',
      display_name: 'Hanoi, Vietnam',
      boundingbox: ['20.8364', '21.2285', '105.5488', '106.1348'],
    },
  ],
  'ha noi': [
    {
      lat: '21.0285',
      lon: '105.8542',
      display_name: 'Hanoi, Vietnam',
      boundingbox: ['20.8364', '21.2285', '105.5488', '106.1348'],
    },
  ],
  'da nang': [
    {
      lat: '16.0544',
      lon: '108.2022',
      display_name: 'Da Nang, Vietnam',
      boundingbox: ['15.7834', '16.2619', '107.8954', '108.3662'],
    },
  ],
  'danang': [
    {
      lat: '16.0544',
      lon: '108.2022',
      display_name: 'Da Nang, Vietnam',
      boundingbox: ['15.7834', '16.2619', '107.8954', '108.3662'],
    },
  ],
  'can tho': [
    {
      lat: '10.0379',
      lon: '105.7869',
      display_name: 'Can Tho, Vietnam',
      boundingbox: ['9.7341', '10.2788', '105.3884', '106.0627'],
    },
  ],
  'cantho': [
    {
      lat: '10.0379',
      lon: '105.7869',
      display_name: 'Can Tho, Vietnam',
      boundingbox: ['9.7341', '10.2788', '105.3884', '106.0627'],
    },
  ],
  'hai phong': [
    {
      lat: '20.8449',
      lon: '106.6881',
      display_name: 'Hai Phong, Vietnam',
      boundingbox: ['20.5275', '21.1230', '106.2669', '107.2088'],
    },
  ],
  'haiphong': [
    {
      lat: '20.8449',
      lon: '106.6881',
      display_name: 'Hai Phong, Vietnam',
      boundingbox: ['20.5275', '21.1230', '106.2669', '107.2088'],
    },
  ],
};

/**
 * Lấy mock data cho một thành phố
 */
export const getMockCityData = (query: string): CityMockData[] => {
  const normalizedQuery = query.toLowerCase().trim();
  
  for (const [key, value] of Object.entries(VIETNAMESE_CITIES_MOCK)) {
    if (normalizedQuery.includes(key) || key.includes(normalizedQuery.split(' ')[0])) {
      return value;
    }
  }
  
  return [];
};
