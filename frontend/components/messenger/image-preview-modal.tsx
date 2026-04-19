'use client';

import React from 'react';
import { X, Download } from 'lucide-react';
import Image from 'next/image';

interface ImagePreviewModalProps {
  imageUrl: string;
  onClose: () => void;
}

export default function ImagePreviewModal({ imageUrl, onClose }: ImagePreviewModalProps) {
  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `image-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden bg-black"
      >
        {/* Image Container */}
        <div className="relative w-full h-full flex items-center justify-center min-h-[400px]">
          <Image
            src={imageUrl}
            alt="Preview"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors backdrop-blur-sm"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="absolute bottom-4 right-4 p-2 rounded-full bg-cyan-500/80 hover:bg-cyan-600 text-white transition-colors backdrop-blur-sm flex items-center gap-2"
        >
          <Download className="w-5 h-5" />
          <span
            className="text-sm pr-2"
            style={{ fontFamily: "'Poppins Regular', sans-serif" }}
          >
            Tải
          </span>
        </button>
      </div>
    </div>
  );
}
