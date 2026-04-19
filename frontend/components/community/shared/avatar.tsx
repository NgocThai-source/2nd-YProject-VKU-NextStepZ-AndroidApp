'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

interface AvatarProps {
    src: string;
    alt: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    verified?: boolean;
    className?: string;
    onClick?: () => void;
}

const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
};

const verifiedSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6',
};

export function Avatar({
    src,
    alt,
    size = 'md',
    verified = false,
    className = '',
    onClick,
}: AvatarProps) {
    // Default avatar if src is empty
    const imageSrc = src && src.trim() !== ''
        ? src
        : `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(alt || 'default')}`;

    return (
        <motion.div
            whileHover={onClick ? { scale: 1.05 } : undefined}
            whileTap={onClick ? { scale: 0.95 } : undefined}
            className={`relative shrink-0 ${onClick ? 'cursor-pointer' : ''} ${className}`}
            onClick={onClick}
        >
            <div
                className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gradient-to-br from-cyan-400/20 to-blue-500/20 border-2 border-cyan-400/30`}
            >
                <Image
                    src={imageSrc}
                    alt={alt || 'Avatar'}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                    unoptimized={imageSrc.includes('dicebear.com')}
                />
            </div>
            {verified && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`absolute -bottom-0.5 -right-0.5 bg-cyan-500 rounded-full p-0.5 border border-slate-900`}
                >
                    <CheckCircle2 className={`${verifiedSizes[size]} text-white fill-cyan-500`} />
                </motion.div>
            )}
        </motion.div>
    );
}
