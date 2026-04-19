'use client';

import { Question } from '@/lib/community-mock-data';

interface TopQuestionsCardProps {
  questions: Question[];
}

export function TopQuestionsCard({ questions }: TopQuestionsCardProps) {
  return (
    <div className="rounded-xl bg-white/5 border border-cyan-400/20 backdrop-blur-sm p-6">
      <h3
        className="text-lg font-bold text-white mb-4"
        style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
      >
        🔥 Câu Hỏi Nổi Bật
      </h3>
      <div className="space-y-3">
        {questions
          .sort((a, b) => b.votes - a.votes)
          .slice(0, 3)
          .map((question, idx) => (
            <div
              key={question.id}
              className="p-3 bg-white/5 border border-cyan-400/10 rounded-lg hover:bg-white/10 transition-colors cursor-pointer group"
            >
              <div className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold text-sm">{idx + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate group-hover:text-cyan-300 transition-colors">
                    {question.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    👍 {question.votes} likes
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
