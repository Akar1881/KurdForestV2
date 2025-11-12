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
      <div className="relative aspect-[2/3] rounded-md overflow-hidden bg-gray-900 mb-2 max-h-[300px]">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 200px"
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
}
