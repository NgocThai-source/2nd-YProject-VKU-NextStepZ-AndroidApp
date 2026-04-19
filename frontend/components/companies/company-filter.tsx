'use client';

import { motion } from 'framer-motion';
import {
  ChevronDown,
} from 'lucide-react';
import { useState } from 'react';
import { VIETNAM_CITIES } from '@/lib/vietnam-cities';
import { SearchableFilter } from './searchable-filter';

interface CompanyFilterProps {
  selectedLocations: string[];
  onLocationsChange: (locations: string[]) => void;
  selectedSizes: string[];
  onSizesChange: (sizes: string[]) => void;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  ratingFilter: number;
  onRatingChange: (rating: number) => void;
  salaryRange: [number, number];
  onSalaryRangeChange: (range: [number, number]) => void;
}

const INDUSTRIES = [
  'Tuyển dụng',
  'Đối tác nhân sự (HRBP)',
  'Đào tạo',
  'Quan hệ lao động',
  'Phát triển tổ chức',
  'Truyền thông nội bộ',
  'Payroll/C&B (Lương/Thưởng/Phúc lợi)',
  'Nhân sự tổng hợp',
  'Trưởng phòng nhân sự',
  'Giám đốc nhân sự',
  'Chuyên môn Nhân sự khác',
  'Chuyên viên phát triển văn hóa doanh nghiệp',
  'Hành chính nhân sự',
  'Hành chính tổng hợp',
  'Trưởng phòng hành chính',
  'Giám đốc hành chính',
  'Giám đốc điều hành',
  'Văn thư',
  'Quản lý cơ sở vật chất',
  'Lái xe văn phòng',
  'Trợ lý/Thu kỳ',
  'Lễ tân/Đón tiếp',
  'Project Administrator',
];

