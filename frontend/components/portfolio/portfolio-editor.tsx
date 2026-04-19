'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Plus, Mail, Phone, MapPin, Github, Facebook, Search, X, Edit, Globe } from 'lucide-react';
import { VIETNAM_CITIES, getCityDistricts } from '@/lib/vietnam-cities';
import { IT_SKILLS } from '@/lib/it-skills';
import { LANGUAGES, PROFICIENCY_LEVELS, type LanguageSkill } from '@/lib/languages';

interface ContactInfo {
  email?: string;
  phone?: string;
  city?: string;
  district?: string;
  facebook?: string;
  github?: string;
}

interface SkillsData {
  selected: string[];
}

interface ExperienceItem {
  id: string;
  position: string;
  company: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  description: string;
}

interface ExperienceData {
  items: ExperienceItem[];
}

interface EducationItem {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  currentlyStudying: boolean;
  description: string;
}

interface EducationData {
  items: EducationItem[];
}

interface ProjectItem {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
  startDate: string;
  endDate?: string;
  featured: boolean;
}

interface ProjectsData {
  items: ProjectItem[];
}

interface LanguagesData {
  items: LanguageSkill[];
}

interface PortfolioEditorProps {
  data: unknown;
  onChange: (field: string, value: unknown) => void;
}

