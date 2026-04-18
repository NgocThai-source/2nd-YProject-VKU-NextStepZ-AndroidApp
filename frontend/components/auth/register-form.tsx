'use client';

import { Input } from '@/components/ui/input';
import { Facebook, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { API_URL } from '@/lib/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RegisterFormProps {
  onToggleForm: (form: 'login' | 'register' | 'forgot') => void;
}

// Danh sách các tỉnh thành Việt Nam
const provinces = [
  "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu",
  "Bắc Ninh", "Bến Tre", "Bình Định", "Bình Dương", "Bình Phước",
  "Bình Thuận", "Cà Mau", "Cần Thơ", "Cao Bằng", "Đà Nẵng",
  "Đắk Lắk", "Đắk Nông", "Điện Biên", "Đồng Nai", "Đồng Tháp",
  "Gia Lai", "Hà Giang", "Hà Nam", "Hà Nội", "Hà Tĩnh",
  "Hải Dương", "Hải Phòng", "Hậu Giang", "Hòa Bình", "Hưng Yên",
  "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu", "Lâm Đồng",
  "Lạng Sơn", "Lào Cai", "Long An", "Nam Định", "Nghệ An",
  "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Phú Yên", "Quảng Bình",
  "Quảng Nam", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sóc Trăng",
  "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên", "Thanh Hóa",
  "Thừa Thiên Huế", "Tiền Giang", "TP Hồ Chí Minh", "Trà Vinh", "Tuyên Quang",
  "Vĩnh Long", "Vĩnh Phúc", "Yên Bái"
];