const JOB_POSITIONS = [
  // Vị trí chuyên môn
  'Tuyển dụng',
  'Đối tác nhân sự (HRBP)',
  'Đào tạo',
  'Quan hệ lao động',
  'Phát triển tổ chức',
  'Truyền thông nội bộ',
  'Payroll/C&B (Lương/Thưởng/Phúc lợi)',
  'Nhân sự tổng hợp',
  'Trưởng phòng nhân sự',
  'Giám đốc nhân sự',
  'Chuyên môn Nhân sự khác',
  'Chuyên viên phát triển văn hóa doanh nghiệp',
  'Hành chính nhân sự',
  'Hành chính tổng hợp',
  'Trưởng phòng hành chính',
  'Giám đốc hành chính',
  'Giám đốc điều hành',
  'Văn thư',
  'Quản lý cơ sở vật chất',
  'Lái xe văn phòng',
  'Trợ lý/Thu kỳ',
  'Lễ tân/Đón tiếp',
  'Project Administrator',

  // Sinh viên IT
  'Sinh viên IT - Lập trình viên Frontend',
  'Sinh viên IT - Lập trình viên Backend',
  'Sinh viên IT - Lập trình viên Full Stack',
  'Sinh viên IT - Lập trình viên Mobile (Android/iOS)',
  'Sinh viên IT - Tester/QA',
  'Sinh viên IT - UI/UX Designer',
  'Sinh viên IT - Graphic Designer',
  'Sinh viên IT - Data Analyst',
  'Sinh viên IT - DevOps/Cloud',
  'Sinh viên IT - Network Engineer',
  'Sinh viên IT - System Administrator',
  'Sinh viên IT - Database Administrator',
  'Sinh viên IT - Security Engineer',
  'Sinh viên IT - AI/Machine Learning',
  'Sinh viên IT - Web Developer',

  // Sinh viên Marketing & Truyền thông
  'Sinh viên Marketing - Content Creator',
  'Sinh viên Marketing - Digital Marketing',
  'Sinh viên Marketing - Social Media Manager',
  'Sinh viên Marketing - Email Marketing',
  'Sinh viên Marketing - Marketing Analytics',
  'Sinh viên Marketing - Brand Manager',
  'Sinh viên Marketing - Product Marketing',
  'Sinh viên Marketing - Event Organizer',
  'Sinh viên Truyền thông - Biên tập viên',
  'Sinh viên Truyền thông - Phóng viên',
  'Sinh viên Truyền thông - Nhà sản xuất video',

  // Sinh viên Kinh doanh & Bán hàng
  'Sinh viên Sales - Business Development',
  'Sinh viên Sales - Account Executive',
  'Sinh viên Sales - Inside Sales',
  'Sinh viên Sales - Sales Support',
  'Sinh viên Sales - Customer Service',
  'Sinh viên Quản lý Kinh doanh - Business Analyst',
  'Sinh viên Quản lý Kinh doanh - Operations Manager',
  'Sinh viên Quản lý Kinh doanh - Project Manager',

  // Sinh viên Tài chính & Kế toán
  'Sinh viên Kế toán - Kế toán tổng hợp',
  'Sinh viên Kế toán - Kế toán chi phí',
  'Sinh viên Kế toán - Kế toán quản trị',
  'Sinh viên Kế toán - Kế toán thuế',
  'Sinh viên Tài chính - Nhân viên tài chính',
  'Sinh viên Tài chính - Phân tích tài chính',
  'Sinh viên Tài chính - Quy hoạch tài chính',
  'Sinh viên Ngân hàng - Customer Service',
  'Sinh viên Ngân hàng - Teller',
  'Sinh viên Bảo hiểm - Sales Representative',

  // Sinh viên Luật pháp & Nhân sự
  'Sinh viên Luật sư - Luật tư vấn',
  'Sinh viên Luật sư - Luật doanh nghiệp',
  'Sinh viên Pháp lý - Legal Assistant',
  'Sinh viên Nhân sự - Recruitment Officer',
  'Sinh viên Nhân sự - HR Coordinator',
  'Sinh viên Nhân sự - Training Officer',

  // Sinh viên Logistics & Vận tải
  'Sinh viên Logistics - Supply Chain Coordinator',
  'Sinh viên Logistics - Warehouse Supervisor',
  'Sinh viên Logistics - Procurement Officer',
  'Sinh viên Logistics - Inventory Controller',
  'Sinh viên Vận tải - Operations Coordinator',

  // Sinh viên Thiết kế & Creative
  'Sinh viên Thiết kế Đồ họa - Web Designer',
  'Sinh viên Thiết kế Đồ họa - Graphic Designer',
  'Sinh viên Thiết kế Đồ họa - Motion Designer',
  'Sinh viên Thiết kế Đồ họa - 3D Designer',
  'Sinh viên Thiết kế - Product Designer',
  'Sinh viên Thiết kế - Interior Designer',

  // Sinh viên các ngành khác
  'Sinh viên Kỹ sư - Kỹ sư Cơ khí',
  'Sinh viên Kỹ sư - Kỹ sư Điện',
  'Sinh viên Kỹ sư - Kỹ sư Xây dựng',
  'Sinh viên Kỹ sư - Kỹ sư Hóa học',
  'Sinh viên Kỹ sư - Kỹ sư Điều khiển tự động',
  'Sinh viên Môi trường - Environmental Specialist',
  'Sinh viên Y tế - Medical Assistant',
  'Sinh viên Y tế - Phối hợp viên',
  'Sinh viên Giáo dục - Teacher Assistant',
  'Sinh viên Giáo dục - Training Coordinator',
  'Sinh viên Du lịch - Tour Guide',
  'Sinh viên Du lịch - Hospitality Staff',
  'Sinh viên Nông nghiệp - Agricultural Specialist',

  // Part-time dành cho sinh viên
  'Part-time: Phục vụ bàn - Quán ăn/Hủ tiếu',
  'Part-time: Phục vụ bàn - Nhà hàng',
  'Part-time: Phục vụ bàn - Quán cà phê',
  'Part-time: Pha chế - Trà sữa/Cà phê',
  'Part-time: Barista - Quán cà phê',
  'Part-time: Bán hàng - Cửa hàng bán lẻ',
  'Part-time: Bán hàng - Siêu thị',
  'Part-time: Bán hàng - Fashion/Thời trang',
  'Part-time: Bán hàng - Cửa hàng điện tử',
  'Part-time: Thu ngân - Quán ăn/Cửa hàng',
  'Part-time: Thu ngân - Siêu thị',
  'Part-time: Giúp việc - Quán ăn',
  'Part-time: Giúp việc bếp - Quán ăn',
  'Part-time: Rửa chén - Quán ăn',
  'Part-time: Vệ sinh - Quán ăn/Cửa hàng',
  'Part-time: Shipper - Giao hàng',
  'Part-time: Shipper - Grab/Bee/Now',
  'Part-time: Giao hàng - Bưu điện',
  'Part-time: Tư vấn bán hàng - Showroom',
  'Part-time: Tư vấn bán hàng - Cửa hàng điện thoại',
  'Part-time: Cộng tác viên - Cửa hàng',
  'Part-time: Thực tập sinh văn phòng',
  'Part-time: Thực tập sinh bán hàng',
  'Part-time: Làm tay - Xây dựng/Bất động sản',
  'Part-time: Công nhân - Nhà máy',
  'Part-time: Công nhân - Công xưởng',
  'Part-time: Lao động tay - Bất động sản',
  'Part-time: Hỗ trợ sự kiện - Event',
  'Part-time: Hỗ trợ sự kiện - Quảng cáo',
  'Part-time: Gia sư - Dạy kèm',
  'Part-time: Hướng dẫn viên - Bảo tàng/Du lịch',
  'Part-time: Làm mẫu ảnh/Video',
  'Part-time: Tư vấn môi trường - Shop',
  'Part-time: Khác dành cho sinh viên',

  // Thực tập sinh
  'Thực tập sinh - Tổng hợp',
  'Thực tập sinh - IT/Công nghệ',
  'Thực tập sinh - Marketing/Truyền thông',
  'Thực tập sinh - Tài chính/Kế toán',
  'Thực tập sinh - Nhân sự',
  'Thực tập sinh - Sales/Business Development',
  'Thực tập sinh - Logistics/Supply Chain',
  'Thực tập sinh - Luật pháp',
  'Thực tập sinh - Thiết kế',
  'Thực tập sinh - Bất động sản',
  'Thực tập sinh - Ngân hàng',
  'Thực tập sinh - Bảo hiểm',
  'Thực tập sinh - Bán hàng',
  'Thực tập sinh - Hành chính',

  // Entry-level dành cho sinh viên mới tốt nghiệp
  'Trợ lý - Đa ngành',
  'Trợ lý - Marketing',
  'Trợ lý - Pháp lý',
  'Trợ lý - Tài chính',
  'Trợ lý quản lý',
  'Nhân viên Hành chính/Văn phòng',
  'Nhân viên Kho/Logistics',
  'Nhân viên Bán hàng - Entry Level',
  'Nhân viên Customer Service - Mới tốt nghiệp',
  'Nhân viên Tuyển dụng - Mới tốt nghiệp',
  'Nhân viên Marketing - Mới tốt nghiệp',
  'Công việc theo giờ dành cho sinh viên',
];

