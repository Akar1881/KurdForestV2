'use client';

import { AlertCircle } from 'lucide-react';

export default function AdWarning() {
  const handleAdGuardClick = () => {
    window.open('https://chromewebstore.google.com/detail/adguard-adblocker/bgnkhhnnamicmpeenaelnjfhikgbkllg', '_blank');
  };

  return (
    <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-md p-4 mb-6" data-testid="container-ad-warning">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-yellow-500 font-semibold mb-2">Important Notice About Ads</h3>
          <p className="text-gray-300 text-sm leading-relaxed mb-3">
            We do not provide films. Our streaming providers do, so the content includes ads that we cannot control. 
            They won't allow us to remove them.
          </p>
          <div className="space-y-2 text-sm">
            <p className="text-gray-300">
              <span className="font-medium text-white">For desktop users:</span> You can use the{' '}
              <button
                onClick={handleAdGuardClick}
                className="text-yellow-400 hover:text-yellow-300 underline font-medium"
                data-testid="button-adguard-link"
              >
                AdGuard
              </button>{' '}
              extension to block ads and improve your viewing experience.
            </p>
            <p className="text-gray-300">
              <span className="font-medium text-white">For mobile users:</span> We recommend using the{' '}
              <span className="font-medium text-yellow-400">Brave Browser</span> which has built-in ad blocking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
