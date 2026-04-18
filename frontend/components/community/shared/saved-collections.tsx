'use client';

import { motion } from 'framer-motion';
import { BookmarkPlus, Trash2, Share2, Plus } from 'lucide-react';
import { useState } from 'react';

export interface SavedCollection {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  createdAt: string;
  isPrivate: boolean;
}

interface SavedCollectionsProps {
  collections: SavedCollection[];
  onCreateCollection?: (name: string, isPrivate: boolean) => void;
  onDeleteCollection?: (collectionId: string) => void;
  onShareCollection?: (collectionId: string) => void;
}

export function SavedCollections({
  collections,
  onCreateCollection,
  onDeleteCollection,
  onShareCollection,
}: SavedCollectionsProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionPrivate, setNewCollectionPrivate] = useState(true);

  const handleCreate = async () => {
    if (!newCollectionName.trim()) return;

    onCreateCollection?.(newCollectionName, newCollectionPrivate);
    setNewCollectionName('');
    setIsCreating(false);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookmarkPlus className="w-5 h-5 text-cyan-300" />
          <h3
            className="text-lg font-bold text-white"
            style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
          >
            Danh Sách Đã Lưu
          </h3>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-1 px-3 py-1 rounded-lg bg-cyan-400/20 text-cyan-300 text-sm font-semibold hover:bg-cyan-400/30 transition-colors"
          style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
        >
          <Plus className="w-4 h-4" />
          Tạo Danh Sách
        </motion.button>
      </div>

      {/* Create Collection Form */}
      {isCreating && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-cyan-400/10 border border-cyan-400/20 space-y-3"
        >
          <input
            type="text"
            placeholder="Tên danh sách..."
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/10 border border-cyan-400/20 text-white placeholder-gray-500 outline-none focus:border-cyan-400/40"
            style={{ fontFamily: "'Poppins Regular', sans-serif" }}
          />

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={newCollectionPrivate}
              onChange={(e) => setNewCollectionPrivate(e.target.checked)}
              className="w-4 h-4 accent-cyan-400"
            />
            <span className="text-sm text-gray-300">Riêng tư (Chỉ bạn xem được)</span>
          </label>

          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreate}
              className="flex-1 px-3 py-2 rounded-lg bg-cyan-400/20 text-cyan-300 font-semibold hover:bg-cyan-400/30 transition-colors"
              style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
            >
              Tạo
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCreating(false)}
              className="flex-1 px-3 py-2 rounded-lg bg-white/10 text-gray-300 hover:bg-white/20 transition-colors"
            >
              Hủy
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {collections.map((collection) => (
          <motion.div
            key={collection.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            className="p-4 rounded-lg bg-linear-to-br from-white/10 to-white/5 border border-cyan-400/20 hover:border-cyan-400/40 transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <p
                  className="font-semibold text-white truncate"
                  style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
                >
                  {collection.name}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {collection.itemCount} mục
                </p>
              </div>
              {collection.isPrivate && (
                <span className="px-2 py-1 rounded text-xs bg-blue-400/20 text-blue-300 ml-2">
                  🔒
                </span>
              )}
            </div>

            <p className="text-xs text-gray-400 mb-3 line-clamp-2">
              {collection.description}
            </p>

            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onShareCollection?.(collection.id)}
                className="flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded text-xs bg-cyan-400/20 text-cyan-300 hover:bg-cyan-400/30 transition-colors"
              >
                <Share2 className="w-3 h-3" />
                Chia sẻ
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onDeleteCollection?.(collection.id)}
                className="flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded text-xs bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                Xóa
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
