'use client';

export function PostSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-4 space-y-4 animate-pulse border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex gap-3">
        <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32" />
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-24" />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full" />
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full" />
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
      </div>

      {/* Image placeholder */}
      <div className="w-full h-48 bg-gray-300 dark:bg-gray-600 rounded" />

      {/* Stats */}
      <div className="flex gap-4 pt-2">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20" />
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20" />
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20" />
      </div>
    </div>
  );
}

export function UserCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-4 space-y-3 animate-pulse border border-gray-200 dark:border-gray-700">
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-600" />
      </div>
      <div className="text-center space-y-2">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24 mx-auto" />
        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-32 mx-auto" />
      </div>
      <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded" />
    </div>
  );
}

export function CommentSkeleton() {
  return (
    <div className="space-y-2 animate-pulse">
      <div className="flex gap-2">
        <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600" />
        <div className="flex-1 space-y-1">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32" />
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-full" />
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-2/3" />
        </div>
      </div>
    </div>
  );
}