const LOCATIONS = ['Toàn Quốc', ...VIETNAM_CITIES.map((city) => city.name)];

const SIZES = [
  { value: 'startup', label: 'Startup' },
  { value: 'small', label: 'Small (10-50)' },
  { value: 'medium', label: 'Medium (50-200)' },
  { value: 'large', label: 'Large (200-1000)' },
  { value: 'enterprise', label: 'Enterprise (1000+)' },
];


const TAGS = [
  // Công nghệ & IT
  'Technology',
  'Software Development',
  'Cloud Computing',
  'AI',
  'Machine Learning',
  'Blockchain',
  'Web Development',
  'Mobile Development',
  'Backend Development',
  'Frontend Development',
  'Full Stack',
  'DevOps',
  'Cybersecurity',
  'IT Services',
  'Data Science',
  'Big Data',
  'IoT',
  'Network Engineering',
  'Database Administration',
  'System Administration',
  'Quality Assurance',
  'Testing',
  'UI/UX',
  'Graphic Design',
  'Animation',
  'Motion Design',
  '3D Design',

  // Kinh doanh & Bán hàng
  'E-commerce',
  'Retail',
  'Online Shopping',
  'Sales',
  'B2B',
  'B2C',
  'Business Development',
  'Account Management',
  'Customer Service',
  'Customer Support',

  // Marketing & Truyền thông
  'Digital Marketing',
  'Content',
  'Content Marketing',
  'Social Media',
  'Social Media Marketing',
  'SEO',
  'SEM',
  'Email Marketing',
  'Advertising',
  'Branding',
  'Public Relations',
  'Communications',
  'PR Agency',

  // Tài chính & Ngân hàng
  'Finance',
  'FinTech',
  'Banking',
  'Insurance',
  'Investment',
  'Accounting',
  'Auditing',
  'Tax',
  'Financial Planning',
  'Treasury',
  'Payroll',

  // Ẩm thực & Khách sạn
  'Food & Beverage',
  'Restaurant',
  'Cafe',
  'Hotel',
  'Hospitality',
  'Tourism',
  'Culinary',
  'Chef',
  'Bartending',
  'Beverage',
  'Tea',
  'Coffee',
  'Vietnamese Cuisine',
  'International Cuisine',
  'Luxury Dining',

  // Thời trang & Mỹ phẩm
  'Fashion',
  'Luxury Fashion',
  'Beauty',
  'Cosmetics',
  'Skincare',
  'Makeup',
  'Perfume',
  'Clothing',
  'Accessories',

  // Logistics & Vận tải
  'Logistics',
  'Delivery',
  'Supply Chain',
  'Warehousing',
  'Transportation',
  'Shipping',
  'Import/Export',

  // Giáo dục & Đào tạo
  'Education',
  'Training',
  'Learning',
  'E-Learning',
  'Online Education',
  'Tutoring',
  'Coaching',
  'Professional Development',
  'Certification',

  // Y tế & Wellness
  'Healthcare',
  'Hospital',
  'Medical',
  'Nursing',
  'Pharmacy',
  'Wellness',
  'Fitness',
  'Yoga',
  'Mental Health',
  'Telemedicine',

  // Bất động sản
  'Real Estate',
  'Property Management',
  'Construction',
  'Architecture',
  'Interior Design',
  'Urban Planning',

  // Nhân sự & Tuyển dụng
  'Human Resources',
  'Recruitment',
  'Staffing',
  'HR Services',
  'Talent Management',
  'Organizational Development',
  'Training & Development',

  // Dịch vụ & Khác
  'Service',
  'Consulting',
  'Management Consulting',
  'Business Consulting',
  'Legal Services',
  'Law Firm',
  'Accounting Firm',
  'Creative Agency',
  'Media Agency',
  'Event Management',
  'Venue',

  // Công nghiệp & Sản xuất
  'Manufacturing',
  'Industrial',
  'Engineering',
  'Mechanical Engineering',
  'Chemical Engineering',
  'Quality Control',
  'Production',
  'Factory',

  // Môi trường & Năng lượng
  'Energy',
  'Renewable Energy',
  'Solar Energy',
  'Wind Energy',
  'Environmental',
  'Sustainability',
  'Green Tech',

  // Truyền thông & Giải trí
  'Media',
  'Entertainment',
  'Publishing',
  'Film Production',
  'Video Production',
  'Photography',
  'Broadcasting',
  'Journalism',
  'Podcast',

  // Chung
  'Innovation',
  'Startup',
  'Scaleup',
  'Global',
  'International',
  'Remote',
  'Hybrid',
  'Traditional',
  'Luxury',
  'Budget-Friendly',
];

