'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div className="flex items-center justify-center gap-4 py-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoPrevious}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
          canGoPrevious
            ? 'bg-gray-800 text-white hover:bg-gray-700'
            : 'bg-gray-900 text-gray-600 cursor-not-allowed'
        }`}
        data-testid="button-previous"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="text-sm font-medium">PREVIOUS</span>
      </button>

      <span className="text-white text-sm font-medium" data-testid="text-page-info">
        {currentPage}/{totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canGoNext}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
          canGoNext
            ? 'bg-gray-800 text-white hover:bg-gray-700'
            : 'bg-gray-900 text-gray-600 cursor-not-allowed'
        }`}
        data-testid="button-next"
      >
        <span className="text-sm font-medium">NEXT</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
