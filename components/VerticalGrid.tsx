import MediaCard from './MediaCard';
import type { TMDBMovie } from '@/lib/types';

interface VerticalGridProps {
  items: TMDBMovie[];
  type: 'movie' | 'tv';
}

export default function VerticalGrid({ items, type }: VerticalGridProps) {
  if (!items || items.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500 text-center">No results found</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 pb-4">
        {items.map((item) => (
          <MediaCard key={item.id} item={item} type={type} />
        ))}
      </div>
    </div>
  );
}
