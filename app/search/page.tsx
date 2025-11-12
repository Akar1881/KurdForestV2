import { Suspense } from 'react';
import SearchContent from './SearchContent';

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="text-gray-500">Loading...</div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
