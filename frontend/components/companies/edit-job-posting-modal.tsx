'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, AlertCircle, Save, Loader2 } from 'lucide-react';
import { useState, useMemo, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { VIETNAM_CITIES } from '@/lib/vietnam-cities';
import { updateJobPosting } from '@/lib/job-posting-api';
import type { JobPosting } from '@/components/companies/job-posting.types';
import { useToast } from '@/components/ui/toast';

interface JobPosition {
    title: string;
    minSalary: number;
    maxSalary: number;
}

interface CompanyHistory {
    year: string;
    milestone: string;
}

interface ValidationErrors {
    companyName?: string;
    phone?: string;
    email?: string;
    website?: string;
    city?: string;
    detailAddress?: string;
    jobPositions?: string[];
    workingHours?: string;
}

interface EditJobPostingModalProps {
    isOpen: boolean;
    onClose: () => void;
    posting: JobPosting | null;
    onSuccess: (updatedPosting: JobPosting) => void;
}

export function EditJobPostingModal({
    isOpen,
    onClose,
    posting,
    onSuccess,
}: EditJobPostingModalProps) {
    const { addToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state - same as CreateJobPostingModal
    const [companyName, setCompanyName] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [tagSearchQuery, setTagSearchQuery] = useState('');
    const [activeTagCategory, setActiveTagCategory] = useState<string>('all');
    const [description, setDescription] = useState('');
    const [mission, setMission] = useState('');
    const [vision, setVision] = useState('');
    const [companyHistory, setCompanyHistory] = useState<CompanyHistory[]>([
        { year: new Date().getFullYear().toString(), milestone: '' }
    ]);

    // Address fields
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [detailAddress, setDetailAddress] = useState('');

    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [website, setWebsite] = useState('');
    const [jobPositions, setJobPositions] = useState<JobPosition[]>([
        { title: '', minSalary: 0, maxSalary: 0 }
    ]);
    const [workingStartTime, setWorkingStartTime] = useState('09:00');
    const [workingEndTime, setWorkingEndTime] = useState('18:00');
    const [offDays, setOffDays] = useState(2);
    const [vacationDays, setVacationDays] = useState(12);
    const [insurances, setInsurances] = useState<string[]>(['']);
    const [salaryBenefits, setSalaryBenefits] = useState<string[]>(['']);
    const [allowances, setAllowances] = useState<string[]>(['']);
    const [benefits, setBenefits] = useState<string[]>(['']);
    const [galleryImages, setGalleryImages] = useState<string[]>([]);
    const [imageUploadError, setImageUploadError] = useState<string | null>(null);

    // Image upload constants
    const MAX_IMAGE_SIZE_MB = 5;
    const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
    const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];

    // Validation state
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [showErrors, setShowErrors] = useState(false);

    // Refs for scrolling
    const formContainerRef = useRef<HTMLDivElement>(null);

    // Pre-fill form when posting changes
    useEffect(() => {
        if (posting) {
            setCompanyName(posting.companyName || '');
            setSelectedTags(posting.tags || []);
            setDescription(posting.description || '');
            setMission(posting.mission || '');
            setVision(posting.vision || '');
            setCompanyHistory(posting.companyHistory || [{ year: new Date().getFullYear().toString(), milestone: '' }]);

            // Parse address into city, district, detail
            if (posting.address) {
                const parts = posting.address.split(', ');
                if (parts.length >= 3) {
                    setDetailAddress(parts.slice(0, -2).join(', '));
                    setSelectedDistrict(parts[parts.length - 2] || '');
                    setSelectedCity(parts[parts.length - 1] || '');
                } else if (parts.length === 2) {
                    setSelectedDistrict(parts[0] || '');
                    setSelectedCity(parts[1] || '');
                    setDetailAddress('');
                } else {
                    setDetailAddress(posting.address);
                    setSelectedCity('');
                    setSelectedDistrict('');
                }
            }

            setPhone(posting.phone || '');
            setEmail(posting.email || '');
            setWebsite(posting.website || '');

            if (posting.jobPositions && posting.jobPositions.length > 0) {
                setJobPositions(posting.jobPositions);
            } else {
                setJobPositions([{ title: '', minSalary: 0, maxSalary: 0 }]);
            }

            // Parse working hours
            if (posting.workingHours) {
                const match = posting.workingHours.match(/(\d{2}:\d{2})\s*(AM|PM)?\s*-\s*(\d{2}:\d{2})\s*(AM|PM)?/i);
                if (match) {
                    setWorkingStartTime(match[1]);
                    setWorkingEndTime(match[3]);
                }
            }

            setOffDays(posting.offDays || 2);
            setVacationDays(posting.vacationDays || 12);
            setInsurances(posting.insurances?.length ? posting.insurances : ['']);
            setSalaryBenefits(posting.salaryBenefits?.length ? posting.salaryBenefits : ['']);
            setAllowances(posting.allowances?.length ? posting.allowances : ['']);
            setBenefits(posting.benefits?.length ? posting.benefits : ['']);
            setGalleryImages(posting.galleryImages || []);
        }
    }, [posting]);

    // Get districts for selected city
    const availableDistricts = useMemo(() => {
        if (!selectedCity) return [];
        const city = VIETNAM_CITIES.find(c => c.name === selectedCity);
        return city?.districts || [];
    }, [selectedCity]);

    const tagCategories = {
        all: { label: 'Tất Cả', tags: [] as string[] },
        tech: { label: 'Công Nghệ', tags: ['Technology', 'Software Development', 'Web Development', 'Mobile Development', 'Backend Development', 'Frontend Development', 'Full Stack', 'DevOps', 'Cloud Computing', 'AI', 'Machine Learning', 'Blockchain', 'Data Science', 'Cybersecurity'] },
        business: { label: 'Kinh Doanh', tags: ['E-commerce', 'Sales', 'B2B', 'B2C', 'Business Development', 'Customer Service', 'Retail', 'Online Shopping'] },
        marketing: { label: 'Marketing', tags: ['Digital Marketing', 'Content', 'Social Media', 'SEO', 'SEM', 'Branding', 'Advertising', 'Email Marketing'] },
        finance: { label: 'Tài Chính', tags: ['Finance', 'FinTech', 'Banking', 'Insurance', 'Investment', 'Accounting'] },
        food: { label: 'Ẩm Thực', tags: ['Food & Beverage', 'Restaurant', 'Cafe', 'Hotel', 'Hospitality', 'Culinary', 'Vietnamese Cuisine', 'Luxury Dining'] },
        fashion: { label: 'Thời Trang', tags: ['Fashion', 'Beauty', 'Cosmetics', 'Skincare', 'Luxury Fashion'] },
        logistics: { label: 'Logistics', tags: ['Logistics', 'Delivery', 'Supply Chain', 'Transportation', 'Warehousing'] },
        education: { label: 'Giáo Dục', tags: ['Education', 'Training', 'Learning', 'E-Learning', 'Coaching'] },
        healthcare: { label: 'Y Tế', tags: ['Healthcare', 'Hospital', 'Medical', 'Wellness', 'Fitness'] },
        other: { label: 'Khác', tags: ['Design', 'Creative', 'UI/UX', 'Staffing', 'Innovation', 'Startup', 'Global', 'Remote', 'Hybrid'] },
    };

    // Populate 'all' category
    tagCategories.all.tags = Object.values(tagCategories)
        .filter(cat => cat !== tagCategories.all)
        .flatMap(cat => cat.tags);

    const getFilteredTags = () => {
        if (tagSearchQuery.trim()) {
            return tagCategories.all.tags.filter(tag =>
                tag.toLowerCase().includes(tagSearchQuery.toLowerCase())
            );
        }
        const category = tagCategories[activeTagCategory as keyof typeof tagCategories];
        return category?.tags || [];
    };

    const toggleTag = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    const addJobPosition = () => {
        setJobPositions(prev => [...prev, { title: '', minSalary: 0, maxSalary: 0 }]);
    };

    const removeJobPosition = (index: number) => {
        setJobPositions(prev => prev.filter((_, i) => i !== index));
    };

    const updateJobPosition = (index: number, field: keyof JobPosition, value: string | number) => {
        setJobPositions(prev => prev.map((pos, i) =>
            i === index ? { ...pos, [field]: value } : pos
        ));
    };

    const addHistoryEntry = () => {
        setCompanyHistory(prev => [...prev, { year: '', milestone: '' }]);
    };

    const removeHistoryEntry = (index: number) => {
        setCompanyHistory(prev => prev.filter((_, i) => i !== index));
    };

    const updateHistoryEntry = (index: number, field: keyof CompanyHistory, value: string) => {
        setCompanyHistory(prev => prev.map((entry, i) =>
            i === index ? { ...entry, [field]: value } : entry
        ));
    };

    // Validation functions
    const validatePhone = (phoneNumber: string): boolean => {
        if (!phoneNumber) return false;
        const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;
        return phoneRegex.test(phoneNumber.replace(/\s/g, ''));
    };

    const validateEmail = (emailAddress: string): boolean => {
        if (!emailAddress) return false;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(emailAddress);
    };

    const validateWebsite = (url: string): boolean => {
        if (!url) return true; // Optional field
        const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
        return urlRegex.test(url);
    };

    const validateForm = (): { isValid: boolean; firstErrorField: string | null } => {
        const newErrors: ValidationErrors = {};
        let firstErrorField: string | null = null;

        // Company name validation
        if (!companyName.trim()) {
            newErrors.companyName = 'Vui lòng nhập tên công ty';
            if (!firstErrorField) firstErrorField = 'companyName';
        }

        // Phone validation
        if (!phone.trim()) {
            newErrors.phone = 'Vui lòng nhập số điện thoại';
            if (!firstErrorField) firstErrorField = 'phone';
        } else if (!validatePhone(phone)) {
            newErrors.phone = 'Số điện thoại không hợp lệ (VD: 0912345678)';
            if (!firstErrorField) firstErrorField = 'phone';
        }

        // Email validation
        if (!email.trim()) {
            newErrors.email = 'Vui lòng nhập email';
            if (!firstErrorField) firstErrorField = 'email';
        } else if (!validateEmail(email)) {
            newErrors.email = 'Email không hợp lệ';
            if (!firstErrorField) firstErrorField = 'email';
        }

        // Website validation (optional but must be valid if provided)
        if (website && !validateWebsite(website)) {
            newErrors.website = 'URL không hợp lệ';
            if (!firstErrorField) firstErrorField = 'website';
        }

        // Job positions validation
        const jobPositionErrors: string[] = [];
        jobPositions.forEach((pos, idx) => {
            if (!pos.title.trim()) {
                jobPositionErrors[idx] = 'Vui lòng nhập vị trí tuyển dụng';
                if (!firstErrorField) firstErrorField = 'jobPositions';
            } else if (pos.minSalary > 0 && pos.maxSalary > 0 && pos.minSalary > pos.maxSalary) {
                jobPositionErrors[idx] = 'Lương tối thiểu phải nhỏ hơn lương tối đa';
                if (!firstErrorField) firstErrorField = 'jobPositions';
            }
        });
        if (jobPositionErrors.length > 0) {
            newErrors.jobPositions = jobPositionErrors;
        }

        setErrors(newErrors);
        return { isValid: Object.keys(newErrors).length === 0, firstErrorField };
    };

    // Handle form submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!posting) return;

        setShowErrors(true);
        const { isValid } = validateForm();

        if (!isValid) {
            addToast('Vui lòng kiểm tra lại các trường thông tin', 'error');
            return;
        }

        // Build address
        const addressParts: string[] = [];
        if (detailAddress) addressParts.push(detailAddress);
        if (selectedDistrict) addressParts.push(selectedDistrict);
        if (selectedCity) addressParts.push(selectedCity);
        const fullAddress = addressParts.join(', ');

        // Build working hours
        const formatTime = (time: string) => {
            const [hours] = time.split(':').map(Number);
            const period = hours >= 12 ? 'PM' : 'AM';
            return `${time} ${period}`;
        };
        const workingHours = `${formatTime(workingStartTime)} - ${formatTime(workingEndTime)}`;

        try {
            setIsSubmitting(true);

            const updatedPosting = await updateJobPosting(posting.id, {
                companyName,
                tags: selectedTags,
                description,
                mission,
                vision,
                companyHistory: companyHistory.filter(h => h.year && h.milestone),
                address: fullAddress,
                phone,
                email,
                website: website || undefined,
                jobPositions: jobPositions.filter(p => p.title.trim()),
                workingHours,
                offDays,
                vacationDays,
                insurances: insurances.filter(i => i.trim()),
                salaryBenefits: salaryBenefits.filter(s => s.trim()),
                allowances: allowances.filter(a => a.trim()),
                benefits: benefits.filter(b => b.trim()),
                galleryImages,
            });

            addToast('Đã cập nhật bài đăng thành công!', 'success');
            onSuccess(updatedPosting);
            onClose();
        } catch (error) {
            console.error('Failed to update job posting:', error);
            addToast('Không thể cập nhật bài đăng. Vui lòng thử lại.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Error display component
    const ErrorMessage = ({ message }: { message?: string }) => {
        if (!showErrors || !message) return null;
        return (
            <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-xs mt-1 flex items-center gap-1"
            >
                <AlertCircle className="w-3 h-3" />
                {message}
            </motion.p>
        );
    };

    if (!posting) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
                >
                    <motion.div
                        ref={formContainerRef}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-slate-900 rounded-2xl border border-cyan-400/20 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
                    >
                        {/* Header */}
                        <div className="sticky top-0 z-10 bg-slate-900 border-b border-cyan-400/20 p-6 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'Exo 2', sans-serif", fontWeight: 700 }}>
                                Chỉnh Sửa Bài Tuyển Dụng
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X className="w-6 h-6 text-white" />
                            </button>
                        </div>

                        {/* Form Content */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Tên công ty */}
                            <div>
                                <label className="block text-sm font-semibold text-white mb-2">
                                    Tên Công Ty <span className="text-red-400">*</span>
                                </label>
                                <Input
                                    type="text"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    placeholder="Nhập tên công ty"
                                    className={`w-full px-4 py-2 bg-slate-800 border rounded-lg text-white ${showErrors && errors.companyName ? 'border-red-400' : 'border-cyan-400/30'}`}
                                />
                                <ErrorMessage message={errors.companyName} />
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="block text-sm font-semibold text-white mb-2">
                                    Nhãn (Tags)
                                </label>
                                <div className="flex flex-wrap gap-2 mb-3 max-h-24 overflow-y-auto">
                                    {selectedTags.map(tag => (
                                        <span
                                            key={tag}
                                            className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm flex items-center gap-1"
                                        >
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => toggleTag(tag)}
                                                className="hover:text-red-400"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <Input
                                    type="text"
                                    placeholder="Tìm kiếm tag..."
                                    value={tagSearchQuery}
                                    onChange={(e) => setTagSearchQuery(e.target.value)}
                                    className="w-full px-4 py-2 bg-slate-800 border border-cyan-400/30 rounded-lg text-white mb-2"
                                />
                                <div className="flex gap-2 overflow-x-auto pb-2 mb-2">
                                    {Object.entries(tagCategories).map(([key, cat]) => (
                                        <button
                                            key={key}
                                            type="button"
                                            onClick={() => setActiveTagCategory(key)}
                                            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${activeTagCategory === key ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'}`}
                                        >
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                                    {getFilteredTags().map(tag => (
                                        <button
                                            key={tag}
                                            type="button"
                                            onClick={() => toggleTag(tag)}
                                            className={`px-3 py-1 rounded-full text-sm ${selectedTags.includes(tag) ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'}`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Mô tả công ty */}
                            <div>
                                <label className="block text-sm font-semibold text-white mb-2">
                                    Mô Tả Ngắn Về Công Ty
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Nhập mô tả về công ty"
                                    rows={3}
                                    className="w-full px-4 py-2 bg-slate-800 border border-cyan-400/30 rounded-lg text-white"
                                />
                            </div>

                            {/* Sứ mệnh & Tầm nhìn */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-white mb-2">
                                        Sứ Mệnh
                                    </label>
                                    <textarea
                                        value={mission}
                                        onChange={(e) => setMission(e.target.value)}
                                        placeholder="Sứ mệnh của công ty"
                                        rows={2}
                                        className="w-full px-4 py-2 bg-slate-800 border border-cyan-400/30 rounded-lg text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-white mb-2">
                                        Tầm Nhìn
                                    </label>
                                    <textarea
                                        value={vision}
                                        onChange={(e) => setVision(e.target.value)}
                                        placeholder="Tầm nhìn của công ty"
                                        rows={2}
                                        className="w-full px-4 py-2 bg-slate-800 border border-cyan-400/30 rounded-lg text-white"
                                    />
                                </div>
                            </div>

                            {/* Lịch sử công ty */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-semibold text-white">
                                        Lịch Sử Công Ty
                                    </label>
                                    <button
                                        type="button"
                                        onClick={addHistoryEntry}
                                        className="flex items-center gap-1 px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-lg text-sm hover:bg-cyan-500/30"
                                    >
                                        <Plus className="w-4 h-4" /> Thêm
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {companyHistory.map((entry, idx) => (
                                        <div key={idx} className="flex gap-2">
                                            <Input
                                                type="text"
                                                placeholder="Năm"
                                                value={entry.year}
                                                onChange={(e) => updateHistoryEntry(idx, 'year', e.target.value)}
                                                className="w-20 px-2 py-2 bg-slate-800 border border-cyan-400/30 rounded-lg text-white text-sm"
                                            />
                                            <Input
                                                type="text"
                                                placeholder="Cột mốc quan trọng"
                                                value={entry.milestone}
                                                onChange={(e) => updateHistoryEntry(idx, 'milestone', e.target.value)}
                                                className="flex-1 px-2 py-2 bg-slate-800 border border-cyan-400/30 rounded-lg text-white text-sm"
                                            />
                                            {companyHistory.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeHistoryEntry(idx)}
                                                    className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Thông tin liên hệ */}
                            <div className="border-t border-cyan-400/10 pt-6">
                                <h3 className="text-lg font-semibold text-white mb-4">Thông Tin Liên Hệ</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Tỉnh/Thành phố</label>
                                        <select
                                            value={selectedCity}
                                            onChange={(e) => {
                                                setSelectedCity(e.target.value);
                                                setSelectedDistrict('');
                                            }}
                                            className="w-full px-4 py-2 bg-slate-800 border border-cyan-400/30 rounded-lg text-white"
                                        >
                                            <option value="">Chọn Tỉnh/Thành phố</option>
                                            {VIETNAM_CITIES.map(city => (
                                                <option key={city.name} value={city.name}>{city.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Quận/Huyện</label>
                                        <select
                                            value={selectedDistrict}
                                            onChange={(e) => setSelectedDistrict(e.target.value)}
                                            disabled={!selectedCity}
                                            className="w-full px-4 py-2 bg-slate-800 border border-cyan-400/30 rounded-lg text-white disabled:opacity-50"
                                        >
                                            <option value="">Chọn Quận/Huyện</option>
                                            {availableDistricts.map(district => (
                                                <option key={district} value={district}>{district}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm text-gray-400 mb-1">
                                        Địa chỉ cụ thể
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder="Số nhà, tên đường..."
                                        value={detailAddress}
                                        onChange={(e) => setDetailAddress(e.target.value)}
                                        className="w-full px-4 py-2 bg-slate-800 border border-cyan-400/30 rounded-lg text-white"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">
                                            Số điện thoại <span className="text-red-400">*</span>
                                        </label>
                                        <Input
                                            type="tel"
                                            placeholder="VD: 0912345678"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className={`w-full px-4 py-2 bg-slate-800 border rounded-lg text-white ${showErrors && errors.phone ? 'border-red-400' : 'border-cyan-400/30'}`}
                                        />
                                        <ErrorMessage message={errors.phone} />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">
                                            Email <span className="text-red-400">*</span>
                                        </label>
                                        <Input
                                            type="email"
                                            placeholder="example@company.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className={`w-full px-4 py-2 bg-slate-800 border rounded-lg text-white ${showErrors && errors.email ? 'border-red-400' : 'border-cyan-400/30'}`}
                                        />
                                        <ErrorMessage message={errors.email} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm text-gray-400 mb-1">Website</label>
                                        <Input
                                            type="url"
                                            placeholder="https://company.com (không bắt buộc)"
                                            value={website}
                                            onChange={(e) => setWebsite(e.target.value)}
                                            className={`w-full px-4 py-2 bg-slate-800 border rounded-lg text-white ${showErrors && errors.website ? 'border-red-400' : 'border-cyan-400/30'}`}
                                        />
                                        <ErrorMessage message={errors.website} />
                                    </div>
                                </div>
                            </div>

                            {/* Vị trí tuyển dụng */}
                            <div className="border-t border-cyan-400/10 pt-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-white">
                                        Vị Trí Tuyển Dụng <span className="text-red-400">*</span>
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={addJobPosition}
                                        className="flex items-center gap-1 px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-lg text-sm hover:bg-cyan-500/30"
                                    >
                                        <Plus className="w-4 h-4" /> Thêm Vị Trí
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {jobPositions.map((position, idx) => (
                                        <div key={idx} className="flex gap-2 items-start">
                                            <div className="flex-1">
                                                <Input
                                                    type="text"
                                                    placeholder="Vị trí tuyển dụng"
                                                    value={position.title}
                                                    onChange={(e) => updateJobPosition(idx, 'title', e.target.value)}
                                                    className={`w-full px-4 py-2 bg-slate-800 border rounded-lg text-white ${showErrors && errors.jobPositions?.[idx] ? 'border-red-400' : 'border-cyan-400/30'}`}
                                                />
                                                <ErrorMessage message={errors.jobPositions?.[idx]} />
                                            </div>
                                            <div className="w-28">
                                                <Input
                                                    type="number"
                                                    placeholder="Lương min"
                                                    value={position.minSalary || ''}
                                                    onChange={(e) => updateJobPosition(idx, 'minSalary', Number(e.target.value))}
                                                    className="w-full px-2 py-2 bg-slate-800 border border-cyan-400/30 rounded-lg text-white text-sm"
                                                />
                                                <span className="text-xs text-gray-500">triệu đồng</span>
                                            </div>
                                            <div className="w-28">
                                                <Input
                                                    type="number"
                                                    placeholder="Lương max"
                                                    value={position.maxSalary || ''}
                                                    onChange={(e) => updateJobPosition(idx, 'maxSalary', Number(e.target.value))}
                                                    className="w-full px-2 py-2 bg-slate-800 border border-cyan-400/30 rounded-lg text-white text-sm"
                                                />
                                                <span className="text-xs text-gray-500">triệu đồng</span>
                                            </div>
                                            {jobPositions.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeJobPosition(idx)}
                                                    className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Phúc lợi */}
                            <div className="border-t border-cyan-400/10 pt-6">
                                <h3 className="text-lg font-semibold text-white mb-4">Phúc Lợi</h3>

                                {/* Thời gian làm việc */}
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-white mb-2">
                                        Thời Gian Làm Việc <span className="text-red-400">*</span>
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Input
                                                type="time"
                                                value={workingStartTime}
                                                onChange={(e) => setWorkingStartTime(e.target.value)}
                                                className="w-full px-4 py-2 bg-slate-800 border border-cyan-400/30 rounded-lg text-white"
                                            />
                                            <span className="text-xs text-gray-500">Thời gian bắt đầu</span>
                                        </div>
                                        <div>
                                            <Input
                                                type="time"
                                                value={workingEndTime}
                                                onChange={(e) => setWorkingEndTime(e.target.value)}
                                                className="w-full px-4 py-2 bg-slate-800 border border-cyan-400/30 rounded-lg text-white"
                                            />
                                            <span className="text-xs text-gray-500">Thời gian kết thúc</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Ngày nghỉ */}
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Số ngày nghỉ/tuần</label>
                                        <Input
                                            type="number"
                                            value={offDays}
                                            onChange={(e) => setOffDays(Number(e.target.value))}
                                            min={0}
                                            max={7}
                                            className="w-full px-4 py-2 bg-slate-800 border border-cyan-400/30 rounded-lg text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Ngày phép/năm</label>
                                        <Input
                                            type="number"
                                            value={vacationDays}
                                            onChange={(e) => setVacationDays(Number(e.target.value))}
                                            min={0}
                                            className="w-full px-4 py-2 bg-slate-800 border border-cyan-400/30 rounded-lg text-white"
                                        />
                                    </div>
                                </div>

                                {/* Bảo hiểm */}
                                <div className="mb-4">
                                    <label className="block text-sm text-gray-400 mb-1">Bảo hiểm</label>
                                    <div className="space-y-2">
                                        {insurances.map((item, idx) => (
                                            <div key={idx} className="flex gap-2">
                                                <Input
                                                    type="text"
                                                    placeholder="VD: Bảo hiểm y tế, Bảo hiểm xã hội..."
                                                    value={item}
                                                    onChange={(e) => {
                                                        const newItems = [...insurances];
                                                        newItems[idx] = e.target.value;
                                                        setInsurances(newItems);
                                                    }}
                                                    className="flex-1 px-4 py-2 bg-slate-800 border border-cyan-400/30 rounded-lg text-white"
                                                />
                                                {insurances.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setInsurances(insurances.filter((_, i) => i !== idx))}
                                                        className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => setInsurances([...insurances, ''])}
                                            className="text-sm text-cyan-400 hover:text-cyan-300"
                                        >
                                            + Thêm bảo hiểm
                                        </button>
                                    </div>
                                </div>

                                {/* Thưởng lương */}
                                <div className="mb-4">
                                    <label className="block text-sm text-gray-400 mb-1">Thưởng & Lương</label>
                                    <div className="space-y-2">
                                        {salaryBenefits.map((item, idx) => (
                                            <div key={idx} className="flex gap-2">
                                                <Input
                                                    type="text"
                                                    placeholder="VD: Thưởng tháng 13, Thưởng KPI..."
                                                    value={item}
                                                    onChange={(e) => {
                                                        const newItems = [...salaryBenefits];
                                                        newItems[idx] = e.target.value;
                                                        setSalaryBenefits(newItems);
                                                    }}
                                                    className="flex-1 px-4 py-2 bg-slate-800 border border-cyan-400/30 rounded-lg text-white"
                                                />
                                                {salaryBenefits.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setSalaryBenefits(salaryBenefits.filter((_, i) => i !== idx))}
                                                        className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => setSalaryBenefits([...salaryBenefits, ''])}
                                            className="text-sm text-cyan-400 hover:text-cyan-300"
                                        >
                                            + Thêm thưởng/lương
                                        </button>
                                    </div>
                                </div>

                                {/* Trợ cấp */}
                                <div className="mb-4">
                                    <label className="block text-sm text-gray-400 mb-1">Trợ Cấp</label>
                                    <div className="space-y-2">
                                        {allowances.map((item, idx) => (
                                            <div key={idx} className="flex gap-2">
                                                <Input
                                                    type="text"
                                                    placeholder="VD: Trợ cấp ăn trưa, Trợ cấp đi lại..."
                                                    value={item}
                                                    onChange={(e) => {
                                                        const newItems = [...allowances];
                                                        newItems[idx] = e.target.value;
                                                        setAllowances(newItems);
                                                    }}
                                                    className="flex-1 px-4 py-2 bg-slate-800 border border-cyan-400/30 rounded-lg text-white"
                                                />
                                                {allowances.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setAllowances(allowances.filter((_, i) => i !== idx))}
                                                        className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => setAllowances([...allowances, ''])}
                                            className="text-sm text-cyan-400 hover:text-cyan-300"
                                        >
                                            + Thêm trợ cấp
                                        </button>
                                    </div>
                                </div>

                                {/* Phúc lợi khác */}
                                <div className="mb-4">
                                    <label className="block text-sm text-gray-400 mb-1">Phúc Lợi Khác</label>
                                    <div className="space-y-2">
                                        {benefits.map((item, idx) => (
                                            <div key={idx} className="flex gap-2">
                                                <Input
                                                    type="text"
                                                    placeholder="VD: Team building, Du lịch hàng năm..."
                                                    value={item}
                                                    onChange={(e) => {
                                                        const newItems = [...benefits];
                                                        newItems[idx] = e.target.value;
                                                        setBenefits(newItems);
                                                    }}
                                                    className="flex-1 px-4 py-2 bg-slate-800 border border-cyan-400/30 rounded-lg text-white"
                                                />
                                                {benefits.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setBenefits(benefits.filter((_, i) => i !== idx))}
                                                        className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => setBenefits([...benefits, ''])}
                                            className="text-sm text-cyan-400 hover:text-cyan-300"
                                        >
                                            + Thêm phúc lợi
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Hình ảnh */}
                            <div className="border-t border-cyan-400/10 pt-6">
                                <h3 className="text-lg font-semibold text-white mb-4">Hình Ảnh Công Ty</h3>

                                <div className="mb-4">
                                    <label className="cursor-pointer">
                                        <div className="flex items-center gap-2 px-4 py-3 bg-slate-800 border border-dashed border-cyan-400/30 rounded-lg hover:border-cyan-400/50 transition-colors">
                                            <Plus className="w-5 h-5 text-cyan-400" />
                                            <span className="text-gray-400">Tải lên hình ảnh (PNG, JPG, tối đa {MAX_IMAGE_SIZE_MB}MB)</span>
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/png,image/jpeg,image/jpg"
                                            multiple
                                            onChange={(e) => {
                                                const files = Array.from(e.target.files || []);
                                                const validFiles: File[] = [];
                                                const invalidFiles: string[] = [];
                                                const oversizedFiles: string[] = [];

                                                files.forEach(file => {
                                                    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
                                                        invalidFiles.push(file.name);
                                                        return;
                                                    }
                                                    if (file.size > MAX_IMAGE_SIZE_BYTES) {
                                                        oversizedFiles.push(`${file.name} (${(file.size / 1024 / 1024).toFixed(1)}MB)`);
                                                        return;
                                                    }
                                                    validFiles.push(file);
                                                });

                                                const errorParts: string[] = [];
                                                if (invalidFiles.length > 0) {
                                                    errorParts.push(`Định dạng không hợp lệ: ${invalidFiles.join(', ')}`);
                                                }
                                                if (oversizedFiles.length > 0) {
                                                    errorParts.push(`Vượt quá dung lượng: ${oversizedFiles.join(', ')}`);
                                                }

                                                if (errorParts.length > 0) {
                                                    setImageUploadError(errorParts.join('. '));
                                                } else {
                                                    setImageUploadError(null);
                                                }

                                                validFiles.forEach(file => {
                                                    const reader = new FileReader();
                                                    reader.onload = (event) => {
                                                        const result = event.target?.result as string;
                                                        setGalleryImages(prev => [...prev, result]);
                                                    };
                                                    reader.readAsDataURL(file);
                                                });

                                                e.target.value = '';
                                            }}
                                            className="hidden"
                                        />
                                    </label>
                                </div>

                                {imageUploadError && (
                                    <p className="text-red-400 text-sm mb-4">{imageUploadError}</p>
                                )}

                                {/* Image Preview Grid */}
                                {galleryImages.length > 0 && (
                                    <div className="mb-4">
                                        <p className="text-xs text-gray-400 mb-2">Hình ảnh đã tải lên ({galleryImages.length}):</p>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-48 overflow-y-auto">
                                            {galleryImages.map((img, idx) => (
                                                <div key={idx} className="relative group">
                                                    <div
                                                        className="w-full h-24 rounded-lg border border-cyan-400/30 bg-cover bg-center"
                                                        style={{ backgroundImage: `url('${img}')` }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setGalleryImages(galleryImages.filter((_, i) => i !== idx))}
                                                        className="absolute top-1 right-1 p-1 bg-red-500/80 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X className="w-3 h-3 text-white" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="border-t border-cyan-400/10 pt-6 flex gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-4 py-2 rounded-lg border border-cyan-400/30 text-cyan-300 hover:bg-cyan-400/10 transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-2 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600 transition-colors font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Đang lưu...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5" />
                                            Lưu Thay Đổi
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
