'use client';

import { useRouter, usePathname } from 'next/navigation';
import { ArrowLeft, Search } from 'lucide-react';

interface HeaderProps {
  title?: string;
}

export default function Header({ title }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'KurdForest';

  const handleBack = () => {
    if (pathname === '/') return;
    router.back();
  };

  const handleSearch = () => {
    router.push('/search');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-gray-800">
      <div className="flex items-center justify-between h-14 px-4">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-gray-900 rounded-md transition-colors"
          data-testid="button-back"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        <div className="flex-1 text-center">
          <h1 className="text-sm text-white font-medium truncate px-2" data-testid="text-header-title">
            {title ? `${title} • ${siteName}` : siteName}
          </h1>
        </div>

        <button
          onClick={handleSearch}
          className="p-2 hover:bg-gray-900 rounded-md transition-colors"
          data-testid="button-search"
          aria-label="Search"
        >
          <Search className="w-5 h-5 text-white" />
        </button>
      </div>
    </header>
  );
}
