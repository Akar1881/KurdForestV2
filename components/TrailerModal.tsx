'use client';

import { X } from 'lucide-react';
import { useEffect } from 'react';

interface TrailerModalProps {
  videoKey: string;
  onClose: () => void;
}

export default function TrailerModal({ videoKey, onClose }: TrailerModalProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
      data-testid="modal-trailer"
    >
      <div
        className="w-full max-w-4xl bg-black rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-white text-lg font-semibold">Trailer</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-900 rounded-md transition-colors"
            data-testid="button-close-modal"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
        <div className="aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
            title="Trailer"
          />
        </div>
      </div>
    </div>
  );
}
