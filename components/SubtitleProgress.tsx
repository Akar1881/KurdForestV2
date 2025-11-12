'use client';

import type { SubtitleStatus } from '@/lib/types';

interface SubtitleProgressProps {
  status: SubtitleStatus;
}

const STATUS_LABELS: Record<SubtitleStatus['status'], string> = {
  starting: 'Starting...',
  fetching_imdb: 'Fetching IMDB data...',
  searching_subs: 'Searching for subtitles...',
  downloading: 'Downloading subtitle...',
  translating: 'Translating subtitle...',
  finalizing: 'Finalizing...',
  converting: 'Converting subtitle...',
  complete: 'Complete!',
  failed: 'Failed',
  retrying: 'Retrying...',
  processing: 'Processing subtitle...',
  from_cache: 'Loaded from cache!',
};

const STATUS_PROGRESS: Record<SubtitleStatus['status'], number> = {
  starting: 10,
  fetching_imdb: 20,
  searching_subs: 35,
  downloading: 50,
  translating: 65,
  finalizing: 80,
  converting: 90,
  complete: 100,
  failed: 0,
  retrying: 40,
  processing: 5,
  from_cache: 100,
};

export default function SubtitleProgress({ status }: SubtitleProgressProps) {
  const progress = status.progress ?? STATUS_PROGRESS[status.status];
  const label = STATUS_LABELS[status.status];
  const isFailed = status.status === 'failed';
  const isComplete = status.status === 'complete' || status.status === 'from_cache';

  return (
    <div className="w-full space-y-3" data-testid="container-subtitle-progress">
      <div className="flex items-center justify-between">
        <span className={`text-sm font-medium ${isFailed ? 'text-red-500' : isComplete ? 'text-green-500' : 'text-white'}`}>
          {label}
        </span>
        <span className={`text-sm ${isFailed ? 'text-red-500' : isComplete ? 'text-green-500' : 'text-gray-400'}`}>
          {progress}%
        </span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${
            isFailed ? 'bg-red-500' : isComplete ? 'bg-green-500' : 'bg-yellow-400'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
      {status.error && (
        <p className="text-sm text-red-500" data-testid="text-error">
          {status.error}
        </p>
      )}
    </div>
  );
}
