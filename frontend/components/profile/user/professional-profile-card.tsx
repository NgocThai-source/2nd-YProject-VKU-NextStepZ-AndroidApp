'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  Briefcase,
  Award,
  GraduationCap,
  Plus,
  Trash2,
  Edit2,
  X,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface WorkExperience {
  id: string;
  position: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
  isCurrent: boolean;
}

interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  graduationYear: string;
}

interface ProfessionalProfileData {
  objective: string;
  experiences: WorkExperience[];
  skills: Skill[];
  education: Education[];
}

interface ProfessionalProfileCardProps {
  data?: ProfessionalProfileData;
  onUpdate?: (data: ProfessionalProfileData) => void;
}

const skillLevels = {
  beginner: 'Cơ bản',
  intermediate: 'Trung cấp',
  advanced: 'Nâng cao',
  expert: 'Chuyên gia',
};

const skillLevelColors = {
  beginner: 'bg-blue-500',
  intermediate: 'bg-cyan-500',
  advanced: 'bg-purple-500',
  expert: 'bg-pink-500',
};

const defaultData: ProfessionalProfileData = {
  objective: '',
  experiences: [],
  skills: [],
  education: [],
};

export default function ProfessionalProfileCard({
  data = defaultData,
  onUpdate,
}: ProfessionalProfileCardProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState<ProfessionalProfileData>(data);
  const [activeTab, setActiveTab] = useState<'objective' | 'experience' | 'skills' | 'education'>(
    'objective'
  );

  // Tab specific edit states
  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(null);
  const [tempExperience, setTempExperience] = useState<WorkExperience | null>(null);
  const [editingEducationId, setEditingEducationId] = useState<string | null>(null);
  const [tempEducation, setTempEducation] = useState<Education | null>(null);

  // Add form states
  const [newExperience, setNewExperience] = useState<Partial<WorkExperience>>({});
  const [newSkill, setNewSkill] = useState<Partial<Skill>>({});
  const [newEducation, setNewEducation] = useState<Partial<Education>>({});

  // Update editData whenever data prop changes
  useEffect(() => {
    setEditData(data);
  }, [data]);

  // ===== Objective Handlers =====
  const handleObjectiveChange = (value: string) => {
    setEditData({ ...editData, objective: value });
  };

  // ===== Experience Handlers =====
  const handleAddExperience = () => {
    if (!newExperience.position || !newExperience.company) return;
    const experience: WorkExperience = {
      id: Date.now().toString(),
      position: newExperience.position || '',
      company: newExperience.company || '',
      startDate: newExperience.startDate || '',
      endDate: newExperience.endDate || '',
      description: newExperience.description || '',
      isCurrent: newExperience.isCurrent || false,
    };
    setEditData({
      ...editData,
      experiences: [...editData.experiences, experience],
    });
    setNewExperience({});
  };

  const handleRemoveExperience = (id: string) => {
    setEditData({
      ...editData,
      experiences: editData.experiences.filter((exp) => exp.id !== id),
    });
  };

  const handleSaveExperience = () => {
    if (tempExperience) {
      setEditData({
        ...editData,
        experiences: editData.experiences.map((exp) =>
          exp.id === tempExperience.id ? tempExperience : exp
        ),
      });
      setTempExperience(null);
    }
    setEditingExperienceId(null);
  };

  // ===== Skills Handlers =====
  const handleAddSkill = () => {
    if (!newSkill.name) return;
    const skill: Skill = {
      id: Date.now().toString(),
      name: newSkill.name || '',
      level: newSkill.level || 'intermediate',
    };
    setEditData({
      ...editData,
      skills: [...editData.skills, skill],
    });
    setNewSkill({});
  };

  const handleRemoveSkill = (id: string) => {
    setEditData({
      ...editData,
      skills: editData.skills.filter((skill) => skill.id !== id),
    });
  };

  // ===== Education Handlers =====
  const handleAddEducation = () => {
    if (!newEducation.school || !newEducation.degree) return;
    const education: Education = {
      id: Date.now().toString(),
      school: newEducation.school || '',
      degree: newEducation.degree || '',
      field: newEducation.field || '',
      graduationYear: newEducation.graduationYear || '',
    };
    setEditData({
      ...editData,
      education: [...editData.education, education],
    });
    setNewEducation({});
  };

  const handleRemoveEducation = (id: string) => {
    setEditData({
      ...editData,
      education: editData.education.filter((edu) => edu.id !== id),
    });
  };

  const handleSaveEducation = () => {
    if (tempEducation) {
      setEditData({
        ...editData,
        education: editData.education.map((edu) =>
          edu.id === tempEducation.id ? tempEducation : edu
        ),
      });
      setTempEducation(null);
    }
    setEditingEducationId(null);
  };

  // ===== Save/Cancel Handlers =====
  const handleSave = () => {
    onUpdate?.(editData);
    setIsEditMode(false);
  };

  const handleCancel = () => {
    setEditData(data);
    setIsEditMode(false);
    setEditingExperienceId(null);
    setTempExperience(null);
    setEditingEducationId(null);
    setTempEducation(null);
  };

  const tabs = [
    { id: 'objective', label: 'Mục tiêu', icon: Target },
    { id: 'experience', label: 'Kinh nghiệm', icon: Briefcase },
    { id: 'skills', label: 'Kỹ năng', icon: Award },
    { id: 'education', label: 'Học vấn', icon: GraduationCap },
  ] as const;

  return (
    <Card className="bg-linear-to-br from-slate-900 to-slate-800 border-slate-700">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-white" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
          Hồ sơ chuyên môn
        </CardTitle>
        {!isEditMode && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditMode(true)}
            className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
            aria-label="Edit"
          >
            <Edit2 className="w-4 h-4 text-cyan-400" />
          </motion.button>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 -mx-1">
          {tabs.map(({ id, label, icon: TabIcon }) => (
            <motion.button
              key={id}
              onClick={() => setActiveTab(id as typeof activeTab)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg transition-all text-xs sm:text-sm font-medium whitespace-nowrap ${
                activeTab === id
                  ? 'bg-cyan-500 text-white'
                  : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
              }`}
              style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
            >
              <TabIcon className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden text-xs">{label.slice(0, 1)}</span>
            </motion.button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {/* Objective Tab */}
          {activeTab === 'objective' && (
            <motion.div
              key="objective"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <h3
                className="text-xs sm:text-sm font-semibold text-white"
                style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
              >
                Mục tiêu nghề nghiệp
              </h3>
              {isEditMode ? (
                <textarea
                  value={editData.objective}
                  onChange={(e) => handleObjectiveChange(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-700 border-slate-600 text-white placeholder-gray-500 rounded-lg p-3 border text-xs sm:text-sm"
                  placeholder="Nhập mục tiêu nghề nghiệp của bạn..."
                />
              ) : (
                <p
                  className="text-gray-300 text-xs sm:text-sm leading-relaxed"
                  style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                >
                  {editData.objective || 'Chưa cập nhật'}
                </p>
              )}
            </motion.div>
          )}

          {/* Experience Tab */}
          {activeTab === 'experience' && (
            <motion.div
              key="experience"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="space-y-3">
                <AnimatePresence>
                  {editData.experiences.map((exp, idx) => (
                    <motion.div
                      key={exp.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: idx * 0.05 }}
                      className="p-2 sm:p-4 rounded-lg bg-slate-800/50 border border-slate-700"
                    >
                      {editingExperienceId === exp.id ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                          <Input
                            placeholder="Vị trí"
                            value={tempExperience?.position || exp.position}
                            onChange={(e) =>
                              setTempExperience({
                                ...(tempExperience || exp),
                                position: e.target.value,
                              })
                            }
                            className="bg-slate-700 border-slate-600 text-white placeholder-gray-500 text-sm"
                          />
                          <Input
                            placeholder="Công ty"
                            value={tempExperience?.company || exp.company}
                            onChange={(e) =>
                              setTempExperience({
                                ...(tempExperience || exp),
                                company: e.target.value,
                              })
                            }
                            className="bg-slate-700 border-slate-600 text-white placeholder-gray-500 text-sm"
                          />
                          <div className="flex gap-2">
                            <Input
                              type="month"
                              value={tempExperience?.startDate || exp.startDate}
                              onChange={(e) =>
                                setTempExperience({
                                  ...(tempExperience || exp),
                                  startDate: e.target.value,
                                })
                              }
                              className="bg-slate-700 border-slate-600 text-white text-sm flex-1"
                            />
                            <Input
                              type="month"
                              value={tempExperience?.endDate || exp.endDate}
                              onChange={(e) =>
                                setTempExperience({
                                  ...(tempExperience || exp),
                                  endDate: e.target.value,
                                })
                              }
                              className="bg-slate-700 border-slate-600 text-white text-sm flex-1"
                            />
                          </div>
                          <textarea
                            placeholder="Mô tả"
                            value={tempExperience?.description || exp.description}
                            onChange={(e) =>
                              setTempExperience({
                                ...(tempExperience || exp),
                                description: e.target.value,
                              })
                            }
                            rows={2}
                            className="w-full bg-slate-700 border-slate-600 text-white placeholder-gray-500 rounded border p-2 text-sm"
                          />
                          <label className="flex items-center gap-2 text-sm text-gray-300">
                            <input
                              type="checkbox"
                              checked={tempExperience?.isCurrent ?? exp.isCurrent}
                              onChange={(e) =>
                                setTempExperience({
                                  ...(tempExperience || exp),
                                  isCurrent: e.target.checked,
                                })
                              }
                              className="rounded"
                            />
                            Đang làm việc tại đây
                          </label>
                          <Button
                            onClick={handleSaveExperience}
                            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white text-sm"
                            style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                          >
                            Xong
                          </Button>
                        </motion.div>
                      ) : (
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="min-w-0 flex-1">
                              <h4
                                className="text-xs sm:text-base font-semibold text-white break-all"
                                style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                              >
                                {exp.position}
                              </h4>
                              <p
                                className="text-cyan-400 text-xs sm:text-sm break-all"
                                style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                              >
                                {exp.company}
                              </p>
                            </div>
                            {isEditMode && (
                              <div className="flex gap-1 shrink-0">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => setEditingExperienceId(exp.id)}
                                  className="p-1 rounded hover:bg-slate-700"
                                  title="Chỉnh sửa"
                                >
                                  <Edit2 className="w-4 h-4 text-cyan-400" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleRemoveExperience(exp.id)}
                                  className="p-1 rounded hover:bg-slate-700"
                                  title="Xóa"
                                >
                                  <Trash2 className="w-4 h-4 text-red-400" />
                                </motion.button>
                              </div>
                            )}
                          </div>
                          <p
                            className="text-gray-400 text-xs mb-2"
                            style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                          >
                            {exp.startDate} - {exp.endDate || (exp.isCurrent ? 'Hiện tại' : 'N/A')}
                          </p>
                          <p
                            className="text-gray-300 text-xs sm:text-sm line-clamp-2 sm:line-clamp-none"
                            style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                          >
                            {exp.description}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {isEditMode && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 space-y-3"
                >
                  <p className="text-xs text-gray-400" style={{ fontFamily: "'Exo 2 Regular', sans-serif" }}>
                    Thêm kinh nghiệm
                  </p>
                  <Input
                    placeholder="Vị trí"
                    value={newExperience.position || ''}
                    onChange={(e) => setNewExperience({ ...newExperience, position: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white placeholder-gray-500 text-sm"
                  />
                  <Input
                    placeholder="Công ty"
                    value={newExperience.company || ''}
                    onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white placeholder-gray-500 text-sm"
                  />
                  <div className="flex gap-2">
                    <Input
                      type="month"
                      placeholder="Bắt đầu"
                      value={newExperience.startDate || ''}
                      onChange={(e) => setNewExperience({ ...newExperience, startDate: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white text-sm flex-1"
                    />
                    <Input
                      type="month"
                      placeholder="Kết thúc"
                      value={newExperience.endDate || ''}
                      onChange={(e) => setNewExperience({ ...newExperience, endDate: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white text-sm flex-1"
                    />
                  </div>
                  <textarea
                    placeholder="Mô tả"
                    value={newExperience.description || ''}
                    onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                    rows={2}
                    className="w-full bg-slate-700 border-slate-600 text-white placeholder-gray-500 rounded border p-2 text-sm"
                  />
                  <Button
                    onClick={handleAddExperience}
                    disabled={!newExperience.position || !newExperience.company}
                    className="w-full bg-cyan-500 hover:bg-cyan-600 text-white disabled:opacity-50"
                    style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Skills Tab */}
          {activeTab === 'skills' && (
            <motion.div
              key="skills"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex flex-wrap gap-2">
                <AnimatePresence>
                  {editData.skills.map((skill, idx) => (
                    <motion.div
                      key={skill.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-2 rounded-full text-white text-xs sm:text-sm font-medium ${
                        skillLevelColors[skill.level]
                      }`}
                      style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                    >
                      {skill.name}
                      <span className="text-xs opacity-75">({skillLevels[skill.level]})</span>
                      {isEditMode && (
                        <motion.button whileHover={{ scale: 1.2 }} onClick={() => handleRemoveSkill(skill.id)}>
                          <X className="w-3 h-3" />
                        </motion.button>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {isEditMode && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 space-y-3"
                >
                  <p className="text-xs text-gray-400" style={{ fontFamily: "'Exo 2 Regular', sans-serif" }}>
                    Thêm kỹ năng
                  </p>
                  <Input
                    placeholder="Tên kỹ năng"
                    value={newSkill.name || ''}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white placeholder-gray-500 text-sm"
                  />
                  <select
                    value={newSkill.level || 'intermediate'}
                    onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value as Skill['level'] })}
                    className="w-full bg-slate-700 border border-slate-600 text-white rounded p-2 text-sm"
                  >
                    {Object.entries(skillLevels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <Button
                    onClick={handleAddSkill}
                    disabled={!newSkill.name}
                    className="w-full bg-cyan-500 hover:bg-cyan-600 text-white disabled:opacity-50"
                    style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm kỹ năng
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Education Tab */}
          {activeTab === 'education' && (
            <motion.div
              key="education"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="space-y-3">
                <AnimatePresence>
                  {editData.education.map((edu, idx) => (
                    <motion.div
                      key={edu.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: idx * 0.05 }}
                      className="p-2 sm:p-4 rounded-lg bg-slate-800/50 border border-slate-700"
                    >
                      {editingEducationId === edu.id ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                          <Input
                            placeholder="Trường học"
                            value={tempEducation?.school || edu.school}
                            onChange={(e) =>
                              setTempEducation({
                                ...(tempEducation || edu),
                                school: e.target.value,
                              })
                            }
                            className="bg-slate-700 border-slate-600 text-white placeholder-gray-500 text-sm"
                          />
                          <Input
                            placeholder="Bằng cấp (e.g., Cử nhân, Thạc sĩ)"
                            value={tempEducation?.degree || edu.degree}
                            onChange={(e) =>
                              setTempEducation({
                                ...(tempEducation || edu),
                                degree: e.target.value,
                              })
                            }
                            className="bg-slate-700 border-slate-600 text-white placeholder-gray-500 text-sm"
                          />
                          <Input
                            placeholder="Chuyên ngành"
                            value={tempEducation?.field || edu.field}
                            onChange={(e) =>
                              setTempEducation({
                                ...(tempEducation || edu),
                                field: e.target.value,
                              })
                            }
                            className="bg-slate-700 border-slate-600 text-white placeholder-gray-500 text-sm"
                          />
                          <Input
                            type="number"
                            placeholder="Năm tốt nghiệp"
                            value={tempEducation?.graduationYear || edu.graduationYear}
                            onChange={(e) =>
                              setTempEducation({
                                ...(tempEducation || edu),
                                graduationYear: e.target.value,
                              })
                            }
                            className="bg-slate-700 border-slate-600 text-white placeholder-gray-500 text-sm"
                          />
                          <Button
                            onClick={handleSaveEducation}
                            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white text-sm"
                            style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                          >
                            Xong
                          </Button>
                        </motion.div>
                      ) : (
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="min-w-0 flex-1">
                              <h4
                                className="text-xs sm:text-base font-semibold text-white break-all"
                                style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                              >
                                {edu.school}
                              </h4>
                              <p
                                className="text-cyan-400 text-xs sm:text-sm break-all"
                                style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                              >
                                {edu.degree}
                              </p>
                            </div>
                            {isEditMode && (
                              <div className="flex gap-1 shrink-0">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => setEditingEducationId(edu.id)}
                                  className="p-1 rounded hover:bg-slate-700"
                                  title="Chỉnh sửa"
                                >
                                  <Edit2 className="w-4 h-4 text-cyan-400" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleRemoveEducation(edu.id)}
                                  className="p-1 rounded hover:bg-slate-700"
                                  title="Xóa"
                                >
                                  <Trash2 className="w-4 h-4 text-red-400" />
                                </motion.button>
                              </div>
                            )}
                          </div>
                          <p
                            className="text-gray-400 text-xs mb-1"
                            style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                          >
                            {edu.field} • {edu.graduationYear}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {isEditMode && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 space-y-3"
                >
                  <p className="text-xs text-gray-400" style={{ fontFamily: "'Exo 2 Regular', sans-serif" }}>
                    Thêm học vấn
                  </p>
                  <Input
                    placeholder="Trường học"
                    value={newEducation.school || ''}
                    onChange={(e) => setNewEducation({ ...newEducation, school: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white placeholder-gray-500 text-sm"
                  />
                  <Input
                    placeholder="Bằng cấp (e.g., Cử nhân, Thạc sĩ)"
                    value={newEducation.degree || ''}
                    onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white placeholder-gray-500 text-sm"
                  />
                  <Input
                    placeholder="Chuyên ngành"
                    value={newEducation.field || ''}
                    onChange={(e) => setNewEducation({ ...newEducation, field: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white placeholder-gray-500 text-sm"
                  />
                  <Input
                    type="number"
                    placeholder="Năm tốt nghiệp"
                    value={newEducation.graduationYear || ''}
                    onChange={(e) => setNewEducation({ ...newEducation, graduationYear: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white placeholder-gray-500 text-sm"
                  />
                  <Button
                    onClick={handleAddEducation}
                    disabled={!newEducation.school || !newEducation.degree}
                    className="w-full bg-cyan-500 hover:bg-cyan-600 text-white disabled:opacity-50"
                    style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        {isEditMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-2 pt-4 border-t border-slate-700"
          >
            <Button
              onClick={handleSave}
              className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white"
              style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
            >
              Lưu thay đổi
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              className="flex-1 border-slate-600 hover:bg-slate-700"
              style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
            >
              Hủy
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
