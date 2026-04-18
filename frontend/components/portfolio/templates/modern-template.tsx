'use client';

import { motion } from 'framer-motion';
import { Briefcase, Mail, Phone, MapPin, Github, Facebook, Calendar, ExternalLink, Code2, Lightbulb } from 'lucide-react';

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

interface ModernTemplateProps {
  data: PortfolioData;
}

export function ModernTemplate({ data }: ModernTemplateProps) {
  return (
    <div className="h-full bg-white flex flex-col overflow-hidden">
      {/* Header Section - Minimalist Professional Design */}
      <motion.div
        className="border-b border-slate-200 bg-linear-to-r from-slate-50 via-blue-50 to-slate-50 px-4 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-6 md:py-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto">
          {/* Avatar - Elegant and Professional */}
          <motion.div
            className="shrink-0"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <div className="w-24 h-24 sm:w-28 md:w-32 lg:h-32 rounded-lg bg-linear-to-br from-blue-100 to-cyan-100 border-2 border-blue-200 flex items-center justify-center text-3xl sm:text-4xl md:text-5xl shadow-md overflow-hidden">
              {data.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={data.photoUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span>👤</span>
              )}
            </div>
          </motion.div>

          {/* Profile Info */}
          <motion.div
            className="flex-1 pt-0 sm:pt-2 text-center sm:text-left"
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-2 sm:mb-3 tracking-tight">
              {data.title || 'Tiêu Đề Chuyên Nghiệp Của Bạn'}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-blue-600 font-semibold mb-3 sm:mb-5">
              {data.headline || 'Tiêu đề phụ chuyên nghiệp của bạn'}
            </p>

            {/* Contact Info - Horizontal Layout */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-5 mb-4 text-xs sm:text-sm justify-center sm:justify-start">
              {data.contactJson.email && (
                <motion.div
                  className="flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors"
                  whileHover={{ x: 2 }}
                >
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 shrink-0" />
                  <span className="font-medium truncate">{data.contactJson.email}</span>
                </motion.div>
              )}
              {data.contactJson.phone && (
                <motion.div
                  className="flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors"
                  whileHover={{ x: 2 }}
                >
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 shrink-0" />
                  <span className="font-medium">{data.contactJson.phone}</span>
                </motion.div>
              )}
              {(data.contactJson.city || data.contactJson.district) && (
                <motion.div
                  className="flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors"
                  whileHover={{ x: 2 }}
                >
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 shrink-0" />
                  <span className="font-medium">
                    {data.contactJson.city}
                    {data.contactJson.district && `, ${data.contactJson.district}`}
                  </span>
                </motion.div>
              )}
            </div>

            {/* Social Links */}
            <motion.div
              className="flex gap-2 sm:gap-3 justify-center sm:justify-start flex-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              {data.contactJson.facebook && (
                <a
                  href={data.contactJson.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all font-medium text-xs sm:text-sm border border-blue-200"
                >
                  <Facebook className="w-4 h-4" />
                  <span className="hidden sm:inline">Facebook</span>
                </a>
              )}
              {data.contactJson.github && (
                <a
                  href={data.contactJson.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all font-medium text-xs sm:text-sm border border-slate-300"
                >
                  <Github className="w-4 h-4" />
                  <span className="hidden sm:inline">GitHub</span>
                </a>
              )}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content - Two Column Layout for Better Organization */}
      <motion.div
        className="flex-1 overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 md:py-10">
          {/* Left Column - About & Summary */}
          <div className="md:col-span-2 space-y-6 sm:space-y-8">
            {/* About Section */}
            {data.summary && (
              <motion.section
                className="bg-linear-to-br from-slate-50 to-slate-100 rounded-xl p-4 sm:p-6 md:p-8 border border-slate-200"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-5">
                  <div className="w-1 h-6 sm:h-8 bg-blue-500 rounded"></div>
                  <h2 className="text-lg sm:text-2xl font-bold text-slate-900">Giới Thiệu</h2>
                </div>
                <p className="text-slate-700 leading-relaxed text-sm sm:text-base font-medium">
                  {data.summary}
                </p>
              </motion.section>
            )}

            {/* Experience Section */}
            {data.experience && data.experience.items && data.experience.items.length > 0 && (
              <motion.section
                className="space-y-6"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-3">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-slate-900">Kinh Nghiệm Làm Việc</h2>
                </div>
                <div className="space-y-5">
                  {data.experience.items.map((exp, idx) => (
                    <motion.div
                      key={exp.id}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + idx * 0.1 }}
                      className="bg-white rounded-xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900">{exp.position}</h3>
                          <p className="text-blue-600 font-semibold text-lg mt-1">{exp.company}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600 mb-4 font-medium">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>
                          {exp.startDate}
                          {exp.endDate ? ` - ${exp.endDate}` : ' - Hiện tại'}
                        </span>
                      </div>
                      {exp.description && (
                        <p className="text-slate-700 leading-relaxed text-sm">{exp.description}</p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Projects Section */}
            {data.projects && data.projects.items && data.projects.items.length > 0 && (
              <motion.section
                className="space-y-6"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center gap-3">
                  <Lightbulb className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-slate-900">Dự Án Nổi Bật</h2>
                </div>
                <div className="space-y-5">
                  {data.projects.items
                    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
                    .map((proj, idx) => (
                      <motion.div
                        key={proj.id}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + idx * 0.1 }}
                        className={`rounded-xl p-6 border transition-all ${
                          proj.featured
                            ? 'bg-linear-to-br from-blue-50 to-cyan-50 border-blue-300 shadow-md'
                            : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-bold text-slate-900">{proj.name}</h3>
                              {proj.featured && (
                                <span className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
                                  ⭐ Nổi Bật
                                </span>
                              )}
                            </div>
                            <p className="text-slate-700 text-sm mb-3">{proj.description}</p>
                          </div>
                        </div>

                        {/* Technologies */}
                        {proj.technologies && proj.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {proj.technologies.slice(0, 4).map((tech) => (
                              <span
                                key={tech}
                                className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full border border-blue-200"
                              >
                                {tech}
                              </span>
                            ))}
                            {proj.technologies.length > 4 && (
                              <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full border border-slate-200">
                                +{proj.technologies.length - 4} more
                              </span>
                            )}
                          </div>
                        )}

                        {/* Date and Link */}
                        <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                          <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {proj.startDate}
                              {proj.endDate ? ` - ${proj.endDate}` : ''}
                            </span>
                          </div>
                          {proj.link && (
                            <a
                              href={proj.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-xs font-semibold rounded-lg hover:bg-blue-600 transition-all"
                            >
                              Xem Dự Án
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </motion.div>
                    ))}
                </div>
              </motion.section>
            )}
          </div>

          {/* Right Column - Skills & Education */}
          <div className="md:col-span-1 space-y-6 sm:space-y-8">
            {/* Skills Section */}
            {data.skills && data.skills.selected && data.skills.selected.length > 0 && (
              <motion.section
                className="bg-white rounded-xl p-6 border border-slate-200"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <Code2 className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-bold text-slate-900">Kỹ Năng</h2>
                </div>
                <div className="space-y-3">
                  {data.skills.selected.map((skill, idx) => (
                    <motion.div
                      key={skill}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.35 + idx * 0.05 }}
                      className="flex items-center gap-3 p-3 bg-linear-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200 hover:border-blue-400 transition-all group cursor-default"
                    >
                      <div className="w-2 h-2 rounded-full bg-blue-500 group-hover:scale-150 transition-transform"></div>
                      <span className="font-semibold text-slate-900 text-sm">{skill}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Education Section */}
            {data.education && data.education.items && data.education.items.length > 0 && (
              <motion.section
                className="bg-white rounded-xl p-6 border border-slate-200"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-2xl">🎓</span>
                  <h2 className="text-xl font-bold text-slate-900">Học Vấn</h2>
                </div>
                <div className="space-y-4">
                  {data.education.items.map((edu, idx) => (
                    <motion.div
                      key={edu.id}
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.45 + idx * 0.1 }}
                      className="pb-4 border-b border-slate-200 last:pb-0 last:border-b-0"
                    >
                      <h3 className="font-bold text-slate-900 text-sm mb-1">{edu.degree}</h3>
                      <p className="text-blue-600 font-semibold text-xs mb-2">{edu.school}</p>
                      {edu.field && (
                        <p className="text-slate-600 text-xs mb-2">{edu.field}</p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {edu.startDate}
                          {edu.endDate ? ` - ${edu.endDate}` : ' - Hiện tại'}
                        </span>
                      </div>
                      {edu.description && (
                        <p className="text-slate-700 text-xs mt-2">{edu.description}</p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Languages Section */}
            {data.languages && data.languages.items && data.languages.items.length > 0 && (
              <motion.section
                className="bg-white rounded-xl p-6 border border-slate-200"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-2xl">🌍</span>
                  <h2 className="text-xl font-bold text-slate-900">Ngôn Ngữ</h2>
                </div>
                <div className="space-y-3">
                  {data.languages.items.map((lang, idx) => (
                    <motion.div
                      key={lang.id}
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.55 + idx * 0.1 }}
                      className="flex items-start gap-3 p-3 bg-linear-to-r from-cyan-50 to-blue-50 rounded-lg border border-cyan-200 hover:border-cyan-400 transition-all"
                    >
                      <span className="text-lg mt-0.5">{lang.language.flag}</span>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900 text-sm">{lang.language.name}</p>
                        <p className="text-xs text-slate-600 mb-1">{lang.proficiency}</p>
                        <div className="flex gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <div
                              key={i}
                              className={`h-1.5 w-2 rounded-full ${
                                i < lang.levelScore
                                  ? 'bg-cyan-500'
                                  : 'bg-slate-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}
          </div>
        </div>

        {/* Footer Padding */}
        <div className="h-8" />
      </motion.div>
    </div>
  );
}
