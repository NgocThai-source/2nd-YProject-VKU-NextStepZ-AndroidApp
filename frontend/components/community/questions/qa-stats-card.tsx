'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import * as communityApi from '@/lib/community-api';

export function QAStatsCard() {
  const [stats, setStats] = useState<communityApi.QAStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await communityApi.getQAStats();
        setStats(data);
      } catch (err) {
        console.error('Error fetching Q&A stats:', err);
        // Set default values on error
        setStats({
          totalQuestions: 0,
          unansweredCount: 0,
          resolvedRate: 0,
          answersThisWeek: 0,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-xl bg-white/5 border border-cyan-400/20 backdrop-blur-sm p-6">
        <h3
          className="text-lg font-bold text-white mb-4"
          style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
        >
          📊 Thống kê Hỏi &amp; Đáp
        </h3>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white/5 border border-cyan-400/20 backdrop-blur-sm p-6">
      <h3
        className="text-lg font-bold text-white mb-4"
        style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
      >
        📊 Thống kê Hỏi &amp; Đáp
      </h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-center pb-3 border-b border-cyan-400/10">
          <p
            className="text-gray-400"
            style={{ fontFamily: "'Poppins Regular', sans-serif" }}
          >
            Tổng câu hỏi:
          </p>
          <p className="font-bold text-cyan-300 text-lg">{stats?.totalQuestions || 0}</p>
        </div>
        <div className="flex justify-between items-center pb-3 border-b border-cyan-400/10">
          <p
            className="text-gray-400"
            style={{ fontFamily: "'Poppins Regular', sans-serif" }}
          >
            Chưa được trả lời:
          </p>
          <p className="font-bold text-red-400 text-lg">{stats?.unansweredCount || 0}</p>
        </div>
        <div className="flex justify-between items-center pb-3 border-b border-cyan-400/10">
          <p
            className="text-gray-400"
            style={{ fontFamily: "'Poppins Regular', sans-serif" }}
          >
            Tỷ lệ câu hỏi được giải quyết:
          </p>
          <p className="font-bold text-green-400 text-lg">{stats?.resolvedRate || 0}%</p>
        </div>
        <div className="flex justify-between items-center">
          <p
            className="text-gray-400"
            style={{ fontFamily: "'Poppins Regular', sans-serif" }}
          >
            Câu trả lời tuần này:
          </p>
          <p className="font-bold text-purple-400 text-lg">
            {stats?.answersThisWeek || 0}
          </p>
        </div>
      </div>
    </div>
  );
}
