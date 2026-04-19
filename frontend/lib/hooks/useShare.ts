import { useCallback, useState } from 'react';

interface UseShareProps {
  postId: string;
  postUrl?: string;
}

export function useShare({ postId, postUrl }: UseShareProps) {
  const [shareCount, setShareCount] = useState(0);
  const [isShared, setIsShared] = useState(false);

  const handleShare = useCallback(() => {
    setIsShared(true);
    setShareCount((prev) => prev + 1);
    setTimeout(() => setIsShared(false), 2000);
  }, []);

  const copyLink = useCallback(async () => {
    const url = postUrl || `${window.location.origin}/community/posts/${postId}`;
    try {
      await navigator.clipboard.writeText(url);
      handleShare();
      return true;
    } catch (err) {
      console.error('Failed to copy link:', err);
      return false;
    }
  }, [postId, postUrl, handleShare]);

  const shareToFacebook = useCallback(() => {
    const url = postUrl || `${window.location.origin}/community/posts/${postId}`;
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(fbUrl, '_blank', 'width=600,height=400');
    handleShare();
  }, [postId, postUrl, handleShare]);

  const shareToMessenger = useCallback(() => {
    const url = postUrl || `${window.location.origin}/community/posts/${postId}`;
    const messengerUrl = `https://www.facebook.com/dialog/send?app_id=YOUR_APP_ID&link=${encodeURIComponent(url)}&redirect_uri=${encodeURIComponent(url)}`;
    window.open(messengerUrl, '_blank', 'width=600,height=400');
    handleShare();
  }, [postId, postUrl, handleShare]);

  const shareViaEmail = useCallback(() => {
    const subject = encodeURIComponent('Chia sẻ một bài viết từ NextStepZ');
    const url = postUrl || `${window.location.origin}/community/posts/${postId}`;
    const body = encodeURIComponent(`\nHãy xem bài viết này:\n\n${url}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    handleShare();
  }, [postId, postUrl, handleShare]);

  return {
    shareCount,
    isShared,
    copyLink,
    shareToFacebook,
    shareToMessenger,
    shareViaEmail,
    handleShare,
  };
}
