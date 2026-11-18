'use client';

import React from 'react';
import { X } from 'lucide-react';

interface VideoModalProps {
  videoId: string;
  title: string;
  onClose: () => void;
}

export default function VideoModal({ videoId, title, onClose }: VideoModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-purple-800">
        <div className="flex items-center justify-between p-4 bg-purple-950 text-white border-b border-purple-800">
          <h3 className="text-base font-bold truncate max-w-[80%]">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="relative aspect-video w-full">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>
      </div>
    </div>
  );
}
