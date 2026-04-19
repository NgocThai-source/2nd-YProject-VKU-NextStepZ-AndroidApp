'use client';

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Question } from '@/lib/community-mock-data';
import { QAFeed } from './question-card';
import { QAStatsCard } from './qa-stats-card';
import { TopQuestionsCard } from './top-questions-card';
import { ExpertContributorsCard } from './expert-contributors-card';
import { CreateQuestionModal } from './create-question-modal';
import { QuestionReportModal } from './question-report-modal';

interface QuestionsPageProps {
  questions: Question[];
  onCreateQuestion?: (question: Question) => void;
  onVote?: (questionId: string, direction: 'up' | 'down') => void;
  onAnswerClick?: (questionId: string) => void;
  onReport?: (questionId: string) => void;
  onLikeUpdate?: (questionId: string, likesCount: number, isLiked: boolean) => void;
  onViewUpdate?: (questionId: string, viewCount: number) => void;
  onUserClick?: (userId: string) => void;
}

export function QuestionsPage({
  questions,
  onCreateQuestion,
  onVote,
  onAnswerClick,
  onReport,
  onLikeUpdate,
  onViewUpdate,
  onUserClick,
}: QuestionsPageProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  const handleCreateQuestion = (question: Question) => {
    onCreateQuestion?.(question);
    setIsCreateModalOpen(false);
  };

  const handleOpenReportModal = (questionId: string) => {
    const question = questions.find((q) => q.id === questionId);
    if (question) {
      setSelectedQuestion(question);
      setIsReportModalOpen(true);
    }
    onReport?.(questionId);
  };

  return (
    <>
      <motion.div
        key="questions"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="lg:col-span-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full mb-4 flex items-center gap-2 px-6 py-3 rounded-lg bg-linear-to-r from-cyan-400 to-blue-500 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all"
            style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
          >
            <Plus className="w-5 h-5" />
            Đặt Câu Hỏi
          </motion.button>

          <QAFeed
            questions={questions}
            onVote={
              onVote ||
              ((questionId, direction) =>
                console.log(`Vote ${direction} on question ${questionId}`))
            }
            onAnswerClick={
              onAnswerClick ||
              ((questionId) => console.log(`View answers for question ${questionId}`))
            }
            onReport={handleOpenReportModal}
            onLikeUpdate={onLikeUpdate}
            onViewUpdate={onViewUpdate}
            onUserClick={onUserClick}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4 hidden lg:block"
        >
          <QAStatsCard />
          <TopQuestionsCard questions={questions} />
          <ExpertContributorsCard onUserClick={onUserClick} />
        </motion.div>
      </motion.div>

      {/* Create Question Modal */}
      <CreateQuestionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateQuestion}
      />

      {/* Report Modal */}
      <QuestionReportModal
        isOpen={isReportModalOpen}
        question={selectedQuestion}
        onClose={() => {
          setIsReportModalOpen(false);
          setSelectedQuestion(null);
        }}
        onSubmit={(reason, description) => {
          console.log('Report submitted:', { reason, description });
        }}
      />
    </>
  );
}
