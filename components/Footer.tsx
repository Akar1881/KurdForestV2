'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Tv, Film } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  const tabs = [
    { href: '/', label: 'Home', icon: Home, testId: 'link-home' },
    { href: '/tv', label: 'TV Shows', icon: Tv, testId: 'link-tv' },
    { href: '/movies', label: 'Movies', icon: Film, testId: 'link-movies' },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-gray-800">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map(({ href, label, icon: Icon, testId }) => {
          const isActive = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive ? 'text-white' : 'text-gray-500'
              }`}
              data-testid={testId}
            >
              <Icon className={`w-6 h-6 mb-1 ${isActive ? 'text-white' : 'text-gray-500'}`} />
              <span className={`text-xs ${isActive ? 'text-white font-medium' : 'text-gray-500'}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </footer>
  );
}
