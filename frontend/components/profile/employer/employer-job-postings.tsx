'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProfile } from '@/lib/profile-context';

interface JobPosting {
  id: string;
  title: string;
  location?: string;
  level?: string;
  postedAt?: string;
  applications?: number;
}

interface EmployerJobPostingsProps {
  postings?: JobPosting[];
  totalPostings?: number;
  onViewAllClick?: () => void;
}

export default function EmployerJobPostings({
  postings = [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      location: 'TP. Hồ Chí Minh',
      level: 'Senior',
      postedAt: '2 tuần trước',
      applications: 24,
    },
    {
      id: '2',
      title: 'Backend Developer (Node.js)',
      location: 'Hà Nội',
      level: 'Mid',
      postedAt: '1 tuần trước',
      applications: 18,
    },
    {
      id: '3',
      title: 'UI/UX Designer',
      location: 'TP. Hồ Chí Minh',
      level: 'Mid',
      postedAt: '3 ngày trước',
      applications: 12,
    },
  ],
  totalPostings = 12,
  onViewAllClick,
}: EmployerJobPostingsProps) {
  const { employerProfile } = useProfile();
  const [jobPostings, setJobPostings] = useState<JobPosting[]>(postings);
  const [total, setTotal] = useState(totalPostings);

  // Sync with context changes
  useEffect(() => {
    if (employerProfile?.jobPostings) {
      setJobPostings(employerProfile.jobPostings);
      setTotal(employerProfile.jobPostings.length);
    }
  }, [employerProfile?.jobPostings]);

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
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <Card className="bg-linear-to-br from-slate-900 to-slate-800 border-slate-700">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
            <Briefcase className="w-5 h-5 text-cyan-400" />
            Tin tuyển dụng đã đăng
          </CardTitle>
          <div className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30">
            <p className="text-sm font-bold text-cyan-400" style={{ fontFamily: "'Exo 2 Bold', sans-serif" }}>
              {total}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {jobPostings.length > 0 ? (
            <>
              {jobPostings.map((posting) => (
                <motion.div
                  key={posting.id}
                  variants={itemVariants}
                  whileHover={{ x: 4 }}
                  className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-cyan-400/30 transition-colors cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                        {posting.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-cyan-400" />
                          {posting.location}
                        </span>
                        <span className="inline-block w-1 h-1 bg-gray-600 rounded-full" />
                        <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300">
                          {posting.level}
                        </span>
                        <span className="inline-block w-1 h-1 bg-gray-600 rounded-full" />
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-gray-500" />
                          {posting.postedAt}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                        <span className="text-cyan-400 font-semibold">{posting.applications}</span> hồ sơ ứng tuyển
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-cyan-400 transition-colors shrink-0 mt-1" />
                  </div>
                </motion.div>
              ))}

              {/* View All Button */}
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={onViewAllClick}
                className="w-full px-4 py-3 rounded-lg bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400/50 transition-all font-medium text-sm"
                style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
              >
                Xem tất cả tin tuyển dụng
              </motion.button>
            </>
          ) : (
            <motion.div
              variants={itemVariants}
              className="py-8 text-center"
            >
              <Briefcase className="w-12 h-12 text-gray-600 mx-auto mb-3 opacity-50" />
              <p className="text-gray-400 text-sm" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                Chưa có tin tuyển dụng nào được đăng
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 px-4 py-2 rounded-lg bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 text-sm font-medium transition-colors"
                style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
              >
                Đăng tin tuyển dụng
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </CardContent>
    </Card>
  );
}
