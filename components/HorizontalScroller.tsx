import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { resolvePoster } from '@/lib/tmdb';
import type { TMDBMovie } from '@/lib/types';
import { ReactNode } from 'react';

interface HorizontalScrollerProps {
  title: ReactNode;
  items: TMDBMovie[];
  type: 'movie' | 'tv';
}

export default function HorizontalScroller({ title, items, type }: HorizontalScrollerProps) {
  if (!items || items.length === 0) return null;

  // 👇 FIX: Safely generate ID if title is a string
  const sectionId =
    typeof title === "string"
      ? title.toLowerCase().replace(/\s+/g, "-")
      : "section";

  return (
    <section className="mb-10 sm:mb-12">
      <div className="container-custom">
        <h2
          className="text-white text-xl sm:text-2xl font-bold mb-4 sm:mb-6"
          data-testid={`text-section-${sectionId}`}
        >
          {title}
        </h2>
      </div>

      <div className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide pl-4 sm:pl-6 lg:pl-8 pr-4 sm:pr-6 lg:pr-8 pb-2 smooth-scroll">
        {items.map((item) => {
          const itemTitle = item.title || item.name || 'Untitled';
          const href = type === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}`;
          const imageUrl = resolvePoster(item.poster_path, 'w300');

          return (
            <Link
              key={item.id}
              href={href}
              className="group block flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px] scroll-snap-start"
              data-testid={`card-${type}-${item.id}`}
            >
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-card-bg shadow-card group-hover:shadow-card-hover transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                <Image
                  src={imageUrl}
                  alt={itemTitle}
                  fill
                  sizes="(max-width: 640px) 140px, (max-width: 768px) 160px, (max-width: 1024px) 180px, 200px"
                  className="object-cover transition-all duration-300 group-hover:scale-110"
                />
                {item.vote_average > 0 && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 glass px-2.5 py-1.5 rounded-full backdrop-blur-md z-20">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-yellow-400 font-bold">
                      {item.vote_average.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>

              <h3
                className="text-sm text-white font-semibold line-clamp-2 group-hover:text-yellow-400 transition-colors duration-200 mt-2 px-1"
                data-testid={`text-title-${item.id}`}
              >
                {itemTitle}
              </h3>
            </Link>
          );
        })}
      </div>
    </section>
  );
}