export function CompanyFilter({
  selectedLocations,
  onLocationsChange,
  selectedSizes,
  onSizesChange,
  selectedTags,
  onTagsChange,
  ratingFilter,
  onRatingChange,
  salaryRange,
  onSalaryRangeChange,
}: CompanyFilterProps) {
  const [expandedSections, setExpandedSections] = useState({
    location: true,
    tags: false,
    salary: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleLocation = (location: string) => {
    onLocationsChange(
      selectedLocations.includes(location)
        ? selectedLocations.filter((l) => l !== location)
        : [...selectedLocations, location]
    );
  };

  const toggleSize = (size: string) => {
    onSizesChange(
      selectedSizes.includes(size)
        ? selectedSizes.filter((s) => s !== size)
        : [...selectedSizes, size]
    );
  };





  const hasActiveFilters =
    selectedLocations.length > 0 ||
    selectedSizes.length > 0 ||
    selectedTags.length > 0 ||
    ratingFilter > 0 ||
    salaryRange[0] > 0 ||
    salaryRange[1] < 100;

  return (
    <div className="space-y-4">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <h3
          className="text-lg font-bold text-white"
          style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
        >
          Bộ Lọc
        </h3>
        {hasActiveFilters && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              onLocationsChange([]);
              onSizesChange([]);
              onTagsChange([]);
              onRatingChange(0);
              onSalaryRangeChange([0, 100]);
            }}
            className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            Xóa tất cả
          </motion.button>
        )}
      </div>

      {/* Location Filter */}
      <SearchableFilter
        title="Địa Điểm"
        options={LOCATIONS}
        selected={selectedLocations}
        onSelectionChange={onLocationsChange}
        isExpanded={expandedSections.location}
        onToggleExpand={() => toggleSection('location')}
      />



      {/* Tags Filter */}
      <SearchableFilter
        title="Các Ngành Nghề"
        options={TAGS}
        selected={selectedTags}
        onSelectionChange={onTagsChange}
        isExpanded={expandedSections.tags}
        onToggleExpand={() => toggleSection('tags')}
      />

      {/* Salary Range Filter */}
      <motion.div className="rounded-lg border border-cyan-400/20 bg-slate-800/30 overflow-hidden">
        <motion.button
          onClick={() => toggleSection('salary')}
          className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
        >
          <span
            className="font-semibold text-white"
            style={{ fontFamily: "'Poppins Medium', sans-serif" }}
          >
            Khoảng Lương (Triệu)
          </span>
          <motion.div
            animate={{ rotate: expandedSections.salary ? 0 : -90 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </motion.div>
        </motion.button>

        {expandedSections.salary && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-cyan-400/10 p-4 space-y-4"
          >
            <div>
              <label
                className="text-sm text-gray-400 mb-2 block"
                style={{ fontFamily: "'Poppins Regular', sans-serif" }}
              >
                Tối thiểu: {salaryRange[0]}M
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={salaryRange[0]}
                onChange={(e) =>
                  onSalaryRangeChange([
                    parseInt(e.target.value),
                    salaryRange[1],
                  ])
                }
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            <div>
              <label
                className="text-sm text-gray-400 mb-2 block"
                style={{ fontFamily: "'Poppins Regular', sans-serif" }}
              >
                Tối đa: {salaryRange[1]}M
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={salaryRange[1]}
                onChange={(e) =>
                  onSalaryRangeChange([
                    salaryRange[0],
                    parseInt(e.target.value),
                  ])
                }
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSalaryRangeChange([0, 100])}
              className="w-full mt-3 px-3 py-2 rounded-lg text-sm text-cyan-300 hover:bg-white/10 transition-colors"
            >
              Đặt lại
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
