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
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-2">No results found</p>
          <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 pb-4">
        {items.map((item) => (
          <MediaCard key={item.id} item={item} type={type} />
        ))}
      </div>
    </div>
  );
}
