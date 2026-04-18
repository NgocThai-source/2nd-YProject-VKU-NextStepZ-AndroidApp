import { useCallback, useState, useRef } from 'react';
import { portfolioShareService } from '@/lib/services/portfolio-share-service';
import { SavedPortfolio } from '@/lib/saved-portfolio-context';

interface UseSharePortfolioProps {
  portfolioId: string;
  portfolio?: SavedPortfolio;
  portfolioUrl?: string;
}

export function useSharePortfolio({ portfolioId, portfolio, portfolioUrl }: UseSharePortfolioProps) {
  const [shareCount, setShareCount] = useState(0);
  const [isShared, setIsShared] = useState(false);
  const [copiedFeedback, setCopiedFeedback] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleShare = useCallback(() => {
    setIsShared(true);
    setShareCount((prev) => prev + 1);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setIsShared(false);
    }, 2000);
  }, []);

  const showCopiedFeedback = useCallback(() => {
    setCopiedFeedback(true);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setCopiedFeedback(false);
    }, 2000);
  }, []);

  const copyLink = useCallback(async () => {
    try {
      const url = portfolioUrl || `${window.location.origin}/shared-portfolio/${portfolioId}`;
      
      // Save portfolio data for sharing
      if (portfolio) {
        portfolioShareService.saveForSharing(portfolioId, portfolio);
      }
      
      await navigator.clipboard.writeText(url);
      portfolioShareService.recordShare(portfolioId, 'copy');
      
      showCopiedFeedback();
      handleShare();
      return true;
    } catch (err) {
      console.error('Failed to copy portfolio link:', err);
      return false;
    }
  }, [portfolioId, portfolio, portfolioUrl, handleShare, showCopiedFeedback]);

  const shareToFacebook = useCallback(() => {
    try {
      const url = portfolioUrl || `${window.location.origin}/shared-portfolio/${portfolioId}`;
      
      // Save portfolio data for sharing
      if (portfolio) {
        portfolioShareService.saveForSharing(portfolioId, portfolio);
      }
      
      const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
      window.open(fbUrl, '_blank', 'width=600,height=400');
      
      portfolioShareService.recordShare(portfolioId, 'facebook');
      handleShare();
    } catch (err) {
      console.error('Failed to share portfolio to Facebook:', err);
    }
  }, [portfolioId, portfolio, portfolioUrl, handleShare]);

  const shareToMessenger = useCallback(() => {
    try {
      const url = portfolioUrl || `${window.location.origin}/shared-portfolio/${portfolioId}`;
      
      // Save portfolio data for sharing
      if (portfolio) {
        portfolioShareService.saveForSharing(portfolioId, portfolio);
      }
      
      const messengerUrl = `https://www.facebook.com/dialog/send?app_id=YOUR_APP_ID&link=${encodeURIComponent(url)}&redirect_uri=${encodeURIComponent(url)}`;
      window.open(messengerUrl, '_blank', 'width=600,height=400');
      
      portfolioShareService.recordShare(portfolioId, 'messenger');
      handleShare();
    } catch (err) {
      console.error('Failed to share portfolio to Messenger:', err);
    }
  }, [portfolioId, portfolio, portfolioUrl, handleShare]);

  const shareViaEmail = useCallback(() => {
    try {
      const portfolioName = portfolio?.name || 'Hồ sơ của tôi';
      const subject = encodeURIComponent(`Xem hồ sơ: ${portfolioName}`);
      const url = portfolioUrl || `${window.location.origin}/shared-portfolio/${portfolioId}`;
      const body = encodeURIComponent(`Hãy xem hồ sơ của tôi:\n\n${url}`);
      
      // Save portfolio data for sharing
      if (portfolio) {
        portfolioShareService.saveForSharing(portfolioId, portfolio);
      }
      
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
      
      portfolioShareService.recordShare(portfolioId, 'email');
      handleShare();
    } catch (err) {
      console.error('Failed to share portfolio via email:', err);
    }
  }, [portfolioId, portfolio, portfolioUrl, handleShare]);

  const shareDirectLink = useCallback(async () => {
    return copyLink();
  }, [copyLink]);

  return {
    shareCount,
    isShared,
    copiedFeedback,
    copyLink,
    shareToFacebook,
    shareToMessenger,
    shareViaEmail,
    shareDirectLink,
    handleShare,
  };
}
