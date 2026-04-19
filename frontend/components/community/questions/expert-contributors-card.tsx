'use client';

import { useState, useEffect } from 'react';
import { Avatar } from '../shared/avatar';
import * as communityApi from '@/lib/community-api';
import { Loader2 } from 'lucide-react';

interface Expert {
  id: string;
  name: string;
  avatar: string | null;
  questionCount: number;
}

interface ExpertContributorsCardProps {
  onUserClick?: (userId: string) => void;
}

export function ExpertContributorsCard({ onUserClick }: ExpertContributorsCardProps) {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const data = await communityApi.getTopExperts();
        setExperts(data.map(e => ({
          id: e.id,
          name: e.name,
          avatar: e.avatar,
          questionCount: e.questionCount,
        })));
      } catch (err) {
        console.error('Error fetching top experts:', err);
        // Fallback to empty on error
        setExperts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExperts();
  }, []);

  const badges = ['🏆', '🥈', '🥉'];

  return (
    <div className="rounded-xl bg-white/5 border border-cyan-400/20 backdrop-blur-sm p-6">
      <h3
        className="text-lg font-bold text-white mb-4"
        style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
      >
        ⭐ Chuyên Gia Hàng Đầu
      </h3>

      {isLoading ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
        </div>
      ) : experts.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">Chưa có dữ liệu</p>
      ) : (
        <div className="space-y-3">
          {experts.map((expert, idx) => (
            <div
              key={expert.id}
              onClick={() => onUserClick?.(expert.id)}
              className="p-3 bg-white/5 border border-cyan-400/10 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{badges[idx] || '⭐'}</span>
                  <Avatar
                    src={expert.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${expert.id}`}
                    alt={expert.name}
                    size="sm"
                  />
                  <div>
                    <p className="text-sm font-medium text-white hover:text-cyan-300 transition-colors">{expert.name}</p>
                    <p className="text-xs text-gray-500">{expert.questionCount} câu hỏi</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
