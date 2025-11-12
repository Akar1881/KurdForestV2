import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { getImageUrl } from '@/lib/tmdb';
import type { TMDBMovie } from '@/lib/types';

interface HorizontalScrollerProps {
  title: string;
  items: TMDBMovie[];
  type: 'movie' | 'tv';
}

export default function HorizontalScroller({ title, items, type }: HorizontalScrollerProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="text-white text-xl font-bold mb-4 px-4" data-testid={`text-section-${title.toLowerCase().replace(/\s+/g, '-')}`}>
        {title}
      </h2>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-2 smooth-scroll">
        {items.map((item) => {
          const title = item.title || item.name || 'Untitled';
          const href = type === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}`;
          const imageUrl = getImageUrl(item.poster_path, 'w300');

          return (
            <Link
              key={item.id}
              href={href}
              className="group block flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px]"
              data-testid={`card-${type}-${item.id}`}
            >
              <div className="relative aspect-[2/3] rounded-md overflow-hidden bg-gray-900 mb-2 h-[210px] sm:h-[240px] md:h-[270px]">
                <Image
                  src={imageUrl}
                  alt={title}
                  fill
                  sizes="(max-width: 640px) 140px, (max-width: 768px) 160px, 180px"
                  className="object-cover transition-transform group-hover:scale-105"
                />
                {item.vote_average > 0 && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/80 px-2 py-1 rounded-md">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-yellow-400 font-semibold">
                      {item.vote_average.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
              <h3 className="text-sm text-white font-medium line-clamp-2 group-hover:text-gray-300 transition-colors" data-testid={`text-title-${item.id}`}>
                {title}
              </h3>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