const universitiesByProvince: { [key: string]: string[] | null } = {
  "An Giang": [
    "Đại học An Giang - Đại học Quốc gia TP.HCM",
    "Đại học Tây Đô - Phân hiệu An Giang",
    "Phân hiệu Đại học Cần Thơ tại An Giang"
  ],
  "Hà Nội": [
    "Đại học Quốc gia Hà Nội",
    "Đại học Bách khoa Hà Nội",
    "Học viện Công nghệ Bưu chính Viễn thông",
    "Đại học Kinh tế Quốc dân",
    "Đại học Ngoại thương",
    "Đại học Thương mại",
    "Học viện Ngân hàng",
    "Đại học Y Hà Nội",
    "Đại học Dược Hà Nội",
    "Đại học Xây dựng",
    "Đại học Giao thông vận tải",
    "Đại học Công nghiệp Hà Nội",
    "Đại học Mỏ - Địa chất",
    "Đại học Thủy lợi",
    "Học viện Kỹ thuật Quân sự",
    "Đại học FPT Hà Nội",
    "Đại học RMIT Hà Nội",
    "Đại học Công nghệ - ĐHQGHN",
    "Đại học Sư phạm Hà Nội",
    "Đại học Khoa học Tự nhiên - ĐHQGHN",
    "Đại học Khoa học Xã hội và Nhân văn - ĐHQGHN",
    "Đại học Kinh tế - ĐHQGHN",
    "Đại học Giáo dục - ĐHQGHN",
    "Đại học Ngoại ngữ - ĐHQGHN",
    "Đại học Luật Hà Nội",
    "Học viện Báo chí và Tuyên truyền",
    "Học viện Tài chính",
    "Học viện Nông nghiệp Việt Nam",
    "Đại học Lao động Xã hội",
    "Đại học Văn hóa Hà Nội",
    "Đại học Mỹ thuật Việt Nam",
    "Đại học Mỹ thuật Công nghiệp",
    "Đại học Sân khấu Điện ảnh Hà Nội",
    "Đại học Âm nhạc Quốc gia Việt Nam",
    "Đại học Kiến trúc Hà Nội",
    "Đại học Công đoàn",
    "Học viện Quản lý Giáo dục",
    "Đại học Thuỷ sản",
    "Đại học Phenikaa",
    "Đại học Thăng Long"
  ],
  "TP Hồ Chí Minh": [
    "Đại học Quốc gia TP.HCM",
    "Đại học Bách khoa - ĐHQG TP.HCM",
    "Đại học Khoa học Tự nhiên - ĐHQG TP.HCM",
    "Đại học Khoa học Xã hội và Nhân văn - ĐHQG TP.HCM",
    "Đại học Quốc tế - ĐHQG TP.HCM",
    "Đại học Công nghệ Thông tin - ĐHQG TP.HCM",
    "Đại học Kinh tế - Luật - ĐHQG TP.HCM",
    "Đại học Kinh tế TP.HCM",
    "Đại học Sư phạm Kỹ thuật TP.HCM",
    "Đại học Y Dược TP.HCM",
    "Đại học Tôn Đức Thắng",
    "Đại học Ngoại thương CS2",
    "Đại học FPT TP.HCM",
    "Đại học RMIT TP.HCM",
    "Đại học Hoa Sen",
    "Đại học Văn Lang",
    "Đại học Công nghiệp TP.HCM",
    "Đại học Ngân hàng TP.HCM",
    "Đại học Sài Gòn",
    "Đại học Mở TP.HCM",
    "Đại học Sư phạm TP.HCM",
    "Đại học Y khoa Phạm Ngọc Thạch",
    "Đại học Kiến trúc TP.HCM",
    "Đại học Nông Lâm TP.HCM",
    "Đại học Giao thông Vận tải TP.HCM",
    "Đại học Công nghiệp Thực phẩm TP.HCM",
    "Đại học Tài nguyên và Môi trường TP.HCM",
    "Đại học Nguyễn Tất Thành",
    "Đại học Công nghệ TP.HCM (HUTECH)",
    "Đại học Gia Định",
    "Đại học Hồng Bàng",
    "Đại học Quốc tế Hồng Bàng",
    "Đại học Văn Hiến",
    "Đại học Công nghệ - Thông tin Sài Gòn"
  ],
  "Đà Nẵng": [
    "Đại học Đà Nẵng",
    "Đại học Bách khoa - Đại học Đà Nẵng",
    "Đại học Kinh tế - Đại học Đà Nẵng",
    "Đại học Sư phạm - Đại học Đà Nẵng",
    "Đại học Ngoại ngữ - Đại học Đà Nẵng",
    "Đại học FPT Đà Nẵng",
    "Đại học Duy Tân",
    "Đại học Kiến trúc Đà Nẵng",
    "Đại học Công nghệ Thông tin và Truyền thông Việt - Hàn"
  ],
  "Cần Thơ": [
    "Đại học Cần Thơ",
    "Đại học Y Dược Cần Thơ",
    "Đại học Nam Cần Thơ",
    "Đại học Tây Đô",
    "Đại học FPT Cần Thơ",
    "Đại học Kỹ thuật - Công nghệ Cần Thơ"
  ],
  "Thái Nguyên": [
    "Đại học Thái Nguyên",
    "Đại học Kinh tế và Quản trị kinh doanh - ĐH Thái Nguyên",
    "Đại học Sư phạm - ĐH Thái Nguyên",
    "Đại học Nông Lâm - ĐH Thái Nguyên",
    "Đại học Y Dược - ĐH Thái Nguyên",
    "Đại học Công nghệ thông tin và Truyền thông - ĐH Thái Nguyên"
  ],
  "Thừa Thiên Huế": [
    "Đại học Huế",
    "Đại học Y Dược - Đại học Huế",
    "Đại học Khoa học - Đại học Huế",
    "Đại học Sư phạm - Đại học Huế",
    "Đại học Kinh tế - Đại học Huế",
    "Đại học Nông Lâm - Đại học Huế",
    "Đại học Nghệ thuật - Đại học Huế",
    "Đại học Luật - Đại học Huế",
    "Đại học Ngoại ngữ - Đại học Huế",
    "Phân hiệu Đại học Huế tại Quảng Trị"
  ],
  "Hải Phòng": [
    "Đại học Hàng hải Việt Nam",
    "Đại học Y Dược Hải Phòng",
    "Đại học Hải Phòng",
    "Đại học Dân lập Hải Phòng"
  ],
  "Nghệ An": [
    "Đại học Vinh",
    "Đại học Y khoa Vinh",
    "Đại học Kinh tế Nghệ An"
  ],
  "Thái Bình": [
    "Đại học Thái Bình",
    "Đại học Y Dược Thái Bình"
  ],
  "Thanh Hóa": [
    "Đại học Hồng Đức",
    "Đại học Văn hóa, Thể thao và Du lịch Thanh Hóa"
  ],
  "Bình Dương": [
    "Đại học Thủ Dầu Một",
    "Đại học Bình Dương",
    "Đại học Việt - Đức (VGU)",
    "Đại học Quốc tế Miền Đông"
  ],
  "Đồng Nai": [
    "Đại học Đồng Nai",
    "Đại học Công nghệ Đồng Nai",
    "Đại học Lạc Hồng",
    "Đại học Công nghệ Miền Đông"
  ],
  "Khánh Hòa": [
    "Đại học Nha Trang",
    "Đại học Khánh Hòa",
    "Đại học Thái Bình Dương"
  ],
  "Lâm Đồng": [
    "Đại học Đà Lạt",
    "Đại học Kiến trúc Đà Lạt",
    "Đại học Duy Tân - Phân hiệu Đà Lạt"
  ],
  "Bắc Ninh": [
    "Đại học Kinh Bắc",
    "Đại học Quốc tế - ĐH Quốc gia Hà Nội"
  ],
  "Quảng Nam": [
    "Đại học Quảng Nam",
    "Đại học Phan Châu Trinh"
  ],
  "Đắk Lắk": [
    "Đại học Tây Nguyên",
    "Đại học Buôn Ma Thuột"
  ],
  "Nam Định": [
    "Đại học Điều dưỡng Nam Định"
  ],
  "Phú Yên": [
    "Đại học Phú Yên"
  ],
  "Hà Nam": [
    "Đại học Công nghiệp Hà Nam",
    "Phân hiệu Đại học Công nghiệp Hà Nội tại Hà Nam"
  ],
  "Bình Định": [
    "Đại học Quy Nhơn",
    "Đại học Quang Trung"
  ],
  "Bà Rịa - Vũng Tàu": [
    "Đại học Bà Rịa - Vũng Tàu",
    "Phân hiệu Đại học Dầu khí Việt Nam"
  ],
  "Vĩnh Long": [
    "Đại học Xây dựng Miền Tây",
    "Đại học Sư phạm Kỹ thuật Vĩnh Long"
  ],
  "Kiên Giang": [
    "Đại học Kiên Giang",
    "Phân hiệu Đại học Nha Trang tại Kiên Giang"
  ],
  "Trà Vinh": [
    "Đại học Trà Vinh"
  ],
  "Phú Thọ": [
    "Đại học Hùng Vương",
    "Đại học Công nghiệp Việt Trì"
  ],
  "Quảng Ninh": [
    "Đại học Hạ Long",
    "Đại học Công nghiệp Quảng Ninh"
  ],
  "Hưng Yên": [
    "Đại học Sư phạm Kỹ thuật Hưng Yên",
    "Đại học Y tế Công cộng cơ sở Hưng Yên",
    "Đại học Thủy lợi - Cơ sở 2"
  ],
  "Bến Tre": [
    "Phân hiệu Đại học Quốc gia TP.HCM tại Bến Tre"
  ],
  "Ninh Thuận": [
    "Phân hiệu Đại học Nông Lâm TP.HCM tại Ninh Thuận"
  ],
  "Gia Lai": [
    "Đại học Công nghệ Gia Lai",
    "Phân hiệu Đại học Nông Lâm TP.HCM tại Gia Lai"
  ],
  "Sóc Trăng": [
    "Đại học Sóc Trăng"
  ],
  "Hà Tĩnh": [
    "Đại học Hà Tĩnh"
  ],
  "Quảng Bình": [
    "Đại học Quảng Bình"
  ],
  "Quảng Trị": [
    "Đại học Quảng Trị"
  ],
  "Bắc Giang": [
    "Đại học Nông - Lâm Bắc Giang"
  ],
  "Lào Cai": [
    "Phân hiệu Đại học Thái Nguyên tại Lào Cai"
  ],
  "Tây Ninh": [
    "Đại học Tây Ninh"
  ],
  "Vĩnh Phúc": [
    "Đại học Công nghệ GTVT",
    "Đại học Sư phạm Hà Nội 2",
    "Đại học Trưng Vương"
  ],
  "Cà Mau": [
    "Đại học Nam Cần Thơ - Phân hiệu Cà Mau",
    "Phân hiệu Đại học Bách Khoa TP.HCM tại Cà Mau"
  ],
  "Long An": [
    "Đại học Kinh tế Công nghiệp Long An",
    "Phân hiệu Đại học Tân Tạo"
  ],
  "Bình Phước": [
    "Phân hiệu Đại học Công nghiệp TP.HCM tại Bình Phước",
    "Phân hiệu Đại học Bình Dương tại Bình Phước"
  ],
  "Bạc Liêu": [
    "Phân hiệu Đại học Y Dược Cần Thơ tại Bạc Liêu"
  ],
  "Đồng Tháp": [
    "Đại học Đồng Tháp",
    "Phân hiệu Đại học Sư phạm TP.HCM tại Đồng Tháp"
  ],
  "Tiền Giang": [
    "Đại học Tiền Giang"
  ]
};

