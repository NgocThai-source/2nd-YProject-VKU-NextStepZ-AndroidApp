'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Briefcase, Award, BookOpen } from 'lucide-react';

interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

interface Experience {
  id: string;
  position: string;
  company: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string;
}

interface Education {
  id: string;
  school: string;
  degree?: string;
  field?: string;
  graduationYear?: string;
}

interface PublicCareerProfile {
  objective?: string;
  experiences?: Experience[];
  education?: Education[];
  skills?: Skill[];
}

interface PublicProfessionalInfoCardProps {
  data?: PublicCareerProfile;
}

const skillLevelColors = {
  beginner: 'bg-blue-500',
  intermediate: 'bg-cyan-500',
  advanced: 'bg-purple-500',
  expert: 'bg-pink-500',
};

const skillLevels = {
  beginner: 'Cơ bản',
  intermediate: 'Trung cấp',
  advanced: 'Nâng cao',
  expert: 'Chuyên gia',
};

export default function PublicProfessionalInfoCard({
  data,
}: PublicProfessionalInfoCardProps) {
  const displayData = data || {
    objective: '',
    experiences: [],
    education: [],
    skills: [],
  };

  return (
    <>
      {/* Objective */}
      {displayData.objective && (
        <Card className="bg-linear-to-br from-slate-900 to-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
              <Target className="w-5 h-5 text-cyan-400" />
              Mục tiêu nghề nghiệp
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-300 leading-relaxed" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
              {displayData.objective}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Experience */}
      <Card className="bg-linear-to-br from-slate-900 to-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
            <Briefcase className="w-5 h-5 text-cyan-400" />
            Kinh nghiệm làm việc
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {displayData.experiences && displayData.experiences.length > 0 ? (
            displayData.experiences.map((exp, idx) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h3 className="font-semibold text-white" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                      {exp.position}
                    </h3>
                    <p className="text-cyan-400 text-sm" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                      {exp.company}
                    </p>
                  </div>
                  {exp.isCurrent && (
                    <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold whitespace-nowrap" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                      Hiện tại
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mb-2" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                  {exp.startDate} - {exp.endDate || (exp.isCurrent ? 'Hiện tại' : 'N/A')}
                </p>
                {exp.description && (
                  <p className="text-sm text-gray-300" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                    {exp.description}
                  </p>
                )}
              </motion.div>
            ))
          ) : (
            <p className="text-gray-400 text-sm" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
              Chưa có kinh nghiệm
            </p>
          )}
        </CardContent>
      </Card>

      {/* Skills */}
      <Card className="bg-linear-to-br from-slate-900 to-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
            <Award className="w-5 h-5 text-cyan-400" />
            Kỹ năng
          </CardTitle>
        </CardHeader>
        <CardContent>
          {displayData.skills && displayData.skills.length > 0 ? (
            <motion.div
              className="flex flex-wrap gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {displayData.skills.map((skill: Skill, idx: number) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-white font-semibold ${
                    skillLevelColors[skill.level as keyof typeof skillLevelColors]
                  }`}
                  style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                >
                  {skill.name}
                  <span className="text-xs opacity-75">({skillLevels[skill.level as keyof typeof skillLevels]})</span>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <p className="text-gray-400 text-sm" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
              Chưa có kỹ năng
            </p>
          )}
        </CardContent>
      </Card>

      {/* Education */}
      <Card className="bg-linear-to-br from-slate-900 to-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
            <BookOpen className="w-5 h-5 text-cyan-400" />
            Học vấn
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {displayData.education && displayData.education.length > 0 ? (
            displayData.education.map((edu, idx) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-colors"
              >
                <h3 className="font-semibold text-white mb-1" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                  {edu.school}
                </h3>
                {edu.degree && (
                  <p className="text-cyan-400 text-sm mb-2" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                    {edu.degree}
                  </p>
                )}
                <p className="text-sm text-gray-300" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                  {edu.field} • {edu.graduationYear}
                </p>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-400 text-sm" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
              Chưa có học vấn
            </p>
          )}
        </CardContent>
      </Card>
    </>
  );
}
