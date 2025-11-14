'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Google Analytics tracking ID
const GA_TRACKING_ID = 'G-4R31TD63KS';

export default function GAClientTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Load GA script once
    if (!document.querySelector(`#ga-script`)) {
      const script = document.createElement('script');
      script.id = 'ga-script';
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
      script.async = true;
      document.head.appendChild(script);

      const inlineScript = document.createElement('script');
      inlineScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_TRACKING_ID}', { page_path: window.location.pathname });
      `;
      document.head.appendChild(inlineScript);
    } else {
      // If GA already loaded, just send pageview
      if (typeof window.gtag !== 'undefined') {
        window.gtag('config', GA_TRACKING_ID, { page_path: pathname });
      }
    }
  }, [pathname]);

  return null; // This component renders nothing
}