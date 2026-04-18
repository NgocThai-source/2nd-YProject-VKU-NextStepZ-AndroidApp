'use client';

import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  onClick?: (rating: number) => void;
  interactive?: boolean;
}

export function RatingStars({
  rating,
  size = 'md',
  onClick,
  interactive = false,
}: RatingStarsProps) {
  const sizeMap = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const sizes = sizeMap[size];

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => interactive && onClick?.(star)}
          disabled={!interactive}
          className="transition-colors"
        >
          <Star
            className={`${sizes} ${
              star <= Math.round(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-400'
            }`}
          />
        </button>
      ))}
      {size !== 'sm' && (
        <span className="text-sm font-semibold text-white ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
