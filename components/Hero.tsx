// components/Hero.tsx - Updated
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Play, Info, Film, Tv } from 'lucide-react';
import { getImageUrl, GENRE_MAP } from '@/lib/tmdb';
import type { TMDBMovie } from '@/lib/types';

interface HeroProps {
  items: TMDBMovie[];
  type: 'movie' | 'tv' | 'mixed';
}

export default function Hero({ items, type }: HeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    let transitionTimeout: NodeJS.Timeout;
    const interval = setInterval(() => {
      setIsTransitioning(true);
      transitionTimeout = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
        setIsTransitioning(false);
      }, 500);
    }, 5000);

    return () => {
      clearInterval(interval);
      if (transitionTimeout) clearTimeout(transitionTimeout);
    };
  }, [items.length]);

  if (!items || items.length === 0) return null;

  const currentItem = items[currentIndex];
  const title = currentItem.title || currentItem.name || 'Untitled';
  const backdropUrl = getImageUrl(currentItem.backdrop_path, 'w1280');
  const genres = currentItem.genre_ids?.slice(0, 3).map((id) => GENRE_MAP[id]).filter(Boolean) || [];
  const mediaType = currentItem.media_type || type;
  const isMovie = mediaType === 'movie';

  return (
    <section className="relative w-full h-[70vh] sm:h-[75vh] md:h-[80vh] lg:h-[85vh] max-h-[800px] overflow-hidden">
      <div className={`absolute inset-0 transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        <Image
          src={backdropUrl}
          alt={title}
          fill
          priority
          className="object-cover hero-transition"
        />
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40" />
      
      <div className="absolute inset-0 flex items-end">
        <div className="container-custom pb-8 sm:pb-12 md:pb-16 lg:pb-20 w-full">
          <div className="max-w-3xl space-y-4 sm:space-y-5 md:space-y-6">
            {/* Media Type Badge */}
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-sm ${
                isMovie ? 'bg-blue-500/20' : 'bg-purple-500/20'
              }`}>
                {isMovie ? (
                  <Film className="w-4 h-4 text-blue-300" />
                ) : (
                  <Tv className="w-4 h-4 text-purple-300" />
                )}
                <span className={`text-sm font-medium ${
                  isMovie ? 'text-blue-300' : 'text-purple-300'
                }`}>
                  {isMovie ? 'MOVIE' : 'TV SHOW'}
                </span>
              </div>
            </div>

            <h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg"
              data-testid="text-hero-title"
            >
              {title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              {currentItem.vote_average > 0 && (
                <div className="flex items-center gap-1.5 bg-black/40 glass px-3 py-1.5 rounded-full backdrop-blur-sm">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-yellow-400 font-bold text-sm sm:text-base">
                    {currentItem.vote_average.toFixed(1)}
                  </span>
                </div>
              )}
              {genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre, idx) => (
                    <span 
                      key={idx}
                      className="text-gray-200 text-xs sm:text-sm font-medium bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <p className="text-gray-200 text-sm sm:text-base md:text-lg line-clamp-3 leading-relaxed drop-shadow-md max-w-2xl">
              {currentItem.overview}
            </p>

            <div className="flex flex-wrap gap-3 sm:gap-4 pt-2">
              <Link
                href={`/watch/${mediaType}/${currentItem.id}`}
                className="flex items-center justify-center gap-2 bg-white text-black px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl button-press font-semibold text-sm sm:text-base"
                data-testid="button-hero-watch"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                <span>Watch Now</span>
              </Link>
              <Link
                href={`/${mediaType}/${currentItem.id}`}
                className="flex items-center gap-2 glass-light text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl hover:bg-white/20 transition-all duration-200 border border-white/20 backdrop-blur-md button-press font-medium text-sm sm:text-base"
                data-testid="button-hero-details"
              >
                <Info className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>More Info</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-8 flex gap-2 z-20">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1 rounded-full transition-all duration-300 ${
              idx === currentIndex
                ? 'bg-yellow-400 w-8 sm:w-12'
                : 'bg-white/40 w-4 sm:w-6 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}