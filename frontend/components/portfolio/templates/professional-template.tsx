'use client';

import { motion } from 'framer-motion';
import { Briefcase, Mail, Phone, MapPin, Github, Facebook, Calendar, ExternalLink } from 'lucide-react';

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

interface ProfessionalTemplateProps {
  data: PortfolioData;
}

export function ProfessionalTemplate({ data }: ProfessionalTemplateProps) {
  return (
    <div className="flex flex-col md:flex-row h-full bg-white">
      {/* LEFT SIDEBAR - Đẹp và Sạch */}
      <motion.div
        className="w-full md:w-2/5 bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 text-white overflow-y-auto flex flex-col p-4 sm:p-6 md:p-8 lg:p-10"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Avatar Section */}
        <motion.div
          className="text-center mb-6 sm:mb-8"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="w-28 h-28 sm:w-32 md:w-40 lg:h-40 rounded-2xl bg-linear-to-br from-cyan-300 to-blue-400 border-4 border-white flex items-center justify-center text-4xl sm:text-5xl md:text-7xl shadow-2xl mx-auto mb-4 sm:mb-6 overflow-hidden">
            {data.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.photoUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span>👤</span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 sm:mb-3 text-white">{data.title || 'Professional Title'}</h1>
          <p className="text-lg sm:text-xl text-cyan-300 font-semibold mb-2">{data.headline || 'Professional Subtitle'}</p>
          <div className="h-1 w-12 sm:w-16 bg-linear-to-r from-cyan-300 to-blue-400 mx-auto rounded-full" />
        </motion.div>

        {/* Contact Information */}
        <motion.div
          className="space-y-3 sm:space-y-4 mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-widest">Liên Hệ</h3>
          <div className="space-y-2 sm:space-y-3">
            {data.contactJson.email && (
              <motion.a
                href={`mailto:${data.contactJson.email}`}
                className="flex items-start gap-3 group cursor-pointer"
                whileHover={{ x: 5 }}
              >
                <Mail className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-sm text-slate-200 break-all group-hover:text-cyan-300 transition-colors">{data.contactJson.email}</span>
              </motion.a>
            )}
            {data.contactJson.phone && (
              <motion.a
                href={`tel:+84${data.contactJson.phone}`}
                className="flex items-start gap-3 group cursor-pointer"
                whileHover={{ x: 5 }}
              >
                <Phone className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-sm text-slate-200 group-hover:text-cyan-300 transition-colors">+84{data.contactJson.phone}</span>
              </motion.a>
            )}
            {(data.contactJson.city || data.contactJson.district) && (
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
                <span className="text-sm text-slate-200">
                  {data.contactJson.city}
                  {data.contactJson.district && `, ${data.contactJson.district}`}
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Divider */}
        <div className="h-px bg-slate-700/50 mb-8" />

        {/* About Section */}
        {data.summary && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-widest mb-3">Giới Thiệu</h3>
            <p className="text-slate-300 text-sm leading-relaxed">{data.summary}</p>
          </motion.div>
        )}

        {/* Divider */}
        <div className="h-px bg-slate-700/50 mb-8" />

        {/* Skills Section */}
        {data.skills && data.skills.selected && data.skills.selected.length > 0 && (
          <motion.div
            className="mt-auto pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-widest mb-4">Kỹ Năng Chính</h3>
            <div className="flex flex-wrap gap-2">
              {data.skills.selected.map((skill) => (
                <motion.span
                  key={skill}
                  className="px-3 py-1.5 bg-linear-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold rounded-full shadow-lg hover:shadow-xl transition-all"
                  whileHover={{ scale: 1.08, y: -2 }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Languages Section */}
        {data.languages && data.languages.items && data.languages.items.length > 0 && (
          <motion.div
            className="mt-6 pt-6 border-t border-slate-700/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
          >
            <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-widest mb-3">Ngôn Ngữ</h3>
            <div className="space-y-2.5">
              {data.languages.items.map((lang) => (
                <motion.div
                  key={lang.id}
                  className="flex items-center justify-between"
                  whileHover={{ x: 5 }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{lang.language.flag}</span>
                    <div>
                      <p className="text-sm font-semibold text-white">{lang.language.name}</p>
                      <p className="text-xs text-slate-400">{lang.proficiency}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 w-2 rounded-full ${
                          i < lang.levelScore
                            ? 'bg-cyan-400 shadow-lg'
                            : 'bg-slate-600/50'
                        }`}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Social Links */}
        {(data.contactJson.facebook || data.contactJson.github) && (
          <motion.div
            className="flex gap-3 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {data.contactJson.facebook && (
              <motion.a
                href={data.contactJson.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg bg-slate-700/50 hover:bg-cyan-600 transition-all flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
              >
                <Facebook className="w-5 h-5" />
              </motion.a>
            )}
            {data.contactJson.github && (
              <motion.a
                href={data.contactJson.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg bg-slate-700/50 hover:bg-cyan-600 transition-all flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
              >
                <Github className="w-5 h-5" />
              </motion.a>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* RIGHT CONTENT - Nội dung chính */}
      <motion.div
        className="w-full md:w-3/5 overflow-y-auto bg-white p-4 sm:p-6 md:p-8 lg:p-10"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="space-y-6 sm:space-y-8 max-w-3xl">
          {/* Experience Section */}
          {data.experience && data.experience.items && data.experience.items.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Briefcase className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900">Kinh Nghiệm Làm Việc</h2>
                <div className="flex-1 h-1 bg-linear-to-r from-blue-500 to-transparent rounded-full" />
              </div>
              <div className="space-y-4">
                {data.experience.items.map((exp, idx) => (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + idx * 0.08 }}
                    className="relative pl-6 pb-4 border-l-4 border-blue-500 last:border-l-2 last:border-blue-300"
                  >
                    <div className="absolute -left-3.5 top-1 w-6 h-6 rounded-full bg-blue-600 border-3 border-white shadow-md" />
                    <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">{exp.position}</h3>
                          <p className="text-blue-600 font-semibold text-sm">{exp.company}</p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-600 whitespace-nowrap">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {exp.startDate}
                            {exp.endDate ? ` - ${exp.endDate}` : ' - Hiện tại'}
                          </span>
                        </div>
                      </div>
                      {exp.description && (
                        <p className="text-slate-700 text-sm leading-relaxed">{exp.description}</p>
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">🎓</span>
                <h2 className="text-2xl font-bold text-slate-900">Học Vấn</h2>
                <div className="flex-1 h-1 bg-linear-to-r from-cyan-500 to-transparent rounded-full" />
              </div>
              <div className="space-y-4">
                {data.education.items.map((edu, idx) => (
                  <motion.div
                    key={edu.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + idx * 0.08 }}
                    className="relative pl-6 pb-4 border-l-4 border-cyan-500 last:border-l-2 last:border-cyan-300"
                  >
                    <div className="absolute -left-3.5 top-1 w-6 h-6 rounded-full bg-cyan-600 border-3 border-white shadow-md" />
                    <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 hover:border-cyan-400 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">{edu.degree}</h3>
                          <p className="text-cyan-600 font-semibold text-sm">
                            {edu.school}
                            {edu.field ? ` • ${edu.field}` : ''}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-600 whitespace-nowrap">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {edu.startDate}
                            {edu.endDate ? ` - ${edu.endDate}` : ' - Hiện tại'}
                          </span>
                        </div>
                      </div>
                      {edu.description && (
                        <p className="text-slate-700 text-sm leading-relaxed">{edu.description}</p>
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">🚀</span>
                <h2 className="text-2xl font-bold text-slate-900">Dự Án Nổi Bật</h2>
                <div className="flex-1 h-1 bg-linear-to-r from-blue-500 to-transparent rounded-full" />
              </div>
              <div className="space-y-4">
                {data.projects.items
                  .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
                  .map((proj, idx) => (
                    <motion.div
                      key={proj.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + idx * 0.08 }}
                      className={`p-5 rounded-lg border-2 transition-all ${
                        proj.featured
                          ? 'bg-linear-to-br from-blue-50 to-cyan-50 border-blue-400 shadow-md'
                          : 'bg-slate-50 border-slate-200 hover:border-blue-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-base font-bold text-slate-900">{proj.name}</h3>
                            {proj.featured && (
                              <motion.span
                                className="px-2 py-0.5 bg-linear-to-r from-blue-600 to-cyan-600 text-white text-xs font-bold rounded-full"
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                ⭐
                              </motion.span>
                            )}
                          </div>
                          <p className="text-slate-700 text-sm">{proj.description}</p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-600 whitespace-nowrap">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {proj.startDate}
                            {proj.endDate ? ` - ${proj.endDate}` : ''}
                          </span>
                        </div>
                      </div>

                      {/* Technologies */}
                      {proj.technologies && proj.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {proj.technologies.map((tech) => (
                            <motion.span
                              key={tech}
                              className="px-2 py-1 bg-white text-blue-700 text-xs font-semibold rounded border border-blue-300 hover:border-blue-500 transition-all"
                              whileHover={{ scale: 1.05 }}
                            >
                              {tech}
                            </motion.span>
                          ))}
                        </div>
                      )}

                      {/* Link */}
                      {proj.link && (
                        <motion.a
                          href={proj.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-linear-to-r from-blue-600 to-cyan-600 text-white text-xs font-semibold rounded hover:shadow-lg transition-all"
                          whileHover={{ x: 2 }}
                        >
                          Xem Dự Án
                          <ExternalLink className="w-3 h-3" />
                        </motion.a>
                      )}
                    </motion.div>
                  ))}
              </div>
            </motion.section>
          )}

          {/* Footer Padding */}
          <div className="h-4" />
        </div>
      </motion.div>
    </div>
  );
}