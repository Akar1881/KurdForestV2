import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { getImageUrl } from '@/lib/tmdb';
import type { TMDBMovie } from '@/lib/types';

interface MediaCardProps {
  item: TMDBMovie;
  type: 'movie' | 'tv';
}

export default function MediaCard({ item, type }: MediaCardProps) {
  const title = item.title || item.name || 'Untitled';
  const href = type === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}`;
  const imageUrl = getImageUrl(item.poster_path, 'w300');

  return (
    <Link
      href={href}
      className="group block w-full"
      data-testid={`card-${type}-${item.id}`}
    >
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-card-bg mb-3 shadow-card group-hover:shadow-card-hover transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 200px"
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
      <h3 className="text-sm text-white font-semibold line-clamp-2 group-hover:text-yellow-400 transition-colors duration-200 px-1" data-testid={`text-title-${item.id}`}>
        {title}
      </h3>
    </Link>
  );
}
