import { useCallback } from 'react';
import { useToast } from '@/components/ui/toast';
import { useSavedItems } from './saved-items-context';

/**
 * Hook for saving/removing job postings (companies) with toast notification
 * Uses backend API through saved-items-context
 */
export function useSaveCompany() {
  const { addToast } = useToast();
  const { addSavedCompany, removeSavedCompany, isSavedCompany } = useSavedItems();

  const toggleSaveCompany = useCallback(
    async (companyId: string, companyName?: string) => {
      if (isSavedCompany(companyId)) {
        await removeSavedCompany(companyId);
        addToast(companyName ? `${companyName} đã được bỏ lưu` : 'Đã bỏ lưu công ty', 'info', 2000);
      } else {
        await addSavedCompany(companyId);
        addToast(companyName ? `${companyName} đã được lưu` : 'Đã lưu công ty', 'success', 2000);
      }
    },
    [addSavedCompany, removeSavedCompany, isSavedCompany, addToast]
  );

  return {
    toggleSaveCompany,
    isSavedCompany,
  };
}

/**
 * Hook for saving/removing posts with toast notification
 * Uses backend API through saved-items-context
 */
export function useSavePost() {
  const { addToast } = useToast();
  const { addSavedPost, removeSavedPost, isSavedPost } = useSavedItems();

  const toggleSavePost = useCallback(
    async (postId: string) => {
      if (isSavedPost(postId)) {
        await removeSavedPost(postId);
        addToast('Bài viết đã được bỏ lưu', 'info', 2000);
      } else {
        await addSavedPost(postId);
        addToast('Bài viết đã được lưu', 'success', 2000);
      }
    },
    [addSavedPost, removeSavedPost, isSavedPost, addToast]
  );

  return {
    toggleSavePost,
    isSavedPost,
  };
}
