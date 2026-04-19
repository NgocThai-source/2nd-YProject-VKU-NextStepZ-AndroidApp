'use client';

import { motion } from 'framer-motion';
import { FileText, ShieldAlert, Users, MessageSquare } from 'lucide-react';
import { useState } from 'react';

interface GuidelineSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: string;
  examples: string[];
}

export function CommunityGuidelines() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const guidelines: GuidelineSection[] = [
    {
      id: 'respect',
      title: 'Tôn Trọng & Lịch Sự',
      icon: <Users className="w-5 h-5" />,
      content:
        'Hãy tôn trọng những người khác bất kể họ là ai. Tránh quấy rối, làm tổn thương hoặc phân biệt đối xử.',
      examples: [
        '✓ Tham gia các cuộc thảo luận một cách tích cực',
        '✓ Chấp nhận những ý kiến khác',
        '✗ Không gửi lời lăng mạ hoặc quấy rối',
        '✗ Không phân biệt chủng tộc, giới tính, tôn giáo',
      ],
    },
    {
      id: 'content',
      title: 'Nội Dung Chất Lượng',
      icon: <FileText className="w-5 h-5" />,
      content:
        'Chia sẻ nội dung có giá trị cho cộng đồng. Tránh spam, nội dung sai lệch hoặc quảng cáo không phù hợp.',
      examples: [
        '✓ Chia sẻ kinh nghiệm và bài học',
        '✓ Cung cấp thông tin chính xác',
        '✗ Không spam hoặc nội dung lặp lại',
        '✗ Không chia sẻ fake news hoặc thông tin sai lệch',
      ],
    },
    {
      id: 'safety',
      title: 'An Toàn & Riêng Tư',
      icon: <ShieldAlert className="w-5 h-5" />,
      content:
        'Bảo vệ thông tin cá nhân của bạn và người khác. Không chia sẻ dữ liệu nhạy cảm hoặc thông tin riêng tư.',
      examples: [
        '✓ Giữ kín thông tin cá nhân',
        '✓ Báo cáo nội dung không an toàn',
        '✗ Không chia sẻ mật khẩu hay tài khoản ngân hàng',
        '✗ Không doxx hoặc tiết lộ thông tin cá nhân của người khác',
      ],
    },
    {
      id: 'communication',
      title: 'Giao Tiếp Thương Lượng',
      icon: <MessageSquare className="w-5 h-5" />,
      content:
        'Giao tiếp một cách tích cực và xây dựng. Lắng nghe người khác và cố gắng tìm hiểu.',
      examples: [
        '✓ Đặt câu hỏi để hiểu rõ hơn',
        '✓ Cung cấp feedback xây dựng',
        '✗ Không chỉ trích mà không cơ sở',
        '✗ Không cải biến cuộc trò chuyện thành tranh cãi',
      ],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-linear-to-b from-slate-800 to-slate-900 border border-cyan-400/20 p-6 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-lg bg-cyan-400/20 border border-cyan-400/30">
          <FileText className="w-6 h-6 text-cyan-300" />
        </div>
        <div>
          <h2
            className="text-2xl font-bold text-white"
            style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
          >
            Hướng Dẫn Cộng Đồng
          </h2>
          <p className="text-sm text-gray-400">
            Quy tắc để tạo môi trường tích cực và an toàn
          </p>
        </div>
      </div>

      {/* Guidelines */}
      <div className="space-y-3">
        {guidelines.map((guideline) => (
          <motion.div
            key={guideline.id}
            className="rounded-lg border border-cyan-400/20 overflow-hidden bg-white/5 hover:bg-white/8 transition-colors"
          >
            {/* Header */}
            <motion.button
              onClick={() =>
                setExpandedSection(
                  expandedSection === guideline.id ? null : guideline.id
                )
              }
              className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-400/20 text-cyan-300 shrink-0">
                {guideline.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className="text-base font-semibold text-white"
                  style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                >
                  {guideline.title}
                </h3>
              </div>
              <motion.div
                animate={{ rotate: expandedSection === guideline.id ? 180 : 0 }}
                className="text-gray-400"
              >
                ▼
              </motion.div>
            </motion.button>

            {/* Content */}
            {expandedSection === guideline.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-4 pb-4 border-t border-white/10 space-y-3"
              >
                <p className="text-sm text-gray-300" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                  {guideline.content}
                </p>

                <div className="space-y-2">
                  {guideline.examples.map((example, idx) => (
                    <motion.p
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`text-xs pl-3 ${
                        example.startsWith('✓')
                          ? 'text-green-300'
                          : 'text-red-300'
                      }`}
                    >
                      {example}
                    </motion.p>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-400/20 text-sm text-blue-300"
      >
        <p className="font-semibold mb-1" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
          ℹ️ Ghi Chú Quan Trọng
        </p>
        <p style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
          Vi phạm các quy tắc này có thể dẫn đến cảnh báo, hạn chế hoặc cấm vĩnh viễn. Hãy báo cáo nội
          dung vi phạm bằng cách sử dụng tính năng báo cáo.
        </p>
      </motion.div>
    </motion.div>
  );
}
