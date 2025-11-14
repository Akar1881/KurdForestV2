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

  const isHome = pathname === '/';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-800/50 backdrop-blur-lg">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 sm:h-18">
          <button
            onClick={handleBack}
            className={`p-2.5 hover:bg-white/10 rounded-xl transition-all duration-200 button-press ${
              isHome ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isHome}
            data-testid="button-back"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>

          <div className="flex-1 text-center px-4">
            <h1 className="text-sm sm:text-base text-white font-semibold truncate" data-testid="text-header-title">
              {title || siteName}
            </h1>
          </div>

          <button
            onClick={handleSearch}
            className="p-2.5 hover:bg-white/10 rounded-xl transition-all duration-200 button-press"
            data-testid="button-search"
            aria-label="Search"
          >
            <Search className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>
        </div>
      </div>
    </header>
  );
}