export function RegisterForm({ onToggleForm }: RegisterFormProps) {
  const [role, setRole] = useState<'user' | 'employer' | null>(null);
  const [age, setAge] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  // Common fields
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Student fields
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedSchool, setSelectedSchool] = useState<string>('');
  const [major, setMajor] = useState('');

  // Employer fields
  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
  const [address, setAddress] = useState('');
  const [taxId, setTaxId] = useState('');

  // Real-time validation using useMemo
  const fieldErrors = useMemo(() => {
    const errors: { [key: string]: string } = {};

    // Full Name validation (for Student role)
    if (fullName) {
      const trimmedName = fullName.trim();
      if (trimmedName.length < 2) {
        errors.fullName = 'Họ và tên phải có ít nhất 2 ký tự';
      } else if (!/^[\p{L}\s]+$/u.test(trimmedName)) {
        errors.fullName = 'Họ và tên chỉ được chứa chữ cái và khoảng trắng';
      } else if (trimmedName.split(/\s+/).length < 2) {
        errors.fullName = 'Vui lòng nhập đầy đủ họ và tên';
      }
    }

    // Company Name validation (for Employer role)
    if (companyName) {
      const trimmedCompany = companyName.trim();
      if (trimmedCompany.length < 2) {
        errors.companyName = 'Tên công ty phải có ít nhất 2 ký tự';
      } else if (!/^[\p{L}\s]+$/u.test(trimmedCompany)) {
        errors.companyName = 'Tên công ty chỉ được chứa chữ cái và khoảng trắng';
      } else if (trimmedCompany.split(/\s+/).length < 2) {
        errors.companyName = 'Vui lòng nhập đầy đủ tên công ty';
      }
    }

    // Email validation
    if (email && !email.includes('@')) {
      errors.email = 'Email không đúng định dạng';
    }

    // Phone validation
    if (phone) {
      const phoneDigitsOnly = phone.replace(/\D/g, '');
      if (phoneDigitsOnly.length !== 10) {
        errors.phone = `Số điện thoại không đúng định dạng`;
      }
    }

    // Password validation
    if (password && password.length < 6) {
      errors.password = `Mật khẩu phải có ít nhất 6 ký tự (hiện có ${password.length})`;
    }

    // Confirm password validation
    if (confirmPassword && password && password !== confirmPassword) {
      errors.confirmPassword = 'Mật khẩu không khớp';
    }

    // Age validation
    if (age !== null) {
      if (age < 18) {
        errors.age = 'Số tuổi phải từ 18 tuổi trở lên';
      } else if (age > 100) {
        errors.age = 'Số tuổi vô lý, vui lòng kiểm tra lại năm sinh';
      }
    }

    return errors;
  }, [email, phone, password, confirmPassword, age, fullName, companyName]);


  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    setAge(age);
    setBirthDate(birthDate);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Common validation
    if (!email || !phone || !password || !confirmPassword) {
      setError('Vui lòng điền tất cả các trường bắt buộc');
      setIsLoading(false);
      return;
    }

    // Email validation - must contain @
    if (!email.includes('@')) {
      setError('Email phải đúng định dạng');
      setIsLoading(false);
      return;
    }

    // Phone validation - must be exactly 10 digits
    const phoneDigitsOnly = phone.replace(/\D/g, '');
    if (phoneDigitsOnly.length !== 10) {
      setError('Số điện thoại phải đúng định dạng');
      setIsLoading(false);
      return;
    }

    // Password validation
    if (password !== confirmPassword) {
      setError('Mật khẩu không khớp');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      setIsLoading(false);
      return;
    }

    // Role-specific validation
    if (role === 'user') {
      if (!fullName || !birthDate || !selectedProvince) {
        setError('Vui lòng điền đầy đủ thông tin sinh viên (trừ ngành học)');
        setIsLoading(false);
        return;
      }

      // Full Name validation
      const trimmedName = fullName.trim();
      if (trimmedName.length < 2) {
        setError('Họ và tên phải có ít nhất 2 ký tự');
        setIsLoading(false);
        return;
      }
      if (!/^[\p{L}\s]+$/u.test(trimmedName)) {
        setError('Họ và tên chỉ được chứa chữ cái và khoảng trắng');
        setIsLoading(false);
        return;
      }
      if (trimmedName.split(/\s+/).length < 2) {
        setError('Vui lòng nhập đầy đủ họ và tên');
        setIsLoading(false);
        return;
      }

      // Age validation - must be between 18 and 100
      if (age === null || age < 18 || age > 100) {
        setError('Tuổi phải từ 18 đến 100 tuổi');
        setIsLoading(false);
        return;
      }

      // School validation - only required if there are universities in the province
      if (universitiesByProvince[selectedProvince] && !selectedSchool) {
        setError('Vui lòng chọn trường đại học');
        setIsLoading(false);
        return;
      }
    }

    if (role === 'employer') {
      if (!companyName || !address) {
        setError('Vui lòng điền đầy đủ thông tin công ty (bắt buộc: tên công ty, địa chỉ)');
        setIsLoading(false);
        return;
      }

      // Company Name validation
      const trimmedCompany = companyName.trim();
      if (trimmedCompany.length < 2) {
        setError('Tên công ty phải có ít nhất 2 ký tự');
        setIsLoading(false);
        return;
      }
      if (trimmedCompany.length > 200) {
        setError('Tên công ty không được quá 200 ký tự');
        setIsLoading(false);
        return;
      }
    }

    try {
      // Prepare registration data
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const registerData: Record<string, any> = {
        email,
        phone: phoneDigitsOnly,
        password,
        role: role === 'user' ? 'user' : 'employer',
      };

      if (role === 'user') {
        const nameParts = fullName.trim().split(' ');
        registerData.firstName = nameParts[0] || '';
        registerData.lastName = nameParts.slice(1).join(' ') || '';
        registerData.birthDate = birthDate;
        registerData.province = selectedProvince;
        registerData.school = selectedSchool || null;
        registerData.major = major || null;
      } else {
        const companyNameParts = companyName.trim().split(' ');
        registerData.firstName = companyNameParts[0] || '';
        registerData.lastName = companyNameParts.slice(1).join(' ') || '';
        registerData.companyName = companyName;
        registerData.website = website || null;
        registerData.address = address;
        registerData.taxId = taxId || null;
      }

      // Call register API
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Đăng ký thất bại');
        setIsLoading(false);
        return;
      }

      setSuccess('Đăng ký thành công! Vui lòng đăng nhập...');

      // Redirect to login after 1.5 seconds
      setTimeout(() => {
        onToggleForm('login');
      }, 1500);
    } catch (err) {
      setError('Có lỗi xảy ra. Vui lòng thử lại.');
      console.error('Register error:', err);
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div className="space-y-2" variants={itemVariants}>
        <h1
          className="text-xl sm:text-3xl font-black bg-linear-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent"
          style={{ fontFamily: "'Exo 2 ExtraBold', sans-serif" }}
        >
          Tạo tài khoản
        </h1>
        <p
          className="text-gray-400 text-xs sm:text-sm leading-relaxed"
          style={{ fontFamily: "'Poppins Regular', sans-serif" }}
        >
          Nhập thông tin để bắt đầu hành trình của bạn
        </p>
      </motion.div>

      {/* Role Selection */}
      <motion.div className="space-y-4" variants={itemVariants}>
        <label
          className="text-sm font-semibold text-gray-300"
          style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
        >
          Bạn là
        </label>
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {[
            { value: 'user', label: 'Sinh viên', icon: '🎓' },
            { value: 'employer', label: 'Nhà tuyển dụng', icon: '🏢' },
          ].map((option) => (
            <motion.button
              key={option.value}
              onClick={() => setRole(option.value as 'user' | 'employer')}
              className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 font-semibold whitespace-nowrap text-xs sm:text-sm ${role === option.value
                ? 'border-cyan-400 bg-cyan-500/10 text-cyan-300'
                : 'border-cyan-400/30 bg-white/5 text-gray-300 hover:border-cyan-400/50'
                }`}
              style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-lg">{option.icon}</span>
              {option.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontFamily: "'Poppins Regular', sans-serif" }}
        >
          {error}
        </motion.div>
      )}

      {/* Success Message */}
      {success && (
        <motion.div
          className="p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontFamily: "'Poppins Regular', sans-serif" }}
        >
          {success}
        </motion.div>
      )}

      {/* Conditional Fields based on Role */}
      <motion.div className="space-y-4" variants={itemVariants}>
        {role === 'user' && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Full Name */}
            <div className="space-y-2">
              <label
                className="text-sm font-semibold text-gray-300"
                style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
              >
                Họ và tên
              </label>
              <Input
                type="text"
                placeholder="Nguyễn Văn A"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isLoading}
                className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder:text-gray-500 transition-all duration-300 focus:bg-white/10 focus:shadow-lg focus:shadow-cyan-500/20 disabled:opacity-50 ${fieldErrors.fullName
                  ? 'border-red-500/50 focus:border-red-500'
                  : 'border-cyan-400/30 focus:border-cyan-400'
                  }`}
                style={{ fontFamily: "'Poppins Regular', sans-serif" }}
              />
              {fieldErrors.fullName && (
                <motion.div
                  className="flex items-center gap-2 text-sm text-red-400"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {fieldErrors.fullName}
                </motion.div>
              )}
            </div>

            {/* Birth Date */}
            <div className="space-y-2">
              <label
                className="text-sm font-semibold text-gray-300"
                style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
              >
                Ngày sinh (Tháng / Ngày / Năm)
              </label>
              <Input
                type="date"
                onChange={(e) => calculateAge(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-cyan-400/30 rounded-xl text-white transition-all duration-300 focus:border-cyan-400 focus:bg-white/10 focus:shadow-lg focus:shadow-cyan-500/20"
              />
            </div>

            {/* Age Display */}
            {age !== null && (
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <label
                  className="text-sm font-semibold text-gray-300"
                  style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                >
                  Tuổi
                </label>
                <div className={`px-4 py-3 border rounded-xl font-semibold transition-all ${fieldErrors.age
                  ? 'bg-red-500/10 border-red-500/40 text-red-300'
                  : 'bg-cyan-500/10 border-cyan-400/40 text-cyan-300'
                  }`}>
                  {age} tuổi
                </div>
                {fieldErrors.age && (
                  <motion.div
                    className="flex items-center gap-2 text-sm text-red-400"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {fieldErrors.age}
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label
                className="text-sm font-semibold text-gray-300"
                style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
              >
                Email
              </label>
              <Input
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder:text-gray-500 transition-all duration-300 focus:bg-white/10 focus:shadow-lg focus:shadow-cyan-500/20 disabled:opacity-50 ${fieldErrors.email
                  ? 'border-red-500/50 focus:border-red-500'
                  : 'border-cyan-400/30 focus:border-cyan-400'
                  }`}
                style={{ fontFamily: "'Poppins Regular', sans-serif" }}
              />
              {fieldErrors.email && (
                <motion.div
                  className="flex items-center gap-2 text-sm text-red-400"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {fieldErrors.email}
                </motion.div>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label
                className="text-sm font-semibold text-gray-300"
                style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
              >
                Số điện thoại
              </label>
              <Input
                type="tel"
                placeholder="0xxx xxx xxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isLoading}
                className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder:text-gray-500 transition-all duration-300 focus:bg-white/10 focus:shadow-lg focus:shadow-cyan-500/20 disabled:opacity-50 ${fieldErrors.phone
                  ? 'border-red-500/50 focus:border-red-500'
                  : 'border-cyan-400/30 focus:border-cyan-400'
                  }`}
                style={{ fontFamily: "'Poppins Regular', sans-serif" }}
              />
              {fieldErrors.phone && (
                <motion.div
                  className="flex items-center gap-2 text-sm text-red-400"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {fieldErrors.phone}
                </motion.div>
              )}
            </div>

            {/* Province Select */}
            <div className="space-y-2">
              <label
                className="text-sm font-semibold text-gray-300"
                style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
              >
                Quê quán
              </label>
              <Select onValueChange={(value) => {
                setSelectedProvince(value);
                setSelectedSchool('');
              }}>
                <SelectTrigger className="w-full px-4 py-3 bg-cyan-400/20 border border-cyan-400 rounded-xl text-white placeholder:text-gray-300 transition-all duration-300 focus:border-cyan-300 focus:bg-cyan-400/30 focus:shadow-lg focus:shadow-cyan-500/30 hover:bg-cyan-400/25">
                  <SelectValue placeholder="Chọn tỉnh/thành phố" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border border-cyan-400 text-white max-h-[280px] overflow-y-auto"
                  style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'rgba(34, 211, 238, 0.5) rgba(15, 23, 42, 0.3)',
                  }}
                >
                  <style>{`
                    .scroll-custom::-webkit-scrollbar {
                      width: 6px;
                    }
                    .scroll-custom::-webkit-scrollbar-track {
                      background: rgba(15, 23, 42, 0.3);
                      border-radius: 10px;
                    }
                    .scroll-custom::-webkit-scrollbar-thumb {
                      background: rgba(34, 211, 238, 0.5);
                      border-radius: 10px;
                    }
                    .scroll-custom::-webkit-scrollbar-thumb:hover {
                      background: rgba(34, 211, 238, 0.8);
                    }
                  `}</style>
                  <div className="scroll-custom">
                    {provinces.map((province) => (
                      <SelectItem key={province} value={province} className="hover:bg-cyan-500/20 focus:bg-cyan-500/30 bg-slate-900 text-white focus:text-cyan-100 hover:text-cyan-100">
                        {province}
                      </SelectItem>
                    ))}
                  </div>
                </SelectContent>
              </Select>
            </div>

            {/* University Select */}
            {selectedProvince && (
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <label
                  className="text-sm font-semibold text-gray-300"
                  style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                >
                  Trường đại học
                </label>
                {universitiesByProvince[selectedProvince] ? (
                  <Select value={selectedSchool} onValueChange={setSelectedSchool}>
                    <SelectTrigger className="w-full px-4 py-3 bg-cyan-400/20 border border-cyan-400 rounded-xl text-white placeholder:text-gray-300 transition-all duration-300 focus:border-cyan-300 focus:bg-cyan-400/30 focus:shadow-lg focus:shadow-cyan-500/30 hover:bg-cyan-400/25">
                      <SelectValue placeholder="Chọn trường" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border border-cyan-400 text-white max-h-[280px] overflow-y-auto"
                      style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: 'rgba(34, 211, 238, 0.5) rgba(15, 23, 42, 0.3)',
                      }}
                    >
                      <style>{`
                        .scroll-custom::-webkit-scrollbar {
                          width: 6px;
                        }
                        .scroll-custom::-webkit-scrollbar-track {
                          background: rgba(15, 23, 42, 0.3);
                          border-radius: 10px;
                        }
                        .scroll-custom::-webkit-scrollbar-thumb {
                          background: rgba(34, 211, 238, 0.5);
                          border-radius: 10px;
                        }
                        .scroll-custom::-webkit-scrollbar-thumb:hover {
                          background: rgba(34, 211, 238, 0.8);
                        }
                      `}</style>
                      <div className="scroll-custom">
                        {universitiesByProvince[selectedProvince]?.map((university) => (
                          <SelectItem key={university} value={university} className="hover:bg-cyan-500/20 focus:bg-cyan-500/30 bg-slate-900 text-white focus:text-cyan-100 hover:text-cyan-100">
                            {university}
                          </SelectItem>
                        ))}
                      </div>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="px-4 py-3 bg-yellow-500/10 border border-yellow-400/30 rounded-xl text-yellow-300 text-sm">
                    Không có trường đại học ở tỉnh này
                  </div>
                )}
              </motion.div>
            )}

            {/* Major */}
            <div className="space-y-2">
              <label
                className="text-sm font-semibold text-gray-300"
                style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
              >
                Ngành học
              </label>
              <Input
                type="text"
                placeholder="VD: Công nghệ thông tin"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-white/5 border border-cyan-400/30 rounded-xl text-white placeholder:text-gray-500 transition-all duration-300 focus:border-cyan-400 focus:bg-white/10 focus:shadow-lg focus:shadow-cyan-500/20 disabled:opacity-50"
                style={{ fontFamily: "'Poppins Regular', sans-serif" }}
              />
            </div>
          </motion.div>
        )}

        {role === 'employer' && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Company Name */}
            <div className="space-y-2">
              <label
                className="text-sm font-semibold text-gray-300"
                style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
              >
                Tên công ty
              </label>
              <Input
                type="text"
                placeholder="Tên công ty"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                disabled={isLoading}
                className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder:text-gray-500 transition-all duration-300 focus:bg-white/10 focus:shadow-lg focus:shadow-cyan-500/20 disabled:opacity-50 ${fieldErrors.companyName
                  ? 'border-red-500/50 focus:border-red-500'
                  : 'border-cyan-400/30 focus:border-cyan-400'
                  }`}
                style={{ fontFamily: "'Poppins Regular', sans-serif" }}
              />
              {fieldErrors.companyName && (
                <motion.div
                  className="flex items-center gap-2 text-sm text-red-400"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {fieldErrors.companyName}
                </motion.div>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label
                className="text-sm font-semibold text-gray-300"
                style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
              >
                Email doanh nghiệp
              </label>
              <Input
                type="email"
                placeholder="info@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder:text-gray-500 transition-all duration-300 focus:bg-white/10 focus:shadow-lg focus:shadow-cyan-500/20 disabled:opacity-50 ${fieldErrors.email
                  ? 'border-red-500/50 focus:border-red-500'
                  : 'border-cyan-400/30 focus:border-cyan-400'
                  }`}
                style={{ fontFamily: "'Poppins Regular', sans-serif" }}
              />
              {fieldErrors.email && (
                <motion.div
                  className="flex items-center gap-2 text-sm text-red-400"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {fieldErrors.email}
                </motion.div>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label
                className="text-sm font-semibold text-gray-300"
                style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
              >
                Số điện thoại liên hệ
              </label>
              <Input
                type="tel"
                placeholder="0xxx xxx xxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isLoading}
                className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder:text-gray-500 transition-all duration-300 focus:bg-white/10 focus:shadow-lg focus:shadow-cyan-500/20 disabled:opacity-50 ${fieldErrors.phone
                  ? 'border-red-500/50 focus:border-red-500'
                  : 'border-cyan-400/30 focus:border-cyan-400'
                  }`}
                style={{ fontFamily: "'Poppins Regular', sans-serif" }}
              />
              {fieldErrors.phone && (
                <motion.div
                  className="flex items-center gap-2 text-sm text-red-400"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {fieldErrors.phone}
                </motion.div>
              )}
            </div>

            {/* Website */}
            <div className="space-y-2">
              <label
                className="text-sm font-semibold text-gray-300"
                style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
              >
                Website (nếu có)
              </label>
              <Input
                type="url"
                placeholder="https://example.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-white/5 border border-cyan-400/30 rounded-xl text-white placeholder:text-gray-500 transition-all duration-300 focus:border-cyan-400 focus:bg-white/10 focus:shadow-lg focus:shadow-cyan-500/20 disabled:opacity-50"
                style={{ fontFamily: "'Poppins Regular', sans-serif" }}
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label
                className="text-sm font-semibold text-gray-300"
                style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
              >
                Địa chỉ
              </label>
              <Input
                type="text"
                placeholder="Địa chỉ công ty"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-white/5 border border-cyan-400/30 rounded-xl text-white placeholder:text-gray-500 transition-all duration-300 focus:border-cyan-400 focus:bg-white/10 focus:shadow-lg focus:shadow-cyan-500/20 disabled:opacity-50"
                style={{ fontFamily: "'Poppins Regular', sans-serif" }}
              />
            </div>

            {/* Tax ID */}
            <div className="space-y-2">
              <label
                className="text-sm font-semibold text-gray-300"
                style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
              >
                Mã số thuế
              </label>
              <Input
                type="text"
                placeholder="Mã số thuế / Giấy phép kinh doanh"
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-white/5 border border-cyan-400/30 rounded-xl text-white placeholder:text-gray-500 transition-all duration-300 focus:border-cyan-400 focus:bg-white/10 focus:shadow-lg focus:shadow-cyan-500/20 disabled:opacity-50"
                style={{ fontFamily: "'Poppins Regular', sans-serif" }}
              />
            </div>
          </motion.div>
        )}

        {/* Password Section - Show for both roles */}
        {role && (
          <motion.div
            className="space-y-4 pt-2 border-t border-cyan-400/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {/* Password */}
            <div className="space-y-2">
              <label
                className="text-sm font-semibold text-gray-300"
                style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
              >
                Mật khẩu
              </label>
              <div className="relative group">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder:text-gray-500 pr-12 transition-all duration-300 focus:bg-white/10 focus:shadow-lg focus:shadow-cyan-500/20 disabled:opacity-50 ${fieldErrors.password
                    ? 'border-red-500/50 focus:border-red-500'
                    : 'border-cyan-400/30 focus:border-cyan-400'
                    }`}
                  style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                />
                <motion.button
                  type="button"
                  onMouseDown={() => setShowPassword(true)}
                  onMouseUp={() => setShowPassword(false)}
                  onMouseLeave={() => setShowPassword(false)}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-300 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </motion.button>
              </div>
              {fieldErrors.password && (
                <motion.div
                  className="flex items-center gap-2 text-sm text-red-400"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {fieldErrors.password}
                </motion.div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label
                className="text-sm font-semibold text-gray-300"
                style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
              >
                Xác nhận mật khẩu
              </label>
              <div className="relative group">
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder:text-gray-500 pr-12 transition-all duration-300 focus:bg-white/10 focus:shadow-lg focus:shadow-cyan-500/20 disabled:opacity-50 ${fieldErrors.confirmPassword
                    ? 'border-red-500/50 focus:border-red-500'
                    : 'border-cyan-400/30 focus:border-cyan-400'
                    }`}
                  style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                />
                <motion.button
                  type="button"
                  onMouseDown={() => setShowConfirmPassword(true)}
                  onMouseUp={() => setShowConfirmPassword(false)}
                  onMouseLeave={() => setShowConfirmPassword(false)}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-300 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </motion.button>
              </div>
              {fieldErrors.confirmPassword && (
                <motion.div
                  className="flex items-center gap-2 text-sm text-red-400"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {fieldErrors.confirmPassword}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Register Button */}
      {role && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <motion.button
            onClick={handleRegister}
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold transition-all duration-300 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
            whileHover={{ scale: isLoading ? 1 : 1.02, y: isLoading ? 0 : -2 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
          >
            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent opacity-0"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <span className="relative">{isLoading ? 'Đang tạo tài khoản...' : 'Tạo Tài Khoản'}</span>
          </motion.button>
        </motion.div>
      )}

      {/* Divider */}
      {role && (
        <motion.div
          className="relative my-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.35 }}
        >
          <div className="absolute inset-0 flex items-center">
            <motion.div className="w-full border-t border-cyan-400/20" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-3 text-sm text-gray-400" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
              Hoặc đăng ký với
            </span>
          </div>
        </motion.div>
      )}

      {/* Social Buttons */}
      {role && (
        <motion.div
          className="grid grid-cols-2 gap-2 sm:gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <motion.button
            className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-cyan-400/20 hover:border-cyan-400/50 rounded-xl text-gray-300 hover:text-cyan-300 transition-all duration-300 group"
            style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
            whileHover={{
              scale: 1.05,
              y: -2,
              backgroundColor: 'rgba(34, 211, 238, 0.1)',
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Facebook className="w-5 h-5" />
            <span className="text-sm font-semibold">Facebook</span>
          </motion.button>
          <motion.button
            className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-cyan-400/20 hover:border-cyan-400/50 rounded-xl text-gray-300 hover:text-cyan-300 transition-all duration-300 group"
            style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
            whileHover={{
              scale: 1.05,
              y: -2,
              backgroundColor: 'rgba(34, 211, 238, 0.1)',
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Mail className="w-5 h-5" />
            <span className="text-sm font-semibold">Google</span>
          </motion.button>
        </motion.div>
      )}

      {/* Toggle to Login */}
      <motion.div
        className="text-center pt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <p className="text-gray-400 text-sm" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
          Bạn đã có tài khoản?{' '}
          <motion.button
            onClick={() => onToggleForm('login')}
            className="text-cyan-300 font-bold hover:text-cyan-200 transition-colors"
            style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Đăng nhập
          </motion.button>
        </p>
      </motion.div>
    </motion.div>
  );
}