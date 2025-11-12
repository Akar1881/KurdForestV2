'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Play, Info } from 'lucide-react';
import { getImageUrl, GENRE_MAP } from '@/lib/tmdb';
import type { TMDBMovie } from '@/lib/types';

interface HeroProps {
  items: TMDBMovie[];
  type: 'movie' | 'tv';
}

export default function Hero({ items, type }: HeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [items.length]);

  if (!items || items.length === 0) return null;

  const currentItem = items[currentIndex];
  const title = currentItem.title || currentItem.name || 'Untitled';
  const backdropUrl = getImageUrl(currentItem.backdrop_path, 'w1280');
  const genres = currentItem.genre_ids?.slice(0, 3).map((id) => GENRE_MAP[id]).filter(Boolean) || [];

  return (
    <section className="relative w-full aspect-[16/9] sm:aspect-[21/9] overflow-hidden">
      <Image
        src={backdropUrl}
        alt={title}
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
        <div className="max-w-2xl">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 line-clamp-2" data-testid="text-hero-title">
            {title}
          </h1>
          
          <div className="flex items-center gap-3 mb-3">
            {currentItem.vote_average > 0 && (
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="text-yellow-400 font-semibold">
                  {currentItem.vote_average.toFixed(1)}
                </span>
              </div>
            )}
            {genres.length > 0 && (
              <span className="text-gray-300 text-sm">
                {genres.join(' • ')}
              </span>
            )}
          </div>

          <p className="text-gray-300 text-sm sm:text-base mb-4 line-clamp-3">
            {currentItem.overview}
          </p>

          <div className="flex gap-3">
            <Link
              href={`/${type}/${currentItem.id}`}
              className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
              data-testid="button-hero-details"
            >
              <Info className="w-4 h-4" />
              <span className="text-sm font-medium">Details</span>
            </Link>
            <Link
              href={`/watch/${type}/${currentItem.id}`}
              className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
              data-testid="button-hero-watch"
            >
              <Play className="w-4 h-4" />
              <span className="text-sm font-medium">Watch</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
