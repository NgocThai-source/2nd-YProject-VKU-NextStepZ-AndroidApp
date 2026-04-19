'use client';

import { motion } from 'framer-motion';
import { Briefcase, Award, Mail, Phone, MapPin, Github, Facebook, Calendar, Sparkles } from 'lucide-react';

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

interface CreativeTemplateProps {
  data: PortfolioData;
}

export function CreativeTemplate({ data }: CreativeTemplateProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className="h-full bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 overflow-y-auto">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        className="relative space-y-4 sm:space-y-6 p-4 sm:p-6 md:p-8 max-w-5xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section - Enhanced */}
        <motion.div
          variants={itemVariants}
          className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-linear-to-135 from-purple-600 via-pink-600 to-purple-700" />
          
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 right-0 w-48 sm:w-72 h-48 sm:h-72 bg-white/10 rounded-full blur-2xl transform translate-x-1/3 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-40 sm:w-64 h-40 sm:h-64 bg-white/10 rounded-full blur-2xl transform -translate-x-1/4 translate-y-1/2" />
          </div>

          {/* Content */}
          <div className="relative px-4 sm:px-6 md:px-10 py-6 sm:py-10 md:py-12 text-white">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 md:gap-8">
              {/* Avatar with enhanced styling */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="shrink-0"
              >
                <div className="relative">
                  <div className="w-24 h-24 sm:w-28 md:w-32 rounded-2xl sm:rounded-3xl bg-white/20 backdrop-blur-md border-3 border-white flex items-center justify-center text-3xl sm:text-5xl md:text-6xl shadow-xl overflow-hidden ring-4 ring-white/30">
                    {data.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={data.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span>👤</span>
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center text-base sm:text-lg shadow-lg">
                    ✨
                  </div>
                </div>
              </motion.div>

              {/* Profile Info */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex-1 min-w-0 text-center sm:text-left"
              >
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3 tracking-tight drop-shadow-lg">
                  {data.title || 'Tiêu Đề Chuyên Nghiệp Của Bạn'}
                </h1>
                <p className="text-base sm:text-xl text-white/90 font-semibold mb-4 sm:mb-6 drop-shadow-md">
                  {data.headline || 'Tiêu đề phụ chuyên nghiệp của bạn'}
                </p>

                {/* Contact Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {data.contactJson.email && (
                    <motion.div
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-2 sm:gap-3 bg-white/15 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-white/25 transition-all justify-center sm:justify-start text-xs sm:text-sm"
                    >
                      <Mail className="w-4 h-4 shrink-0" />
                      <span className="truncate">{data.contactJson.email}</span>
                    </motion.div>
                  )}
                  {data.contactJson.phone && (
                    <motion.div
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-2 sm:gap-3 bg-white/15 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-white/25 transition-all justify-center sm:justify-start text-xs sm:text-sm"
                    >
                      <Phone className="w-4 h-4 shrink-0" />
                      <span>{data.contactJson.phone}</span>
                    </motion.div>
                  )}
                  {(data.contactJson.city || data.contactJson.district) && (
                    <motion.div
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-2 sm:gap-3 bg-white/15 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-white/25 transition-all justify-center sm:justify-start text-xs sm:text-sm col-span-1 sm:col-span-2"
                    >
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span>
                        {data.contactJson.city}
                        {data.contactJson.district && `, ${data.contactJson.district}`}
                      </span>
                    </motion.div>
                  )}
                  
                  {/* Social Links */}
                  {(data.contactJson.facebook || data.contactJson.github) && (
                    <div className="flex items-center gap-2 col-span-1 sm:col-span-2 justify-center sm:justify-start">
                      {data.contactJson.facebook && (
                        <motion.a
                          whileHover={{ y: -3 }}
                          href={data.contactJson.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 sm:p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all backdrop-blur-md"
                        >
                          <Facebook className="w-4 h-4" />
                        </motion.a>
                      )}
                      {data.contactJson.github && (
                        <motion.a
                          whileHover={{ y: -3 }}
                          href={data.contactJson.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 sm:p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all backdrop-blur-md"
                        >
                          <Github className="w-4 h-4" />
                        </motion.a>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* About Section */}
        {data.summary && (
          <motion.section
            variants={itemVariants}
            className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-white/20 hover:border-white/40 transition-all shadow-lg"
          >
            <h2 className="text-lg sm:text-2xl font-bold text-white mb-3 sm:mb-4 pb-2 sm:pb-3 border-b border-white/20 flex items-center gap-2 sm:gap-3">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300" />
              Giới Thiệu
            </h2>
            <p className="text-slate-100 leading-relaxed text-sm sm:text-base">{data.summary}</p>
          </motion.section>
        )}

        {/* Skills Section */}
        {data.skills && data.skills.selected && data.skills.selected.length > 0 && (
          <motion.section
            variants={itemVariants}
            className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-white/20 hover:border-white/40 transition-all shadow-lg"
          >
            <h2 className="text-lg sm:text-2xl font-bold text-white mb-4 sm:mb-6 pb-2 sm:pb-3 border-b border-white/20 flex items-center gap-2 sm:gap-3">
              <Award className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-300" />
              Kỹ Năng
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
              {data.skills.selected.map((skill, idx) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + idx * 0.05 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="px-3 sm:px-4 py-2 sm:py-3 bg-linear-to-r from-purple-500/30 to-pink-500/30 text-white rounded-lg sm:rounded-xl text-center font-semibold text-xs sm:text-sm border border-purple-400/50 hover:border-purple-300 transition-all cursor-default shadow-lg backdrop-blur-sm"
                >
                  {skill}
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Languages Section */}
        {data.languages && data.languages.items && data.languages.items.length > 0 && (
          <motion.section
            variants={itemVariants}
            className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-white/20 hover:border-white/40 transition-all shadow-lg"
          >
            <h2 className="text-lg sm:text-2xl font-bold text-white mb-4 sm:mb-6 pb-2 sm:pb-3 border-b border-white/20 flex items-center gap-2 sm:gap-3">
              <span className="text-xl sm:text-2xl">🌍</span>
              Ngôn Ngữ
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {data.languages.items.map((lang, idx) => (
                <motion.div
                  key={lang.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  whileHover={{ y: -2 }}
                  className="px-4 py-3 bg-linear-to-r from-emerald-500/20 to-teal-500/20 text-white rounded-xl border border-emerald-400/50 hover:border-emerald-300 transition-all backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{lang.language.flag}</span>
                      <div>
                        <p className="font-semibold text-sm">{lang.language.name}</p>
                        <p className="text-xs text-slate-200">{lang.proficiency}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 w-2 rounded-full ${
                          i < lang.levelScore
                            ? 'bg-emerald-300'
                            : 'bg-white/30'
                        }`}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Experience Section */}
        {data.experience && data.experience.items && data.experience.items.length > 0 && (
          <motion.section
            variants={itemVariants}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:border-white/40 transition-all shadow-lg"
          >
            <h2 className="text-2xl font-bold text-white mb-6 pb-3 border-b border-white/20 flex items-center gap-3">
              <Briefcase className="w-6 h-6 text-blue-300" />
              Kinh Nghiệm Làm Việc
            </h2>
            <div className="space-y-5">
              {data.experience.items.map((exp, idx) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  className="relative pl-6 pb-5 border-l-2 border-purple-400/50 last:pb-0 hover:border-purple-300 transition-all"
                >
                  <div className="absolute -left-3 top-1 w-4 h-4 rounded-full bg-purple-500 border-2 border-white shadow-md" />
                  
                  <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all">
                    <h3 className="text-lg font-bold text-white mb-1">{exp.position}</h3>
                    <p className="text-purple-200 font-semibold text-sm mb-2">{exp.company}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-300 mb-3">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {exp.startDate}
                        {exp.endDate ? ` - ${exp.endDate}` : ' - Hiện tại'}
                      </span>
                    </div>
                    {exp.description && (
                      <p className="text-slate-100 leading-relaxed text-sm">{exp.description}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Education Section */}
        {data.education && data.education.items && data.education.items.length > 0 && (
          <motion.section
            variants={itemVariants}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:border-white/40 transition-all shadow-lg"
          >
            <h2 className="text-2xl font-bold text-white mb-6 pb-3 border-b border-white/20 flex items-center gap-3">
              <span className="text-2xl">🎓</span>
              Học Vấn
            </h2>
            <div className="space-y-5">
              {data.education.items.map((edu, idx) => (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + idx * 0.1 }}
                  className="relative pl-6 pb-5 border-l-2 border-cyan-400/50 last:pb-0 hover:border-cyan-300 transition-all"
                >
                  <div className="absolute -left-3 top-1 w-4 h-4 rounded-full bg-cyan-500 border-2 border-white shadow-md" />
                  
                  <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all">
                    <h3 className="text-lg font-bold text-white mb-1">{edu.degree}</h3>
                    <p className="text-cyan-200 font-semibold text-sm mb-2">
                      {edu.school}
                      {edu.field ? ` • ${edu.field}` : ''}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-300 mb-3">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {edu.startDate}
                        {edu.endDate ? ` - ${edu.endDate}` : ' - Hiện tại'}
                      </span>
                    </div>
                    {edu.description && (
                      <p className="text-slate-100 leading-relaxed text-sm">{edu.description}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Projects Section */}
        {data.projects && data.projects.items && data.projects.items.length > 0 && (
          <motion.section
            variants={itemVariants}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:border-white/40 transition-all shadow-lg"
          >
            <h2 className="text-2xl font-bold text-white mb-6 pb-3 border-b border-white/20 flex items-center gap-3">
              <span className="text-2xl">🚀</span>
              Dự Án Nổi Bật
            </h2>
            <div className="space-y-5">
              {data.projects.items
                .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
                .map((proj, idx) => (
                  <motion.div
                    key={proj.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + idx * 0.1 }}
                    whileHover={{ y: -4 }}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      proj.featured
                        ? 'bg-linear-to-r from-purple-500/20 to-pink-500/20 border-purple-400 shadow-lg'
                        : 'bg-white/5 border-white/20 hover:border-white/40 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h3 className="text-lg font-bold text-white">{proj.name}</h3>
                          {proj.featured && (
                            <span className="px-2 py-1 bg-yellow-500/30 text-yellow-200 text-xs font-bold rounded-full border border-yellow-400/50">
                              ⭐ Nổi Bật
                            </span>
                          )}
                        </div>
                        <p className="text-slate-100 text-sm leading-relaxed mb-3">{proj.description}</p>
                      </div>
                    </div>

                    {/* Technologies */}
                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {proj.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 bg-white/10 text-purple-200 text-xs font-semibold rounded-full border border-purple-400/30 backdrop-blur-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Date and Link */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <div className="flex items-center gap-2 text-xs text-slate-300">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {proj.startDate}
                          {proj.endDate ? ` - ${proj.endDate}` : ''}
                        </span>
                      </div>
                      {proj.link && (
                        <motion.a
                          whileHover={{ x: 2 }}
                          href={proj.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-semibold rounded-lg transition-all"
                        >
                          Xem Dự Án →
                        </motion.a>
                      )}
                    </div>
                  </motion.div>
                ))}
            </div>
          </motion.section>
        )}

        {/* Footer Spacing */}
        <div className="h-8" />
      </motion.div>
    </div>
  );
}
