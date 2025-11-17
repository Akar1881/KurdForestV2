'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Tv, Film, Bookmark, Activity } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  const tabs = [
    { href: '/', label: 'Home', icon: Home, testId: 'link-home' },
    { href: '/tv', label: 'TV Shows', icon: Tv, testId: 'link-tv' },
    { href: '/movies', label: 'Movies', icon: Film, testId: 'link-movies' },
    { href: '/my-list', label: 'My List', icon: Bookmark, testId: 'link-my-list' },
    { href: '/status', label: 'Status', icon: Activity, testId: 'link-status' },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-gray-800/50 backdrop-blur-lg">
      <div className="container-custom">
        <div className="flex items-center justify-around h-18 sm:h-20">
          {tabs.map(({ href, label, icon: Icon, testId }) => {
            const isActive = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-200 relative group ${
                  isActive ? '' : 'hover:bg-white/5'
                }`}
                data-testid={testId}
              >
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full" />
                )}
                <div className={`p-2 rounded-xl transition-all duration-200 ${
                  isActive ? 'bg-yellow-400/10' : 'group-hover:bg-white/5'
                }`}>
                  <Icon className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors ${
                    isActive ? 'text-yellow-400' : 'text-gray-400 group-hover:text-gray-300'
                  }`} />
                </div>
                <span className={`text-[10px] sm:text-xs font-medium transition-colors ${
                  isActive ? 'text-yellow-400' : 'text-gray-500 group-hover:text-gray-400'
                }`}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
