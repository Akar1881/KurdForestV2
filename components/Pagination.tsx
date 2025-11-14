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
    <div className="flex items-center justify-center gap-3 sm:gap-4 py-8 sm:py-10">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoPrevious}
        className={`flex items-center gap-2 px-5 sm:px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
          canGoPrevious
            ? 'bg-card-bg text-white border border-card-border shadow-card hover:shadow-card-hover button-press'
            : 'bg-black/40 text-gray-600 cursor-not-allowed opacity-50 border border-gray-800'
        }`}
        data-testid="button-previous"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="hidden sm:inline">Previous</span>
        <span className="sm:hidden">Prev</span>
      </button>

      <div className="flex items-center gap-2 px-4 sm:px-5 py-3 bg-card-bg text-white rounded-xl border border-card-border shadow-card">
        <span className="font-bold text-yellow-400" data-testid="text-page-info">{currentPage}</span>
        <span className="text-gray-400">/</span>
        <span className="text-gray-300">{totalPages}</span>
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canGoNext}
        className={`flex items-center gap-2 px-5 sm:px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
          canGoNext
            ? 'bg-card-bg text-white border border-card-border shadow-card hover:shadow-card-hover button-press'
            : 'bg-black/40 text-gray-600 cursor-not-allowed opacity-50 border border-gray-800'
        }`}
        data-testid="button-next"
      >
        <span className="hidden sm:inline">Next</span>
        <span className="sm:hidden">Next</span>
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </div>
  );
}