export default function PortfolioEditor({ data, onChange }: PortfolioEditorProps) {
  const portfolioData = data as Record<string, unknown>;
  const contactJson = (portfolioData.contactJson as ContactInfo) || {};
  const skillsData = (portfolioData.skills as SkillsData) || { selected: [] };
  const languagesData = (portfolioData.languages as LanguagesData) || { items: [] };
  const experienceData = (portfolioData.experience as ExperienceData) || { items: [] };
  const educationData = (portfolioData.education as EducationData) || { items: [] };
  const projectsData = (portfolioData.projects as ProjectsData) || { items: [] };

  const skillsSectionRef = useRef<HTMLDivElement>(null);
  const languagesSectionRef = useRef<HTMLDivElement>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const experienceSectionRef = useRef<HTMLDivElement>(null);
  const educationSectionRef = useRef<HTMLDivElement>(null);
  const projectsSectionRef = useRef<HTMLDivElement>(null);

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: false,
    skills: false,
    languages: false,
    experience: false,
    education: false,
    projects: false,
  });

  const [contactInfo, setContactInfo] = useState<ContactInfo>(contactJson);
  const [selectedCity, setSelectedCity] = useState<string>(contactJson.city || '');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(skillsData.selected || []);
  const [skillSearchTerm, setSkillSearchTerm] = useState<string>('');
  const [showSkillDropdown, setShowSkillDropdown] = useState<boolean>(false);
  
  const [languages, setLanguages] = useState<LanguageSkill[]>(languagesData.items || []);
  const [languageSearchTerm, setLanguageSearchTerm] = useState<string>('');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState<boolean>(false);
  const [editingLangId, setEditingLangId] = useState<string | null>(null);
  const [editingLang, setEditingLang] = useState<LanguageSkill | null>(null);
  
  const [experiences, setExperiences] = useState<ExperienceItem[]>(experienceData.items || []);
  const [editingExpId, setEditingExpId] = useState<string | null>(null);
  const [editingExp, setEditingExp] = useState<ExperienceItem | null>(null);
  const [showExpForm, setShowExpForm] = useState<boolean>(false);

  const [educations, setEducations] = useState<EducationItem[]>(educationData.items || []);
  const [editingEduId, setEditingEduId] = useState<string | null>(null);
  const [editingEdu, setEditingEdu] = useState<EducationItem | null>(null);
  const [showEduForm, setShowEduForm] = useState<boolean>(false);

  const [projects, setProjects] = useState<ProjectItem[]>(projectsData.items || []);
  const [editingProjId, setEditingProjId] = useState<string | null>(null);
  const [editingProj, setEditingProj] = useState<ProjectItem | null>(null);
  const [showProjForm, setShowProjForm] = useState<boolean>(false);

  const districts = getCityDistricts(selectedCity);

  // Auto-scroll to skills section when expanded
  useEffect(() => {
    if (expandedSections.skills && skillsSectionRef.current && editorContainerRef.current) {
      // Scroll to top of skills section
      editorContainerRef.current.scrollTop = skillsSectionRef.current.offsetTop - 50;
    }
  }, [expandedSections.skills]);

  // Get filtered skills based on search
  const filteredSkillsData = skillSearchTerm
    ? IT_SKILLS.map((category) => ({
        ...category,
        skills: category.skills.filter((skill) =>
          skill.toLowerCase().includes(skillSearchTerm.toLowerCase())
        ),
      })).filter((category) => category.skills.length > 0)
    : IT_SKILLS;

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleContactChange = (field: keyof ContactInfo, value: string) => {
    const updated = { ...contactInfo, [field]: value };
    setContactInfo(updated);
    onChange('contactJson', updated);
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    const updated = { ...contactInfo, city, district: '' };
    setContactInfo(updated);
    onChange('contactJson', updated);
  };

  const handleSkillAdd = (skill: string) => {
    if (!selectedSkills.includes(skill)) {
      const updated = [...selectedSkills, skill];
      setSelectedSkills(updated);
      onChange('skills', { selected: updated });
      setSkillSearchTerm('');
    }
  };

  const handleSkillRemove = (skill: string) => {
    const updated = selectedSkills.filter((s) => s !== skill);
    setSelectedSkills(updated);
    onChange('skills', { selected: updated });
  };

  const handleAddExperience = () => {
    setEditingExp({
      id: Date.now().toString(),
      position: '',
      company: '',
      startDate: '',
      endDate: '',
      currentlyWorking: false,
      description: '',
    });
    setShowExpForm(true);
  };

  const handleEditExperience = (exp: ExperienceItem) => {
    setEditingExp(exp);
    setEditingExpId(exp.id);
    setShowExpForm(true);
  };

  const handleSaveExperience = () => {
    if (!editingExp || !editingExp.position || !editingExp.company) return;
    
    let updated: ExperienceItem[];
    if (editingExpId) {
      updated = experiences.map((e) => (e.id === editingExpId ? editingExp : e));
    } else {
      updated = [...experiences, editingExp];
    }
    
    setExperiences(updated);
    onChange('experience', { items: updated });
    setShowExpForm(false);
    setEditingExp(null);
    setEditingExpId(null);
  };

  const handleDeleteExperience = (id: string) => {
    const updated = experiences.filter((e) => e.id !== id);
    setExperiences(updated);
    onChange('experience', { items: updated });
  };

  const handleAddEducation = () => {
    setEditingEdu({
      id: Date.now().toString(),
      school: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      currentlyStudying: false,
      description: '',
    });
    setShowEduForm(true);
  };

  const handleEditEducation = (edu: EducationItem) => {
    setEditingEdu(edu);
    setEditingEduId(edu.id);
    setShowEduForm(true);
  };

  const handleSaveEducation = () => {
    if (!editingEdu || !editingEdu.school) return;
    
    // Nếu không phải "Đang học tại đây", yêu cầu bằng cấp
    if (!editingEdu.currentlyStudying && !editingEdu.degree) return;
    
    let updated: EducationItem[];
    if (editingEduId) {
      updated = educations.map((e) => (e.id === editingEduId ? editingEdu : e));
    } else {
      updated = [...educations, editingEdu];
    }
    
    setEducations(updated);
    onChange('education', { items: updated });
    setShowEduForm(false);
    setEditingEdu(null);
    setEditingEduId(null);
  };

  const handleDeleteEducation = (id: string) => {
    const updated = educations.filter((e) => e.id !== id);
    setEducations(updated);
    onChange('education', { items: updated });
  };

  const handleAddProject = () => {
    setEditingProj({
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: [],
      link: '',
      startDate: '',
      endDate: '',
      featured: false,
    });
    setShowProjForm(true);
  };

  const handleEditProject = (proj: ProjectItem) => {
    setEditingProj(proj);
    setEditingProjId(proj.id);
    setShowProjForm(true);
  };

  const handleSaveProject = () => {
    if (!editingProj || !editingProj.name) return;
    
    let updated: ProjectItem[];
    if (editingProjId) {
      updated = projects.map((p) => (p.id === editingProjId ? editingProj : p));
    } else {
      updated = [...projects, editingProj];
    }
    
    setProjects(updated);
    onChange('projects', { items: updated });
    setShowProjForm(false);
    setEditingProj(null);
    setEditingProjId(null);
  };

  const handleDeleteProject = (id: string) => {
    const updated = projects.filter((p) => p.id !== id);
    setProjects(updated);
    onChange('projects', { items: updated });
  };

  const handleAddProjectTechnology = (tech: string) => {
    if (editingProj && tech && !editingProj.technologies.includes(tech)) {
      setEditingProj({
        ...editingProj,
        technologies: [...editingProj.technologies, tech],
      });
    }
  };

  const handleRemoveProjectTechnology = (tech: string) => {
    if (editingProj) {
      setEditingProj({
        ...editingProj,
        technologies: editingProj.technologies.filter((t) => t !== tech),
      });
    }
  };

  // Language Handlers
  const filteredLanguages = languageSearchTerm
    ? LANGUAGES.filter((lang) =>
        lang.name.toLowerCase().includes(languageSearchTerm.toLowerCase()) ||
        lang.nativeName.toLowerCase().includes(languageSearchTerm.toLowerCase())
      )
    : LANGUAGES;

  const handleAddLanguage = (language: typeof LANGUAGES[0]) => {
    if (!languages.find((l) => l.language.code === language.code)) {
      const newLanguage: LanguageSkill = {
        id: Date.now().toString(),
        language: language,
        proficiency: 'Professional Working',
        levelScore: 3,
      };
      const updated = [...languages, newLanguage];
      setLanguages(updated);
      onChange('languages', { items: updated });
      setLanguageSearchTerm('');
    }
  };

  const handleRemoveLanguage = (id: string) => {
    const updated = languages.filter((l) => l.id !== id);
    setLanguages(updated);
    onChange('languages', { items: updated });
  };

  const handleUpdateLanguageProficiency = (id: string, proficiency: string) => {
    const profLevel = PROFICIENCY_LEVELS.find((p) => p.value === proficiency);
    const updated = languages.map((l) =>
      l.id === id
        ? { ...l, proficiency: proficiency as LanguageSkill['proficiency'], levelScore: profLevel?.score || 3 }
        : l
    );
    setLanguages(updated);
    onChange('languages', { items: updated });
  };

  const sectionVariants = {
    collapsed: { height: 0, opacity: 0 },
    expanded: { height: 'auto', opacity: 1 },
  };

  return (
    <div className="space-y-4" ref={editorContainerRef}>
      <div className="text-white mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-bold" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>Thông Tin Hồ Sơ</h3>
        <p className="text-xs sm:text-sm text-slate-400 mt-1" style={{ fontFamily: "'Exo 2 Regular', sans-serif" }}>Chỉnh sửa thông tin chi tiết của bạn</p>
      </div>

      {/* Basic Information Section */}
      <motion.div className="border border-slate-700/50 rounded-lg overflow-hidden bg-slate-800/30">
        <button
          onClick={() => toggleSection('basic')}
          className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50 transition-all"
        >
          <span className="font-semibold text-white" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>Thông Tin Cơ Bản</span>
          <motion.div
            animate={{ rotate: expandedSections.basic ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-5 h-5 text-slate-400" />
          </motion.div>
        </button>

        <motion.div
          animate={expandedSections.basic ? 'expanded' : 'collapsed'}
          variants={sectionVariants}
          initial="collapsed"
        >
          <div className="px-4 pb-4 space-y-3 sm:space-y-4 border-t border-slate-700/50 pt-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-200 mb-1.5 sm:mb-2">
                Tiêu Đề Nghề Nghiệp
              </label>
              <input
                type="text"
                value={(portfolioData.title as string) || ''}
                onChange={(e) => onChange('title', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-sm"
                placeholder="VD: Frontend Developer • UI/UX Builder • Tư Duy Sản Phẩm"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-200 mb-1.5 sm:mb-2">
                Mô Tả Ngắn Về Bạn
              </label>
              <input
                type="text"
                value={(portfolioData.headline as string) || ''}
                onChange={(e) => onChange('headline', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-sm"
                placeholder="VD: Đam mê xây dựng trải nghiệm số mượt mà, trực quan và hiệu quả."
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-200 mb-1.5 sm:mb-2">
                Giới Thiệu Bản Thân
              </label>
              <textarea
                value={(portfolioData.summary as string) || ''}
                onChange={(e) => onChange('summary', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all resize-none text-sm"
                rows={4}
                placeholder="Hãy chia sẻ điểm mạnh, kinh nghiệm nổi bật và định hướng của bạn."
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-200 mb-1.5 sm:mb-2">
                Liên Kết Ảnh Cá Nhân
              </label>
              <input
                type="url"
                value={(portfolioData.photoUrl as string) || ''}
                onChange={(e) => onChange('photoUrl', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-sm"
                placeholder="https://your-photo-link.com/avatar.jpg"
              />
            </div>

            {/* Contact Information */}
            <div className="pt-3 sm:pt-4 border-t border-slate-700/50">
              <h4 className="font-semibold text-white mb-3 sm:mb-4 text-sm sm:text-base">Thông Tin Liên Hệ</h4>

              <div className="space-y-3 sm:space-y-4">
                {/* Email */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                  <input
                    type="email"
                    value={contactInfo.email || ''}
                    onChange={(e) => handleContactChange('email', e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-xs sm:text-sm"
                    placeholder="abc@gmail.com"
                  />
                </div>

                {/* Phone */}
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div className="flex-1 flex items-center rounded-lg bg-slate-700/50 border border-slate-600/50 overflow-hidden">
                    <span className="px-3 py-2 text-slate-400 font-medium text-sm bg-slate-600/30 border-r border-slate-600/50">+84</span>
                    <input
                      type="tel"
                      value={contactInfo.phone || ''}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
                        if (value.startsWith('84')) {
                          value = value.substring(2); // Remove leading 84
                        } else if (value.startsWith('0')) {
                          value = value.substring(1); // Remove leading 0
                        }
                        handleContactChange('phone', value);
                      }}
                      className="flex-1 px-3 py-2 bg-transparent text-white placeholder-slate-400 focus:outline-none text-sm"
                      placeholder="(123) 456-7890"
                    />
                  </div>
                </div>

                {/* City & District */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-2" />
                    <select
                      value={selectedCity}
                      onChange={(e) => handleCityChange(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-sm"
                    >
                      <option value="">Chọn Thành Phố/Tỉnh</option>
                      {VIETNAM_CITIES.map((city) => (
                        <option key={city.name} value={city.name}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedCity && (
                    <div className="flex items-center gap-3 pl-7">
                      <select
                        value={contactInfo.district || ''}
                        onChange={(e) => handleContactChange('district', e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-sm"
                      >
                        <option value="">Chọn Quận/Huyện</option>
                        {districts.map((district, index) => (
                          <option key={index} value={district}>
                            {district}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Facebook */}
                <div className="flex items-center gap-3">
                  <Facebook className="w-4 h-4 text-cyan-400 shrink-0" />
                  <input
                    type="url"
                    value={contactInfo.facebook || ''}
                    onChange={(e) => handleContactChange('facebook', e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-sm"
                    placeholder="facebook.com/nguyenngocthai"
                  />
                </div>

                {/* GitHub */}
                <div className="flex items-center gap-3">
                  <Github className="w-4 h-4 text-cyan-400 shrink-0" />
                  <input
                    type="url"
                    value={contactInfo.github || ''}
                    onChange={(e) => handleContactChange('github', e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-sm"
                    placeholder="github.com/nguyenngocthai"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Skills Section - MOVED UP & OPTIMIZED */}
      <motion.div className="border border-slate-700/50 rounded-lg overflow-hidden bg-slate-800/30" ref={skillsSectionRef}>
        <button
          onClick={() => toggleSection('skills')}
          className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-slate-800/50 transition-all"
        >
          <span className="font-semibold text-white text-sm sm:text-base" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>Kỹ Năng ({selectedSkills.length})</span>
          <motion.div
            animate={{ rotate: expandedSections.skills ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-5 h-5 text-slate-400" />
          </motion.div>
        </button>

        <motion.div
          animate={expandedSections.skills ? 'expanded' : 'collapsed'}
          variants={sectionVariants}
          className="overflow-hidden"
        >
          <div className="px-3 sm:px-4 pb-4 sm:pb-6 space-y-4 sm:space-y-6 border-t border-slate-700/50 pt-4 sm:pt-6 max-h-96 sm:max-h-[500px] overflow-y-auto">
            {/* Selected Skills */}
            {selectedSkills.length > 0 && (
              <div className="space-y-2 sm:space-y-3 pb-3 sm:pb-4 border-b border-slate-700/50">
                <label className="block text-xs sm:text-sm font-semibold text-slate-100" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>✓ Kỹ Năng Đã Chọn ({selectedSkills.length})</label>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {selectedSkills.map((skill) => (
                    <div
                      key={skill}
                      className="group flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 text-xs sm:text-sm hover:bg-cyan-500/30 hover:border-cyan-400/70 transition-all cursor-default"
                    >
                      <span className="font-medium">{skill}</span>
                      <button
                        onClick={() => handleSkillRemove(skill)}
                        className="opacity-60 group-hover:opacity-100 hover:text-cyan-100 transition-all p-0.5 rounded hover:bg-cyan-500/20"
                        title="Xóa kỹ năng này"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skill Search & Selection */}
            <div className="space-y-2 sm:space-y-3">
              <label className="block text-xs sm:text-sm font-semibold text-slate-100" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>+ Thêm Kỹ Năng Mới</label>
              <div className="relative">
                <div className="flex items-center gap-2 px-3 py-2 sm:py-2.5 rounded-lg bg-slate-700/50 border border-slate-600/50 focus-within:border-cyan-500/70 focus-within:bg-slate-700/70 transition-all">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={skillSearchTerm}
                    onChange={(e) => {
                      setSkillSearchTerm(e.target.value);
                      setShowSkillDropdown(true);
                    }}
                    onFocus={() => setShowSkillDropdown(true)}
                    placeholder="Tìm kiếm: React, Python, Docker..."
                    className="flex-1 bg-transparent text-white placeholder-slate-500 focus:outline-none text-xs sm:text-sm"
                  />
                  {skillSearchTerm && (
                    <button
                      onClick={() => {
                        setSkillSearchTerm('');
                        setShowSkillDropdown(false);
                      }}
                      className="p-1 text-slate-400 hover:text-slate-300 transition-all"
                      title="Xóa tìm kiếm"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Skill Dropdown */}
                {showSkillDropdown && (
                  <div 
                    className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-lg overflow-hidden z-50 shadow-xl"
                    onMouseLeave={() => {
                      // Optional: close on mouse leave
                    }}
                  >
                    <div className="overflow-y-auto max-h-[500px]">
                      {filteredSkillsData.length > 0 ? (
                        filteredSkillsData.map((category) => (
                          <div key={category.name}>
                            <div className="px-4 py-2.5 text-xs font-bold text-cyan-400 bg-slate-900/80 sticky top-0 uppercase tracking-wide" style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}>
                              {category.name}
                            </div>
                            {category.skills.map((skill) => (
                              <button
                                key={skill}
                                onClick={() => {
                                  handleSkillAdd(skill);
                                  setShowSkillDropdown(false);
                                  setSkillSearchTerm('');
                                }}
                                disabled={selectedSkills.includes(skill)}
                                className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-all disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed flex items-center justify-between group"
                              >
                                <span>{skill}</span>
                                {selectedSkills.includes(skill) && (
                                  <span className="text-cyan-400 font-bold">✓</span>
                                )}
                              </button>
                            ))}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-8 text-sm text-slate-400 text-center">
                          <p className="mb-1">🔍 Không tìm thấy kỹ năng</p>
                          <p className="text-xs text-slate-500">Thử từ khóa khác hoặc cuộn xuống danh sách</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-start gap-2 p-3 rounded-lg bg-slate-900/50 border border-slate-700/50">
                <span className="text-lg">💡</span>
                <div className="text-xs text-slate-400">
                  <p className="font-medium text-slate-300 mb-1" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>Có {IT_SKILLS.flatMap((cat) => cat.skills).length}+ kỹ năng để chọn</p>
                  <p style={{ fontFamily: "'Exo 2 Regular', sans-serif" }}>Tìm kiếm nhanh hoặc cuộn qua các danh mục</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Languages Section */}
      <motion.div className="border border-slate-700/50 rounded-lg overflow-hidden bg-slate-800/30">
        <button
          onClick={() => toggleSection('languages')}
          className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-slate-800/50 transition-all"
        >
          <span className="font-semibold text-white text-sm sm:text-base flex items-center gap-2" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
            <Globe className="w-5 h-5 text-cyan-400" />
            Ngôn Ngữ ({languages.length})
          </span>
          <motion.div
            animate={{ rotate: expandedSections.languages ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-5 h-5 text-slate-400" />
          </motion.div>
        </button>

        <motion.div
          animate={expandedSections.languages ? 'expanded' : 'collapsed'}
          variants={sectionVariants}
          className="overflow-hidden"
        >
          <div ref={languagesSectionRef} className="px-3 sm:px-4 pb-4 sm:pb-6 space-y-4 sm:space-y-6 border-t border-slate-700/50 pt-4 sm:pt-6 max-h-96 sm:max-h-[500px] overflow-y-auto">
            {/* Selected Languages */}
            {languages.length > 0 && (
              <div className="space-y-2 sm:space-y-3 pb-3 sm:pb-4 border-b border-slate-700/50">
                <label className="block text-xs sm:text-sm font-semibold text-slate-100" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>✓ Ngôn Ngữ Đã Chọn ({languages.length})</label>
                <div className="space-y-2">
                  {languages.map((lang) => (
                    <div
                      key={lang.id}
                      className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-slate-700/30 border border-slate-600/50 hover:border-slate-500/50 transition-all group"
                    >
                      <div className="flex items-center gap-2.5 flex-1">
                        <span className="text-lg">{lang.language.flag}</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">{lang.language.name}</p>
                          <p className="text-xs text-slate-400">{lang.language.nativeName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={lang.proficiency}
                          onChange={(e) => handleUpdateLanguageProficiency(lang.id, e.target.value)}
                          className="px-3 py-1.5 text-xs sm:text-sm font-medium bg-linear-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/50 hover:border-emerald-400/70 rounded-lg text-white focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30 transition-all cursor-pointer appearance-none"
                        >
                          {PROFICIENCY_LEVELS.map((level) => (
                            <option key={level.value} value={level.value} className="bg-slate-800">
                              {level.label}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleRemoveLanguage(lang.id)}
                          className="p-1 text-slate-400 hover:text-red-400 hover:bg-slate-600/50 rounded transition-all opacity-0 group-hover:opacity-100"
                          title="Xóa ngôn ngữ này"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Language Search & Selection */}
            <div className="space-y-2 sm:space-y-3">
              <label className="block text-xs sm:text-sm font-semibold text-slate-100" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>+ Thêm Ngôn Ngữ Mới</label>
              <div className="relative">
                <div className="flex items-center gap-2 px-3 py-2 sm:py-2.5 rounded-lg bg-slate-700/50 border border-slate-600/50 focus-within:border-emerald-500/70 focus-within:bg-slate-700/70 focus-within:shadow-lg focus-within:shadow-emerald-500/10 transition-all">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={languageSearchTerm}
                    onChange={(e) => {
                      setLanguageSearchTerm(e.target.value);
                      setShowLanguageDropdown(true);
                    }}
                    onFocus={() => setShowLanguageDropdown(true)}
                    placeholder="Tìm kiếm: Tiếng Anh, Tiếng Việt, Tiếng Pháp..."
                    className="flex-1 bg-transparent text-white placeholder-slate-500 focus:outline-none text-xs sm:text-sm"
                  />
                  {languageSearchTerm && (
                    <button
                      onClick={() => {
                        setLanguageSearchTerm('');
                        setShowLanguageDropdown(false);
                      }}
                      className="p-1 text-slate-400 hover:text-slate-300 transition-all"
                      title="Xóa tìm kiếm"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Language Dropdown - Premium Design */}
                {showLanguageDropdown && (
                  <div 
                    className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden z-50 shadow-2xl shadow-black/50"
                  >
                    {/* Dropdown Header */}
                    {filteredLanguages.length > 0 && (
                      <div className="sticky top-0 px-4 py-3 bg-linear-to-r from-slate-800 to-slate-900 border-b border-slate-700/50 flex items-center justify-between">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Danh sách ngôn ngữ ({filteredLanguages.length})</p>
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                      </div>
                    )}

                    <div className="overflow-y-auto max-h-[420px]">
                      {filteredLanguages.length > 0 ? (
                        <div className="divide-y divide-slate-700/30">
                          {filteredLanguages.map((language, idx) => {
                            const isSelected = languages.some((l) => l.language.code === language.code);
                            return (
                              <motion.button
                                key={language.code}
                                onClick={() => {
                                  handleAddLanguage(language);
                                  setShowLanguageDropdown(false);
                                }}
                                disabled={isSelected}
                                whileHover={!isSelected ? { x: 4 } : {}}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.02 }}
                                className={`w-full text-left px-4 py-3 text-sm transition-all flex items-center justify-between group ${
                                  isSelected
                                    ? 'bg-slate-800/30 opacity-50 cursor-not-allowed'
                                    : 'hover:bg-emerald-500/10 text-slate-300 hover:text-slate-100'
                                }`}
                              >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <span className="text-xl shrink-0">{language.flag}</span>
                                  <div className="min-w-0">
                                    <p className="font-semibold text-slate-200 group-hover:text-white transition-colors">{language.name}</p>
                                    <p className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors truncate">{language.nativeName}</p>
                                  </div>
                                </div>
                                {isSelected ? (
                                  <span className="ml-2 px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-md flex items-center gap-1 shrink-0">
                                    ✓ Đã chọn
                                  </span>
                                ) : (
                                  <div className="ml-2 w-5 h-5 rounded border-2 border-slate-600 group-hover:border-emerald-500 transition-colors group-hover:bg-emerald-500/10 shrink-0"></div>
                                )}
                              </motion.button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="px-4 py-12 text-sm text-slate-400 text-center">
                          <div className="text-3xl mb-2">🔍</div>
                          <p className="font-medium mb-1">Không tìm thấy ngôn ngữ</p>
                          <p className="text-xs text-slate-500">Thử tìm kiếm với từ khóa khác</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-start gap-2 p-3 rounded-lg bg-linear-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 hover:border-emerald-500/50 transition-all">
                <span className="text-lg">💡</span>
                <div className="text-xs text-slate-300">
                  <p className="font-medium text-emerald-300 mb-1" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>Có {LANGUAGES.length}+ ngôn ngữ để chọn</p>
                  <p style={{ fontFamily: "'Exo 2 Regular', sans-serif" }}>Thêm ngôn ngữ và chọn mức độ thành thạo của bạn</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Experience Section */}
      <motion.div className="border border-slate-700/50 rounded-lg overflow-hidden bg-slate-800/30">
        <button
          onClick={() => toggleSection('experience')}
          className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-slate-800/50 transition-all"
        >
          <span className="font-semibold text-white text-sm sm:text-base" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>Kinh Nghiệm Làm Việc ({experiences.length})</span>
          <motion.div
            animate={{ rotate: expandedSections.experience ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-5 h-5 text-slate-400" />
          </motion.div>
        </button>

        <motion.div
          animate={expandedSections.experience ? 'expanded' : 'collapsed'}
          variants={sectionVariants}
          className="overflow-hidden"
        >
          <div ref={experienceSectionRef} className="px-3 sm:px-4 pb-4 sm:pb-6 space-y-3 sm:space-y-4 border-t border-slate-700/50 pt-4 sm:pt-6 max-h-96 sm:max-h-[500px] overflow-y-auto">
            {/* List of Experiences */}
            {experiences.length > 0 && (
              <div className="space-y-3">
                {experiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4 hover:border-slate-500/50 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">{exp.position}</h4>
                        <p className="text-sm text-cyan-300">{exp.company}</p>
                        <p className="text-xs text-slate-400 mt-1">
                          {exp.startDate}
                          {exp.endDate ? ` → ${exp.endDate}` : ' → Hiện tại'}
                        </p>
                        {exp.description && (
                          <p className="text-sm text-slate-300 mt-2 line-clamp-2">{exp.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditExperience(exp)}
                          className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-600/50 rounded transition-all"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteExperience(exp.id)}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-600/50 rounded transition-all"
                          title="Xóa"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Form */}
            {showExpForm && editingExp && (
              <div className="bg-slate-700/20 border border-slate-600/50 rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-white mb-4" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                  {editingExpId ? 'Chỉnh Sửa Kinh Nghiệm' : 'Thêm Kinh Nghiệm Mới'}
                </h4>

                {/* Position */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Chức Vụ *</label>
                  <input
                    type="text"
                    value={editingExp.position}
                    onChange={(e) =>
                      setEditingExp({ ...editingExp, position: e.target.value })
                    }
                    placeholder="vd: Lập Trình Viên Full Stack"
                    className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/70 text-sm"
                  />
                </div>

                {/* Company */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Công Ty *</label>
                  <input
                    type="text"
                    value={editingExp.company}
                    onChange={(e) =>
                      setEditingExp({ ...editingExp, company: e.target.value })
                    }
                    placeholder="vd: Công Ty Công Nghệ ABC"
                    className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/70 text-sm"
                  />
                </div>

                {/* Start Date */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Ngày Bắt Đầu</label>
                  <input
                    type="text"
                    value={editingExp.startDate}
                    onChange={(e) =>
                      setEditingExp({ ...editingExp, startDate: e.target.value })
                    }
                    placeholder="vd: Tháng 1 năm 2021"
                    className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/70 text-sm"
                  />
                </div>

                {/* End Date & Currently Working */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingExp.currentlyWorking}
                      onChange={(e) =>
                        setEditingExp({
                          ...editingExp,
                          currentlyWorking: e.target.checked,
                        })
                      }
                      className="rounded"
                    />
                    <span className="text-sm text-slate-300">Đang làm việc tại đây</span>
                  </label>

                  {!editingExp.currentlyWorking && (
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">Ngày Kết Thúc</label>
                      <input
                        type="text"
                        value={editingExp.endDate}
                        onChange={(e) =>
                          setEditingExp({ ...editingExp, endDate: e.target.value })
                        }
                        placeholder="vd: Tháng 12 năm 2023"
                        className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/70 text-sm"
                      />
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Mô Tả Công Việc</label>
                  <textarea
                    value={editingExp.description}
                    onChange={(e) =>
                      setEditingExp({ ...editingExp, description: e.target.value })
                    }
                    placeholder="vd: Lãnh đạo phát triển ứng dụng, tăng hiệu suất 40%"
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/70 text-sm resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleSaveExperience}
                    className="flex-1 px-3 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/30 transition-all font-medium text-sm"
                  >
                    Lưu
                  </button>
                  <button
                    onClick={() => {
                      setShowExpForm(false);
                      setEditingExp(null);
                      setEditingExpId(null);
                    }}
                    className="flex-1 px-3 py-2 rounded-lg bg-slate-700/50 border border-slate-600/50 text-slate-300 hover:bg-slate-700 transition-all font-medium text-sm"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            )}

            {/* Add Button */}
            {!showExpForm && (
              <button
                onClick={handleAddExperience}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed border-slate-600/50 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300 transition-all"
                style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
              >
                <Plus className="w-4 h-4" />
                Thêm Kinh Nghiệm
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Education Section */}
      <motion.div className="border border-slate-700/50 rounded-lg overflow-hidden bg-slate-800/30">
        <button
          onClick={() => toggleSection('education')}
          className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-slate-800/50 transition-all"
        >
          <span className="font-semibold text-white text-sm sm:text-base" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>Học Vấn ({educations.length})</span>
          <motion.div
            animate={{ rotate: expandedSections.education ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-5 h-5 text-slate-400" />
          </motion.div>
        </button>

        <motion.div
          animate={expandedSections.education ? 'expanded' : 'collapsed'}
          variants={sectionVariants}
          className="overflow-hidden"
        >
          <div ref={educationSectionRef} className="px-3 sm:px-4 pb-4 sm:pb-6 space-y-3 sm:space-y-4 border-t border-slate-700/50 pt-4 sm:pt-6 max-h-96 sm:max-h-[500px] overflow-y-auto">
            {/* List of Educations */}
            {educations.length > 0 && (
              <div className="space-y-3">
                {educations.map((edu) => (
                  <div
                    key={edu.id}
                    className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4 hover:border-slate-500/50 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">{edu.degree}</h4>
                        <p className="text-sm text-cyan-300">{edu.school}</p>
                        {edu.field && <p className="text-sm text-slate-400">{edu.field}</p>}
                        <p className="text-xs text-slate-400 mt-1">
                          {edu.startDate}
                          {edu.endDate ? ` → ${edu.endDate}` : ' → Hiện tại'}
                        </p>
                        {edu.description && (
                          <p className="text-sm text-slate-300 mt-2 line-clamp-2">{edu.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditEducation(edu)}
                          className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-600/50 rounded transition-all"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteEducation(edu.id)}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-600/50 rounded transition-all"
                          title="Xóa"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Form */}
            {showEduForm && editingEdu && (
              <div className="bg-slate-700/20 border border-slate-600/50 rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-white mb-4" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                  {editingEduId ? 'Chỉnh Sửa Học Vấn' : 'Thêm Học Vấn Mới'}
                </h4>

                {/* School */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Trường Học *</label>
                  <input
                    type="text"
                    value={editingEdu.school}
                    onChange={(e) =>
                      setEditingEdu({ ...editingEdu, school: e.target.value })
                    }
                    placeholder="vd: Đại Học Bách Khoa Hà Nội"
                    className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/70 text-sm"
                  />
                </div>

                {/* Currently Studying Checkbox */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingEdu.currentlyStudying}
                    onChange={(e) =>
                      setEditingEdu({
                        ...editingEdu,
                        currentlyStudying: e.target.checked,
                      })
                    }
                    className="rounded"
                  />
                  <span className="text-sm text-slate-300">Đang học tại đây</span>
                </label>

                {/* Degree - Show regardless of currentlyStudying */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Bằng Cấp {!editingEdu.currentlyStudying && '*'}</label>
                  <input
                    type="text"
                    value={editingEdu.degree}
                    onChange={(e) =>
                      setEditingEdu({ ...editingEdu, degree: e.target.value })
                    }
                    placeholder="vd: Thạc sĩ Khoa học máy tính, Đại học (đang học)"
                    className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/70 text-sm"
                  />
                  {editingEdu.currentlyStudying && (
                    <p className="text-xs text-slate-400 mt-1">Không bắt buộc khi đang học tại đây</p>
                  )}
                </div>

                {/* Field of Study */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Chuyên Ngành</label>
                  <input
                    type="text"
                    value={editingEdu.field}
                    onChange={(e) =>
                      setEditingEdu({ ...editingEdu, field: e.target.value })
                    }
                    placeholder="vd: Khoa học Máy tính, Kỹ thuật Phần mềm"
                    className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/70 text-sm"
                  />
                </div>

                {/* Start Date */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Năm Bắt Đầu</label>
                  <input
                    type="text"
                    value={editingEdu.startDate}
                    onChange={(e) =>
                      setEditingEdu({ ...editingEdu, startDate: e.target.value })
                    }
                    placeholder="vd: 2019, Tháng 9 năm 2019"
                    className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/70 text-sm"
                  />
                </div>

                {/* End Date - Show regardless of currentlyStudying */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Năm Kết Thúc {editingEdu.currentlyStudying ? '(Dự kiến)' : ''}
                  </label>
                  <input
                    type="text"
                    value={editingEdu.endDate}
                    onChange={(e) =>
                      setEditingEdu({ ...editingEdu, endDate: e.target.value })
                    }
                    placeholder={editingEdu.currentlyStudying ? "vd: Tháng 6 năm 2025 (dự kiến)" : "vd: 2023, Tháng 6 năm 2023"}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/70 text-sm"
                  />
                  {editingEdu.currentlyStudying && (
                    <p className="text-xs text-slate-400 mt-1">Để trống nếu không có dự kiến</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Mô Tả (Thành Tích, Hoạt Động)</label>
                  <textarea
                    value={editingEdu.description}
                    onChange={(e) =>
                      setEditingEdu({ ...editingEdu, description: e.target.value })
                    }
                    placeholder="vd: GPA: 3.8/4.0, Đạt giải Nhì cuộc thi ICPC Quốc Tế 2022"
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/70 text-sm resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleSaveEducation}
                    className="flex-1 px-3 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/30 transition-all font-medium text-sm"
                  >
                    Lưu
                  </button>
                  <button
                    onClick={() => {
                      setShowEduForm(false);
                      setEditingEdu(null);
                      setEditingEduId(null);
                    }}
                    className="flex-1 px-3 py-2 rounded-lg bg-slate-700/50 border border-slate-600/50 text-slate-300 hover:bg-slate-700 transition-all font-medium text-sm"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            )}

            {/* Add Button */}
            {!showEduForm && (
              <button
                onClick={handleAddEducation}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed border-slate-600/50 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300 transition-all"
                style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
              >
                <Plus className="w-4 h-4" />
                Thêm Học Vấn
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Projects Section */}
      <motion.div className="border border-slate-700/50 rounded-lg overflow-hidden bg-slate-800/30">
        <button
          onClick={() => toggleSection('projects')}
          className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-slate-800/50 transition-all"
        >
          <span className="font-semibold text-white text-sm sm:text-base" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>Dự Án ({projects.length})</span>
          <motion.div
            animate={{ rotate: expandedSections.projects ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-5 h-5 text-slate-400" />
          </motion.div>
        </button>

        <motion.div
          animate={expandedSections.projects ? 'expanded' : 'collapsed'}
          variants={sectionVariants}
          className="overflow-hidden"
        >
          <div ref={projectsSectionRef} className="px-3 sm:px-4 pb-4 sm:pb-6 space-y-3 sm:space-y-4 border-t border-slate-700/50 pt-4 sm:pt-6 max-h-96 sm:max-h-[500px] overflow-y-auto">
            {/* List of Projects */}
            {projects.length > 0 && (
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className={`border rounded-lg p-4 transition-all ${
                      proj.featured
                        ? 'bg-cyan-500/10 border-cyan-500/50 hover:border-cyan-400/70'
                        : 'bg-slate-700/30 border-slate-600/50 hover:border-slate-500/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-white">{proj.name}</h4>
                          {proj.featured && (
                            <span className="text-xs bg-cyan-500/30 text-cyan-300 px-2 py-0.5 rounded-full font-medium">
                              ⭐ Nổi Bật
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-300">{proj.description}</p>
                        {proj.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {proj.technologies.map((tech) => (
                              <span key={tech} className="text-xs bg-slate-600/50 text-slate-300 px-2 py-0.5 rounded">
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                        <p className="text-xs text-slate-400 mt-2">
                          {proj.startDate}
                          {proj.endDate ? ` → ${proj.endDate}` : ''}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditProject(proj)}
                          className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-600/50 rounded transition-all"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(proj.id)}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-600/50 rounded transition-all"
                          title="Xóa"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Form */}
            {showProjForm && editingProj && (
              <div className="bg-slate-700/20 border border-slate-600/50 rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-white mb-4" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                  {editingProjId ? 'Chỉnh Sửa Dự Án' : 'Thêm Dự Án Mới'}
                </h4>

                {/* Project Name */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Tên Dự Án *</label>
                  <input
                    type="text"
                    value={editingProj.name}
                    onChange={(e) =>
                      setEditingProj({ ...editingProj, name: e.target.value })
                    }
                    placeholder="vd: Nền tảng Thương mại điện tử"
                    className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/70 text-sm"
                  />
                </div>

                {/* Project Description */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Mô Tả</label>
                  <textarea
                    value={editingProj.description}
                    onChange={(e) =>
                      setEditingProj({ ...editingProj, description: e.target.value })
                    }
                    placeholder="Mô tả chi tiết về dự án, chức năng chính..."
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/70 text-sm resize-none"
                  />
                </div>

                {/* Technologies */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Công Nghệ Sử Dụng ({editingProj.technologies.length})
                  </label>
                  {editingProj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {editingProj.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded text-xs font-medium border border-cyan-500/50"
                        >
                          {tech}
                          <button
                            onClick={() => handleRemoveProjectTechnology(tech)}
                            className="ml-1 hover:text-cyan-100"
                            type="button"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="techInput"
                      placeholder="React, Node.js, v.v."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && (e.target as HTMLInputElement).value) {
                          handleAddProjectTechnology((e.target as HTMLInputElement).value);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                      className="flex-1 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/70 text-sm"
                    />
                    <button
                      onClick={() => {
                        const input = document.getElementById('techInput') as HTMLInputElement;
                        if (input.value) {
                          handleAddProjectTechnology(input.value);
                          input.value = '';
                        }
                      }}
                      className="px-3 py-2 bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 rounded-lg hover:bg-cyan-500/30 transition-all text-sm font-medium"
                    >
                      Thêm
                    </button>
                  </div>
                </div>

                {/* Start Date */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Ngày Bắt Đầu</label>
                  <input
                    type="text"
                    value={editingProj.startDate}
                    onChange={(e) =>
                      setEditingProj({ ...editingProj, startDate: e.target.value })
                    }
                    placeholder="vd: Tháng 1 năm 2023"
                    className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/70 text-sm"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Ngày Kết Thúc</label>
                  <input
                    type="text"
                    value={editingProj.endDate}
                    onChange={(e) =>
                      setEditingProj({ ...editingProj, endDate: e.target.value })
                    }
                    placeholder="vd: Tháng 6 năm 2024 (Để trống nếu đang tiến hành)"
                    className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/70 text-sm"
                  />
                </div>

                {/* Project Link */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Liên Kết Dự Án</label>
                  <input
                    type="url"
                    value={editingProj.link}
                    onChange={(e) =>
                      setEditingProj({ ...editingProj, link: e.target.value })
                    }
                    placeholder="https://github.com/... hoặc https://project.com"
                    className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/70 text-sm"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleSaveProject}
                    className="flex-1 px-3 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/30 transition-all font-medium text-sm"
                  >
                    Lưu
                  </button>
                  <button
                    onClick={() => {
                      setShowProjForm(false);
                      setEditingProj(null);
                      setEditingProjId(null);
                    }}
                    className="flex-1 px-3 py-2 rounded-lg bg-slate-700/50 border border-slate-600/50 text-slate-300 hover:bg-slate-700 transition-all font-medium text-sm"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            )}

            {/* Add Button */}
            {!showProjForm && (
              <button
                onClick={handleAddProject}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed border-slate-600/50 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300 transition-all"
                style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
              >
                <Plus className="w-4 h-4" />
                Thêm Dự Án
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
