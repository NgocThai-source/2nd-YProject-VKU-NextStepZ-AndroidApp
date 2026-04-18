'use client';

import { motion } from 'framer-motion';
import { Briefcase, Mail, Phone, MapPin, Github, Facebook } from 'lucide-react';

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

interface PortfolioPreviewProps {
  data: unknown;
}

export default function PortfolioPreview({ data }: PortfolioPreviewProps) {
  const portfolioData = data as Record<string, unknown>;
  const contactInfo = (portfolioData.contactJson as ContactInfo) || {};
  const skillsData = (portfolioData.skills as SkillsData) || { selected: [] };
  const experienceData = (portfolioData.experience as ExperienceData) || { items: [] };
  const educationData = (portfolioData.education as EducationData) || { items: [] };
  const projectsData = (portfolioData.projects as ProjectsData) || { items: [] };

  return (
    <div className="space-y-6">
      {/* Browser mockup */}
      <div className="rounded-lg overflow-hidden border border-slate-700/50 bg-slate-800/30">
        {/* Browser Header */}
        <div className="bg-slate-700/50 p-3 flex gap-2 border-b border-slate-700/50">
          <div className="w-3 h-3 rounded-full bg-red-500/60"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/60"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/60"></div>
        </div>

        {/* Preview Content */}
        <div className="bg-slate-900 p-8 min-h-96">
          {/* Header */}
          <motion.div
            className="mb-8 pb-8 border-b border-cyan-500/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Avatar */}
            <div className="mb-4">
              <div className="w-20 h-20 rounded-full bg-slate-700 border-2 border-cyan-500/50 flex items-center justify-center text-3xl">
                👤
              </div>
            </div>

            <h1 className="text-3xl font-bold text-white mb-2">
              {(portfolioData.title as string) || 'Tiêu Đề Chuyên Nghiệp Của Bạn'}
            </h1>
            <p className="text-lg text-cyan-300 font-semibold mb-4">
              {(portfolioData.headline as string) || 'Tiêu đề phụ chuyên nghiệp của bạn'}
            </p>

            {/* Contact Info */}
            <div className="flex flex-wrap gap-4 text-sm text-slate-300">
              {contactInfo.email && (
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  <span>{contactInfo.email}</span>
                </div>
              )}
              {contactInfo.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4 text-cyan-400" />
                  <span>{contactInfo.phone}</span>
                </div>
              )}
              {(contactInfo.city || contactInfo.district) && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span>
                    {contactInfo.city}
                    {contactInfo.district && `, ${contactInfo.district}`}
                  </span>
                </div>
              )}
            </div>

            {/* Social Links */}
            <div className="flex gap-3 mt-4">
              {contactInfo.facebook && (
                <a
                  href={contactInfo.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 transition-all text-xs"
                >
                  <Facebook className="w-4 h-4" />
                  Facebook
                </a>
              )}
              {contactInfo.github && (
                <a
                  href={contactInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 transition-all text-xs"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
              )}
            </div>
          </motion.div>

          {/* About Section */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-bold text-white mb-3">Giới Thiệu</h2>
            <p className="text-slate-300 leading-relaxed text-sm">
              {(portfolioData.summary as string) ||
                'Chuyên gia có kinh nghiệm sâu về thiết kế và phát triển. Đam mê tạo ra các giải pháp có tác động.'}
            </p>
          </motion.div>

          {/* Skills Section - Removed duplicate */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-bold text-white mb-3">Kỹ Năng</h2>
            {skillsData && skillsData.selected && skillsData.selected.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {skillsData.selected.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm font-medium border border-cyan-500/30"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-sm">Chưa có kỹ năng nào được thêm</p>
            )}
          </motion.div>

          {/* Experience Section */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-cyan-400" />
              Kinh Nghiệm
            </h2>
            {experienceData && experienceData.items && experienceData.items.length > 0 ? (
              <div className="space-y-4">
                {experienceData.items.map((exp) => (
                  <div key={exp.id} className="border-l-4 border-cyan-500/50 pl-4 py-2">
                    <h3 className="font-semibold text-white">{exp.position}</h3>
                    <p className="text-sm text-slate-400">
                      {exp.company} • {exp.startDate}
                      {exp.endDate ? ` - ${exp.endDate}` : ' - Hiện tại'}
                    </p>
                    {exp.description && (
                      <p className="text-slate-300 mt-2 text-sm">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-sm">Chưa có kinh nghiệm nào được thêm</p>
            )}
          </motion.div>

          {/* Education Section */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              🎓
              Học Vấn
            </h2>
            {educationData && educationData.items && educationData.items.length > 0 ? (
              <div className="space-y-4">
                {educationData.items.map((edu) => (
                  <div key={edu.id} className="border-l-4 border-cyan-500/50 pl-4 py-2">
                    <h3 className="font-semibold text-white">{edu.degree}</h3>
                    <p className="text-sm text-slate-400">
                      {edu.school}
                      {edu.field ? ` • ${edu.field}` : ''}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {edu.startDate}
                      {edu.endDate ? ` - ${edu.endDate}` : ' - Hiện tại'}
                    </p>
                    {edu.description && (
                      <p className="text-slate-300 mt-2 text-sm">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-sm">Chưa có học vấn nào được thêm</p>
            )}
          </motion.div>

          {/* Projects Section */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              🚀
              Dự Án
            </h2>
            {projectsData && projectsData.items && projectsData.items.length > 0 ? (
              <div className="space-y-4">
                {projectsData.items
                  .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
                  .map((proj) => (
                    <div
                      key={proj.id}
                      className={`border-l-4 pl-4 py-2 ${
                        proj.featured ? 'border-cyan-400 bg-cyan-500/10 p-4 rounded' : 'border-cyan-500/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-white">{proj.name}</h3>
                            {proj.featured && (
                              <span className="text-xs bg-cyan-500/30 text-cyan-300 px-2 py-0.5 rounded-full font-medium">
                                ⭐ Nổi Bật
                              </span>
                            )}
                          </div>
                          <p className="text-slate-300 text-sm mt-1">{proj.description}</p>
                          {proj.technologies && proj.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {proj.technologies.map((tech) => (
                                <span
                                  key={tech}
                                  className="text-xs bg-slate-700/60 text-slate-300 px-2 py-0.5 rounded font-medium"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                          <p className="text-xs text-slate-400 mt-2">
                            {proj.startDate}
                            {proj.endDate ? ` - ${proj.endDate}` : ''}
                          </p>
                          {proj.link && (
                            <a
                              href={proj.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-cyan-400 hover:text-cyan-300 mt-2 inline-block underline"
                            >
                              Xem Dự Án →
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-slate-400 text-sm">Chưa có dự án nào được thêm</p>
            )}
          </motion.div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-slate-700/50 text-center text-sm text-slate-400">
            <p>Được tạo bởi NextStepZ Portfolio Builder</p>
          </div>
        </div>
      </div>

      {/* Score Badge */}
      <motion.div
        className="bg-slate-800/50 p-4 rounded-lg border border-cyan-500/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-sm text-white">
          <span className="font-semibold text-cyan-300">Điểm Portfolio:</span> 85/100 ⭐
        </p>
        <p className="text-xs text-slate-400 mt-1">Kinh nghiệm tốt • Kỹ năng đủ</p>
      </motion.div>
    </div>
  );
}
