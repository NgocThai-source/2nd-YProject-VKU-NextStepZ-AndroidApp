/**
 * Companies Data Service - Đồng bộ dữ liệu real-time từ /companies
 */

import { Company } from '@/lib/companies-mock-data';

let companiesCache: Map<string, Company> = new Map();
let lastUpdateTime = 0;
const CACHE_DURATION = 5000; // Cache 5 giây

/**
 * Cập nhật cache companies từ mockCompanies
 */
export const updateCompaniesCache = (companies: Company[]): void => {
  companiesCache = new Map();
  companies.forEach((company) => {
    companiesCache.set(company.id, company);
  });
  lastUpdateTime = Date.now();
};

/**
 * Lấy công ty từ cache với dữ liệu mới nhất
 */
export const getCompanyFromCache = (companyId: string): Company | null => {
  return companiesCache.get(companyId) || null;
};

/**
 * Lấy tất cả công ty từ cache
 */
export const getAllCompaniesFromCache = (): Company[] => {
  return Array.from(companiesCache.values());
};

/**
 * Kiểm tra xem cache có hết hạn không
 */
export const isCacheExpired = (): boolean => {
  return Date.now() - lastUpdateTime > CACHE_DURATION;
};

/**
 * Làm mới cache
 */
export const refreshCompaniesCache = (companies: Company[]): void => {
  updateCompaniesCache(companies);
};
