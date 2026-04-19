'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Github, Facebook, ExternalLink, Award } from 'lucide-react';

interface ContactJson {
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

interface LanguageSkill {
  id: string;
  language: {
    name: string;
    flag: string;
  };
  proficiency: string;
  levelScore: number;
}

interface LanguagesData {
  items: LanguageSkill[];
}

interface PortfolioData {
  title: string;
  headline: string;
  summary: string;
  photoUrl: string;
  contactJson: ContactJson;
  skills?: SkillsData;
  languages?: LanguagesData;
  experience?: ExperienceData;
  education?: EducationData;
  projects?: ProjectsData;
}

interface MinimalTemplateProps {
  data: PortfolioData;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
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

export function MinimalTemplate({ data }: MinimalTemplateProps) {
  return (
    <div className="min-h-full bg-linear-to-br from-slate-950 via-black to-slate-900 text-white overflow-y-auto">
      {/* Header Section - Hero */}
      <motion.div
        className="relative px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16 border-b border-slate-800/50 bg-linear-to-b from-slate-900/50 to-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Top Row - Avatar, Title and Contact */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 sm:gap-8 mb-6 sm:mb-8">
            {/* Left Side - Avatar, Title and Headline */}
            <motion.div className="flex-1" variants={itemVariants}>
              {/* Avatar Section */}
              <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                {/* Avatar Container */}
                <div className="relative shrink-0 self-center sm:self-start">
                  {/* Gradient Ring Background */}
                  <div className="absolute inset-0 bg-linear-to-br from-cyan-500 via-blue-500 to-purple-500 rounded-full blur-lg opacity-75 animate-pulse" />
                  
                  {/* Avatar Frame */}
                  <div className="relative w-24 h-24 sm:w-28 md:w-28 rounded-full border-4 border-slate-900 bg-slate-800 overflow-hidden shadow-2xl">
                    {data.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img 
                        src={data.photoUrl} 
                        alt={data.title || 'Profile'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-linear-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                        <span className="text-3xl sm:text-5xl">👤</span>
                      </div>
                    )}
                  </div>

                  {/* Status Indicator */}
                  <div className="absolute bottom-2 right-2 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse" />
                </div>

                {/* Title and Headline */}
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold tracking-tight mb-1 sm:mb-2 bg-linear-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                    {data.title || 'Your Name'}
                  </h1>
                  <div className="h-1 w-8 sm:w-12 bg-linear-to-r from-cyan-500 to-blue-500 rounded-full mb-2 sm:mb-3 mx-auto sm:mx-0" />
                  <p className="text-base sm:text-lg md:text-xl font-light text-slate-200 leading-relaxed">
                    {data.headline || 'Professional Headline'}
                  </p>
                </div>
              </div>

              {/* Summary */}
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light text-center sm:text-left">
                {data.summary || 'Your professional summary goes here'}
              </p>
            </motion.div>

            {/* Right Side - Contact Info */}
            <motion.div className="w-full lg:w-96 shrink-0" variants={itemVariants}>
              <div className="bg-slate-900/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 border border-slate-700/50 hover:border-slate-600/80 transition-all">
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-widest mb-3 sm:mb-4 flex items-center gap-2">
                  <Award className="w-4 h-4 text-cyan-400" />
                  Thông Tin Liên Hệ
                </h3>
                
                <div className="space-y-2 sm:space-y-3">
                  {data.contactJson.email && (
                    <a
                      href={`mailto:${data.contactJson.email}`}
                      className="flex items-center gap-2 sm:gap-3 text-slate-300 hover:text-cyan-400 transition-colors text-xs sm:text-sm group"
                    >
                      <Mail className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors shrink-0" />
                      <span className="truncate">{data.contactJson.email}</span>
                    </a>
                  )}

                  {data.contactJson.phone && (
                    <a
                      href={`tel:${data.contactJson.phone}`}
                      className="flex items-center gap-2 sm:gap-3 text-slate-300 hover:text-cyan-400 transition-colors text-xs sm:text-sm group"
                    >
                      <Phone className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors shrink-0" />
                      <span>{data.contactJson.phone}</span>
                    </a>
                  )}

                  {(data.contactJson.city || data.contactJson.district) && (
                    <div className="flex items-start gap-2 sm:gap-3 text-slate-300 text-xs sm:text-sm group">
                      <MapPin className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors shrink-0 mt-0.5" />
                      <span>
                        {data.contactJson.city}
                        {data.contactJson.district && `, ${data.contactJson.district}`}
                      </span>
                    </div>
                  )}
                </div>

                {/* Social Links */}
                {(data.contactJson.facebook || data.contactJson.github) && (
                  <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-700/50">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 sm:mb-3">Mạng Xã Hội</p>
                    <div className="flex gap-2 sm:gap-3">
                      {data.contactJson.github && (
                        <a
                          href={data.contactJson.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-cyan-400 transition-all border border-slate-700/30 hover:border-cyan-500/50 group"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {data.contactJson.facebook && (
                        <a
                          href={data.contactJson.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-cyan-400 transition-all border border-slate-700/30 hover:border-cyan-500/50"
                        >
                          <Facebook className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16">
        <motion.div
          className="space-y-8 sm:space-y-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Skills Section */}
          {data.skills && data.skills.selected && data.skills.selected.length > 0 && (
            <motion.div variants={itemVariants}>
              <div className="border-l-4 border-cyan-500 pl-4 sm:pl-6 mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">Kỹ Năng</h2>
                <p className="text-xs sm:text-sm text-slate-400">Chuyên môn và năng lực chính</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
                {data.skills.selected.map((skill) => (
                  <motion.div
                    key={skill}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="group relative"
                  >
                    <div className="absolute inset-0 bg-linear-to-r from-cyan-500/20 to-blue-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-all" />
                    <div className="relative px-3 py-2 sm:py-3 rounded-lg bg-slate-900/80 border border-slate-700/50 group-hover:border-cyan-500/50 transition-all text-center">
                      <span className="text-xs sm:text-sm font-medium text-slate-200">{skill}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Languages Section */}
          {data.languages && data.languages.items && data.languages.items.length > 0 && (
            <motion.div variants={itemVariants}>
              <div className="border-l-4 border-emerald-500 pl-4 sm:pl-6 mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">Ngôn Ngữ</h2>
                <p className="text-xs sm:text-sm text-slate-400">Khả năng giao tiếp quốc tế</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                {data.languages.items.map((lang) => (
                  <motion.div
                    key={lang.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="group relative"
                  >
                    <div className="absolute inset-0 bg-linear-to-r from-emerald-500/20 to-teal-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-all" />
                    <div className="relative px-4 py-3 sm:py-4 rounded-lg bg-slate-900/80 border border-slate-700/50 group-hover:border-emerald-500/50 transition-all">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg">{lang.language.flag}</span>
                          <div>
                            <p className="text-sm font-medium text-slate-200">{lang.language.name}</p>
                            <p className="text-xs text-slate-400">{lang.proficiency}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div
                            key={i}
                            className={`h-1.5 w-2 rounded-full ${
                              i < lang.levelScore
                                ? 'bg-emerald-500'
                                : 'bg-slate-700/50'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Experience Section */}
          {data.experience && data.experience.items && data.experience.items.length > 0 && (
            <motion.div variants={itemVariants}>
              <div className="border-l-4 border-cyan-500 pl-4 sm:pl-6 mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">Kinh Nghiệm Làm Việc</h2>
                <p className="text-xs sm:text-sm text-slate-400">Quá trình phát triển sự nghiệp</p>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {data.experience.items.map((exp, idx) => (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group relative"
                  >
                    <div className="absolute left-0 top-0 w-1 h-full bg-linear-to-b from-cyan-500 via-blue-500 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-all" />
                    <div className="bg-slate-900/50 border border-slate-700/50 group-hover:border-slate-600/80 rounded-lg p-4 sm:p-6 transition-all">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <div className="flex-1">
                          <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors">
                            {exp.position}
                          </h3>
                          <p className="text-slate-400 text-xs sm:text-sm font-medium">{exp.company}</p>
                        </div>
                        <span className="text-xs sm:text-sm font-mono text-slate-500 bg-slate-800/50 px-3 py-1 rounded whitespace-nowrap" style={{ fontFamily: "'Exo 2 Regular', monospace" }}>
                          {exp.startDate}
                          {exp.endDate ? ` - ${exp.endDate}` : ' - Hiện tại'}
                        </span>
                      </div>

                      {exp.description && (
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Education Section */}
          {data.education && data.education.items && data.education.items.length > 0 && (
            <motion.div variants={itemVariants}>
              <div className="border-l-4 border-cyan-500 pl-4 sm:pl-6 mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">Học Vấn</h2>
                <p className="text-xs sm:text-sm text-slate-400">Nền tảng giáo dục chuyên môn</p>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {data.education.items.map((edu, idx) => (
                  <motion.div
                    key={edu.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group"
                  >
                    <div className="absolute left-0 top-0 w-1 h-full bg-linear-to-b from-cyan-500 via-blue-500 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-all" />
                    <div className="bg-slate-900/50 border border-slate-700/50 group-hover:border-slate-600/80 rounded-lg p-4 sm:p-6 transition-all">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <div className="flex-1">
                          <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors">
                            {edu.degree}
                          </h3>
                          <p className="text-slate-400 text-xs sm:text-sm font-medium">
                            {edu.school}
                            {edu.field && ` • ${edu.field}`}
                          </p>
                        </div>
                        <span className="text-xs sm:text-sm font-mono text-slate-500 bg-slate-800/50 px-3 py-1 rounded whitespace-nowrap" style={{ fontFamily: "'Exo 2 Regular', monospace" }}>
                          {edu.startDate}
                          {edu.endDate ? ` - ${edu.endDate}` : ' - Hiện tại'}
                        </span>
                      </div>

                      {edu.description && (
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                          {edu.description}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Projects Section */}
          {data.projects && data.projects.items && data.projects.items.length > 0 && (
            <motion.div variants={itemVariants}>
              <div className="border-l-4 border-cyan-500 pl-4 sm:pl-6 mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">Dự Án</h2>
                <p className="text-xs sm:text-sm text-slate-400">Các dự án tiêu biểu và thành tựu</p>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {data.projects.items
                  .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
                  .map((proj, idx) => (
                    <motion.div
                      key={proj.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`group rounded-lg border transition-all ${
                        proj.featured
                          ? 'border-cyan-500/50 bg-linear-to-br from-cyan-500/10 to-blue-500/10'
                          : 'border-slate-700/50 bg-slate-900/50 hover:border-slate-600/80'
                      }`}
                    >
                      <div className="p-4 sm:p-6">
                        <div className="flex items-start justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors">
                                {proj.name}
                              </h3>
                              {proj.featured && (
                                <span className="px-2 py-1 bg-cyan-500/20 text-cyan-300 text-xs font-semibold rounded-full border border-cyan-500/30">
                                  Nổi bật
                                </span>
                              )}
                            </div>
                            <p className="text-slate-400 text-xs font-mono">
                              {proj.startDate}
                              {proj.endDate && ` - ${proj.endDate}`}
                            </p>
                          </div>

                          {proj.link && (
                            <a
                              href={proj.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-cyan-400 transition-all border border-slate-700/30 hover:border-cyan-500/50"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>

                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light mb-3 sm:mb-4">
                          {proj.description}
                        </p>

                        {proj.technologies && proj.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {proj.technologies.map((tech) => (
                              <span
                                key={tech}
                                className="inline-block px-2 sm:px-3 py-1 bg-slate-800/60 text-slate-300 text-xs rounded border border-slate-700/50 hover:border-slate-600 transition-all"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        className="border-t border-slate-800/50 bg-slate-950/50 backdrop-blur-sm py-6 sm:py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="max-w-6xl mx-auto px-12 text-center">
          <p className="text-xs text-slate-500 font-light">
            © 2025 Được tạo với <span className="text-cyan-400">NextStepZ</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
