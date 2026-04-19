'use client';

import { X } from 'lucide-react';
import { ComponentProps } from 'react';

interface PillTagProps extends ComponentProps<'button'> {
  label: string;
  variant?: 'primary' | 'secondary' | 'accent';
  onRemove?: () => void;
  isRemovable?: boolean;
  isActive?: boolean;
}

const variantClasses = {
  primary:
    'bg-cyan-400/20 text-cyan-300 hover:bg-cyan-400/30 border border-cyan-400/30',
  secondary:
    'bg-blue-400/20 text-blue-300 hover:bg-blue-400/30 border border-blue-400/30',
  accent:
    'bg-linear-to-r from-cyan-500 to-blue-500 text-white hover:shadow-lg hover:shadow-blue-500/50 border border-cyan-400/50',
};

export function PillTag({
  label,
  variant = 'primary',
  onRemove,
  isRemovable = false,
  isActive = false,
  className = '',
  ...props
}: PillTagProps) {
  const baseClasses = 'inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors whitespace-nowrap';
  const variantClass = variantClasses[variant];
  const activeClass = isActive ? 'ring-2 ring-offset-1 ring-cyan-400/50 ring-offset-slate-900/20' : '';

  return (
    <button
      className={`${baseClasses} ${variantClass} ${activeClass} ${className}`}
      {...props}
    >
      <span>{label}</span>
      {isRemovable && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          className="p-0.5 hover:bg-white/20 rounded-full transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </button>
  );
}
